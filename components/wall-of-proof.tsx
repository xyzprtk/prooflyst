import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const wallItems = [
  {
    content: "This completely changed how we handle customer feedback. Game changer.",
    author: "Sarah Chen",
    role: "Product Lead",
    company: "TechCorp",
  },
  {
    content: "Finally, a system that makes sense. No more scattered screenshots.",
    author: "Marcus Johnson",
    role: "Founder",
    company: "StartupXYZ",
  },
  {
    content: "The API is so clean. Took me 10 minutes to integrate.",
    author: "Alex Rivera",
    role: "Engineer",
    company: "DevStudio",
  },
  {
    content: "We use this for every product launch now. Essential tool.",
    author: "Emma Wilson",
    role: "Marketing Director",
    company: "GrowthCo",
  },
  {
    content: "Structured proof is 10x more valuable than random testimonials.",
    author: "David Park",
    role: "CEO",
    company: "ScaleUp",
  },
  {
    content: "Worth every penny. The organization features alone saved us hours.",
    author: "Lisa Thompson",
    role: "Operations",
    company: "FlowSystems",
  },
];

export function WallOfProofSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Your proof, all in one place.
          </h2>
          <p className="text-base text-muted-foreground">
            Not a list. Not a doc. A living system of credibility.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {wallItems.map((item, index) => (
            <Card key={index} className="border-border rounded-xl bg-background">
              <CardContent className="p-6">
                <p className="text-sm text-foreground mb-4">&ldquo;{item.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {item.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.role}, {item.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg">
            This could be your wall.
          </Button>
        </div>
      </div>
    </section>
  );
}
