const spaghettiCode = `// The Old Way: Managing testimonials
const fs = require('fs');
const csv = fs.readFileSync('testimonials.csv', 'utf8');
const rows = csv.split('\\n').slice(1);
const testimonials = [];

for (const row of rows) {
  const cols = row.split(',');
  const text = cols[0].replace(/[<>]/g, '');
  const author = cols[1].trim();
  testimonials.push({ text, author });
}

let html = '<div class="testimonials">';
for (const t of testimonials) {
  html += \`<div class="review">
    <p>"\${t.text}"</p>
    <strong>\${t.author}</strong>
  </div>\`;
}
html += '</div>';
fs.writeFileSync('output.html', html);`;

const prooflystCode = `// The Prooflyst Way: Clean API
const response = await fetch(
  'https://api.prooflyst.io/v1/testimonials', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});

const { data } = await response.json();
// data is ready to use
renderTestimonials(data);`;

export function WhyProoflystSectionV2() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 max-w-xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Developer Contrast
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Stop writing spaghetti code to manage testimonials.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 relative">
          {/* VS indicator */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="h-10 w-10 rounded-full bg-background border border-border/50 flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">VS</span>
            </div>
          </div>

          {/* Old Way */}
          <div className="rounded-2xl border border-destructive/20 bg-[#1e1e1e] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-white/40 font-mono ml-2">
                testimonials.js
              </span>
              <span className="text-xs text-destructive/60 font-mono ml-auto">
                The Old Way
              </span>
            </div>
            <pre className="p-4 text-xs text-white/60 font-mono overflow-x-auto leading-relaxed">
              <code>{spaghettiCode}</code>
            </pre>
          </div>

          {/* Prooflyst Way */}
          <div className="rounded-2xl border border-primary/20 bg-[#1e1e1e] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-primary/20">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-white/40 font-mono ml-2">
                prooflyst.js
              </span>
              <span className="text-xs text-primary font-mono ml-auto">
                The Prooflyst Way
              </span>
            </div>
            <pre className="p-4 text-xs text-white/80 font-mono overflow-x-auto leading-relaxed">
              <code>{prooflystCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
