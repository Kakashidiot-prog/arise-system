interface SystemHeaderProps {
  name: string;
  rank: string;
  level: number;
}

export default function SystemHeader({ name, rank, level }: SystemHeaderProps) {
  return (
    <header className="sys-header text-center py-8 border-b border-[var(--border)] mb-6 relative">
      <div className="sys-alert sys-font-mono text-[11px] tracking-[3px] color-[var(--muted)] mb-2 animate-sys-blink uppercase">
        System Notification: User Status Active
      </div>
      <h1 className="sys-name sys-font-title text-4xl font-bold text-[var(--text)] tracking-[2px] glow-text mb-1 uppercase">
        {name}
      </h1>
      <div className="sys-rank sys-font-mono text-sm text-[var(--purple2)] tracking-[2px] uppercase">
        Rank: {rank} | Level: {level}
      </div>
      
      {/* Decorative lines from HTML */}
      <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-20 h-[2px] bg-[var(--purple)]" />
      <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-[var(--purple)] to-transparent" />
    </header>
  );
}