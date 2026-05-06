"use client";

import { motion } from "motion/react";
import { MessageSquare, Clock, CheckCircle, Trash2 } from "lucide-react";
import { CountUp } from "./count-up";

interface StatsCardsProps {
  total: number;
  pending: number;
  approved: number;
  deleted: number;
}

const easeOut = [0.22, 1, 0.36, 1] as const;

export function StatsCards({ total, pending, approved, deleted }: StatsCardsProps) {
  const cards = [
    { icon: MessageSquare, label: "Total", value: total, desc: "All testimonials", color: "bg-muted text-muted-foreground" },
    { icon: Clock, label: "Pending", value: pending, desc: "Awaiting review", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", highlight: pending > 0 },
    { icon: CheckCircle, label: "Approved", value: approved, desc: "Published", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    { icon: Trash2, label: "Trash", value: deleted, desc: "Deleted items", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut, delay: i * 0.05 }}
          whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
          className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                <CountUp value={card.value} duration={0.8 + i * 0.1} />
              </p>
              <p className="text-xs text-muted-foreground">{card.desc}</p>
            </div>
            <motion.div
              className={`rounded-xl p-2.5 ${card.color}`}
              animate={card.highlight ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <card.icon className="h-4 w-4" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
