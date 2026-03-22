import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Mic, AudioLines, Download, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVoiceContext } from "../context/VoiceContext";
import { verifyVoice } from "../services/huggingface";

export default function LoginPage() {
  const [isListening, setIsListening] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);
  const { masterAudioBlob } = useVoiceContext();
  const navigate = useNavigate();

  // Audio Recording & Analysis Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);

  // High performance motion values for audio reactivity
  const volumeMotion = useMotionValue(0); // Scales continuously between 0 and 1
  
  // Transform the real-time volume into smooth visual parameters
  const outerGridScale = useTransform(volumeMotion, v => 1 + v * 0.15);
  const dashedBorderScale = useTransform(volumeMotion, v => 0.95 + v * 0.25);
  const dottedBorderScale = useTransform(volumeMotion, v => 1 + v * 0.4);
  const micScale = useTransform(volumeMotion, v => 1 + v * 0.3);
  
  const glowShadow = useTransform(volumeMotion, v => {
    const intensity = 0.05 + v * 0.55; // 0.05 (idle lowest) to 0.6 (active loud)
    const spread = 20 + v * 80; // 20px to 100px depending on volume
    return `0px 0px ${spread}px ${spread/4}px rgba(0, 238, 252, ${intensity}), inset 0px 0px ${spread/2}px ${spread/5}px rgba(0, 238, 252, ${intensity})`;
  });

  const ambientWidth = useTransform(volumeMotion, v => `${40 + v * 40}vw`);
  const ambientOpacity = useTransform(volumeMotion, v => 0.05 + v * 0.2);

  // Idle Animation Loop - Only runs when not recording
  useEffect(() => {
    let idleControls;
    if (!isListening) {
      // Gently breathe from 0 to 0.15 mapping seamlessly onto identical scale logic
      idleControls = animate(volumeMotion, [0, 0.15, 0], {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      });
    }
    return () => {
      if (idleControls) idleControls.stop();
    };
  }, [isListening, volumeMotion]);


  // Clean up device resources strictly on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const startRecording = async (e) => {
    e.preventDefault(); // prevent touch highlight / mobile scaling
    if (isListening) return; 

    setAuthStatus(null); // Clear previous status when retrying

    try {
      setAudioUrl(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Realtime Audio Analysis Setup
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length; // Max rough average is ~150-200
        const normalized = Math.min(avg / 150, 1); // 0 to 1 scaling safely built
        
        // Push actual real-time sound amplitude to the visual mapping (bypassing react renders)
        volumeMotion.set(normalized);
        
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // Recording API setup
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const attemptBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(attemptBlob);
        setAudioUrl(url);

        if (!masterAudioBlob) {
           alert("No internal Registration record found! Please go to /register and setup Master Voice Source.");
           return;
        }

        setIsLoading(true);
        try {
           const resultText = await verifyVoice(masterAudioBlob, attemptBlob);
           if (resultText && resultText.includes("✅ MATCH")) {
              setAuthStatus("Access Granted");
              setTimeout(() => navigate("/dashboard"), 2000);
           } else {
              setAuthStatus("Access Denied: Not Matched");
           }
        } catch (err) {
           setAuthStatus("Verification Failed: Network Error.");
        }
        setIsLoading(false);
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("Unable to access microphone securely.");
    }
  };

  const stopRecording = (e) => {
    e.preventDefault();
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
         audioContextRef.current.close();
         audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
         cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Quickly animate visually back down to 0 volume level upon release
      animate(volumeMotion, 0, { duration: 0.5, ease: "easeOut" });
      
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center relative overflow-hidden font-body selection:bg-primary/30">

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
           <Cpu size={56} className="text-primary mb-6 animate-bounce" />
           <p className="text-primary text-xl md:text-2xl font-bold tracking-[0.2em] font-headline uppercase animate-pulse">
             Loading, please wait...
           </p>
           <p className="text-primary/70 text-sm md:text-md mt-2 font-headline uppercase tracking-widest text-center">
             Verifying voice signature
           </p>
        </div>
      )}

      {/* Success Status Overlay */}
      {authStatus && !isLoading && (
        <div className="absolute top-10 flex justify-center w-full z-50">
          <div className="bg-surface-container/70 backdrop-blur-lg px-8 py-3 rounded-full border border-primary/30 shadow-[0_0_15px_rgba(0,238,252,0.1)]">
            <p className={`font-bold tracking-[0.1em] text-xs uppercase ${authStatus.includes('Verified') ? 'text-primary' : 'text-red-400'}`}>
               {authStatus}
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Ambient Background Glow tied to volume */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none mix-blend-screen"
        style={{
          width: ambientWidth,
          height: ambientWidth,
          opacity: ambientOpacity,
          background: "radial-gradient(circle, rgba(0, 238, 252, 0.4) 0%, transparent 70%)",
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto flex-1 gap-16 md:gap-24 py-12 shrink-0">

        {/* Animated Circle Core */}
        <div className="relative flex items-center justify-center w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 shrink-0">

          {/* Abstract Grid / Frequencies (Outer) dynamically scaled by voice */}
          <motion.div
            className="absolute inset-[-40px] md:inset-[-60px] opacity-60 pointer-events-none"
            style={{
              scale: outerGridScale,
              background: "repeating-conic-gradient(from 0deg, rgba(143, 245, 255, 0.05) 0deg, rgba(143, 245, 255, 0.2) 2deg, transparent 4deg, transparent 15deg)",
              WebkitMaskImage: "radial-gradient(black, transparent 70%)"
            }}
            animate={{ 
              rotate: [0, 360],
              borderRadius: isListening 
                ? ["40% 60% 60% 40% / 40% 40% 60% 60%", "60% 40% 40% 60% / 60% 60% 40% 40%", "40% 60% 60% 40% / 40% 40% 60% 60%"]
                : ["45% 55% 50% 50% / 50% 50% 45% 55%", "55% 45% 50% 50% / 50% 50% 55% 45%", "45% 55% 50% 50% / 50% 50% 45% 55%"]
            }}
            transition={{ 
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              borderRadius: { duration: isListening ? 2 : 6, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Dashed Border Rings -> Reacts to sound! */}
          <motion.div
            className="absolute inset-0 border-[3px] border-dashed border-primary/40 pointer-events-none"
            style={{ scale: dashedBorderScale }}
            animate={{ 
              rotate: [0, -360],
              borderRadius: isListening 
                ? ["60% 40% 40% 60% / 60% 40% 60% 40%", "40% 60% 60% 40% / 40% 60% 40% 60%", "60% 40% 40% 60% / 60% 40% 60% 40%"]
                : ["50% 50% 45% 55% / 45% 55% 50% 50%", "55% 45% 55% 45% / 55% 45% 50% 50%", "50% 50% 45% 55% / 45% 55% 50% 50%"]
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              borderRadius: { duration: isListening ? 1.5 : 5, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Dotted Border Rings -> Reacts to sound! */}
          <motion.div
            className="absolute inset-4 border-[2px] border-dotted border-secondary/50 pointer-events-none"
            style={{ scale: dottedBorderScale }}
            animate={{ 
              rotate: [0, 360],
              borderRadius: isListening 
                ? ["45% 55% 55% 45% / 55% 45% 55% 45%", "55% 45% 45% 55% / 45% 55% 45% 55%", "45% 55% 55% 45% / 55% 45% 55% 45%"]
                : ["50% 50% 55% 45% / 45% 55% 50% 50%", "45% 55% 50% 50% / 50% 50% 45% 55%", "50% 50% 55% 45% / 45% 55% 50% 50%"]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              borderRadius: { duration: isListening ? 2.5 : 4, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Glowing Center */}
          <motion.div
            className="relative flex items-center justify-center w-3/4 h-3/4 rounded-full bg-surface-container/40 backdrop-blur-3xl border border-primary/30"
            style={{ boxShadow: glowShadow }}
          >
            {/* Center Core Visual - Smooth Mic icon */}
            <motion.div
              className="relative z-10 flex items-center justify-center"
              style={{ scale: micScale }}
              animate={{
                opacity: isListening ? [0.7, 1, 0.7] : 0.6,
                color: isListening ? "#8ff5ff" : "#cbd5e1",
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Mic size={64} strokeWidth={1.5} className="drop-shadow-lg" />
            </motion.div>
          </motion.div>

        </div>

        {/* Trigger Button Section */}
        <div className="relative flex flex-col items-center gap-6 z-20">
          <motion.p
            className="text-primary tracking-[0.3em] text-xs font-headline uppercase font-semibold"
            animate={{ opacity: isListening ? [0.4, 0.9, 0.4] : 0.5 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {isListening ? "Listening & Recording..." : "Hold to Authenticate Voice"}
          </motion.p>

          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className="relative group w-20 h-20 flex items-center justify-center rounded-full glass-panel hover:bg-primary/10 transition-colors duration-500 overflow-hidden select-none"
          >
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            {/* Morphing Background on Active */}
            {isListening && (
              <motion.div
                className="absolute inset-0 bg-primary/20 pointer-events-none"
                animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

            <AudioLines
              size={32}
              className={`relative z-10 transition-colors duration-300 pointer-events-none ${isListening ? 'text-primary' : 'text-on-surface-variant'}`}
            />
          </button>
          
          {/* Export / Playback saved signature when available */}
          {audioUrl && !isListening && (
            <motion.div 
               initial={{ opacity: 0, y: -10, height: 0 }}
               animate={{ opacity: 1, y: 0, height: 'auto' }}
               className="flex items-center gap-4 bg-surface-container/60 px-5 py-2 rounded-full border border-primary/20 backdrop-blur-xl mt-2"
            >
               <audio src={audioUrl} controls className="h-8 w-44 opacity-80" />
               <a 
                 href={audioUrl} 
                 download="voice-signature.webm"
                 className="p-1.5 rounded-full hover:bg-primary/20 text-primary transition-colors"
                 title="Export Signature"
               >
                 <Download size={18} />
               </a>
            </motion.div>
          )}

        </div>

      </div>

      {/* Screen Edge Glow (Affecting Surroundings) */}
      <motion.div
        className="fixed inset-0 pointer-events-none mix-blend-screen"
        animate={{
          boxShadow: isListening
            ? ["inset 0 0 0px rgba(0,238,252,0)", "inset 0 0 100px rgba(0,238,252,0.15)", "inset 0 0 0px rgba(0,238,252,0)"]
            : "inset 0 0 0px rgba(0,238,252,0)"
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
