/* eslint-disable */
// Re-Tire — 12 logo explorations on a design canvas
// All marks share the palette: slate-grey + forest-green
// (anti-pastel-tile, engineering register, sans-serif)

const C = {
  slate900: "#0F1A1D",
  slate800: "#1B2A2E",
  slate700: "#2A3B3F",
  slate600: "#3A4A4E",
  slate400: "#6B7B7F",
  slate300: "#8A9A93",
  slate200: "#B8C2BD",
  slate150: "#CFD6CF",
  forest900: "#16382A",
  forest700: "#1F4D3A",
  forest500: "#2F5D43",
  forest300: "#7CA48C",
  bone100:  "#EFEDE6",
  bone50:   "#F5F3ED",
};

// ============================================================
// HELPERS
// ============================================================

// A reusable mesh dot field. Generates a hex-grid of dots clipped to
// a region. densityFn(x,y) returns a 0..1 multiplier on dot radius;
// returning 0 omits the dot.
function meshDots({
  x0, y0, x1, y1, step = 12, color = C.forest500,
  baseR = 1.8, densityFn,
}) {
  const dots = [];
  let row = 0;
  for (let y = y0; y <= y1; y += step) {
    const xoff = (row % 2) * (step / 2);
    for (let x = x0 + xoff; x <= x1; x += step) {
      const d = densityFn ? densityFn(x, y) : 1;
      if (d <= 0.01) continue;
      const r = baseR * d;
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={color}/>);
    }
    row++;
  }
  return dots;
}

// Concentric tire-section rings (left half)
function TireRings({ cx, cy, radii, color, sw = 1.4 }) {
  return radii.map((r, i) => (
    <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw}/>
  ));
}

// Construction crosshair (light hairlines on bone)
function CrossHairs({ w, h, color = C.slate200 }) {
  return (
    <g stroke={color} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.7">
      <line x1="0" y1={h/2} x2={w} y2={h/2}/>
      <line x1={w/2} y1="0" x2={w/2} y2={h}/>
    </g>
  );
}

// Tread radial ticks
function TreadTicks({ cx, cy, rOuter, rInner, color, count = 13, fromDeg = -170, toDeg = 95, sw = 1.6 }) {
  const ticks = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const deg = fromDeg + t * (toDeg - fromDeg);
    ticks.push(
      <line key={i}
        x1={cx} y1={cy - rOuter} x2={cx} y2={cy - rInner}
        transform={`rotate(${deg} ${cx} ${cy})`}
        stroke={color} strokeWidth={sw} strokeLinecap="round"
      />
    );
  }
  return ticks;
}

// Cedar tree silhouette (Lebanese mark)
function Cedar({ cx, cy, size = 12, color = C.forest500 }) {
  const s = size;
  return (
    <g fill={color} transform={`translate(${cx} ${cy})`}>
      <path d={`M0 ${-s} L${-s*0.6} ${-s*0.25} L${-s*0.3} ${-s*0.25} L${-s*0.85} ${s*0.15} L${-s*0.45} ${s*0.15} L${-s*1.1} ${s*0.55} L${s*1.1} ${s*0.55} L${s*0.45} ${s*0.15} L${s*0.85} ${s*0.15} L${s*0.3} ${-s*0.25} L${s*0.6} ${-s*0.25} Z`}/>
      <rect x={-s*0.15} y={s*0.55} width={s*0.3} height={s*0.4}/>
    </g>
  );
}

// ============================================================
// 01 — HALF-DISC SECTION (the primary mark)
// Left: tire cross-section rings + tread ticks
// Right: granular mesh field, density grades outward
// ============================================================
function MarkHalfDisc({ size = 220, ink = C.slate800, accent = C.forest500, dotAccent }) {
  const cx = 100, cy = 100, R = 86;
  const radii = [86, 78, 68, 58, 48, 38, 28, 18];
  const dotColor = dotAccent || accent;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <clipPath id="halfL"><rect x="0" y="0" width={cx} height="200"/></clipPath>
        <clipPath id="halfR"><rect x={cx} y="0" width="100" height="200"/></clipPath>
        <mask id="disk"><rect x="0" y="0" width="200" height="200" fill="black"/><circle cx={cx} cy={cy} r={R} fill="white"/></mask>
      </defs>
      <g clipPath="url(#halfL)">
        <TireRings cx={cx} cy={cy} radii={radii} color={ink}/>
        <TreadTicks cx={cx} cy={cy} rOuter={R} rInner={R-8} color={ink}/>
      </g>
      <line x1={cx} y1={cy-R} x2={cx} y2={cy+R} stroke={accent} strokeWidth="0.6" strokeDasharray="2 2"/>
      <g clipPath="url(#halfR)" mask="url(#disk)">
        {meshDots({
          x0: cx+4, y0: 14, x1: 192, y1: 186, step: 7, color: dotColor, baseR: 1.0,
          densityFn: (x,y) => {
            // density grows outward from center
            const d = Math.hypot(x-cx, y-cy);
            return Math.min(1, Math.max(0, (d-12)/70));
          }
        })}
      </g>
      <circle cx={cx} cy={cy} r="3.4" fill={accent}/>
      <circle cx={cx} cy={cy} r="1.6" fill={ink === C.slate800 ? C.bone100 : C.slate900}/>
    </svg>
  );
}

