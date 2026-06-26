import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import {
  Activity, Home, MapPin, Sparkles, MessageCircle, Cog, Send,
  Waves, Wind, Footprints, HandHeart, Snowflake, Flame, Bike, Dumbbell,
  Check, Bot, BarChart2,
} from "lucide-react";

/* ============================================================
   EaseRA — daily companion for rheumatoid arthritis
   ============================================================ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
  --bg:#EEF3F4; --surface:#FFFFFF; --surface-2:#F6F9F9;
  --ink:#16282E; --muted:#5E747C; --faint:#9CB0B6;
  --teal:#0E6E6E; --teal-deep:#0A4F50; --teal-soft:#D6EAE9;
  --coral:#FF7A5C; --coral-soft:#FFE6DE;
  --line:#E1EBEC; --shadow:0 8px 28px rgba(14,78,80,.10);
  --p1:#5FB87A; --p2:#9CC25C; --p3:#F0B23B; --p4:#F08A45; --p5:#E0594B;
}
*, *::before, *::after { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
html, body, #root { height:100%; margin:0; padding:0; }
body { background:var(--bg); }

.era-root {
  font-family:'Plus Jakarta Sans',system-ui,sans-serif;
  background:var(--bg); color:var(--ink);
  max-width:480px; margin:0 auto; min-height:100vh;
  position:relative; padding-bottom:92px; overflow-x:hidden;
}
.era-root h1,.era-root h2,.era-root h3 { margin:0; }
.display { font-family:'Fraunces',serif; }

.hdr { padding:36px 22px 14px; }
.hdr .eyebrow { font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--teal);font-weight:600; }
.hdr .greet { font-size:30px;font-weight:500;line-height:1.1;margin-top:4px; }
.hdr .sub { color:var(--muted);font-size:14px;margin-top:6px; }

.screen { padding:6px 18px 8px; animation:rise .32s ease; }
@keyframes rise { from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;} }

.card { background:var(--surface);border:1px solid var(--line);border-radius:22px;padding:20px;box-shadow:var(--shadow);margin-bottom:16px; }
.card-title { font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:600;margin-bottom:14px; }
.sec-title { font-family:'Fraunces',serif;font-size:22px;font-weight:500;margin:6px 2px 12px; }

/* Pain scale */
.scale { display:flex;justify-content:space-between;gap:8px;margin-top:4px; }
.dot { flex:1;aspect-ratio:1;border-radius:50%;border:2px solid var(--line);background:var(--surface-2);
  display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;color:var(--faint);
  cursor:pointer;transition:transform .15s,box-shadow .2s; }
