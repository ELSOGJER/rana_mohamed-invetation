import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Music, VolumeX, Heart, ChevronDown, Calendar, Clock } from 'lucide-react';

/* ─── constants ──────────────────────────────────────────────────────── */
const TARGET_DATE = new Date('2026-08-27T20:00:00+03:00').getTime();
const MAP_LINK    = 'https://maps.app.goo.gl/yGquNBWjKq6QwjkM9?g_st=ipc';

/* ─── palette ────────────────────────────────────────────────────────── */
const C = {
  gold:     '#E8A93B',
  goldDark: '#B9761E',
  goldLight:'#F6D488',
  olive:    '#FFF6EC',   // page base — warm ivory (was dark plum)
  olive2:   '#FFEADA',   // soft peach panel
  cream:    '#FFFBF6',
  champ:    '#FFEFE0',   // soft warm cream — accent text over photos/dark surfaces
  text:     '#4A2036',   // main readable dark plum text
  muted:    'rgba(255,239,224,0.72)',
  mutedDark:'rgba(74,32,54,0.62)',
  cardBg:   'rgba(255,255,255,0.86)',
  border:   'rgba(232,169,59,0.35)',
  rose:     '#F0637A',   // vivid festive coral-rose accent
  roseDeep: '#C2394F',
};

/* ─── petals ─────────────────────────────────────────────────────────── */
const PETALS = Array.from({ length: 16 }, (_, i) => ({
  id: i, left: `${5 + (i * 5.7) % 90}%`,
  size: 8 + (i % 5) * 4, delay: (i * 0.7) % 9, duration: 9 + (i % 5) * 2,
  color: i % 3 === 0 ? 'rgba(232,169,59,0.65)' : i % 3 === 1 ? 'rgba(240,99,122,0.7)' : 'rgba(194,57,79,0.5)',
}));

function FloatingPetals() {
  return (
    <div className="section__el" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
      {PETALS.map(p => (
        <div key={p.id} style={{ position: 'absolute', top: '-60px', left: p.left, animation: `floatPetal ${p.duration}s ${p.delay}s ease-in-out infinite` }}>
          <svg className="el-tag-1" width={p.size} height={p.size * 1.4} viewBox="0 0 20 28"><ellipse cx="10" cy="14" rx="7" ry="12" fill={p.color} /></svg>        </div>
      ))}
    </div>
  );
}