// ============================================================
// 02 — CONCENTRIC MESH (full-disc, no division)
// Mesh dots fill the entire circle; density rises in concentric bands
// ============================================================
function MarkConcentricMesh({ size = 220, ink = C.slate800, accent = C.forest500 }) {
  const cx = 100, cy = 100, R = 90;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <mask id="cm"><rect width="200" height="200" fill="black"/><circle cx={cx} cy={cy} r={R} fill="white"/></mask>
      </defs>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={ink} strokeWidth="1.2"/>
      <g mask="url(#cm)">
        {meshDots({
          x0: 6, y0: 6, x1: 194, y1: 194, step: 8, color: accent, baseR: 1.4,
          densityFn: (x,y) => {
            const d = Math.hypot(x-cx, y-cy);
            // 4 dense rings
            const bands = [16, 36, 56, 76];
            let best = 0;
            for (const b of bands) {
              const dist = Math.abs(d - b);
              best = Math.max(best, Math.exp(-dist*dist/40));
            }
            return best;
          }
        })}
      </g>
      <circle cx={cx} cy={cy} r="6" fill={ink}/>
      <circle cx={cx} cy={cy} r="2.4" fill={accent}/>
    </svg>
  );
}

// ============================================================
// 03 — SECTIONAL DIAGRAM (engineering drawing style)
// Like a CAD detail with callouts
// ============================================================
function MarkSectional({ size = 240, ink = C.slate800, accent = C.forest500 }) {
  const cx = 110, cy = 100, R = 78;
  return (
    <svg viewBox="0 0 220 200" width={size} height={size * 200/220}>
      {/* outer bounding hairline */}
      <rect x="6" y="6" width="208" height="188" fill="none" stroke={C.slate200} strokeWidth="0.4" strokeDasharray="2 3"/>

      {/* the tire section */}
      <g stroke={ink} fill="none" strokeWidth="1.2">
        <circle cx={cx} cy={cy} r={R}/>
        <circle cx={cx} cy={cy} r={R-12}/>
        <circle cx={cx} cy={cy} r={R-28}/>
        <circle cx={cx} cy={cy} r={R-48}/>
      </g>

      {/* axis dashed */}
      <line x1={cx} y1={cy-R-10} x2={cx} y2={cy+R+10} stroke={accent} strokeWidth="0.5" strokeDasharray="2 2"/>

      {/* radial callouts */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="6.5" fill={C.slate600}>
        {/* R callout */}
        <line x1={cx} y1={cy} x2={cx+R} y2={cy} stroke={C.slate600} strokeWidth="0.4"/>
        <text x={cx+R/2 - 2} y={cy-3}>R · 1.00a</text>
        {/* mesh callout */}
        <line x1={cx+R+4} y1={cy-30} x2={cx+R+30} y2={cy-30} stroke={C.slate600} strokeWidth="0.4"/>
        <circle cx={cx+R+4} cy={cy-30} r="1" fill={C.slate600}/>
        <text x={cx+R+33} y={cy-28}>MESH 20</text>
      </g>

      {/* mesh nodes inside the tire */}
      <g fill={accent}>
        {meshDots({
          x0: cx-R+10, y0: cy-R+10, x1: cx+R-10, y1: cy+R-10,
          step: 11, baseR: 1.5,
          densityFn: (x,y) => Math.hypot(x-cx, y-cy) < R-10 ? 1 : 0,
        })}
      </g>

      {/* center hub */}
      <circle cx={cx} cy={cy} r="3.5" fill={accent}/>

      {/* dimension lines */}
      <g stroke={C.slate400} strokeWidth="0.4" fontFamily="JetBrains Mono, monospace" fontSize="6.5" fill={C.slate600}>
        <line x1={cx-R} y1={cy+R+18} x2={cx+R} y2={cy+R+18}/>
        <line x1={cx-R} y1={cy+R+15} x2={cx-R} y2={cy+R+21}/>
        <line x1={cx+R} y1={cy+R+15} x2={cx+R} y2={cy+R+21}/>
        <text x={cx-6} y={cy+R+30}>a · 2.00r</text>
      </g>
    </svg>
  );
}

// ============================================================
// 04 — STACKED TREAD (rectangular, layered)
// Horizontal tire layers becoming granulated rubber at the bottom
// ============================================================
function MarkStackedTread({ size = 200, ink = C.slate800, accent = C.forest500 }) {
  const w = 160, h = 200, x0 = 20, y0 = 20;
  // layer bands top to bottom
  const layers = [
    { y: 36, h: 14, fill: ink, label: "TREAD" },
    { y: 50, h: 10, fill: C.slate600, label: "BELT" },
    { y: 60, h: 14, fill: C.slate700, label: "PLY" },
    { y: 74, h: 18, fill: ink, label: "BEAD" },
  ];
  return (
    <svg viewBox="0 0 200 220" width={size} height={size*220/200}>
      {/* container */}
      <rect x={x0} y={y0} width={w} height={180} fill="none" stroke={C.slate300} strokeWidth="0.8"/>
      {/* layers */}
      {layers.map((L, i) => (
        <g key={i}>
          <rect x={x0} y={L.y} width={w} height={L.h} fill={L.fill}/>
          <text x={x0 + w + 6} y={L.y + L.h/2 + 2}
            fontFamily="JetBrains Mono, monospace" fontSize="6" fill={C.slate400} letterSpacing="0.5">
            {L.label}
          </text>
        </g>
      ))}
      {/* connector — tread ticks above */}
      <g stroke={ink} strokeWidth="1.2">
        {[...Array(12)].map((_, i) => (
          <line key={i} x1={x0 + 8 + i*13} y1={y0+4} x2={x0 + 8 + i*13} y2={36} strokeLinecap="round"/>
        ))}
      </g>
      {/* dissolve to mesh below bead */}
      <g fill={accent}>
        {meshDots({
          x0: x0+4, y0: 100, x1: x0+w-4, y1: 196, step: 10, baseR: 1.4,
          densityFn: (x,y) => {
            // density grows downward
            const t = (y - 100) / 96;
            return Math.min(1, Math.max(0, t));
          }
        })}
      </g>
      {/* mesh label */}
      <text x={x0 + w + 6} y={150}
        fontFamily="JetBrains Mono, monospace" fontSize="6" fill={C.forest500} letterSpacing="0.5">
        CRUMB · 20/30
      </text>
    </svg>
  );
}

// ============================================================
// 05 — MINIMAL CROSS (reduced symbol, three rings + 3 dots + axis)
// ============================================================
function MarkMinimal({ size = 200, ink = C.slate800, accent = C.forest500 }) {
  const cx = 100, cy = 100;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <g stroke={ink} fill="none" strokeWidth="2.4">
        <circle cx={cx} cy={cy} r="88"/>
        <circle cx={cx} cy={cy} r="62"/>
        <circle cx={cx} cy={cy} r="36"/>
      </g>
      <line x1={cx} y1={cy-92} x2={cx} y2={cy+92} stroke={accent} strokeWidth="2.4" strokeDasharray="10 10"/>
      <g fill={accent}>
        <circle cx={cx+30} cy={cy-26} r="5"/>
        <circle cx={cx+44} cy={cy} r="6"/>
        <circle cx={cx+30} cy={cy+26} r="5"/>
      </g>
      <circle cx={cx} cy={cy} r="6" fill={accent}/>
    </svg>
  );
}

