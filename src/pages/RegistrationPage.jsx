import { useState, useRef } from "react";
import { motion } from "motion/react";
import { CloudUpload, FileAudio, UserCheck, Cpu, Mic, Settings, Bell, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useVoiceContext } from "../context/VoiceContext";

export default function RegistrationPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [localAudioBlob, setLocalAudioBlob] = useState(null);
  
  const { setMasterAudioBlob } = useVoiceContext();
  const navigate = useNavigate();

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordingTimeoutRef = useRef(null);

  const startRecording = async (e) => {
    if (e) e.preventDefault();
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setLocalAudioBlob(audioBlob);
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Max 5 seconds recording
      recordingTimeoutRef.current = setTimeout(() => { stopRecording(); }, 5000);
    } catch(err) {
      console.error(err);
      alert("Microphone access denied");
    }
  };

  const stopRecording = (e) => {
    if (e) e.preventDefault();
    if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLocalAudioBlob(file);
  };

  const handleInitialization = () => {
    if (!localAudioBlob) {
      alert("Please upload or record a voice signature first.");
      return;
    }
    setMasterAudioBlob(localAudioBlob);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col selection:bg-primary/30">
      {/* TopNavBar */}
      <header className="bg-background/40 backdrop-blur-xl text-primary font-headline uppercase tracking-[0.1em] text-[0.7rem] font-bold sticky top-0 z-50 border-b border-outline-variant/10 flex justify-between items-center px-8 h-16 w-full shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-[#00F0FF] tracking-tighter">Digital Safe</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/register" className="font-headline uppercase tracking-[0.1em] text-[0.7rem] font-bold text-on-surface-variant hover:text-primary transition-colors duration-300">Dashboard</Link>
          <Link to="/register" className="font-headline uppercase tracking-[0.1em] text-[0.7rem] font-bold text-primary border-b-2 border-primary pb-1">System Configuration</Link>
          <Link to="/login" className="font-headline uppercase tracking-[0.1em] text-[0.7rem] font-bold text-on-surface-variant hover:text-primary transition-colors duration-300">Security Check</Link>
          <Link to="/register" className="font-headline uppercase tracking-[0.1em] text-[0.7rem] font-bold text-on-surface-variant hover:text-primary transition-colors duration-300">Vault</Link>
        </nav>
        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors duration-300">
            <Bell size={18} />
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors duration-300">
            <Settings size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Subtle Ambient Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/2 rounded-full blur-[120px]"></div>
          </div>

          {/* System Configuration Glass Card */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel w-full max-w-5xl rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden flex flex-col items-center"
          >
            <div className="relative z-10 w-full">
              <header className="mb-10 text-center">
                <h1 className="font-headline text-2xl md:text-3xl font-extrabold uppercase tracking-[0.2em] text-on-surface mb-2">System Configuration</h1>
                <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.3em]">Biometric Voice Encryption Setup</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                {/* Left Column: Voice Upload */}
                <div className="flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="font-headline text-[11px] font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                      <CloudUpload size={14} />
                      01. Source Authentication
                    </h3>
                    <label className="group relative bg-surface-container-low/40 border border-dashed border-outline-variant/30 rounded-2xl p-8 transition-all duration-500 hover:border-primary/40 hover:bg-surface-container-low/60 flex flex-col items-center justify-center cursor-pointer">
                      <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                      {localAudioBlob ? (
                         <>
                           <CheckCircle className="text-secondary group-hover:text-primary transition-colors mb-4" size={36} />
                           <p className="text-on-surface text-sm font-medium text-center">Voice Captured</p>
                           <p className="text-on-surface-variant text-[10px] mt-1 text-center text-primary/80">Ready for initialization</p>
                         </>
                      ) : (
                         <>
                           <FileAudio className="text-on-surface-variant group-hover:text-primary transition-colors mb-4" size={36} />
                           <p className="text-on-surface text-sm font-medium text-center">Upload Voice File</p>
                           <p className="text-on-surface-variant text-[10px] mt-1 text-center">Drag and drop .WAV or .FLAC</p>
                         </>
                      )}
                    </label>
                  </div>

                  <div className="p-5 bg-surface-container-high/40 rounded-2xl border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-bold uppercase tracking-tighter text-on-surface-variant">System Status</span>
                      <span className="flex items-center gap-1.5 text-[9px] text-secondary font-bold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                        Analyzing Voice...
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: "66%" }}
                          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                        ></motion.div>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-on-surface-variant/50">
                        <span>ENCRYPT_STRENGTH: 88%</span>
                        <span>PHONETIC_HASH: 0x8F...2E</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Recording */}
                <div className="flex flex-col items-center justify-between p-6 border border-outline-variant/10 bg-surface-container-low/20 rounded-2xl">
                  <h3 className="font-headline text-[11px] font-bold uppercase tracking-wider text-primary">
                    02. Live Voice Calibration
                  </h3>
                  <div className="flex flex-col items-center justify-center flex-1 w-full space-y-8 py-10">
                    <div className="relative">
                      <button 
                        onMouseDown={startRecording}
                        onMouseUp={stopRecording}
                        onMouseLeave={stopRecording}
                        onTouchStart={startRecording}
                        onTouchEnd={stopRecording}
                        className={`w-24 h-24 rounded-full bg-gradient-to-br from-primary/90 to-primary-container/90 flex items-center justify-center transition-all active:scale-95 group relative z-10 ${isRecording ? 'mic-pulse' : ''}`}
                      >
                        <Mic className="text-on-primary" size={36} />
                      </button>
                    </div>

                    <div className={`flex items-center gap-1.5 h-8 w-full justify-center transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-30'}`}>
                      {[...Array(10)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1 bg-primary rounded-full transition-all duration-300 ${isRecording ? 'waveform-bar-anim' : 'h-1.5'}`}
                          style={{ animationDelay: `${i * 0.08}s` }}
                        ></div>
                      ))}
                    </div>

                    <div className="text-center">
                      <p className="text-on-surface text-xs font-medium italic">"My voice is the master key to this vault."</p>
                      <p className="text-on-surface-variant text-[10px] mt-2">Press and hold to calibrate</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center gap-5">
                <button onClick={handleInitialization} className="w-full max-w-sm h-14 bg-primary text-on-primary font-headline font-extrabold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all hover:bg-primary-dim active:scale-[0.98] flex items-center justify-center gap-3">
                  Initializing Registration
                </button>
                <div className="flex items-center gap-5 text-[9px] text-on-surface-variant/50 font-bold uppercase tracking-tighter">
                  <span className="flex items-center gap-1.5"><UserCheck size={12} /> AES-256 BIT</span>
                  <span className="w-1 h-1 bg-outline-variant/20 rounded-full"></span>
                  <span className="flex items-center gap-1.5"><Cpu size={12} /> AI PROCESSED</span>
                </div>
              </div>
            </div>
          </motion.section>

          <footer className="mt-8 text-on-surface-variant/20 font-mono text-[8px] uppercase tracking-[0.2em] flex gap-8">
            <span>SECURE_NODE: ALPHA_9</span>
            <span>UPTIME: 99.99%</span>
            <span>LATENCY: 14MS</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
