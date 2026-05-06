"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { EmptyState } from "./empty-state";

interface Testimonial {
  id: string;
  author: string;
  content: string;
  rating: number | null;
  status: "pending" | "approved" | "deleted";
  createdAt: Date | string;
}

interface TestimonialsTableProps {
  testimonials: Testimonial[];
}

type TabFilter = "all" | "pending" | "approved" | "deleted";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function TestimonialsTable({ testimonials }: TestimonialsTableProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [isPending, startTransition] = useTransition();
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, "loading">>({});
  const router = useRouter();

  const filtered = testimonials.filter((t) => {
    if (activeTab === "all") return t.status !== "deleted";
    return t.status === activeTab;
  });

  const handleModerate = async (id: string, action: "approve" | "delete" | "restore") => {
    setOptimisticUpdates((prev) => ({ ...prev, [id]: "loading" }));
    startTransition(async () => {
      try {
        const res = await fetch(`/api/dashboard/testimonials/${id}/moderate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        if (res.ok) {
          setOptimisticUpdates((prev) => { const u = { ...prev }; delete u[id]; return u; });
          router.refresh();
        } else {
          setOptimisticUpdates((prev) => { const u = { ...prev }; delete u[id]; return u; });
          const data = await res.json().catch(() => ({}));
          alert(data.error || "Failed to update testimonial");
        }
      } catch {
        setOptimisticUpdates((prev) => { const u = { ...prev }; delete u[id]; return u; });
        alert("Network error. Please try again.");
      }
    });
  };

  const counts = {
    all: testimonials.filter((t) => t.status !== "deleted").length,
    pending: testimonials.filter((t) => t.status === "pending").length,
    approved: testimonials.filter((t) => t.status === "approved").length,
    deleted: testimonials.filter((t) => t.status === "deleted").length,
  };

  const tabs: { key: TabFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "deleted", label: "Trash", count: counts.deleted },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut, delay: 0.3 }}
      className="rounded-2xl border border-border/50 bg-card shadow-sm"
    >
      <div className="p-5 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Testimonials</h2>
          <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1 relative">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors z-10"
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-background shadow-sm"
                    transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                  />
                )}
                <span className={activeTab === tab.key ? "text-foreground relative" : "text-muted-foreground relative hover:text-foreground"}>
                  {tab.label}{" "}
                  <span className={activeTab === tab.key ? "text-muted-foreground" : "text-muted-foreground/60"}>
                    ({tab.count})
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                title={
                  activeTab === "all"
                    ? "No testimonials yet"
                    : activeTab === "pending"
                      ? "No pending testimonials"
                      : activeTab === "approved"
                        ? "No approved testimonials"
                        : "Trash is empty"
                }
                description="Testimonials will appear here once submitted."
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Author</th>
                    <th className="py-2 pr-3 font-medium">Content</th>
                    <th className="py-2 pr-3 font-medium">Rating</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-0 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((row) => {
                      const isLoading = optimisticUpdates[row.id] === "loading";
                      return (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="border-b align-top"
                        >
                          <td className="py-3 pr-3 font-medium">{row.author}</td>
                          <td className="max-w-md py-3 pr-3 text-muted-foreground">
                            {row.content.length > 100 ? `${row.content.slice(0, 100)}...` : row.content}
                          </td>
                          <td className="py-3 pr-3">
                            {row.rating ? "★".repeat(row.rating) + "☆".repeat(5 - row.rating) : "—"}
                          </td>
                          <td className="py-3 pr-3">
                            <StatusBadge status={row.status} />
                          </td>
                          <td className="py-3 pr-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {row.status === "pending" && (
                                <>
                                  <ActionButton onClick={() => handleModerate(row.id, "approve")} loading={isLoading} variant="primary">
                                    Approve
                                  </ActionButton>
                                  <ActionButton onClick={() => handleModerate(row.id, "delete")} loading={isLoading} variant="destructive">
                                    Delete
                                  </ActionButton>
                                </>
                              )}
                              {row.status === "approved" && (
                                <ActionButton onClick={() => handleModerate(row.id, "delete")} loading={isLoading} variant="outline">
                                  Delete
                                </ActionButton>
                              )}
                              {row.status === "deleted" && (
                                <ActionButton onClick={() => handleModerate(row.id, "restore")} loading={isLoading} variant="outline">
                                  Restore
                                </ActionButton>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    deleted: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs capitalize font-medium ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  );
}

function ActionButton({
  children,
  onClick,
  loading,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  loading: boolean;
  variant: "primary" | "destructive" | "outline";
}) {
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${variantClasses[variant]}`}
    >
      {loading && <Loader2 className="h-3 w-3 animate-spin" />}
      {children}
    </motion.button>
  );
}