// ============================================================
// 06 — CIRCULAR STAMP (seal with circular text)
// ============================================================
function MarkStamp({ size = 220, ink = C.slate800, accent = C.forest500 }) {
  const cx = 110, cy = 110;
  // circular text via textPath
  return (
    <svg viewBox="0 0 220 220" width={size} height={size}>
      <defs>
        <path id="circText" d={`M ${cx} ${cy} m -82 0 a 82 82 0 1 1 164 0 a 82 82 0 1 1 -164 0`}/>
        <path id="circTextBottom" d={`M ${cx} ${cy} m -82 0 a 82 82 0 1 0 164 0 a 82 82 0 1 0 -164 0`}/>
      </defs>
      <circle cx={cx} cy={cy} r="98" fill="none" stroke={ink} strokeWidth="1.2"/>
      <circle cx={cx} cy={cy} r="92" fill="none" stroke={ink} strokeWidth="0.6"/>
      <circle cx={cx} cy={cy} r="62" fill="none" stroke={ink} strokeWidth="0.8"/>
      <text fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="3" fill={ink} fontWeight="600">
        <textPath href="#circText" startOffset="3%">RE-TIRE LEBANON · MESH-GRADED CRUMB ·</textPath>
      </text>
      <text fontFamily="JetBrains Mono, monospace" fontSize="7.5" letterSpacing="3" fill={C.slate600}>
        <textPath href="#circTextBottom" startOffset="22%">ASTM D5603 / D5644 · GAFTA · LB · 2026</textPath>
      </text>
      {/* center: simplified mark */}
      <g>
        <g stroke={ink} fill="none" strokeWidth="1.4">
          <circle cx={cx} cy={cy} r="48"/>
          <circle cx={cx} cy={cy} r="34"/>
          <circle cx={cx} cy={cy} r="20"/>
        </g>
        <line x1={cx} y1={cy-52} x2={cx} y2={cy+52} stroke={accent} strokeWidth="1.4" strokeDasharray="6 6"/>
        <g fill={accent}>
          <circle cx={cx+24} cy={cy-12} r="2.5"/>
          <circle cx={cx+30} cy={cy} r="2.8"/>
          <circle cx={cx+24} cy={cy+12} r="2.5"/>
          <circle cx={cx-24} cy={cy-12} r="2.5"/>
          <circle cx={cx-30} cy={cy} r="2.8"/>
          <circle cx={cx-24} cy={cy+12} r="2.5"/>
        </g>
        <circle cx={cx} cy={cy} r="4" fill={accent}/>
      </g>
      {/* star/cedar accent */}
      <Cedar cx={cx} cy={cy-78} size={6} color={accent}/>
      <Cedar cx={cx} cy={cy+78} size={6} color={accent}/>
    </svg>
  );
}

