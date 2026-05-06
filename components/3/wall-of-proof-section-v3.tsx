"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerContainer, StaggerItem } from "./motion-utils";

const wallItems = [
  {
    content: "This space is reserved for our very first user. Will it be you?",
    author: "You",
    role: "Your role",
    company: "Your company",
  },
  {
    content: "Imagine your best customer saying something amazing about your product right here.",
    author: "Future You",
    role: "Founder",
    company: "Your startup",
  },
  {
    content: "We built this because collecting feedback shouldn't require a messy spreadsheet.",
    author: "The Prooflyst Team",
    role: "Builders",
    company: "Prooflyst",
  },
];

function TiltCard({ item, index }: { item: typeof wallItems[0]; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-full"
    >
      <Card className="border-border bg-background h-full relative overflow-hidden group">
        {/* Glare effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
          }}
        />

        {/* Animated border */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-50" />
        </div>

        <CardContent className="p-6 relative">
          {/* Animated quote mark */}
          <motion.div
            className="text-5xl font-serif text-primary/10 leading-none mb-2 select-none"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
          >
            &ldquo;
          </motion.div>

          <p className="text-sm text-foreground leading-relaxed mb-6 relative z-10">
            {item.content}
          </p>

          <div className="flex items-center gap-3">
            <motion.div
              className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-xs font-medium text-primary">
                {item.author.split(" ").map((n) => n[0]).join("")}
              </span>
            </motion.div>
            <div>
              <p className="text-sm font-medium">{item.author}</p>
              <p className="text-xs text-muted-foreground">
                {item.role}, {item.company}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function WallOfProofSectionV3() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
            Your proof, all in one place.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Not a list. Not a doc. A living system of credibility.
          </p>
        </motion.div>

        <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.12}>
          {wallItems.map((item, index) => (
            <StaggerItem key={index}>
              <TiltCard item={item} index={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