.dot:active { transform:scale(.92); }
.dot.on { color:#fff;border-color:transparent;transform:scale(1.06);box-shadow:0 6px 16px rgba(0,0,0,.16); }
.scale-labels { display:flex;justify-content:space-between;margin-top:8px;font-size:12px;color:var(--faint);font-weight:600; }
.feeling { text-align:center;font-family:'Fraunces',serif;font-size:19px;margin:18px 0 16px;color:var(--ink);min-height:24px; }

.btn { width:100%;border:none;border-radius:16px;padding:16px;font-family:inherit;font-weight:700;font-size:16px;
  cursor:pointer;transition:transform .12s,opacity .2s;display:flex;align-items:center;justify-content:center;gap:8px; }
.btn:active { transform:scale(.98); }
.btn-primary { background:var(--teal);color:#fff; }
.btn-ghost { background:var(--teal-soft);color:var(--teal-deep); }
.btn:disabled { opacity:.45;cursor:default; }

.logged { display:flex;align-items:center;gap:10px;background:var(--teal-soft);color:var(--teal-deep);
  border-radius:14px;padding:13px 16px;font-weight:600;font-size:14px; }

/* Quick grid */
.quick { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
.quick button { background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:16px;text-align:left;
  cursor:pointer;font-family:inherit;display:flex;flex-direction:column;gap:10px;box-shadow:var(--shadow);transition:transform .12s; }
.quick button:active { transform:scale(.97); }
.quick .ic { width:38px;height:38px;border-radius:12px;background:var(--teal-soft);color:var(--teal-deep);display:flex;align-items:center;justify-content:center; }
.quick .qt { font-weight:700;font-size:15px; }
.quick .qd { font-size:12px;color:var(--muted); }

/* Body map */
.body-wrap { display:flex;justify-content:center;padding:6px 0 2px; }
.joint { cursor:pointer;transition:r .15s; }
.legend { display:flex;justify-content:center;gap:16px;margin-top:8px;font-size:12px;color:var(--muted);font-weight:600; }
.legend span { display:flex;align-items:center;gap:6px; }
.legend i { width:12px;height:12px;border-radius:50%;display:inline-block; }
.flag-list { margin-top:4px; }
.flag-row { display:flex;align-items:center;justify-content:space-between;padding:11px 2px;border-bottom:1px solid var(--line);font-size:14px; }
.flag-row:last-child { border:none; }
.flag-dot { width:11px;height:11px;border-radius:50%;display:inline-block;margin-right:9px; }
.sev-pill { font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;text-transform:uppercase;letter-spacing:.04em; }

/* Therapy */
.therapy { display:flex;gap:14px;background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:16px;margin-bottom:12px;box-shadow:var(--shadow); }
.therapy .tic { flex:none;width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center; }
.therapy h3 { font-size:16px;font-weight:700; }
.therapy p { font-size:13px;color:var(--muted);margin:4px 0 8px;line-height:1.45; }
.tag { font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:.03em; }
.disclaimer { font-size:12px;color:var(--muted);text-align:center;line-height:1.5;padding:8px 14px 0; }

/* Suit sliders */
.canvas-box { width:100%;height:300px;border-radius:20px;overflow:hidden;background:linear-gradient(160deg,#11343a,#0a2327);position:relative; }
.canvas-hint { position:absolute;bottom:10px;left:0;right:0;text-align:center;color:rgba(255,255,255,.45);font-size:11px;font-weight:600;letter-spacing:.04em; }
.slider-row { margin:18px 0; }
.slider-top { display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px; }
.slider-top .lab { font-weight:700;font-size:15px; }
.slider-top .val { font-weight:700;font-size:14px;color:var(--teal); }
.slabels { display:flex;justify-content:space-between;font-size:12px;color:var(--faint);font-weight:600;margin-top:6px; }
input[type=range] { -webkit-appearance:none;width:100%;height:10px;border-radius:10px;background:var(--teal-soft);outline:none; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance:none;width:30px;height:30px;border-radius:50%;background:var(--teal);border:4px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.2);cursor:pointer; }
input[type=range]::-moz-range-thumb { width:26px;height:26px;border-radius:50%;background:var(--teal);border:4px solid #fff;cursor:pointer; }
.seg { display:flex;gap:8px;background:var(--surface-2);padding:6px;border-radius:16px; }
.seg button { flex:1;border:none;background:transparent;padding:12px;border-radius:11px;font-family:inherit;font-weight:700;font-size:14px;color:var(--muted);cursor:pointer;transition:.18s; }
.seg button.on { background:var(--teal);color:#fff;box-shadow:0 4px 12px rgba(14,110,110,.3); }
.toggle { display:flex;align-items:center;justify-content:space-between; }
.toggle .tg-txt { font-weight:700;font-size:15px; }
.toggle .tg-sub { font-size:12px;color:var(--muted);margin-top:2px; }
.switch { width:54px;height:31px;border-radius:20px;background:var(--line);position:relative;cursor:pointer;transition:.2s;flex:none; }
.switch.on { background:var(--teal); }
.switch .knob { position:absolute;top:3px;left:3px;width:25px;height:25px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 2px 6px rgba(0,0,0,.2); }
.switch.on .knob { left:26px; }
.readout { display:flex;gap:12px;margin-top:4px; }
.readout .ro { flex:1;background:var(--surface-2);border-radius:14px;padding:14px;text-align:center; }
.readout .ro .n { font-family:'Fraunces',serif;font-size:24px;font-weight:600;color:var(--teal-deep); }
.readout .ro .l { font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-top:2px; }

/* Chat */
.chat-scroll { display:flex;flex-direction:column;gap:12px;padding:4px 2px 12px; }
.msg { max-width:84%;padding:13px 16px;border-radius:18px;font-size:14.5px;line-height:1.5;white-space:pre-wrap; }
.msg.user { align-self:flex-end;background:var(--teal);color:#fff;border-bottom-right-radius:6px; }
.msg.bot { align-self:flex-start;background:var(--surface);border:1px solid var(--line);border-bottom-left-radius:6px;box-shadow:var(--shadow); }
.chips { display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 10px; }
.chip { background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:9px 14px;font-size:13px;font-weight:600;color:var(--teal-deep);cursor:pointer;font-family:inherit; }
.chip:active { transform:scale(.96); }
.composer { position:fixed;bottom:72px;left:0;right:0;max-width:480px;margin:0 auto;padding:10px 14px;background:linear-gradient(180deg,transparent,var(--bg) 30%); }
.composer .row { display:flex;gap:8px;background:var(--surface);border:1px solid var(--line);border-radius:22px;padding:6px 6px 6px 16px;box-shadow:var(--shadow); }
.composer input { flex:1;border:none;outline:none;font-family:inherit;font-size:15px;background:transparent;color:var(--ink); }
.composer .sendb { width:44px;height:44px;border-radius:50%;border:none;background:var(--teal);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none; }
.composer .sendb:disabled { opacity:.4; }
.typing { display:flex;gap:4px;align-items:center;padding:4px 2px; }
.typing i { width:7px;height:7px;border-radius:50%;background:var(--faint);animation:bob 1s infinite; }
.typing i:nth-child(2){animation-delay:.15s;} .typing i:nth-child(3){animation-delay:.3s;}
@keyframes bob{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-5px);opacity:1;}}

/* Analytics */
.stat-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px; }
.stat-card { background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:16px;box-shadow:var(--shadow);text-align:center; }
.stat-card .sn { font-family:'Fraunces',serif;font-size:28px;font-weight:600;color:var(--teal-deep); }
.stat-card .sl { font-size:12px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-top:4px; }
.heat-row { display:flex;gap:4px;align-items:center;margin-bottom:8px;font-size:13px; }
.heat-bar { height:10px;border-radius:5px;background:var(--teal);min-width:4px;transition:width .4s ease; }

/* Nav */
.nav { position:fixed;bottom:0;left:0;right:0;max-width:480px;margin:0 auto;background:var(--surface);
  border-top:1px solid var(--line);display:flex;padding:8px 6px calc(8px + env(safe-area-inset-bottom));box-shadow:0 -6px 20px rgba(14,78,80,.06);z-index:20; }
.nav button { flex:1;border:none;background:transparent;display:flex;flex-direction:column;align-items:center;gap:4px;
  padding:8px 2px;cursor:pointer;color:var(--faint);font-family:inherit;font-size:11px;font-weight:600;transition:color .2s; }
.nav button.on { color:var(--teal); }
.nav .pip { width:34px;height:4px;border-radius:4px;background:transparent;margin-bottom:2px;transition:.2s; }
.nav button.on .pip { background:var(--teal); }
`;

/* ── constants ── */
const PAIN_COLORS = ["#5FB87A","#9CC25C","#F0B23B","#F08A45","#E0594B"];
const FEELINGS    = ["Pick how today feels","A good day","Manageable","A bit much","Rough","Really tough"];
const SEV = [
  { name:"mild",     color:"#9CC25C" },
  { name:"moderate", color:"#F0A93B" },
  { name:"severe",   color:"#E0594B" },
];

const JOINTS = [
  { id:"neck",  label:"Neck",          x:100, y:60,  region:"upper" },
  { id:"shL",   label:"Left shoulder", x:66,  y:92,  region:"upper" },
  { id:"shR",   label:"Right shoulder",x:134, y:92,  region:"upper" },
  { id:"elL",   label:"Left elbow",    x:52,  y:150, region:"hands" },
  { id:"elR",   label:"Right elbow",   x:148, y:150, region:"hands" },
  { id:"wrL",   label:"Left wrist",    x:44,  y:202, region:"hands" },
  { id:"wrR",   label:"Right wrist",   x:156, y:202, region:"hands" },
  { id:"haL",   label:"Left hand",     x:38,  y:228, region:"hands" },
  { id:"haR",   label:"Right hand",    x:162, y:228, region:"hands" },
  { id:"hipL",  label:"Left hip",      x:84,  y:224, region:"lower" },
  { id:"hipR",  label:"Right hip",     x:116, y:224, region:"lower" },
  { id:"knL",   label:"Left knee",     x:82,  y:300, region:"lower" },
  { id:"knR",   label:"Right knee",    x:118, y:300, region:"lower" },
  { id:"anL",   label:"Left ankle",    x:80,  y:370, region:"lower" },
  { id:"anR",   label:"Right ankle",   x:120, y:370, region:"lower" },
  { id:"ftL",   label:"Left foot",     x:76,  y:396, region:"lower" },
  { id:"ftR",   label:"Right foot",    x:124, y:396, region:"lower" },
];

/* ── localStorage helpers ── */
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

/* ======================================================
   3-D EXOSKELETON  (pure Three.js, no React Three Fiber)
   ====================================================== */
function Exoskeleton({ tightness, power, mode, running }) {
  const mount = useRef(null);
  const state = useRef({ tightness, power, mode, running });
  state.current = { tightness, power, mode, running };

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;

    const scene    = new THREE.Scene();
    scene.fog      = new THREE.Fog(0x0a2327, 7, 16);
    const camera   = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0.2, 8.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    /* lighting */
    scene.add(new THREE.AmbientLight(0xbfe0e0, 0.65));
    const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(4, 6, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0x5fd0d0, 0.6); rim.position.set(-5, 2, -4); scene.add(rim);
    const glow = new THREE.PointLight(0xff7a5c, 0, 8); glow.position.set(0, 0.5, 2); scene.add(glow);

    /* materials */
    const frameMat  = new THREE.MeshStandardMaterial({ color:0x2a3138, metalness:0.85, roughness:0.35 });
    const carbonMat = new THREE.MeshStandardMaterial({ color:0x1a1f24, metalness:0.6, roughness:0.45 });
    const padMat    = new THREE.MeshStandardMaterial({ color:0x3a4248, metalness:0.1, roughness:0.9  });
    const motorBase = new THREE.MeshStandardMaterial({ color:0x10333a, metalness:0.7, roughness:0.3, emissive:0x0e6e6e, emissiveIntensity:0.4 });

    const root = new THREE.Group(); scene.add(root);

    /* waist belt arc */
    const belt = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.22, 16, 40, Math.PI * 1.25), padMat);
    belt.rotation.x = Math.PI / 2; belt.rotation.z = -Math.PI * 0.125 - Math.PI;
    belt.position.y = 1.15; root.add(belt);

    const beltCore = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.09, 12, 40, Math.PI * 1.1), frameMat);
    beltCore.rotation.x = Math.PI / 2; beltCore.rotation.z = -Math.PI * 0.05 - Math.PI;
    beltCore.position.y = 1.32; root.add(beltCore);

    /* back battery pack */
    const pack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.4), frameMat);
    pack.position.set(0, 1.2, -1.25); root.add(pack);

    /* comfort padding on back */
    const backPad = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.12), padMat);
    backPad.position.set(0, 1.2, -1.04); root.add(backPad);

    /* RA-specific: lumbar support ridge */
    const lumbar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12), frameMat);
    lumbar.rotation.z = Math.PI / 2; lumbar.position.set(0, 0.82, -1.28); root.add(lumbar);

    /* legs (hip motor + carbon arm + thigh cuff) */
    const legs = [];
    [-1, 1].forEach(side => {
      const leg = new THREE.Group(); leg.position.set(side * 1.28, 1.05, 0.15);

      const motorMat = motorBase.clone();
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.3, 28), motorMat);
      motor.rotation.z = Math.PI / 2; motor.rotation.x = Math.PI / 2; leg.add(motor);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.34, 20), frameMat);
      cap.rotation.z = Math.PI / 2; cap.rotation.x = Math.PI / 2; cap.position.z = 0.02; leg.add(cap);

      const armPivot = new THREE.Group(); leg.add(armPivot);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.5, 0.34), carbonMat);
      arm.position.y = -0.78; armPivot.add(arm);

      /* thigh cuff */
      const cuffPivot = new THREE.Group(); cuffPivot.position.y = -1.5; armPivot.add(cuffPivot);

      /* RA comfort: wider, softer-looking thigh cuff */
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.15, 14, 30, Math.PI * 1.35), padMat);
      cuff.rotation.y = Math.PI / 2; cuff.rotation.z = side > 0 ? 0.2 : Math.PI - 0.2; cuffPivot.add(cuff);

      const cuffFrame = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.34), carbonMat);
      cuffFrame.position.y = -0.1; cuffPivot.add(cuffFrame);

      root.add(leg);
      legs.push({ leg, armPivot, side, motorMat, baseX: side * 1.28 });
    });

    root.position.y = -0.7;

    /* drag-to-rotate */
    let drag = false, px = 0, vel = 0, rotY = -0.35, autoSpin = true;
    const down = e => { drag = true; autoSpin = false; px = e.touches ? e.touches[0].clientX : e.clientX; };
    const move = e => {
      if (!drag) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const d = (cx - px) * 0.01; rotY += d; vel = d; px = cx;
    };
    const up = () => { drag = false; };
    el.addEventListener("mousedown", down); el.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    el.addEventListener("touchstart", down, { passive:true }); el.addEventListener("touchmove", move, { passive:true }); window.addEventListener("touchend", up);

    let raf, t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.016;
      const s = state.current;
      if (!drag) { autoSpin ? (rotY += 0.004) : (rotY += vel, vel *= 0.92); }
      root.rotation.y = rotY;

      const pw = s.power / 100;
      const col = new THREE.Color().lerpColors(new THREE.Color(0x0e9e9e), new THREE.Color(0xff7a5c), pw);
      const pulse = 0.35 + pw * (0.9 + Math.sin(t * (3 + pw * 4)) * 0.18);

      legs.forEach(({ motorMat, leg, armPivot, side }) => {
        motorMat.emissive = col; motorMat.emissiveIntensity = pulse;
        leg.position.x = side * (1.28 - (s.tightness / 100) * 0.18);
        const amp = s.running ? (s.mode === "running" ? 0.42 : 0.22) * (0.4 + pw) : 0;
        const speed = s.mode === "running" ? 5.5 : 3.2;
        armPivot.rotation.x = Math.sin(t * speed + (side > 0 ? Math.PI : 0)) * amp;
      });
      glow.color = col; glow.intensity = pw * 1.6;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mouseup", up); window.removeEventListener("touchend", up);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="canvas-box">
      <div ref={mount} style={{ width:"100%", height:"100%" }} />
      <div className="canvas-hint">drag to rotate · adjust below</div>
    </div>
  );
}

/* ════════════ THERAPY RECOMMENDATIONS ════════════ */
function recommend(level, locations) {
  const flagged = Object.keys(locations);
  const has = region => flagged.some(id => JOINTS.find(j => j.id === id)?.region === region);
  const hands = has("hands"), lower = has("lower"), upper = has("upper");
  const out = [];
  const add = o => { if (!out.find(x => x.title === o.title)) out.push(o); };

  if (level >= 4) {
    add({ title:"Gentle range-of-motion", why:"On a high-pain day, slow joint circles keep you mobile without strain. Move only to the edge of comfort.", tag:"Gentle", icon:HandHeart, c:"#6FB89A" });
    add({ title:"Warmth before moving", why:"A warm shower or heat pad loosens stiff joints and eases morning flares before any activity.", tag:"Comfort", icon:Flame, c:"#F08A45" });
  } else {
    add({ title:"Walking with suit assist", why:"Low-impact and steady. Let the exoskeleton carry some load so you can keep your daily step goal comfortably.", tag:"Daily", icon:Footprints, c:"#0E6E6E" });
  }

  if (hands) add({ title:"Warm-water hand soak", why:"Soak hands in warm water, then do slow finger spreads and gentle fist curls to ease wrist and hand stiffness.", tag:"Gentle", icon:HandHeart, c:"#6FB89A" });
  if (lower) {
    add({ title:"Swimming or water therapy", why:"Water supports your weight, so knees, hips and feet move freely with almost no impact.", tag:"Low impact", icon:Waves, c:"#0E6E6E" });
    if (level <= 3) add({ title:"Easy cycling", why:"Smooth, repetitive motion that's kind to knees and hips while keeping joints moving.", tag:"Low impact", icon:Bike, c:"#3a8fb0" });
  }
  if (upper && level <= 3) add({ title:"Shoulder & neck mobility", why:"Slow shoulder rolls and neck tilts relieve tension and protect range of motion.", tag:"Gentle", icon:Wind, c:"#6FB89A" });
  if (level <= 2) add({ title:"Gentle yoga flow", why:"A short, slow flow builds flexibility and calm. Skip deep weight-bearing on sore joints.", tag:"Restorative", icon:Wind, c:"#8a7bd8" });
  add({ title:"Physical therapy check-in", why:"Bring your pain log to your PT so they can tailor a plan to your current flare pattern.", tag:"Plan", icon:Dumbbell, c:"#5E747C" });
  if (level >= 3) add({ title:"Cold therapy for hot joints", why:"If a joint is warm and swollen, a cold pack for 10–15 min can calm inflammation.", tag:"Comfort", icon:Snowflake, c:"#3a8fb0" });

  return out.slice(0, 5);
}

/* ════════════ MAIN APP ════════════ */
export default function App() {
  const [tab, setTab] = useState("home");
  const [loaded, setLoaded] = useState(false);

  const [selected, setSelected]       = useState(null);
  const [todayLogged, setTodayLogged] = useState(false);
  const [logs, setLogs]               = useState([]);
  const [locations, setLocations]     = useState({});

  const [tightness, setTightness] = useState(55);
  const [power, setPower]         = useState(40);
  const [mode, setMode]           = useState("walking");
  const [active, setActive]       = useState(true);
  const [autoAssist, setAutoAssist] = useState(true);

  const [messages, setMessages] = useState([
    { role:"bot", text:"Hi — I'm your RA companion. Ask me anything about flares, gentle movement, joint care, or how to use the suit. I'm here to help, though I'm not a substitute for your rheumatologist." },
  ]);
  const [input, setInput]     = useState("");
  const [thinking, setThinking] = useState(false);
  const chatEnd = useRef(null);

  const currentLevel = todayLogged && logs.length ? logs[logs.length - 1].level : (selected || 0);

  /* load persisted data on mount */
  useEffect(() => {
    const today = new Date().toDateString();
    const L   = load("ra:logs", []);
    const loc = load("ra:locations", {});
    const suit = load("ra:suit", null);
    setLogs(L); setLocations(loc);
    if (suit) { setTightness(suit.tightness); setPower(suit.power); setMode(suit.mode); setAutoAssist(suit.auto); }
    if (L.length && L[L.length - 1].d === today) { setTodayLogged(true); setSelected(L[L.length - 1].level); }
    setLoaded(true);
  }, []);

  /* auto-match suit power to pain */
  useEffect(() => {
    if (autoAssist && currentLevel) setPower(Math.round(20 + currentLevel * 16));
  }, [autoAssist, currentLevel]);

  /* persist suit settings */
  useEffect(() => {
    if (loaded) save("ra:suit", { tightness, power, mode, auto: autoAssist });
  }, [tightness, power, mode, autoAssist, loaded]);

  /* scroll chat */
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, thinking]);

  function logPain() {
    if (!selected) return;
    const today = new Date().toDateString();
    const next = [...logs.filter(l => l.d !== today), { d: today, level: selected }];
    setLogs(next); setTodayLogged(true); save("ra:logs", next);
  }

  function cycleJoint(id) {
    setLocations(prev => {
      const cur = prev[id];
      const next = { ...prev };
      if (cur === undefined) next[id] = 0;
      else if (cur < 2) next[id] = cur + 1;
      else delete next[id];
      save("ra:locations", next);
      return next;
    });
  }

  /* AI chat — routes through /api/chat so the key stays server-side */
  async function send(preset) {
    const text = (preset ?? input).trim();
    if (!text || thinking) return;
    const userMsg = { role:"user", text };
    const history = [...messages, userMsg];
    setMessages(history); setInput(""); setThinking(true);

    const systemContext =
      `User context — most recent pain level: ${currentLevel || "not logged today"}/5. ` +
      `Flagged joints: ${Object.keys(locations).map(id => JOINTS.find(j => j.id === id)?.label).join(", ") || "none"}. ` +
      `Suit settings: ${power}% assist, ${mode} mode, ${active ? "active" : "paused"}.`;

    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          systemContext,
          messages: history.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text })),
        }),
      });
      const data = await res.json();
      const reply = data.content || data.error || "I'm having trouble responding right now. Please try again.";
      setMessages(m => [...m, { role:"bot", text: reply }]);
    } catch {
      setMessages(m => [...m, { role:"bot", text:"I couldn't reach my brain just now. Check your connection and try again." }]);
    } finally { setThinking(false); }
  }

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  };

  const chartData = logs.slice(-14).map(l => ({
    day: new Date(l.d).toLocaleDateString(undefined, { weekday:"short" }),
    level: l.level,
  }));

  /* ── joint frequency for analytics ── */
  const jointFreq = JOINTS.map(j => ({
    label: j.label,
    count: logs.filter(l => l.joints?.includes(j.id)).length,
  })).filter(j => j.count > 0).sort((a,b) => b.count - a.count).slice(0, 6);

  const maxFreq = jointFreq[0]?.count || 1;

  /* ════════════════════════════════════════════
      RENDER
     ════════════════════════════════════════════ */
  return (
    <div className="era-root">
      <style>{STYLES}</style>

      {tab !== "ask" && (
        <header className="hdr">
          <div className="eyebrow">EaseRA</div>
          <h1 className="greet display">{greeting()}</h1>
          <div className="sub">{new Date().toLocaleDateString(undefined, { weekday:"long", month:"long", day:"numeric" })}</div>
        </header>
      )}

      {/* ─────────── HOME ─────────── */}
      {tab === "home" && (
        <main className="screen">
          <div className="card">
            <div className="card-title">How are you feeling?</div>
            <div className="scale">
              {[1,2,3,4,5].map(n => (
                <button key={n} className={"dot" + (selected === n ? " on" : "")}
                  style={selected === n ? { background: PAIN_COLORS[n-1] } : {}}
                  onClick={() => !todayLogged && setSelected(n)}>
                  {n}
                </button>
              ))}
            </div>
            <div className="scale-labels"><span>No pain</span><span>Worst pain</span></div>
            <div className="feeling">{FEELINGS[selected || 0]}</div>
            {todayLogged
              ? <div className="logged"><Check size={18}/> Logged for today — your suit and therapies are tuned to this.</div>
              : <button className="btn btn-primary" disabled={!selected} onClick={logPain}><Activity size={18}/> Log today's pain</button>}
          </div>

          {chartData.length >= 2 && (
            <div className="card">
              <div className="card-title">Your last {chartData.length} days</div>
              <div style={{ height:150 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top:6, right:6, left:-22, bottom:0 }}>
                    <CartesianGrid stroke="#EEF3F4" vertical={false}/>
                    <XAxis dataKey="day" tick={{ fontSize:11, fill:"#9CB0B6" }} axisLine={false} tickLine={false}/>
                    <YAxis domain={[0,5]} ticks={[1,3,5]} tick={{ fontSize:11, fill:"#9CB0B6" }} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{ borderRadius:12, border:"1px solid #E1EBEC", fontSize:12 }}/>
                    <Line type="monotone" dataKey="level" stroke="#0E6E6E" strokeWidth={3} dot={{ r:4, fill:"#0E6E6E" }}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="quick">
            {[
              { id:"body",    label:"Map your pain",      sub:`${Object.keys(locations).length||"No"} areas flagged`, Icon:MapPin },
              { id:"therapy", label:"Today's therapies",  sub:"Tuned to your day",                                   Icon:Sparkles },
              { id:"suit",    label:"Adjust your suit",   sub:`${power}% assist · ${mode}`,                          Icon:Cog },
              { id:"ask",     label:"Ask EaseRA",         sub:"Questions about RA",                                   Icon:MessageCircle },
            ].map(({ id, label, sub, Icon }) => (
              <button key={id} onClick={() => setTab(id)}>
                <div className="ic"><Icon size={20}/></div>
                <div><div className="qt">{label}</div><div className="qd">{sub}</div></div>
              </button>
            ))}
          </div>

          {logs.length > 0 && (
            <div style={{ textAlign:"center", marginTop:8 }}>
              <button
                onClick={() => setTab("analytics")}
                style={{ border:"none", background:"none", color:"var(--teal)", font:"600 14px 'Plus Jakarta Sans'", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6 }}
              >
                <BarChart2 size={15}/> View full analytics
              </button>
            </div>
          )}
        </main>
      )}

      {/* ─────────── BODY MAP ─────────── */}
      {tab === "body" && (
        <main className="screen">
          <div className="sec-title">Where does it hurt?</div>
          <p style={{ color:"var(--muted)", fontSize:14, margin:"0 2px 8px", lineHeight:1.5 }}>
            Tap a joint to flag it. Tap again to raise from mild → moderate → severe. Tap once more to clear.
          </p>
          <div className="card">
            <div className="body-wrap">
              <svg viewBox="0 0 200 420" width="220" height="420" aria-label="Body map">
                {/* silhouette */}
                <g fill="#EAF1F1" stroke="#D6E4E4" strokeWidth="2">
                  <circle cx="100" cy="44" r="22"/>
                  <rect x="74" y="70" width="52" height="90" rx="22"/>
                  <rect x="50" y="92" width="16" height="110" rx="8" transform="rotate(8 58 150)"/>
                  <rect x="134" y="92" width="16" height="110" rx="8" transform="rotate(-8 142 150)"/>
                  <rect x="76" y="210" width="20" height="180" rx="10"/>
                  <rect x="104" y="210" width="20" height="180" rx="10"/>
                </g>
                {/* joint dots */}
                {JOINTS.map(j => {
                  const sev = locations[j.id];
                  const on = sev !== undefined;
                  return (
                    <circle key={j.id} className="joint" cx={j.x} cy={j.y}
                      r={on ? 10 : 7}
                      fill={on ? SEV[sev].color : "#FFFFFF"}
                      stroke={on ? "#fff" : "#B9CDCD"} strokeWidth={2}
                      onClick={() => cycleJoint(j.id)}/>
                  );
                })}
              </svg>
            </div>
            <div className="legend">
              {SEV.map(s => <span key={s.name}><i style={{ background:s.color }}/> {s.name}</span>)}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Flagged joints</div>
            {Object.keys(locations).length === 0
              ? <p style={{ color:"var(--muted)", fontSize:14, margin:0 }}>Nothing flagged yet. Tap joints above that feel sore today.</p>
              : <div className="flag-list">
                  {Object.entries(locations).map(([id, sev]) => {
                    const j = JOINTS.find(x => x.id === id);
                    return (
                      <div className="flag-row" key={id}>
                        <span><i className="flag-dot" style={{ background:SEV[sev].color }}/>{j.label}</span>
                        <span className="sev-pill" style={{ background:SEV[sev].color+"22", color:SEV[sev].color }}>{SEV[sev].name}</span>
                      </div>
                    );
                  })}
                </div>}
          </div>
        </main>
      )}

      {/* ─────────── THERAPIES ─────────── */}
      {tab === "therapy" && (
        <main className="screen">
          <div className="sec-title">Therapies for today</div>
          <p style={{ color:"var(--muted)", fontSize:14, margin:"0 2px 14px", lineHeight:1.5 }}>
            {currentLevel
              ? `Based on a pain level of ${currentLevel}/5${Object.keys(locations).length ? ` and ${Object.keys(locations).length} flagged area${Object.keys(locations).length > 1 ? "s" : ""}.` : "."}`
              : "Log today's pain on the home screen for picks tuned to how you feel."}
          </p>
          {recommend(currentLevel || 1, locations).map(r => {
            const Icon = r.icon;
            return (
              <div className="therapy" key={r.title}>
                <div className="tic" style={{ background:r.c+"1e", color:r.c }}><Icon size={22}/></div>
                <div>
                  <h3>{r.title}</h3>
                  <p>{r.why}</p>
                  <span className="tag" style={{ background:r.c+"1e", color:r.c }}>{r.tag}</span>
                </div>
              </div>
            );
          })}
          <p className="disclaimer">These are gentle, general suggestions — not medical advice. Check with your rheumatologist or physical therapist before starting something new, especially during a flare.</p>
        </main>
      )}

      {/* ─────────── SUIT / EXOSKELETON ─────────── */}
      {tab === "suit" && (
        <main className="screen">
          <div className="sec-title">Your exoskeleton</div>
          <Exoskeleton tightness={tightness} power={power} mode={mode} running={active}/>

          <div className="readout" style={{ marginTop:16 }}>
            <div className="ro"><div className="n">{power}%</div><div className="l">Assist</div></div>
            <div className="ro"><div className="n" style={{ textTransform:"capitalize", fontSize:18, paddingTop:4 }}>{mode}</div><div className="l">Mode</div></div>
            <div className="ro"><div className="n">{active ? "On" : "Off"}</div><div className="l">Status</div></div>
          </div>

          {/* Auto-assist toggle */}
          <div className="card" style={{ marginTop:16 }}>
            <div className="toggle" style={{ marginBottom:4 }}>
              <div>
                <div className="tg-txt">Auto-assist</div>
                <div className="tg-sub">Match power to today's pain ({currentLevel || "—"}/5)</div>
              </div>
              <div className={"switch"+(autoAssist?" on":"")} onClick={() => setAutoAssist(a=>!a)}><div className="knob"/></div>
            </div>
          </div>

          {/* Sliders */}
          <div className="card">
            {/* Waist straps */}
            <div className="slider-row" style={{ marginTop:0 }}>
              <div className="slider-top">
                <span className="lab">Waist straps</span>
                <span className="val">{tightness < 33 ? "Loose" : tightness < 66 ? "Snug" : "Firm"}</span>
              </div>
              <input type="range" min="0" max="100" value={tightness}
                onChange={e => setTightness(+e.target.value)}/>
              <div className="slabels"><span>Loose</span><span>Tight</span></div>
            </div>

            {/* Thigh support — left */}
            <div className="slider-row">
              <div className="slider-top">
                <span className="lab">Left thigh support</span>
                <span className="val">{power < 33 ? "Minimal" : power < 66 ? "Moderate" : "Full"}</span>
              </div>
              <input type="range" min="0" max="100" value={power}
                onChange={e => setPower(+e.target.value)} disabled={autoAssist}
                style={autoAssist ? { opacity:.5 } : {}}/>
              <div className="slabels"><span>Low</span><span>High</span></div>
            </div>

            {/* Skeleton power */}
            <div className="slider-row">
              <div className="slider-top">
                <span className="lab">Skeleton power</span>
                <span className="val">{power}%</span>
              </div>
              <input type="range" min="0" max="100" value={power}
                onChange={e => setPower(+e.target.value)} disabled={autoAssist}
                style={autoAssist ? { opacity:.5 } : {}}/>
              <div className="slabels"><span>Low</span><span>High</span></div>
              {autoAssist && <div style={{ fontSize:12, color:"var(--faint)", marginTop:8 }}>Turn off auto-assist to set by hand.</div>}
            </div>

            {/* Movement mode */}
            <div className="slider-row" style={{ marginBottom:6 }}>
              <div className="slider-top"><span className="lab">Movement mode</span></div>
              <div className="seg">
                {["walking","running"].map(m => (
                  <button key={m} className={mode===m?"on":""} onClick={()=>setMode(m)} style={{ textTransform:"capitalize" }}>{m}</button>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-ghost" onClick={() => setActive(a=>!a)}>
            {active ? "Pause assist" : "Start assist"}
          </button>

          <p className="disclaimer" style={{ marginTop:12 }}>
            The exoskeleton settings in this app are a simulation. Always follow the guidance in your physical device's manual and your care team's recommendations.
          </p>
        </main>
      )}

      {/* ─────────── ANALYTICS ─────────── */}
      {tab === "analytics" && (
        <main className="screen">
          <div className="sec-title">Your pain report</div>

          {/* Stat cards */}
          <div className="stat-grid">
            {[
              { label:"Avg pain",    value: logs.length ? (logs.reduce((s,l)=>s+l.level,0)/logs.length).toFixed(1) : "—" },
              { label:"Days logged", value: logs.length },
              { label:"Best day",    value: logs.length ? Math.min(...logs.map(l=>l.level)) : "—" },
              { label:"Worst day",   value: logs.length ? Math.max(...logs.map(l=>l.level)) : "—" },
            ].map(({ label, value }) => (
              <div className="stat-card" key={label}>
                <div className="sn">{value}</div>
                <div className="sl">{label}</div>
              </div>
            ))}
          </div>

          {/* Trend chart */}
          {chartData.length >= 2 && (
            <div className="card">
              <div className="card-title">Pain over time</div>
              <div style={{ height:180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top:6, right:6, left:-22, bottom:0 }}>
                    <CartesianGrid stroke="#EEF3F4" vertical={false}/>
                    <XAxis dataKey="day" tick={{ fontSize:11, fill:"#9CB0B6" }} axisLine={false} tickLine={false}/>
                    <YAxis domain={[0,5]} ticks={[1,2,3,4,5]} tick={{ fontSize:11, fill:"#9CB0B6" }} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{ borderRadius:12, border:"1px solid #E1EBEC", fontSize:12 }}/>
                    <Line type="monotone" dataKey="level" stroke="#0E6E6E" strokeWidth={3} dot={{ r:4, fill:"#0E6E6E" }}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Joint heatmap */}
          {jointFreq.length > 0 && (
            <div className="card">
              <div className="card-title">Most affected joints</div>
              {jointFreq.map(({ label, count }) => (
                <div className="heat-row" key={label}>
                  <span style={{ width:120, fontSize:13, color:"var(--muted)", flexShrink:0 }}>{label}</span>
                  <div className="heat-bar" style={{ width:`${(count/maxFreq)*100}%`, maxWidth:160 }}/>
                  <span style={{ marginLeft:"auto", fontSize:12, color:"var(--teal)", fontWeight:700 }}>{count}×</span>
                </div>
              ))}
            </div>
          )}

          {logs.length === 0 && (
            <div className="card" style={{ textAlign:"center", color:"var(--muted)", fontSize:15 }}>
              Start logging your pain on the home screen to see your report here.
            </div>
          )}
        </main>
      )}

      {/* ─────────── AI CHAT ─────────── */}
      {tab === "ask" && (
        <main className="screen" style={{ paddingBottom:80 }}>
          <header style={{ display:"flex", alignItems:"center", gap:10, padding:"36px 4px 6px" }}>
            <div style={{ width:42, height:42, borderRadius:14, background:"var(--teal-soft)", color:"var(--teal-deep)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Bot size={22}/>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:17 }}>EaseRA Assistant</div>
              <div style={{ fontSize:12, color:"var(--muted)" }}>Informational support · not a doctor</div>
            </div>
          </header>

          <div className="chat-scroll">
            {messages.map((m, i) => <div key={i} className={"msg "+m.role}>{m.text}</div>)}
            {thinking && <div className="msg bot"><div className="typing"><i/><i/><i/></div></div>}
            <div ref={chatEnd}/>
          </div>

          {messages.length <= 1 && (
            <div className="chips">
              {[
                "Why are my joints stiff in the morning?",
                "Gentle moves for sore hands?",
                "How should I set the suit during a flare?",
                "Tips for pacing a busy day",
              ].map(q => (
                <button key={q} className="chip" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}

          <div className="composer">
            <div className="row">
              <input
                value={input}
                placeholder="Ask about RA, flares, the suit…"
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
              />
              <button className="sendb" disabled={!input.trim() || thinking} onClick={() => send()}>
                <Send size={18}/>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ─────────── BOTTOM NAV ─────────── */}
      <nav className="nav">
        {[
          { id:"home",      label:"Today",   Icon:Home        },
          { id:"body",      label:"Body",    Icon:MapPin      },
          { id:"therapy",   label:"Therapy", Icon:Sparkles    },
          { id:"suit",      label:"Suit",    Icon:Cog         },
          { id:"analytics", label:"Report",  Icon:BarChart2   },
          { id:"ask",       label:"Ask",     Icon:MessageCircle },
        ].map(({ id, label, Icon }) => (
          <button key={id} className={tab===id?"on":""} onClick={() => setTab(id)}>
            <span className="pip"/>
            <Icon size={20}/>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