// ============================================================
// 07 — SPEC TAG (industrial label / rectangular tag)
// ============================================================
function MarkSpecTag({ wide = 380, tall = 120, ink = C.slate800, accent = C.forest500 }) {
  const w = 380, h = 120;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={wide} height={tall} style={{maxWidth:"100%"}}>
      <rect x="0.5" y="0.5" width={w-1} height={h-1} fill={C.bone25 || C.bone50} stroke={ink} strokeWidth="1"/>
      {/* punch hole */}
      <circle cx="22" cy={h/2} r="6" fill="none" stroke={ink} strokeWidth="1"/>
      <circle cx="22" cy={h/2} r="2" fill={ink}/>
      {/* divider */}
      <line x1="44" y1="14" x2="44" y2={h-14} stroke={C.slate300} strokeWidth="0.6"/>
      {/* mark small */}
      <g transform={`translate(70 ${h/2 - 32})`}>
        <g stroke={ink} fill="none" strokeWidth="1.6">
          <circle cx="32" cy="32" r="28"/>
          <circle cx="32" cy="32" r="18"/>
        </g>
        <line x1="32" y1="2" x2="32" y2="62" stroke={accent} strokeWidth="1.4" strokeDasharray="4 4"/>
        <g fill={accent}>
          <circle cx="44" cy="20" r="2"/><circle cx="48" cy="32" r="2.2"/><circle cx="44" cy="44" r="2"/>
        </g>
        <circle cx="32" cy="32" r="3" fill={accent}/>
      </g>
      {/* wordmark */}
      <text x="148" y={h/2 - 4} fontFamily="Inter, sans-serif" fontWeight="600" fontSize="34" letterSpacing="-1" fill={ink}>
        Re<tspan fill={accent}>-</tspan>Tire
      </text>
      {/* mono spec line */}
      <text x="148" y={h/2 + 18} fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill={C.slate500}>
        MESH 20/30 · ASTM D5603 · ORIGIN LB
      </text>
      {/* right meta */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="8" fill={C.slate500} textAnchor="end" letterSpacing="1.5">
        <text x={w-14} y="22">LOT</text>
        <text x={w-14} y="34" fill={ink} fontSize="11" fontWeight="600">26-0814</text>
        <text x={w-14} y="62">TOL · ≤5%</text>
        <text x={w-14} y="78">MOIST · ≤0.75%</text>
        <text x={w-14} y="94">FE · ≤0.1%</text>
        <text x={w-14} y="110" fill={accent}>VERIFIED · 26.05.18</text>
      </g>
    </svg>
  );
}

// ============================================================
// 08 — WORDMARK + CEDAR (type-led, Lebanon-forward)
// ============================================================
function MarkWordmarkCedar({ ink = C.slate900, accent = C.forest500, large = 96 }) {
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start", gap: 10}}>
      <div style={{
        fontFamily:"Inter, sans-serif",
        fontWeight: 600,
        fontSize: large,
        letterSpacing: "-0.04em",
        lineHeight: 0.95,
        color: ink,
        display:"inline-flex",
        alignItems:"baseline",
      }}>
        Re
        <span style={{display:"inline-flex", alignItems:"center", padding:"0 0.06em"}}>
          <svg width={large*0.42} height={large*0.42} viewBox="0 0 40 40">
            <Cedar cx={20} cy={22} size={15} color={accent}/>
          </svg>
        </span>
        Tire
      </div>
      <div style={{
        fontFamily:"JetBrains Mono, monospace",
        fontSize: 11, letterSpacing: "0.16em", textTransform:"uppercase",
        color: C.slate500,
      }}>
        Mesh-graded crumb · Lebanon · est. 2026
      </div>
    </div>
  );
}

