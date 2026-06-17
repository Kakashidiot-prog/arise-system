interface SystemHeaderProps {
  name: string;
  rank: string;
  level: number;
}

export default function SystemHeader({ name, rank, level }: SystemHeaderProps) {
  return (
    <header className="sys-header text-center pt-12 pb-8 border-b border-border mb-8 relative">
      {/* System Status Alert */}
      <div className="sys-alert sys-font-mono text-[11px] tracking-[4px] text-muted mb-3 animate-sys-blink uppercase">
        [ system online ]
      </div>
      
      {/* Character Name */}
      <h1 className="sys-name sys-font-title text-5xl font-bold text-text tracking-[3px] glow-text mb-2 uppercase">
        {name}
      </h1>
      
      {/* Rank and Level Info */}
      <div className="sys-rank sys-font-mono text-[13px] text-purple2 tracking-[2px] uppercase">
        {rank} · Level {level}
      </div>
      
      {/* Decorative Underline (Prototype Match) */}
      <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 flex items-center justify-center w-full">
        {/* Main solid line */}
        <div className="w-20 h-[2px] bg-purple relative z-10" />
        {/* Glowing gradient line */}
        <div className="absolute w-40 h-[2px] bg-gradient-to-r from-transparent via-purple to-transparent opacity-70" />
      </div>

      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent" />
    </header>
  );
}