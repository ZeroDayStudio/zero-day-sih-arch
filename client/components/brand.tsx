import { Activity } from "lucide-react";

export function Brand({ light = false }: { light?: boolean }) {
  return <div className={`flex items-center gap-2.5 ${light ? "text-paper" : "text-ink"}`}>
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-saffron text-ink"><Activity size={18} strokeWidth={2.5} /></span>
    <span className="font-serif text-xl font-bold tracking-tight">AYUSH <span className="text-leaf">SkillSync</span></span>
  </div>;
}