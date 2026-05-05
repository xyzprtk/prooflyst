export function WhyProoflystSection() {
  const spaghettiCode = `// The Old Way: Managing testimonials
const fs = require('fs');
const csv = fs.readFileSync('testimonials.csv', 'utf8');
const rows = csv.split('\\n').slice(1);
const testimonials = [];

for (const row of rows) {
  const cols = row.split(',');
  // sanitize manually
  const text = cols[0].replace(/[<>]/g, '');
  const author = cols[1].trim();
  testimonials.push({ text, author });
}

// generate ugly static HTML
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
const response = await fetch('https://api.prooflyst.io/v1/testimonials', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});

const { data } = await response.json();
// data is ready to use
renderTestimonials(data);`;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Developer Contrast
          </h2>
          <p className="text-base text-muted-foreground max-w-xl">
            Stop writing spaghetti code to manage testimonials.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-[#1e1e1e] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-white/50 font-mono ml-2">testimonials.js</span>
              <span className="text-xs text-red-400 font-mono ml-auto">The Old Way</span>
            </div>
            <pre className="p-4 text-xs text-white/80 font-mono overflow-x-auto leading-relaxed">
              <code>{spaghettiCode}</code>
            </pre>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-[#1e1e1e] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-primary/20">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-white/50 font-mono ml-2">prooflyst.js</span>
              <span className="text-xs text-primary font-mono ml-auto">The Prooflyst Way</span>
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