"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type SkillGap = { skill: string; current: number; target: number };

export function SkillGapChart({ data }: { data: SkillGap[] }) {
  return <div className="h-[280px] w-full" aria-label="Bar chart comparing current competency with target competency"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 10, right: 4, left: -18, bottom: 0 }} barGap={8}><CartesianGrid stroke="#102a4315" vertical={false} /><XAxis dataKey="skill" axisLine={false} tickLine={false} tick={{ fill: "#52677a", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#52677a", fontSize: 10 }} domain={[0, 100]} /><Tooltip cursor={{ fill: "#102a4308" }} contentStyle={{ border: "1px solid #d9e2e8", borderRadius: 8, fontSize: 12 }} /><Bar dataKey="current" name="Current" fill="#347563" radius={[3, 3, 0, 0]} /><Bar dataKey="target" name="Target" fill="#a9c7b4" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div>;
}
