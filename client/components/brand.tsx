import { Activity } from "lucide-react";
import Image from "next/image";

export function Brand({ light = false }: { light?: boolean }) {
  return <div className={`flex items-center gap-2.5 ${light ? "text-paper" : "text-ink"}`}>
    <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-ink"><Image src="/zeroday-logo.jpeg" alt="Zero Day" fill sizes="36px" className="object-cover" /><Activity size={18} strokeWidth={2.5} className="relative text-paper" /></span>
    <span className="font-serif text-xl font-bold tracking-tight">AYUSH <span className="text-leaf">SkillSync</span></span>
  </div>;
}