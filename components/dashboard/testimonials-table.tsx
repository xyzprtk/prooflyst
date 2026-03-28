"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export function TestimonialsTable({ testimonials }: TestimonialsTableProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [isPending, startTransition] = useTransition();
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, "pending" | "approved" | "deleted" | "loading">>({});
  const router = useRouter();

  const filteredTestimonials = testimonials.filter((t) => {
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
          setOptimisticUpdates((prev) => {
            const updates = { ...prev };
            delete updates[id];
            return updates;
          });
          router.refresh();
        } else {
          const data = await res.json().catch(() => ({}));
          console.error("Moderation failed:", data.error || data.message || "Unknown error");
          setOptimisticUpdates((prev) => {
            const updates = { ...prev };
            delete updates[id];
            return updates;
          });
          alert(data.error || data.message || "Failed to update testimonial");
        }
      } catch (error) {
        console.error("Moderation error:", error);
        setOptimisticUpdates((prev) => {
          const updates = { ...prev };
          delete updates[id];
          return updates;
        });
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Testimonials</CardTitle>
          <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            <TabButton
              active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
              count={counts.all}
            >
              All
            </TabButton>
            <TabButton
              active={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
              count={counts.pending}
            >
              Pending
            </TabButton>
            <TabButton
              active={activeTab === "approved"}
              onClick={() => setActiveTab("approved")}
              count={counts.approved}
            >
              Approved
            </TabButton>
            <TabButton
              active={activeTab === "deleted"}
              onClick={() => setActiveTab("deleted")}
              count={counts.deleted}
              variant="deleted"
            >
              Trash
            </TabButton>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTestimonials.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {activeTab === "all"
              ? "No testimonials yet."
              : activeTab === "pending"
                ? "No pending testimonials."
                : activeTab === "approved"
                  ? "No approved testimonials."
                  : "Trash is empty."}
          </p>
        ) : (
          <div className="overflow-x-auto">
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
                {filteredTestimonials.map((row) => {
                  const isLoading = optimisticUpdates[row.id] === "loading";
                  return (
                    <tr key={row.id} className="border-b align-top">
                      <td className="py-3 pr-3 font-medium">{row.author}</td>
                      <td className="max-w-md py-3 pr-3 text-muted-foreground">
                        {row.content.length > 100 ? `${row.content.slice(0, 100)}...` : row.content}
                      </td>
                      <td className="py-3 pr-3">
                        {row.rating ? "★".repeat(row.rating) + "☆".repeat(5 - row.rating) : "-"}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`rounded px-2 py-1 text-xs capitalize ${
                            row.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : row.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 pr-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {row.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleModerate(row.id, "approve")}
                                disabled={isLoading || isPending}
                              >
                                {isLoading ? "..." : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleModerate(row.id, "delete")}
                                disabled={isLoading || isPending}
                              >
                                {isLoading ? "..." : "Delete"}
                              </Button>
                            </>
                          )}
                          {row.status === "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleModerate(row.id, "delete")}
                              disabled={isLoading || isPending}
                            >
                              {isLoading ? "..." : "Delete"}
                            </Button>
                          )}
                          {row.status === "deleted" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleModerate(row.id, "restore")}
                              disabled={isLoading || isPending}
                            >
                              {isLoading ? "..." : "Restore"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TabButton({
  active,
  onClick,
  count,
  children,
  variant,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
  variant?: "deleted";
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
        active
          ? "bg-background text-foreground shadow-sm"
          : variant === "deleted"
            ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}{" "}
      <span className={`ml-1 ${active ? "text-muted-foreground" : ""} ${variant === "deleted" && !active ? "text-red-500" : ""}`}>
        ({count})
      </span>
    </button>
  );
}