import { Brain, Activity, Radar, ShieldCheck } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-full flex flex-col p-4 bg-surface-container-low/60 backdrop-blur-2xl border-r border-outline-variant/10 shrink-0">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center border border-secondary/20">
            <Brain className="text-secondary" size={20} />
          </div>
          <div>
            <h3 className="text-secondary font-headline font-bold text-sm">SENTINEL AI</h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Active Protection</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-2">
        {[
          { icon: Activity, label: "Live Status" },
          { icon: Brain, label: "AI Neural Link" },
          { icon: Radar, label: "Threat Map" },
          { icon: ShieldCheck, label: "Encryption" },
        ].map((item, idx) => (
          <div key={idx} className="group flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant hover:text-white transition-all rounded-lg cursor-pointer hover:translate-x-1 duration-200">
            <item.icon size={16} />
            <span className="font-body text-xs font-bold uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </nav>
      <button className="mt-auto w-full py-3 bg-secondary/10 border border-secondary/30 text-secondary font-headline text-[10px] font-bold tracking-[0.2em] rounded-lg hover:bg-secondary/20 transition-all active:scale-95">
        LOCK VAULT
      </button>
    </aside>
  );
}