/* ─── countdown ──────────────────────────────────────────────────────── */
function useCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const d = TARGET_DATE - Date.now();
      if (d > 0) setT({ days: Math.floor(d / 86400000), hours: Math.floor((d % 86400000) / 3600000), minutes: Math.floor((d % 3600000) / 60000), seconds: Math.floor((d % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return t;
}

const GoldLine = ({ w = 80 }: { w?: number }) => (
  <div className="section__el-1" style={{ width: w, height: 1, background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`, margin: '0 auto' }} />
);

/* ─── decorative watercolor-style flower cluster (landing page corners) ─── */
function FlowerCluster({ size = 190, mirror = false }: { size?: number; mirror?: boolean }) {
  const bloom = (cx: number, cy: number, r: number, color: string, rot = 0) => (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={cx} cy={cy - r * 0.52} rx={r * 0.44} ry={r * 0.62} fill={color} opacity={0.94}
          transform={`rotate(${a} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.2} fill="#C97A4A" opacity={0.8} />
    </g>
  );
  return (
    <svg className="el-tag-2" width={size} height={size} viewBox="0 0 200 200" style={{ transform: mirror ? 'scale(-1,-1)' : 'none' }} aria-hidden="true">      <ellipse cx={38} cy={158} rx={40} ry={16} fill="#AEB98C" opacity={0.75} transform="rotate(28 38 158)" />
      <ellipse cx={72} cy={172} rx={34} ry={13} fill="#9AAE7E" opacity={0.7} transform="rotate(-18 72 172)" />
      {bloom(108, 42, 42, '#F6C9B8', 15)}
      {bloom(58, 62, 56, '#F3A8B7', -8)}
      {bloom(30, 112, 44, '#F8D9DA', 20)}
      {bloom(92, 96, 34, '#EDA0AE', 42)}
      {bloom(60, 30, 26, '#F6C9B8', -25)}
    </svg>
  );
}

/* ─── cartoon photo frame (cover & hero) ─────────────────────────────── */
function CartoonFrame({ scale = 1 }: { scale?: number }) {
  return (
    <div className="section__el-2" style={{ position: 'relative', width: 252 * scale, height: 252 * scale }}>
      {/* spinning dashed ring */}
      <div className="section__spinning-dashed-ring" style={{
        position: 'absolute', inset: -12 * scale, borderRadius: '50%',
        border: `1.5px dashed rgba(232,169,59,0.38)`,
        animation: 'spin 30s linear infinite',
      }} />
      {/* glow */}
      <div className="section__glow" style={{
        position: 'absolute', inset: -5 * scale, borderRadius: '50%',
        boxShadow: '0 0 40px rgba(232,169,59,0.22), 0 20px 60px rgba(0,0,0,0.45)',
      }} />
      {/* circle frame */}
      <div className="section__circle-frame" style={{
        width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
        border: `${2.5 * scale}px solid rgba(232,169,59,0.58)`,
        boxShadow: '0 0 0 1px rgba(232,169,59,0.1)',
        background: '#F3E6DC',
      }}>
{/*         <img className="el-tag-3" src={cartoonCouple} alt="محمد ورنا"          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%', transform: 'scale(1.06)' }} />
 */}      
      </div>
      {/* corner ornaments */}
      {([
        { top: 8 * scale, right: 8 * scale },
        { top: 8 * scale, left: 8 * scale, flipX: true },
        { bottom: 8 * scale, right: 8 * scale, flipY: true },
        { bottom: 8 * scale, left: 8 * scale, flipX: true, flipY: true },
      ] as Array<{ top?: number; bottom?: number; left?: number; right?: number; flipX?: boolean; flipY?: boolean }>).map((pos, i) => (
        <svg className="el-tag-4" key={i} width={18 * scale} height={18 * scale} viewBox="0 0 22 22"          style={{
            position: 'absolute',
            top: pos.top, bottom: pos.bottom, left: pos.left, right: pos.right,
            transform: `scale(${pos.flipX ? -1 : 1}, ${pos.flipY ? -1 : 1})`,
            opacity: 0.65,
          }}>
          <path d="M0 0 L22 0 L22 4 Q11 4 4 11 L0 11 Z" fill={C.gold}/>
          <path d="M0 0 L0 22 L4 22 Q4 11 11 4 L11 0 Z" fill={C.gold}/>
        </svg>
      ))}
    </div>
  );
}

/* ─── wax seal ───────────────────────────────────────────────────────── */
function WaxSeal({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button className="el-tag-5" onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}      style={{ position: 'relative', border: 'none', background: 'none', cursor: 'pointer', padding: 0, transform: hov ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.3s ease' }}>
      <div className="section__corner-ornaments" style={{ position: 'absolute', inset: -12, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,169,59,0.28) 0%, transparent 70%)', animation: 'pulse 2.5s ease-in-out infinite' }} />
      <svg className="el-tag-6" width="118" height="118" viewBox="0 0 118 118">        <defs><radialGradient id="sg" cx="40%" cy="35%" r="65%"><stop offset="0%" stopColor="#F0C98A"/><stop offset="55%" stopColor="#A9713A"/><stop offset="100%" stopColor="#7A4229"/></radialGradient></defs>
        {Array.from({ length: 18 }, (_, i) => { const a = ((i * 20) - 90) * Math.PI / 180; return <line key={i} x1="59" y1="59" x2={59 + 57 * Math.cos(a)} y2={59 + 57 * Math.sin(a)} stroke="rgba(232,169,59,0.25)" strokeWidth="1.5"/>; })}
        <circle cx="59" cy="59" r="48" fill="url(#sg)"/>
        <circle cx="59" cy="59" r="44" fill="none" stroke="rgba(255,220,100,0.22)" strokeWidth="1"/>
        <text x="59" y="53" textAnchor="middle" fill="rgba(255,248,230,0.95)" fontSize="12" fontFamily="'Amiri', serif">افتح</text>
        <text x="59" y="69" textAnchor="middle" fill="rgba(255,248,230,0.95)" fontSize="12" fontFamily="'Amiri', serif">الدعوة</text>
        <text x="59" y="81" textAnchor="middle" fill="rgba(255,248,230,0.5)" fontSize="7" fontFamily="serif" letterSpacing="2">✦ ✦ ✦</text>
      </svg>
    </button>
  );
}

/* ─── SQL SSMS section ───────────────────────────────────────────────── */
function SqlSection() {
  const [started, setStarted] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [q1Text, setQ1Text] = useState('');
  const [q2Text, setQ2Text] = useState('');
  const [showR1, setShowR1] = useState(false);
  const [showQ2, setShowQ2] = useState(false);
  const [showCommit, setShowCommit] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const Q1 = `USE [LoveDatabase];\nGO\n\nSELECT *\nFROM   [dbo].[Students]\nWHERE  Name IN (N'محمد', N'رنا');`;
  const Q2 = `BEGIN TRANSACTION;\n\n  INSERT INTO [dbo].[Engagement]\n    (Groom,    Bride,   [Date],       Venue)\n  VALUES\n    (N'محمد', N'رنا', '27-08-2026', N'قاعة أركان');\n\nCOMMIT; -- ❤️ forever`;

  // Intersection observer — start when visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  // Loading bar
  useEffect(() => {
    if (!started) return;
    let v = 0;
    const t = setInterval(() => { v += 3; setLoadPct(Math.min(v, 100)); if (v >= 100) clearInterval(t); }, 30);
    return () => clearInterval(t);
  }, [started]);

  // Q1 typing
  useEffect(() => {
    if (loadPct < 100) return;
    let i = 0;
    const delay = setTimeout(() => {
      const t = setInterval(() => { i++; setQ1Text(Q1.slice(0, i)); if (i >= Q1.length) { clearInterval(t); setTimeout(() => setShowR1(true), 400); setTimeout(() => setShowQ2(true), 1600); } }, 22);
      return () => clearInterval(t);
    }, 600);
    return () => clearTimeout(delay);
  }, [loadPct]);

  // Q2 typing
  useEffect(() => {
    if (!showQ2) return;
    let i = 0;
    const delay = setTimeout(() => {
      const t = setInterval(() => { i++; setQ2Text(Q2.slice(0, i)); if (i >= Q2.length) { clearInterval(t); setTimeout(() => setShowCommit(true), 500); setTimeout(() => setCelebrate(true), 1000); } }, 24);
      return () => clearInterval(t);
    }, 300);
    return () => clearTimeout(delay);
  }, [showQ2]);

  const renderCode = (text: string) =>
    text.split('\n').map((line, i) => {
      const isComment = line.trim().startsWith('--');
      const isKeyword = /^(USE|GO|SELECT|FROM|WHERE|AND|INSERT|INTO|VALUES|BEGIN|COMMIT|TRANSACTION)\b/.test(line.trim());
      const color = isComment ? '#6A9955' : isKeyword ? '#569CD6' : '#D4D4D4';
      const parts = line.split(/(N'[^']*'|'[^']*'|\[[^\]]+\])/g);
      return (
        <div key={i} style={{ minHeight: '1.55em' }}>
          {parts.map((p, j) => {
            if (/^N?'/.test(p)) return <span className="el-tag-7" key={j} style={{ color: '#CE9178' }}>{p}</span>;            if (/^\[/.test(p))  return <span className="el-tag-8" key={j} style={{ color: '#9CDCFE' }}>{p}</span>;            if (isKeyword && j === 0) return <span className="el-tag-9" key={j} style={{ color: '#569CD6' }}>{p}</span>;            return <span className="el-tag-10" key={j} style={{ color: isComment ? '#6A9955' : '#D4D4D4' }}>{p}</span>;          })}
        </div>
      );
    });

  const RESULTS1 = [
    { id: '1', name: 'محمد', dept: 'IT', year: '2023', status: '💍 Ready' },
    { id: '2', name: 'رنا',  dept: 'CS', year: '2024', status: '💍 Ready' },
  ];

  return (
    <section className="el-tag-11" ref={sectionRef} style={{ background: C.olive2, padding: '3rem 0 0', position: 'relative', overflow: 'hidden' }}>      {/* top border */}
      <div className="section__top-border" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${C.gold}88, transparent)` }} />

      {/* header label */}
      <motion.div className="motion-el-1" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>        <div className="section__header-label" style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', padding: '0 1.5rem 2rem', direction: 'rtl' }}>
          <div className="section__el-3" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0.4rem 1.25rem', background: 'rgba(232,169,59,0.07)', border: `1px solid rgba(232,169,59,0.2)`, borderRadius: 50, marginBottom: '0.5rem' }}>
            <span className="el-tag-12" style={{ color: '#569CD6', fontFamily: 'monospace', fontSize: '0.8rem' }}>SQL</span>            <span className="el-tag-13" style={{ color: C.mutedDark, fontFamily: "'Amiri', serif", fontSize: '0.85rem' }}>وكان SQL Server بداية الحكاية بيننا</span>          </div>
          <div className="section__el-4" style={{ fontFamily: "'Amiri', serif", fontSize: '1.15rem', color: C.roseDeep, opacity: 0.9 }}>
            بدأت قصتنا بسطر SQL... وانتهت بوعدٍ يدوم العمر كله
          </div>
        </div>
      </motion.div>

      {/* SSMS window */}
      <div className="section__ssms-window" style={{ padding: '0 0.75rem' }}>
      <div className="section__el-5" style={{ maxWidth: 680, margin: '0 auto', borderRadius: '12px 12px 0 0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 -8px 40px rgba(0,0,0,0.5)' }}>

        {/* SSMS title bar */}
        <div className="section__ssms-title-bar" style={{ background: '#1E2022', padding: '0 1rem', height: 36, display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="section__el-6" style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56' }} />
          <div className="section__el-7" style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
          <div className="section__el-8" style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }} />
          <div className="section__el-9" style={{ flex: 1, textAlign: 'center', fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
            SQLQuery1.sql — LoveDatabase (Mohamed\CS)
          </div>
        </div>

        {/* toolbar strip */}
        <div className="section__toolbar-strip" style={{ background: '#252526', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 1rem', height: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
          {['Execute', 'New Query', 'Open', 'Save'].map(btn => (
            <span className="el-tag-14" key={btn} style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', cursor: 'default' }}>{btn}</span>          ))}
          <div className="section__el-10" style={{ flex: 1 }} />
          <div className="section__el-11" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="section__el-12" style={{ width: 6, height: 6, borderRadius: '50%', background: started && loadPct === 100 ? '#27C93F' : '#FFBD2E' }} />
            <span className="el-tag-15" style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>              {started && loadPct === 100 ? 'Connected' : started ? 'Connecting...' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* loading bar */}
        {started && loadPct < 100 && (
          <div className="section__loading-bar" style={{ background: '#1E1E1E', padding: '1.5rem 1.25rem' }}>
            <div className="section__el-13" style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#6A9955', marginBottom: '0.75rem' }}>
              -- Connecting to SQL Server...<br/>
              -- Loading LoveDatabase...
            </div>
            <div className="section__el-14" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
              <motion.div className="motion-el-2" animate={{ width: `${loadPct}%` }} transition={{ ease: 'linear' }}                style={{ height: '100%', background: `linear-gradient(to right, ${C.goldDark}, ${C.gold})`, borderRadius: 4 }} />
            </div>
            <div className="section__el-15" style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: C.muted, marginTop: '0.4rem' }}>{loadPct}%</div>
          </div>
        )}

        {/* editor area */}
        {loadPct === 100 && (
          <div className="section__editor-area" style={{ background: '#1E1E1E', display: 'flex' }}>
            {/* line numbers */}
            <div className="section__line-numbers" style={{ background: '#1E1E1E', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '0.9rem 0.6rem', fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.18)', lineHeight: 1.55, userSelect: 'none', minWidth: 28, textAlign: 'right' }}>
              {Array.from({ length: Math.max(q1Text.split('\n').length + (showQ2 ? q2Text.split('\n').length + 2 : 0), 8) }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* code */}
            <div className="section__code" style={{ flex: 1, padding: '0.9rem 1rem', fontFamily: "'Courier New', monospace", fontSize: '0.73rem', lineHeight: 1.55, direction: 'ltr', minHeight: 180 }}>
              {renderCode(q1Text)}
              {showQ2 && <div className="section__el-16" style={{ minHeight: '1.55em' }}>&nbsp;</div>}
              {showQ2 && renderCode(q2Text)}
              {/* blinking cursor */}
              {!showCommit && <span className="el-tag-16" style={{ display: 'inline-block', width: 7, height: 13, background: C.gold, opacity: 0.8, verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite', marginLeft: 1 }} />}            </div>
          </div>
        )}

        {/* results panel */}
        {showR1 && (
          <motion.div className="motion-el-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>            {/* results tab */}
            <div className="section__results-tab" style={{ background: '#252526', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1rem', height: 26, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span className="el-tag-17" style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: C.gold, borderBottom: `1.5px solid ${C.gold}`, paddingBottom: 2 }}>Results</span>              <span className="el-tag-18" style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>Messages</span>            </div>

            {/* results table */}
            <div className="section__results-table" style={{ background: '#1E1E1E', overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '0.68rem', direction: 'ltr' }}>
                <thead>
                  <tr style={{ background: '#2D2D2D', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['ID','Name','Dept','Year','Status'].map(h => (
                      <th key={h} style={{ padding: '5px 10px', color: 'rgba(255,255,255,0.55)', fontWeight: 500, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RESULTS1.map((row, i) => (
                    <motion.tr className="motion-el-4" key={i}                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 + 0.1 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'rgba(232,169,59,0.03)' : 'transparent' }}>
                      {[row.id, row.name, row.dept, row.year, row.status].map((cell, j) => (
                        <td key={j} style={{ padding: '5px 10px', color: j === 0 ? C.muted : j === 4 ? C.gold : '#D4D4D4', whiteSpace: 'nowrap' }}>{cell}</td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              <div className="section__el-17" style={{ padding: '5px 10px 8px', fontFamily: 'monospace', fontSize: '0.65rem', color: '#6A9955' }}>
                (2 rows affected)
              </div>
            </div>
          </motion.div>
        )}

        {/* COMMIT success banner */}
        {showCommit && (
          <motion.div className="motion-el-5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>            <div className="section__commit-success-banner" style={{ background: 'rgba(39,201,63,0.06)', borderTop: '1px solid rgba(39,201,63,0.2)', padding: '0.9rem 1.25rem', fontFamily: 'monospace', fontSize: '0.72rem', lineHeight: 1.8, direction: 'ltr' }}>
              <div className="section__el-18" style={{ color: '#27C93F' }}>✓  Transaction committed successfully</div>
              <div className="section__el-19" style={{ color: C.gold }}>✓  (2 hearts affected)</div>
              <div className="section__el-20" style={{ color: '#6A9955', marginTop: '0.25rem' }}>-- Constraint: Love = ∞  |  UNIQUE(Soulmates) = TRUE</div>
            </div>
          </motion.div>
        )}
      </div>
      </div>

      {/* celebrate */}
      {celebrate && (
        <motion.div className="motion-el-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}          style={{ background: `${C.olive2}`, padding: '2.5rem 1.5rem', textAlign: 'center', direction: 'rtl', position: 'relative', overflow: 'hidden' }}>
          {/* confetti dots */}
          {Array.from({ length: 14 }, (_, i) => (
            <motion.div className="motion-el-7" key={i}              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 60 + (i % 4) * 30, opacity: [0, 1, 0] }}
              transition={{ delay: i * 0.08, duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
              style={{
                position: 'absolute', top: 0, left: `${6 + i * 6.5}%`,
                width: 6, height: 6, borderRadius: '50%',
                background: i % 3 === 0 ? C.gold : i % 3 === 1 ? C.rose : C.roseDeep,
              }} />
          ))}
          <div className="section__confetti-dots" style={{ fontFamily: "'Amiri', serif", fontSize: '1.4rem', color: C.roseDeep, marginBottom: '0.5rem' }}>اللهم بارك لهما وأتم عليهما السعادة</div>
          <div className="section__el-21" style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(1.7rem, 5vw, 2rem)', color: C.roseDeep, textShadow: `0 2px 16px rgba(232,169,59,0.3)` }}>Mohamed & Rana</div>
          <div className="section__el-22" style={{ marginTop: '0.75rem', fontFamily: 'monospace', fontSize: '0.7rem', color: C.mutedDark, direction: 'ltr' }}>
            EXEC Forever — ∞ rows committed
          </div>
        </motion.div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   App
═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [coverLeaving, setCoverLeaving] = useState(false);
  const [stage, setStage] = useState<'closed' | 'curl' | 'bloom' | 'message' | 'explode' | 'heart'>('closed');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const timeLeft = useCountdown();

  const tryPlay = useCallback(() => {
    if (audioRef.current && !isPlaying) audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [isPlaying]);

  useEffect(() => {
    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('touchstart', tryPlay, { once: true });
    return () => { document.removeEventListener('click', tryPlay); document.removeEventListener('touchstart', tryPlay); };
  }, [tryPlay]);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
  };

  const openInvite = () => { setCoverLeaving(true); tryPlay(); setTimeout(() => setIsOpen(true), 950); };
  const handleEnvelopeTap = () => {
    if (stage !== 'closed') return;
    tryPlay();
    setStage('curl');
    setTimeout(() => setStage('bloom'), 650);
    setTimeout(() => setStage('message'), 1450);
    setTimeout(() => setStage('explode'), 2500);
    setTimeout(() => setStage('heart'), 2900);
    setTimeout(() => openInvite(), 3600);
  };

  const petalTarget = (s: typeof stage) => {
    switch (s) {
      case 'curl':    return { y: -16, scale: 0.55, opacity: 1 };
      case 'bloom':
      case 'message': return { y: -34, scale: 1,    opacity: 1 };
      case 'explode': return { y: -150, scale: 2.2, opacity: 0 };
      default:        return { y: -2,  scale: 0.12, opacity: 0 };
    }
  };

  return (
    <div className="section__el-23" style={{ minHeight: '100dvh', width: '100%', position: 'relative', background: C.olive, overflowX: 'hidden', fontFamily: "'Amiri', serif", direction: 'rtl' }}>
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop preload="auto" />

      {/* ══════════════════════════════════════════
          COVER
      ══════════════════════════════════════════ */}
      {!isOpen && (
        <motion.div className="motion-el-8"          animate={coverLeaving ? { y: '-100vh', opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          style={{ position: 'fixed', inset: 0, zIndex: 100, overflow: 'hidden', background: `radial-gradient(ellipse 90% 70% at 50% 20%, rgba(240,99,122,0.13) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(232,169,59,0.13) 0%, transparent 65%), ${C.olive}` }}
        >
          <div className="section__el-24" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(1.5rem, 5vw, 3rem)' }}>

            {/* basmala */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }} className="cover__basmala-wrap" style={{ marginBottom: '0.6rem' }}>
              <div className="cover__basmala" style={{ fontSize: '0.92rem', color: C.roseDeep, opacity: 0.85 }}>بسم الله الرحمن الرحيم</div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="cover__label-wrap" style={{ marginBottom: 'clamp(1.2rem, 3.5vw, 1.6rem)' }}>
              <div className="cover__label" style={{ fontFamily: "'Amiri', serif", fontSize: '0.8rem', color: C.mutedDark, letterSpacing: '0.3em' }}>دعوة خطوبة</div>
              <GoldLine w={46} />
            </motion.div>

            {/* names — sit above the part of the envelope that opens */}
            <motion.div className="cover__names" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.55, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem', direction: 'ltr', marginBottom: 'clamp(1.4rem, 4vw, 1.9rem)' }}>
              <span className="cover__names-groom" style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(1.8rem, 6vw, 2.2rem)', color: C.text }}>Mohamed</span>
              <span className="cover__names-amp" style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', color: C.roseDeep }}>&amp;</span>
              <span className="cover__names-bride" style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(1.8rem, 6vw, 2.2rem)', color: C.text }}>Rana</span>
            </motion.div>

            {/* ── the envelope ─────────────────────────────────────── */}
            <div className="envelope__perspective" style={{ perspective: 1300 }}>
              <motion.div className="envelope"
                onClick={handleEnvelopeTap}
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileTap={{ scale: stage === 'closed' ? 0.97 : 1 }}
                style={{ position: 'relative', width: 'clamp(210px, 55vw, 260px)', height: 'clamp(142px, 37vw, 176px)', cursor: stage === 'closed' ? 'pointer' : 'default' }}
              >
                {/* envelope body */}
                <div className="envelope__body" style={{ position: 'absolute', inset: 0, borderRadius: 30, background: `linear-gradient(160deg, ${C.cream}, ${C.olive2})`, border: `1.5px solid rgba(232,169,59,0.4)`, boxShadow: '0 24px 55px rgba(122,46,68,0.18)', opacity: stage === 'closed' || stage === 'curl' ? 1 : 0, transition: 'opacity 0.4s' }} />

                {stage === 'closed' && (
                  <>
                    {/* lower pocket */}
                    <div className="envelope__pocket" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '100%', zIndex: 3, background: `linear-gradient(160deg, ${C.olive2}, ${C.cream})`, clipPath: 'polygon(0px 100%, 0px 28%, 50% 76%, 100% 28%, 100% 100%)', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />

                    {/* flap */}
                    <div className="envelope__flap" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '71%', zIndex: 20, transformOrigin: 'center top' }}>
                      <div className="envelope__flap-fill" style={{ position: 'absolute', inset: 0, clipPath: 'polygon(-80px 0px, 127% 0px, 50% 109%)', background: `linear-gradient(135deg, ${C.rose}, ${C.roseDeep})`, borderTopLeftRadius: 30, borderTopRightRadius: 30 }} />
                      <div className="envelope__seal" style={{ position: 'absolute', bottom: -25, left: '50%', transform: 'translateX(-50%)', width: 40, height: 40, borderRadius: '50%', zIndex: 1000, background: `radial-gradient(circle at 35% 30%, ${C.goldLight}, ${C.goldDark})`, border: `2px solid ${C.gold}`, boxShadow: '0 4px 10px rgba(0,0,0,0.25)' }} />
                    </div>
                  </>
                )}

                {/* ── the crazy bit: envelope curls into a rose, blooms, releases the message, explodes, and becomes a heart ── */}
                {stage !== 'closed' && (
                  <div className="envelope__bloom-stage" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    {/* burst flash on explosion */}
                    <AnimatePresence>
                      {stage === 'explode' && (
                        <motion.div className="envelope__burst-flash"
                          initial={{ scale: 0, opacity: 0.9 }} animate={{ scale: 3.2, opacity: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }}
                          style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', background: `radial-gradient(circle, ${C.goldLight} 0%, transparent 70%)` }} />
                      )}
                    </AnimatePresence>

                    {/* four petals — each envelope side curls into a petal, together forming a rose */}
                    {(stage === 'curl' || stage === 'bloom' || stage === 'message' || stage === 'explode') && [0, 90, 180, 270].map((baseAngle, i) => {
                      const t = petalTarget(stage);
                      return (
                        <div key={i} className={`envelope__petal-arm envelope__petal-arm--${i}`} style={{ position: 'absolute', inset: 0, transform: `rotate(${baseAngle}deg)` }}>
                          <motion.div className="envelope__petal"
                            animate={{ y: t.y, scale: t.scale, opacity: t.opacity }}
                            transition={{ duration: stage === 'explode' ? 0.55 : 0.65, ease: stage === 'explode' ? 'easeIn' : [0.34, 1.56, 0.64, 1] }}
                            style={{ position: 'absolute', left: '50%', top: '50%', width: 46, height: 64, marginLeft: -23, marginTop: -64, background: `linear-gradient(180deg, ${C.rose}, ${C.roseDeep})`, borderRadius: '0% 100% 0% 100%', transformOrigin: 'center bottom', boxShadow: '0 4px 14px rgba(122,46,68,0.25)' }}
                          />
                        </div>
                      );
                    })}

                    {/* the message — emerges once the rose has bloomed, then becomes a heart */}
                    <AnimatePresence>
                      {(stage === 'message' || stage === 'explode') && (
                        <motion.div key="msg" className="envelope__message"
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', bounce: 0.45, duration: 0.6 }}
                          style={{ position: 'absolute', zIndex: 30, width: 74, height: 52, background: '#fff', borderRadius: 8, border: `1px solid ${C.border}`, boxShadow: '0 12px 26px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Heart size={20} color={C.roseDeep} fill={C.rose} />
                        </motion.div>
                      )}
                      {stage === 'heart' && (
                        <motion.div key="heart" className="envelope__final-heart"
                          initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: [0.3, 1.35, 1], opacity: 1 }} transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                          style={{ position: 'absolute', zIndex: 30 }}>
                          <Heart size={62} color={C.roseDeep} fill={C.rose} style={{ filter: `drop-shadow(0 0 22px ${C.rose})` }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            </div>


            {/* hint + date */}
            <motion.p className="cover__hint" animate={{ opacity: stage === 'closed' ? 1 : 0 }} transition={{ duration: 0.35 }}
              style={{ marginTop: 'clamp(1.4rem, 4vw, 1.8rem)', fontSize: '0.82rem', color: C.mutedDark, letterSpacing: '0.06em' }}>اضغط على الظرف لفتح دعوتكم</motion.p>
            <motion.div className="cover__date" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }}
              style={{ marginTop: '0.6rem', fontFamily: "'Playfair Display', serif", fontSize: '0.8rem', color: C.roseDeep, letterSpacing: '0.2em' }}>27 · 08 · 2026</motion.div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      {isOpen && (
        <motion.div className="motion-el-11" ref={contentRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55 }}          style={{ minHeight: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>

          {/* music */}
          <motion.button className="motion-el-12" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}            onClick={toggleMusic}
            style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 200, width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: `1.5px solid rgba(232,169,59,0.55)`, color: C.roseDeep, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(122,46,68,0.15)' }}>
            {isPlaying ? <Music size={18} /> : <VolumeX size={18} />}
          </motion.button>

          {/* ── HERO — floral landing (section 1) ───────────────────── */}
          <section className="section__hero-floral-landing-section-1" style={{ position: 'relative', height: '100dvh', overflow: 'hidden', background: C.olive }}>
            <div className="section__el-27" style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(232,169,59,0.08) 0%, transparent 65%)` }} />

            {/* top-left flowers — drop in from above and settle toward the left corner */}
            <motion.div className="motion-el-13"              initial={{ opacity: 0, x: 100, y: -140 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', top: -14, left: -14, zIndex: 2, pointerEvents: 'none', width: 'clamp(120px, 32vw, 190px)' }}
            >
              <FlowerCluster size={190} />
            </motion.div>

            {/* bottom-right flower — scales in with a delay */}
            <motion.div className="motion-el-14"              initial={{ opacity: 0, scale: 0.25 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.95, duration: 0.6, type: 'spring', bounce: 0.4 }}
              style={{ position: 'absolute', bottom: -14, right: -14, zIndex: 2, pointerEvents: 'none', width: 'clamp(90px, 22vw, 140px)' }}
            >
              <FlowerCluster size={140} mirror />
            </motion.div>

            <div className="section__bottom-right-flower-scales-in-with-a-del" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(1.5rem, 5vw, 3rem)' }}>

              {/* names — big serif, stacked */}
              <motion.div className="motion-el-15" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}>                <div className="section__names-big-serif-stacked" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 'clamp(2.4rem, 10vw, 3.8rem)', color: C.text, lineHeight: 1.05, direction: 'ltr' }}>Mohamed</div>
                <div className="section__el-28" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', color: C.roseDeep, margin: '0.15rem 0' }}>&amp;</div>
                <div className="section__el-29" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 'clamp(2.4rem, 10vw, 3.8rem)', color: C.text, lineHeight: 1.05, direction: 'ltr' }}>Rana</div>
              </motion.div>

              {/* location · date · time row */}
              <div className="section__location-date-time-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(0.7rem, 3vw, 1.6rem)', marginTop: 'clamp(2rem, 6vw, 3rem)', flexWrap: 'wrap' }}>

                {/* location — enters from the left */}
                <motion.div className="motion-el-16" initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}                  style={{ textAlign: 'center' }}>
                  <div className="section__location-enters-from-the-left" style={{ fontSize: '0.68rem', color: C.mutedDark, letterSpacing: '0.1em', marginBottom: 4 }}>المكان</div>
                  <div className="section__el-30" style={{ fontFamily: "'Amiri', serif", fontSize: 'clamp(0.85rem, 2.6vw, 0.95rem)', color: C.text, fontWeight: 700 }}>قاعة أركان</div>
                </motion.div>

                <div className="section__el-31" style={{ width: 1, height: 42, background: 'rgba(232,169,59,0.35)' }} />

                {/* date — scales from inside to outside */}
                <motion.div className="motion-el-17" initial={{ opacity: 0, scale: 0.35 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.95, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}                  style={{ textAlign: 'center' }}>
                  <div className="section__date-scales-from-inside-to-outside" style={{ fontSize: '0.68rem', color: C.mutedDark, letterSpacing: '0.1em', marginBottom: 4 }}>التاريخ</div>
                  <div className="section__el-32" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 5.5vw, 1.9rem)', fontWeight: 700, color: C.roseDeep, lineHeight: 1 }}>27</div>
                  <div className="section__el-33" style={{ fontFamily: "'Amiri', serif", fontSize: '0.8rem', color: C.text }}>August 2026</div>
                </motion.div>

                <div className="section__el-34" style={{ width: 1, height: 42, background: 'rgba(232,169,59,0.35)' }} />

                {/* time — enters from the right */}
                <motion.div className="motion-el-18" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}                  style={{ textAlign: 'center' }}>
                  <div className="section__time-enters-from-the-right" style={{ fontSize: '0.68rem', color: C.mutedDark, letterSpacing: '0.1em', marginBottom: 4 }}>الساعة</div>
                  <div className="section__el-35" style={{ fontFamily: "'Amiri', serif", fontSize: 'clamp(0.85rem, 2.6vw, 0.95rem)', color: C.text, fontWeight: 700 }}>8:00 PM</div>
                </motion.div>
              </div>
            </div>

            <motion.div className="motion-el-19" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}              style={{ position: 'absolute', bottom: 22, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
              <div className="section__el-36" style={{ color: C.roseDeep, opacity: 0.5, animation: 'bounce 2s ease-in-out infinite' }}><ChevronDown size={24} /></div>
            </motion.div>
          </section>

          {/* ── DETAILS ──────────────────────────────────────────── */}
          <section className="section__details" style={{ background: C.olive2, padding: '2.2rem 0 0.5rem', textAlign: 'center' }}>
            <div className="section__el-37" style={{ fontSize: '1.3rem', color: C.gold, opacity: 0.9 }}>✦</div>
            <div className="section__el-38" style={{ fontSize: '0.7rem', color: C.roseDeep, letterSpacing: '0.3em', opacity: 0.85, marginTop: '0.4rem' }}>— تفاصيل الحفل —</div>

            <motion.div className="motion-el-20" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}              style={{ maxWidth: 480, margin: '1.5rem auto 2rem', width: 'calc(100% - 2.5rem)', background: '#fffdfa', border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 50px rgba(122,46,68,0.14)' }}>

              {/* date + time row */}
              <div className="section__date-time-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px dashed rgba(232,169,59,0.4)` }}>
                <div className="section__el-39" style={{ padding: '1.4rem 1rem', textAlign: 'center', borderLeft: `1px dashed rgba(232,169,59,0.4)` }}>
                  <Calendar size={26} color={C.gold} style={{ margin: '0 auto 0.45rem', opacity: 0.8 }} />
                  <div className="section__el-40" style={{ fontSize: '0.62rem', color: C.mutedDark, letterSpacing: '0.12em', marginBottom: '0.3rem' }}>التاريخ</div>
                  <div className="section__el-41" style={{ fontSize: '0.9rem', color: C.text, fontFamily: "'Amiri', serif", fontWeight: 700 }}>الخميس</div>
                  <div className="section__el-42" style={{ fontSize: '1rem', color: C.gold, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>27 أغسطس 2026</div>
                </div>
                <div className="section__el-43" style={{ padding: '1.4rem 1rem', textAlign: 'center' }}>
                  <Clock size={26} color={C.gold} style={{ margin: '0 auto 0.45rem', opacity: 0.8 }} />
                  <div className="section__el-44" style={{ fontSize: '0.62rem', color: C.mutedDark, letterSpacing: '0.12em', marginBottom: '0.3rem' }}>الوقت</div>
                  <div className="section__el-45" style={{ fontSize: '0.9rem', color: C.text, fontFamily: "'Amiri', serif", fontWeight: 700 }}>الساعة</div>
                  <div className="section__el-46" style={{ fontSize: '1.2rem', color: C.gold, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>8:00 م</div>
                </div>
              </div>

              {/* venue row */}
              <div className="section__venue-row" style={{ padding: '1.4rem 1.25rem', textAlign: 'center' }}>
                <MapPin size={26} color={C.gold} style={{ margin: '0 auto 0.45rem', opacity: 0.8 }} />
                <div className="section__el-47" style={{ fontSize: '0.62rem', color: C.mutedDark, letterSpacing: '0.12em', marginBottom: '0.35rem' }}>المكان</div>
                <div className="section__el-48" style={{ fontSize: '1.1rem', color: C.text, fontFamily: "'Amiri', serif", fontWeight: 700, lineHeight: 1.6 }}>قاعة أركان</div>
                <div className="section__el-49" style={{ fontSize: '0.9rem', color: C.mutedDark, fontFamily: "'Amiri', serif", lineHeight: 1.8 }}>نادي الصفوة — العاشر من رمضان</div>
              </div>

              <div className="section__el-50" style={{ borderBottom: `1px dashed rgba(232,169,59,0.35)` }} />
              <div className="section__el-57" style={{ maxWidth: 320,maxHeight: 200, margin: '20px auto', borderRadius: 18, overflow: 'hidden', border: `2px solid ${C.gold}`, boxShadow: '0 16px 40px rgba(122,46,68,0.16)' }}>
                <iframe
                  title="موقع قاعة أركان"
                  src="https://www.google.com/maps?q=%D9%82%D8%A7%D8%B9%D8%A9%20%D8%A3%D8%B1%D9%83%D8%A7%D9%86%2C%20%D9%86%D8%A7%D8%AF%D9%8A%20%D8%A7%D9%84%D8%B5%D9%81%D9%88%D8%A9&output=embed"
                  width="100%" height="260" style={{ border: 0, display: 'block' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="section__el-51" style={{ padding: '1.1rem', textAlign: 'center' }}>
                <motion.a className="motion-el-21" href={MAP_LINK} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.75rem', color: C.gold, border: `1px solid rgba(232,169,59,0.38)`, borderRadius: 50, fontFamily: "'Amiri', serif", fontSize: '0.95rem', textDecoration: 'none' }}>
                  
                  <MapPin size={15} /><span className="el-tag-19">افتح الموقع على الخريطة</span>                </motion.a>
              </div>
            </motion.div>
          </section>

          {/* ── COUNTDOWN ────────────────────────────────────────── */}
          <section className="section__countdown" style={{ background: C.olive, padding: 'clamp(2.5rem, 6vw, 3.5rem) 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className="section__el-52" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, ${C.gold}50, transparent)` }} />
            <motion.div className="motion-el-22" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>              <div className="section__el-53" style={{ fontSize: '0.7rem', color: C.gold, letterSpacing: '0.3em', marginBottom: '0.4rem', opacity: 0.8 }}>— بانتظار اللحظة —</div>
              <div className="section__el-54" style={{ fontFamily: "'Amiri', serif", fontSize: '1.35rem', color: C.roseDeep, marginBottom: 'clamp(1.6rem, 4vw, 2.2rem)' }}> بوجودكم تكتمل فرحتنا ✨</div>

              <div dir="ltr" style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(0.4rem, 1.8vw, 0.9rem)', padding: 'clamp(1rem, 3vw, 1.5rem) clamp(1.4rem, 5vw, 2.6rem)', border: `2px solid ${C.gold}`, borderRadius: 100, background: C.cardBg, boxShadow: '0 16px 38px rgba(122,46,68,0.14)', position: 'relative' }}>
                <span className="el-tag-20" style={{ position: 'absolute', left: 'clamp(6px,2vw,16px)', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', color: C.gold, opacity: 0.7 }}>✦</span>                <span className="el-tag-21" style={{ position: 'absolute', right: 'clamp(6px,2vw,16px)', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', color: C.gold, opacity: 0.7 }}>✦</span>
                {[{ v: timeLeft.days, l: 'DAYS' }, { v: timeLeft.hours, l: 'HRS' }, { v: timeLeft.minutes, l: 'MIN' }, { v: timeLeft.seconds, l: 'SEC' }].map(({ v, l }, i) => (
                  <React.Fragment key={l}>
                    <div className="section__el-55" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 'clamp(42px, 9vw, 60px)' }}>
                      <AnimatePresence mode="wait">
                        <motion.span className="motion-el-23" key={v} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} transition={{ duration: 0.2 }}                          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 5vw, 2.1rem)', fontWeight: 700, color: C.gold, textShadow: '0 0 16px rgba(232,169,59,0.25)', lineHeight: 1.1, display: 'block' }}>
                          {String(v).padStart(2, '0')}
                        </motion.span>
                      </AnimatePresence>
                      <span className="el-tag-22" style={{ fontSize: '0.6rem', color: C.mutedDark, letterSpacing: '0.1em', marginTop: 3 }}>{l}</span>                    </div>
                    {i < 3 && <span className="el-tag-23" style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)', color: C.gold, opacity: 0.55, marginTop: -14 }}>:</span>}                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ── SQL SSMS (last section) ───────────────────────────── */}
          <SqlSection />

          {/* ── FOOTER ───────────────────────────────────────────── */}
          <footer className="section__footer" style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(2.5rem, 6vw, 4rem) 2rem 3rem', textAlign: 'center', background: C.olive }}>
            <div className="section__el-58" style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 90% 60% at 50% 0%, rgba(240,99,122,0.1) 0%, transparent 65%)` }} />
            <FloatingPetals />
            <motion.div className="motion-el-25" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 5, maxWidth: 480, margin: '0 auto' }}>              <div className="section__el-59" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: '2rem' }}>
                <div className="section__el-60" style={{ height: 1, flex: 1, background: 'linear-gradient(to left, rgba(232,169,59,0.5), transparent)' }} />
                <Heart size={18} fill={C.gold} color={C.gold} />
                <div className="section__el-61" style={{ height: 1, flex: 1, background: 'linear-gradient(to right, rgba(232,169,59,0.5), transparent)' }} />
              </div>
              <div className="section__el-62" style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2rem, 5vw, 2.4rem)', color: C.roseDeep, textShadow: `0 2px 16px rgba(232,169,59,0.3)`, marginBottom: '1.5rem' }}>Mohamed & Rana</div>
              <p style={{ fontFamily: "'Amiri', serif", fontSize: '1.05rem', color: C.roseDeep, lineHeight: 2 }}>ندعوكم لمشاركتنا فرحتنا</p>
              <p style={{ fontFamily: "'Amiri', serif", fontSize: '0.9rem', color: C.mutedDark, lineHeight: 2 }}>برجاء الحضور والدعاء</p>
              <div className="section__el-63" style={{ marginTop: '2rem', fontSize: '0.68rem', color: C.mutedDark, opacity: 0.6, letterSpacing: '0.15em' }}>✦ 2026 ✦</div>
            </motion.div>
          </footer>
        </motion.div>
      )}

      <style>{`
        @keyframes floatPetal { 0%{transform:translateY(0) translateX(0) rotate(0deg);opacity:0} 8%{opacity:0.85} 50%{transform:translateY(50vh) translateX(28px) rotate(200deg);opacity:0.6} 92%{opacity:0.3} 100%{transform:translateY(100vh) translateX(-12px) rotate(380deg);opacity:0} }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%,100%{opacity:.32;transform:scale(1)} 50%{opacity:.7;transform:scale(1.12)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(9px)} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#FFF6EC}
        ::-webkit-scrollbar{display:none}
      `}</style>
    </div>
  );
}