// ============================================================
// 09 — MONOGRAM R (letter R built from mesh dots)
// ============================================================
function MarkMonogramR({ size = 220, ink = C.slate800, accent = C.forest500 }) {
  // We'll define an R shape and tile dots inside it via SVG mask
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <mask id="r-mask">
          <rect width="200" height="200" fill="black"/>
          <text x="100" y="158" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="200" letterSpacing="-12" textAnchor="middle" fill="white">R</text>
        </mask>
      </defs>
      {/* bounding box */}
      <rect x="22" y="22" width="156" height="156" fill="none" stroke={C.slate200} strokeWidth="0.6" strokeDasharray="3 3"/>
      {/* mesh-fill inside R */}
      <g mask="url(#r-mask)">
        <rect width="200" height="200" fill={ink}/>
        {meshDots({
          x0: 10, y0: 30, x1: 190, y1: 188, step: 7, color: accent, baseR: 1.4,
          densityFn: (x,y) => 1,
        })}
      </g>
      {/* small accent dot */}
      <circle cx="158" cy="42" r="4" fill={accent}/>
      <text x="158" y="190" fontFamily="JetBrains Mono, monospace" fontSize="8" textAnchor="middle" fill={C.slate400} letterSpacing="2">
        RE-TIRE
      </text>
    </svg>
  );
}

// ============================================================
// 10 — SQUARE SECTION (rejecting the round form)
// ============================================================
function MarkSquare({ size = 220, ink = C.slate800, accent = C.forest500 }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      {/* outer */}
      <rect x="20" y="20" width="160" height="160" fill="none" stroke={ink} strokeWidth="1.4"/>
      <rect x="36" y="36" width="128" height="128" fill="none" stroke={ink} strokeWidth="1.2"/>
      <rect x="52" y="52" width="96" height="96" fill="none" stroke={ink} strokeWidth="1"/>
      {/* tread ticks along top */}
      <g stroke={ink} strokeWidth="1.4" strokeLinecap="round">
        {[...Array(11)].map((_,i)=>(
          <line key={i} x1={28+i*14.4} y1="12" x2={28+i*14.4} y2="20"/>
        ))}
      </g>
      {/* central axis */}
      <line x1="100" y1="20" x2="100" y2="180" stroke={accent} strokeWidth="0.8" strokeDasharray="3 3"/>
      {/* mesh fill in right half */}
      <g>
        {meshDots({
          x0: 104, y0: 24, x1: 176, y1: 176, step: 8, color: accent, baseR: 1.4,
          densityFn: (x,y) => {
            // density rises toward the right edge
            return Math.min(1, (x-100)/76);
          }
        })}
      </g>
      {/* center hub */}
      <rect x="92" y="92" width="16" height="16" fill={accent}/>
      <rect x="96" y="96" width="8" height="8" fill={C.bone100}/>
    </svg>
  );
}

// ============================================================
// 11 — MONOSPACE TECH WORDMARK ("RE-TIRE //")
// ============================================================
function MarkMonoTech({ ink = C.slate900, accent = C.forest500, large = 84 }) {
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start", gap: 10}}>
      <div style={{
        fontFamily:"JetBrains Mono, monospace",
        fontWeight: 700,
        fontSize: large,
        letterSpacing: "-0.06em",
        lineHeight: 0.95,
        color: ink,
      }}>
        RE<span style={{color: accent}}>—</span>TIRE<span style={{color: accent, marginLeft:"0.12em"}}>/</span>
      </div>
      <div style={{
        display:"flex",
        gap: 12,
        fontFamily:"JetBrains Mono, monospace",
        fontSize: 10, letterSpacing: "0.16em", textTransform:"uppercase",
        color: C.slate500,
      }}>
        <span>// MESH 20/30</span>
        <span>// LB</span>
        <span>// ASTM D5603</span>
      </div>
    </div>
  );
}

// ============================================================
// 12 — VERTICAL LOCKUP (symbol on top, wordmark below)
// ============================================================
function MarkVertical({ symbolSize = 120, ink = C.slate900, accent = C.forest500 }) {
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap: 18}}>
      <MarkHalfDisc size={symbolSize} ink={ink === C.bone100 ? C.bone100 : C.slate800} accent={accent}/>
      <div style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontSize: 32,
        letterSpacing: "-0.025em",
        lineHeight: 1,
        color: ink,
        display:"inline-flex",
        alignItems:"baseline",
      }}>
        Re<span style={{color: accent, padding:"0 0.02em"}}>‑</span>Tire
      </div>
      <div style={{
        fontFamily:"JetBrains Mono, monospace",
        fontSize: 9.5, letterSpacing: "0.2em", textTransform:"uppercase",
        color: C.slate400,
      }}>
        Lebanon · Est. 2026
      </div>
    </div>
  );
}

// ============================================================
// REUSABLE: horizontal lockup (symbol + wordmark side-by-side)
// ============================================================
function Lockup({ children, size = 60, ink = C.slate900, accent = C.forest500, gap = 18, scale = 1, sublabel }) {
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap: 10}}>
      <div style={{display:"flex", alignItems:"center", gap}}>
        {children}
        <div style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: 44 * scale,
          letterSpacing: "-0.03em",
          color: ink,
          lineHeight: 1,
          display:"inline-flex",
          alignItems:"baseline",
        }}>
          Re<span style={{color: accent, padding:"0 0.02em"}}>‑</span>Tire
        </div>
      </div>
      {sublabel && (
        <div style={{
          fontFamily:"JetBrains Mono, monospace",
          fontSize: 9.5, letterSpacing: "0.2em", textTransform:"uppercase",
          color: C.slate400, textAlign:"center",
        }}>{sublabel}</div>
      )}
    </div>
  );
}

