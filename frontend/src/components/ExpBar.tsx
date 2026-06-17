interface ExpBarProps {
  currentExp: number;
  maxExp: number;
}

export default function ExpBar({ currentExp, maxExp }: ExpBarProps) {
  const percentage = Math.min(Math.round((currentExp / maxExp) * 100), 100);

  return (
    <div className="exp-wrap mb-6">
      <div className="exp-header flex justify-between sys-font-mono text-[11px] text-muted mb-2 uppercase tracking-wider">
        <span>Exp to next level</span>
        <span className="text-purple2">{currentExp.toFixed(1)} / {maxExp}</span>
      </div>
      
      <div className="exp-track bg-bg2 border border-border rounded h-4 overflow-hidden relative">
        {/* The dynamic fill bar */}
        <div 
          className="exp-fill h-full bg-gradient-to-r from-[#2d1fa0] via-purple to-purple2 rounded-sm transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-sys-shine" />
        </div>
      </div>
    </div>
  );
}
