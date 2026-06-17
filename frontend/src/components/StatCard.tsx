interface StatCardProps {
  label: string;
  value: string | number;
  colorClass?: string; // e.g., 'text-gold', 'text-purple2', 'text-green'
}

export default function StatCard({ label, value, colorClass = 'text-purple2' }: StatCardProps) {
  return (
    <div className="stat-card bg-panel border border-border rounded-lg p-3 text-center relative overflow-hidden transition-all hover:border-border2 group">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-purple opacity-40 group-hover:opacity-100 transition-opacity" />
      
      <div className="stat-label sys-font-mono text-[10px] tracking-[2px] text-muted uppercase mb-1">
        {label}
      </div>
      
      <div className={`stat-val sys-font-mono text-2xl font-normal ${colorClass} transition-colors`}>
        {value}
      </div>
    </div>
  );
}