// ============================================================
// CANVAS
// ============================================================
function App() {
  return (
    <DesignCanvas>

      {/* ===== Section 1 — Primary lockups ===== */}
      <DCSection id="primary" title="Primary lockups" subtitle="Symbol + wordmark · the workhorse pairings for nav, FIBC print, and document headers.">

        <DCArtboard id="p1" label="01 · Half-disc + wordmark" width={640} height={360}>
          <div className="ab light">
            <Lockup ink={C.slate900} accent={C.forest500} gap={24} scale={1.05}
                    sublabel="Tire-section dissolving into mesh · the literal mark">
              <MarkHalfDisc size={160}/>
            </Lockup>
            <div className="stamp-mono">RT-LOCK-01 · BONE</div>
            <div className="stamp-mono r">PRIMARY</div>
          </div>
        </DCArtboard>

        <DCArtboard id="p2" label="02 · Concentric mesh, dark" width={640} height={360}>
          <div className="ab dark">
            <Lockup ink={C.bone100} accent={C.forest300} gap={24} scale={1.05}
                    sublabel="Pure mesh field · for embossing on dark surfaces">
              <MarkConcentricMesh size={150} ink={C.bone100} accent={C.forest300}/>
            </Lockup>
            <div className="stamp-mono">RT-LOCK-02 · SLATE 900</div>
            <div className="stamp-mono r">DARK</div>
          </div>
        </DCArtboard>

        <DCArtboard id="p3" label="03 · Minimal cross" width={640} height={360}>
          <div className="ab bone">
            <Lockup ink={C.slate900} accent={C.forest700} gap={24} scale={1.05}
                    sublabel="The reduced form · for favicons and small print">
              <MarkMinimal size={150}/>
            </Lockup>
            <div className="stamp-mono">RT-LOCK-03 · REDUCED</div>
            <div className="stamp-mono r">SECONDARY</div>
          </div>
        </DCArtboard>

        <DCArtboard id="p4" label="04 · Forest field" width={640} height={360}>
          <div className="ab forest">
            <Lockup ink={C.bone100} accent={C.forest300} gap={24} scale={1.05}
                    sublabel="On forest-green · for badges and ESG collateral">
              <MarkHalfDisc size={150} ink={C.bone100} accent={C.forest300} dotAccent={C.bone100}/>
            </Lockup>
            <div className="stamp-mono">RT-LOCK-04 · FOREST 900</div>
            <div className="stamp-mono r">BRAND</div>
          </div>
        </DCArtboard>
      </DCSection>

      {/* ===== Section 2 — Symbol-only marks ===== */}
      <DCSection id="symbols" title="Symbol-only marks" subtitle="Standalone glyphs · use when context already provides the brand name (avatars, embossed FIBC seals, app icons).">

        <DCArtboard id="s1" label="05 · Half-disc symbol" width={320} height={320}>
          <div className="ab light grid">
            <MarkHalfDisc size={220}/>
            <div className="stamp-mono">RT-SYM-01</div>
            <div className="stamp-mono r">a/220</div>
          </div>
        </DCArtboard>

        <DCArtboard id="s2" label="06 · Concentric mesh" width={320} height={320}>
          <div className="ab light grid">
            <MarkConcentricMesh size={220}/>
            <div className="stamp-mono">RT-SYM-02</div>
            <div className="stamp-mono r">a/220</div>
          </div>
        </DCArtboard>

        <DCArtboard id="s3" label="07 · Sectional diagram" width={320} height={320}>
          <div className="ab paper grid">
            <MarkSectional size={260}/>
            <div className="stamp-mono">RT-SYM-03</div>
            <div className="stamp-mono r">CAD</div>
          </div>
        </DCArtboard>

        <DCArtboard id="s4" label="08 · Stacked tread" width={320} height={360}>
          <div className="ab paper grid">
            <MarkStackedTread size={200}/>
            <div className="stamp-mono">RT-SYM-04</div>
            <div className="stamp-mono r">SECTION</div>
          </div>
        </DCArtboard>

        <DCArtboard id="s5" label="09 · Monogram R" width={320} height={320}>
          <div className="ab light grid">
            <MarkMonogramR size={220}/>
            <div className="stamp-mono">RT-SYM-05</div>
            <div className="stamp-mono r">MONOGRAM</div>
          </div>
        </DCArtboard>

        <DCArtboard id="s6" label="10 · Square section" width={320} height={320}>
          <div className="ab light grid">
            <MarkSquare size={220}/>
            <div className="stamp-mono">RT-SYM-06</div>
            <div className="stamp-mono r">SQUARE</div>
          </div>
        </DCArtboard>

        <DCArtboard id="s7" label="11 · Circular stamp / seal" width={320} height={320}>
          <div className="ab bone">
            <MarkStamp size={240}/>
            <div className="stamp-mono">RT-SYM-07</div>
            <div className="stamp-mono r">CERTIFICATION</div>
          </div>
        </DCArtboard>
      </DCSection>

      {/* ===== Section 3 — Wordmark-led ===== */}
      <DCSection id="word" title="Type-led directions" subtitle="No symbol · for headers, billboards, and applications where the wordmark must carry the whole brand.">

        <DCArtboard id="w1" label="12 · Wordmark + cedar" width={720} height={220}>
          <div className="ab bone" style={{padding:"40px"}}>
            <MarkWordmarkCedar ink={C.slate900} accent={C.forest500}/>
            <div className="stamp-mono">RT-WORD-01 · CEDAR DASH</div>
            <div className="stamp-mono r">LEBANON-FORWARD</div>
          </div>
        </DCArtboard>

        <DCArtboard id="w2" label="13 · Mono · engineering register" width={720} height={220}>
          <div className="ab dark" style={{padding:"40px"}}>
            <MarkMonoTech ink={C.bone100} accent={C.forest300}/>
            <div className="stamp-mono">RT-WORD-02 · MONO</div>
            <div className="stamp-mono r">TECHNICAL</div>
          </div>
        </DCArtboard>

        <DCArtboard id="w3" label="14 · Spec tag (industrial label)" width={720} height={220}>
          <div className="ab paper" style={{padding:"20px"}}>
            <MarkSpecTag/>
            <div className="stamp-mono">RT-WORD-03 · TAG</div>
            <div className="stamp-mono r">FIBC / PRINT</div>
          </div>
        </DCArtboard>

        <DCArtboard id="w4" label="15 · Vertical lockup" width={400} height={420}>
          <div className="ab bone">
            <MarkVertical symbolSize={140}/>
            <div className="stamp-mono">RT-WORD-04 · STACKED</div>
            <div className="stamp-mono r">EQUITY</div>
          </div>
        </DCArtboard>
      </DCSection>

      {/* ===== Section 4 — In context ===== */}
      <DCSection id="contexts" title="In context" subtitle="The same marks, applied. Quick proof that each direction survives outside the artboard.">

        <DCArtboard id="c1" label="16 · Favicon / 32 px stress test" width={420} height={260}>
          <div className="ab light" style={{flexDirection:"column", gap: 22}}>
            <div style={{display:"flex", gap: 28, alignItems:"flex-end"}}>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap: 8}}>
                <MarkMinimal size={96} ink={C.slate900} accent={C.forest500}/>
                <div style={{fontFamily:"JetBrains Mono, monospace", fontSize: 9, color: C.slate400, letterSpacing:"0.1em"}}>96 PX</div>
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap: 8}}>
                <MarkMinimal size={48} ink={C.slate900} accent={C.forest500}/>
                <div style={{fontFamily:"JetBrains Mono, monospace", fontSize: 9, color: C.slate400, letterSpacing:"0.1em"}}>48 PX</div>
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap: 8}}>
                <MarkMinimal size={32} ink={C.slate900} accent={C.forest500}/>
                <div style={{fontFamily:"JetBrains Mono, monospace", fontSize: 9, color: C.slate400, letterSpacing:"0.1em"}}>32 PX</div>
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap: 8}}>
                <MarkMinimal size={20} ink={C.slate900} accent={C.forest500}/>
                <div style={{fontFamily:"JetBrains Mono, monospace", fontSize: 9, color: C.slate400, letterSpacing:"0.1em"}}>20 PX</div>
              </div>
            </div>
            <div className="stamp-mono">RT-CTX-01 · SCALE</div>
          </div>
        </DCArtboard>

        <DCArtboard id="c2" label="17 · FIBC bag print" width={420} height={420}>
          <div className="ab light" style={{flexDirection:"column"}}>
            {/* A stylised one-tonne FIBC bag with printed brand */}
            <svg viewBox="0 0 240 280" width="220">
              <defs>
                <linearGradient id="bagFill" x1="0" x2="1">
                  <stop offset="0" stopColor="#E8E2D2"/>
                  <stop offset="0.5" stopColor="#F5F0E0"/>
                  <stop offset="1" stopColor="#D9D2C0"/>
                </linearGradient>
              </defs>
              {/* bag body */}
              <path d="M40 50 L200 50 L210 250 L30 250 Z" fill="url(#bagFill)" stroke={C.slate400} strokeWidth="1"/>
              {/* straps */}
              <g stroke={C.slate600} strokeWidth="3" fill="none">
                <path d="M70 50 Q70 20 90 20 Q110 20 110 50"/>
                <path d="M130 50 Q130 20 150 20 Q170 20 170 50"/>
              </g>
              {/* horizontal fold lines */}
              <line x1="35" y1="120" x2="205" y2="120" stroke={C.slate400} strokeWidth="0.4" strokeDasharray="2 4"/>
              <line x1="32" y1="180" x2="208" y2="180" stroke={C.slate400} strokeWidth="0.4" strokeDasharray="2 4"/>
              {/* print area: simplified mark + spec */}
              <g transform="translate(120 140)">
                <g stroke={C.slate800} fill="none" strokeWidth="1.4">
                  <circle r="34"/>
                  <circle r="22"/>
                  <circle r="10"/>
                </g>
                <line x1="0" y1="-36" x2="0" y2="36" stroke={C.forest700} strokeWidth="1.2" strokeDasharray="4 4"/>
                <g fill={C.forest700}>
                  <circle cx="14" cy="-8" r="2"/><circle cx="20" cy="0" r="2.4"/><circle cx="14" cy="8" r="2"/>
                </g>
                <circle r="3" fill={C.forest700}/>
              </g>
              <text x="120" y="195" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="20" fill={C.slate900} letterSpacing="-0.5">
                Re<tspan fill={C.forest700}>-</tspan>Tire
              </text>
              <text x="120" y="215" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7.5" fill={C.slate600} letterSpacing="1.5">
                RC-20 · MESH 20 · 1000 KG NET
              </text>
              <text x="120" y="230" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="6.5" fill={C.slate400} letterSpacing="1">
                BATCH #RT-2026-0814 · ASTM D5603
              </text>
            </svg>
            <div className="stamp-mono">RT-CTX-02 · FIBC PRINT</div>
            <div className="stamp-mono r">1 T BAG</div>
          </div>
        </DCArtboard>

        <DCArtboard id="c3" label="18 · Document header" width={420} height={300}>
          <div className="ab paper" style={{flexDirection:"column", alignItems:"stretch", padding:"24px", gap: 0}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom: 12, borderBottom: `1px solid ${C.slate200}`}}>
              <div style={{display:"flex", alignItems:"center", gap: 10}}>
                <MarkMinimal size={32} ink={C.slate900} accent={C.forest700}/>
                <div style={{display:"flex", alignItems:"baseline", gap: 10}}>
                  <span style={{fontFamily:"Inter, sans-serif", fontWeight:600, fontSize: 18, letterSpacing:"-0.02em", color: C.slate900}}>
                    Re<span style={{color: C.forest700}}>-</span>Tire
                  </span>
                  <span style={{fontFamily:"JetBrains Mono, monospace", fontSize: 9, letterSpacing:"0.14em", color: C.slate400, textTransform:"uppercase", paddingLeft: 8, borderLeft: `1px solid ${C.slate200}`}}>
                    LEBANON
                  </span>
                </div>
              </div>
              <div style={{fontFamily:"JetBrains Mono, monospace", fontSize: 9, color: C.slate400, letterSpacing:"0.1em"}}>CoA-26-0814 · REV B</div>
            </div>
            <div style={{padding:"16px 0", fontFamily:"Inter, sans-serif", fontSize: 22, fontWeight: 500, letterSpacing:"-0.015em", color: C.slate900}}>
              Certificate of Analysis
            </div>
            <div style={{fontFamily:"JetBrains Mono, monospace", fontSize: 10, color: C.slate500, letterSpacing:"0.04em"}}>
              Re-Tire RC-20 · Batch #RT-2026-0814 · Classified per ASTM D5603
            </div>
            <div style={{flex:1}}/>
            <div style={{display:"flex", justifyContent:"space-between", paddingTop: 14, borderTop: `1px solid ${C.slate200}`, fontFamily:"JetBrains Mono, monospace", fontSize: 9, color: C.slate400, letterSpacing:"0.08em"}}>
              <span>RE-TIRE LEBANON SARL · KESERWAN-MATN</span>
              <span style={{color: C.forest700}}>VERIFIED · 26.05.18</span>
            </div>
            <div className="stamp-mono">RT-CTX-03 · DOC HEAD</div>
          </div>
        </DCArtboard>

        <DCArtboard id="c4" label="19 · Avatar / social" width={420} height={300}>
          <div className="ab dark" style={{flexDirection:"row", gap: 24}}>
            {/* avatar circle 1 */}
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: C.slate800,
              border: `1px solid ${C.slate700}`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <MarkMinimal size={56} ink={C.bone100} accent={C.forest300}/>
            </div>
            {/* avatar square */}
            <div style={{
              width: 88, height: 88,
              background: C.forest700,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <MarkMinimal size={56} ink={C.bone100} accent={C.bone100}/>
            </div>
            {/* avatar concentric */}
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: C.bone100,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <MarkConcentricMesh size={70} ink={C.slate900} accent={C.forest700}/>
            </div>
            <div className="stamp-mono">RT-CTX-04 · AVATARS · 88PX</div>
          </div>
        </DCArtboard>

      </DCSection>

    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
