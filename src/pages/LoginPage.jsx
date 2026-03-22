import { useState } from "react";
import { motion } from "motion/react";
import { Mic, Settings, Bell, Unlock, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => setIsListening(true);
  const stopListening = () => setIsListening(false);

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30 flex flex-col">
      {/* TopNavBar */}
      <header className="sticky top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-background/40 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="text-xl font-black tracking-tighter text-primary font-headline">
          DIGITAL SAFE
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/register" className="font-headline uppercase tracking-[0.1em] text-[0.7rem] font-bold text-on-surface-variant hover:text-primary transition-colors duration-300">Dashboard</Link>
          <Link to="/register" className="font-headline uppercase tracking-[0.1em] text-[0.7rem] font-bold text-on-surface-variant hover:text-primary transition-colors duration-300">System Configuration</Link>
          <Link to="/login" className="font-headline uppercase tracking-[0.1em] text-[0.7rem] font-bold text-primary border-b-2 border-primary pb-1">Security Check</Link>
          <Link to="/register" className="font-headline uppercase tracking-[0.1em] text-[0.7rem] font-bold text-on-surface-variant hover:text-primary transition-colors duration-300">Vault</Link>
        </nav>
        <div className="flex items-center gap-6 text-on-surface-variant">
          <button className="hover:text-primary transition-colors"><Bell size={18} /></button>
          <button className="hover:text-primary transition-colors"><Settings size={18} /></button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main Content Canvas (No Sidebar) */}
        <main className="flex-1 relative flex flex-col items-center justify-center bg-background py-20 px-6">
          {/* Subtle Ambient Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/2 rounded-full blur-[120px]"></div>
          </div>

          {/* Security Check Interface */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            {/* Metadata Header */}
            <div className="mb-10 space-y-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] font-headline">Neural Biometric Link</span>
              <h1 className="text-on-surface font-headline font-extrabold text-xl tracking-tight">IDENTITY VERIFICATION</h1>
              <p className="text-on-surface-variant text-[11px] max-w-xs mx-auto leading-relaxed">Place your voice signature within the neural capture field for encrypted vault access.</p>
            </div>

            {/* Central Kinetic Mic Interface */}
            <div className="relative">
              {/* Kinetic Mic Button */}
              <button 
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onMouseLeave={stopListening}
                onTouchStart={startListening}
                onTouchEnd={stopListening}
                className={`relative z-10 w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 bg-gradient-to-br from-primary/90 to-primary-container/90 ${isListening ? 'mic-pulse' : ''}`}
              >
                <div className="absolute inset-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex flex-col items-center justify-center">
                  {/* High-Tech Waveform */}
                  <div className={`flex items-center gap-[3px] h-8 mb-2 transition-opacity duration-300 ${isListening ? 'opacity-100' : 'opacity-30'}`}>
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-[2px] bg-primary rounded-full transition-all duration-300 ${isListening ? 'waveform-bar-anim' : 'h-2'}`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                  <Mic className="text-primary" size={40} />
                  {/* Mini status indicator inside mic */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full bg-primary ${isListening ? 'animate-pulse' : ''}`}></div>
                    <span className="text-[10px] font-bold text-primary tracking-widest">{isListening ? 'LISTENING' : 'IDLE'}</span>
                  </div>
                </div>
              </button>

              {/* Status Labels Floating */}
              <div className="absolute -left-24 top-1/2 -translate-y-1/2 glass-panel px-4 py-2 rounded-xl">
                <p className="text-[8px] text-on-surface-variant uppercase font-bold tracking-tighter">Confidence</p>
                <p className="text-sm font-headline font-black text-primary">0%</p>
              </div>
            </div>

            {/* Operational Subtext (Removed) */}
          </motion.section>

          {/* Dynamic Feedback Indicators */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-16 opacity-30 hover:opacity-100 transition-opacity duration-500">
            <div className="flex flex-col items-center gap-2 group cursor-help">
              <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Unlock className="text-primary" size={16} />
              </div>
              <span className="text-[9px] font-bold text-primary tracking-widest uppercase">Success Mode</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-help">
              <div className="w-10 h-10 rounded-full border border-error/20 flex items-center justify-center group-hover:bg-error/10 transition-colors">
                <AlertTriangle className="text-error" size={16} />
              </div>
              <span className="text-[9px] font-bold text-error tracking-widest uppercase">Alert Mode</span>
            </div>
          </div>
        </main>
      </div>

      {/* Visual Polish: Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    </div>
  );
}
