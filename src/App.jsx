import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import {
  Activity, Home, MapPin, Sparkles, MessageCircle, Cog, Send,
  Waves, Wind, Footprints, HandHeart, Snowflake, Flame, Bike, Dumbbell,
  Check, Bot, Calendar, Plus, X, AlertTriangle, Clock, ChevronDown,
  ChevronUp, BarChart2,
} from "lucide-react";

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
*,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body,#root{height:100%;margin:0;padding:0;}
body{background:var(--bg);}

.era-root{
  font-family:'Plus Jakarta Sans',system-ui,sans-serif;
  background:var(--bg);color:var(--ink);
  max-width:480px;margin:0 auto;min-height:100vh;
  position:relative;padding-bottom:92px;overflow-x:hidden;
}
.era-root h1,.era-root h2,.era-root h3{margin:0;}
.display{font-family:'Fraunces',serif;}

.hdr{padding:36px 22px 14px;}
.hdr .eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--teal);font-weight:600;}
.hdr .greet{font-size:30px;font-weight:500;line-height:1.1;margin-top:4px;}
.hdr .sub{color:var(--muted);font-size:14px;margin-top:6px;}

.screen{padding:6px 18px 8px;animation:rise .32s ease;}
@keyframes rise{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}

.card{background:var(--surface);border:1px solid var(--line);border-radius:22px;padding:20px;box-shadow:var(--shadow);margin-bottom:16px;}
.card-title{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:600;margin-bottom:14px;}
.sec-title{font-family:'Fraunces',serif;font-size:22px;font-weight:500;margin:6px 2px 12px;}

/* Pain scale */
.scale{display:flex;justify-content:space-between;gap:8px;margin-top:4px;}
.dot{flex:1;aspect-ratio:1;border-radius:50%;border:2px solid var(--line);background:var(--surface-2);
  display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;color:var(--faint);
  cursor:pointer;transition:transform .15s,box-shadow .2s;}
.dot:active{transform:scale(.92);}
.dot.on{color:#fff;border-color:transparent;transform:scale(1.06);box-shadow:0 6px 16px rgba(0,0,0,.16);}
.scale-labels{display:flex;justify-content:space-between;margin-top:8px;font-size:12px;color:var(--faint);font-weight:600;}
.feeling{text-align:center;font-family:'Fraunces',serif;font-size:19px;margin:18px 0 16px;color:var(--ink);min-height:24px;}

.btn{width:100%;border:none;border-radius:16px;padding:16px;font-family:inherit;font-weight:700;font-size:16px;
  cursor:pointer;transition:transform .12s,opacity .2s;display:flex;align-items:center;justify-content:center;gap:8px;}
.btn:active{transform:scale(.98);}
.btn-primary{background:var(--teal);color:#fff;}
.btn-ghost{background:var(--teal-soft);color:var(--teal-deep);}
.btn-sm{padding:10px 16px;font-size:14px;border-radius:12px;width:auto;}
.btn:disabled{opacity:.45;cursor:default;}

.logged{display:flex;align-items:center;gap:10px;background:var(--teal-soft);color:var(--teal-deep);
  border-radius:14px;padding:13px 16px;font-weight:600;font-size:14px;}

.quick{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.quick button{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:16px;text-align:left;
  cursor:pointer;font-family:inherit;display:flex;flex-direction:column;gap:10px;box-shadow:var(--shadow);transition:transform .12s;}
.quick button:active{transform:scale(.97);}
.quick .ic{width:38px;height:38px;border-radius:12px;background:var(--teal-soft);color:var(--teal-deep);display:flex;align-items:center;justify-content:center;}
.quick .qt{font-weight:700;font-size:15px;}
.quick .qd{font-size:12px;color:var(--muted);}

/* Body map */
.body-wrap{display:flex;justify-content:center;padding:6px 0 2px;}
.joint{cursor:pointer;transition:all .15s;}
.level-badge{font-size:9px;font-weight:800;fill:white;text-anchor:middle;dominant-baseline:central;pointer-events:none;}
.legend{display:flex;justify-content:center;gap:10px;margin-top:10px;flex-wrap:wrap;}
.legend span{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted);font-weight:600;}
.legend i{width:10px;height:10px;border-radius:50%;display:inline-block;}
.flag-list{margin-top:4px;}
.flag-row{display:flex;align-items:center;justify-content:space-between;padding:11px 2px;border-bottom:1px solid var(--line);font-size:14px;}
.flag-row:last-child{border:none;}
.flag-dot{width:11px;height:11px;border-radius:50%;display:inline-block;margin-right:9px;}
.level-pill{font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;}

/* Workout cards */
.workout{background:var(--surface);border:1px solid var(--line);border-radius:18px;margin-bottom:12px;overflow:hidden;box-shadow:var(--shadow);}
.workout-header{display:flex;gap:14px;padding:16px;cursor:pointer;align-items:flex-start;}
.workout .tic{flex:none;width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;}
.workout h3{font-size:16px;font-weight:700;margin:0 0 4px;}
.workout .why{font-size:13px;color:var(--muted);line-height:1.45;margin:0 0 8px;}
.workout .meta{display:flex;gap:8px;align-items:center;}
.tag{font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:.03em;}
.duration{font-size:11px;color:var(--muted);font-weight:600;display:flex;align-items:center;gap:4px;}
.exercises{padding:0 16px 16px;border-top:1px solid var(--line);}
.ex-item{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--surface-2);}
.ex-item:last-child{border:none;}
.ex-num{width:24px;height:24px;border-radius:50%;background:var(--teal-soft);color:var(--teal-deep);
  font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}
.ex-name{font-weight:700;font-size:13px;}
.ex-detail{font-size:12px;color:var(--muted);margin-top:2px;line-height:1.4;}

/* Schedule / Plan */
.suggestion{background:#FFFBEB;border:1px solid #FDE68A;border-radius:16px;padding:14px;margin-bottom:12px;}
.suggestion .s-title{font-weight:700;font-size:14px;color:#92400E;display:flex;align-items:center;gap:7px;margin-bottom:6px;}
.suggestion .s-body{font-size:13px;color:#78350F;line-height:1.45;margin-bottom:10px;}
.suggestion .s-actions{display:flex;gap:8px;}
.suggestion .s-actions button{flex:1;border:none;border-radius:10px;padding:9px;font-family:inherit;
  font-weight:700;font-size:13px;cursor:pointer;}
.s-reschedule{background:#FEF3C7;color:#92400E;}
.s-keep{background:var(--teal-soft);color:var(--teal-deep);}

.schedule-list{display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}
.sched-item{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:14px;
  display:flex;align-items:center;gap:12px;box-shadow:var(--shadow);}
.sched-item.rescheduled{opacity:.5;}
.sched-time{font-size:13px;font-weight:700;color:var(--muted);min-width:52px;}
.sched-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
.sched-title{font-weight:700;font-size:14px;flex:1;}
.sched-title.rescheduled{text-decoration:line-through;}
.intensity-badge{font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:.04em;}
.sched-remove{background:none;border:none;cursor:pointer;color:var(--faint);padding:4px;display:flex;}

.add-event-form{background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:18px;margin-bottom:16px;box-shadow:var(--shadow);}
.form-input{width:100%;border:1.5px solid var(--line);border-radius:12px;padding:12px 14px;font-family:inherit;
  font-size:14px;color:var(--ink);background:var(--surface-2);outline:none;margin-bottom:10px;}
.form-input:focus{border-color:var(--teal);}
.intensity-row{display:flex;gap:6px;margin-bottom:14px;}
.intensity-row button{flex:1;border:1.5px solid var(--line);border-radius:10px;padding:9px 4px;
  font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;background:var(--surface-2);color:var(--muted);transition:.15s;}
.intensity-row button.on{border-color:var(--teal);background:var(--teal-soft);color:var(--teal-deep);}

/* Suit */
.canvas-box{width:100%;height:300px;border-radius:20px;overflow:hidden;background:linear-gradient(160deg,#11343a,#0a2327);position:relative;}
.canvas-hint{position:absolute;bottom:10px;left:0;right:0;text-align:center;color:rgba(255,255,255,.45);font-size:11px;font-weight:600;letter-spacing:.04em;}
.slider-row{margin:18px 0;}
.slider-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;}
.slider-top .lab{font-weight:700;font-size:15px;}
.slider-top .val{font-weight:700;font-size:14px;color:var(--teal);}
.slabels{display:flex;justify-content:space-between;font-size:12px;color:var(--faint);font-weight:600;margin-top:6px;}
input[type=range]{-webkit-appearance:none;width:100%;height:10px;border-radius:10px;background:var(--teal-soft);outline:none;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:30px;height:30px;border-radius:50%;background:var(--teal);border:4px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.2);cursor:pointer;}
input[type=range]::-moz-range-thumb{width:26px;height:26px;border-radius:50%;background:var(--teal);border:4px solid #fff;cursor:pointer;}
.seg{display:flex;gap:8px;background:var(--surface-2);padding:6px;border-radius:16px;}
.seg button{flex:1;border:none;background:transparent;padding:12px;border-radius:11px;font-family:inherit;font-weight:700;font-size:14px;color:var(--muted);cursor:pointer;transition:.18s;}
.seg button.on{background:var(--teal);color:#fff;box-shadow:0 4px 12px rgba(14,110,110,.3);}
.toggle{display:flex;align-items:center;justify-content:space-between;}
.toggle .tg-txt{font-weight:700;font-size:15px;}
.toggle .tg-sub{font-size:12px;color:var(--muted);margin-top:2px;}
.switch{width:54px;height:31px;border-radius:20px;background:var(--line);position:relative;cursor:pointer;transition:.2s;flex:none;}
.switch.on{background:var(--teal);}
.switch .knob{position:absolute;top:3px;left:3px;width:25px;height:25px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 2px 6px rgba(0,0,0,.2);}
.switch.on .knob{left:26px;}
.readout{display:flex;gap:12px;margin-top:4px;}
.readout .ro{flex:1;background:var(--surface-2);border-radius:14px;padding:14px;text-align:center;}
.readout .ro .n{font-family:'Fraunces',serif;font-size:24px;font-weight:600;color:var(--teal-deep);}
.readout .ro .l{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-top:2px;}

/* Analytics */
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
.stat-card{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:16px;box-shadow:var(--shadow);text-align:center;}
.stat-card .sn{font-family:'Fraunces',serif;font-size:28px;font-weight:600;color:var(--teal-deep);}
.stat-card .sl{font-size:12px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-top:4px;}
.heat-row{display:flex;gap:8px;align-items:center;margin-bottom:8px;font-size:13px;}
.heat-bar{height:10px;border-radius:5px;background:var(--teal);min-width:4px;transition:width .4s ease;}

/* Chat */
.chat-scroll{display:flex;flex-direction:column;gap:12px;padding:4px 2px 12px;}
.msg{max-width:84%;padding:13px 16px;border-radius:18px;font-size:14.5px;line-height:1.5;white-space:pre-wrap;}
.msg.user{align-self:flex-end;background:var(--teal);color:#fff;border-bottom-right-radius:6px;}
.msg.bot{align-self:flex-start;background:var(--surface);border:1px solid var(--line);border-bottom-left-radius:6px;box-shadow:var(--shadow);}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 10px;}
.chip{background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:9px 14px;font-size:13px;font-weight:600;color:var(--teal-deep);cursor:pointer;font-family:inherit;}
.chip:active{transform:scale(.96);}
.composer{position:fixed;bottom:72px;left:0;right:0;max-width:480px;margin:0 auto;padding:10px 14px;background:linear-gradient(180deg,transparent,var(--bg) 30%);}
.composer .row{display:flex;gap:8px;background:var(--surface);border:1px solid var(--line);border-radius:22px;padding:6px 6px 6px 16px;box-shadow:var(--shadow);}
.composer input{flex:1;border:none;outline:none;font-family:inherit;font-size:15px;background:transparent;color:var(--ink);}
.composer .sendb{width:44px;height:44px;border-radius:50%;border:none;background:var(--teal);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none;}
.composer .sendb:disabled{opacity:.4;}
.typing{display:flex;gap:4px;align-items:center;padding:4px 2px;}
.typing i{width:7px;height:7px;border-radius:50%;background:var(--faint);animation:bob 1s infinite;}
.typing i:nth-child(2){animation-delay:.15s;}.typing i:nth-child(3){animation-delay:.3s;}
@keyframes bob{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-5px);opacity:1;}}

/* Nav */
.nav{position:fixed;bottom:0;left:0;right:0;max-width:480px;margin:0 auto;background:var(--surface);
  border-top:1px solid var(--line);display:flex;padding:8px 2px calc(8px + env(safe-area-inset-bottom));box-shadow:0 -6px 20px rgba(14,78,80,.06);z-index:20;}
.nav button{flex:1;border:none;background:transparent;display:flex;flex-direction:column;align-items:center;gap:3px;
  padding:6px 2px;cursor:pointer;color:var(--faint);font-family:inherit;font-size:10px;font-weight:600;transition:color .2s;}
.nav button.on{color:var(--teal);}
.nav .pip{width:28px;height:3px;border-radius:4px;background:transparent;margin-bottom:1px;transition:.2s;}
.nav button.on .pip{background:var(--teal);}
.disclaimer{font-size:12px;color:var(--muted);text-align:center;line-height:1.5;padding:8px 14px 0;}
`;

/* ── constants ── */
const PAIN_COLORS = ["#5FB87A","#9CC25C","#F0B23B","#F08A45","#E0594B"];
const FEELINGS    = ["Pick how today feels","A good day","Manageable","A bit much","Rough","Really tough"];
const jColor      = lvl => PAIN_COLORS[lvl - 1] || "#ccc";

const JOINTS = [
  {id:"neck", label:"Neck",          x:100,y:60, region:"upper"},
  {id:"shL",  label:"Left shoulder", x:66, y:92, region:"upper"},
  {id:"shR",  label:"Right shoulder",x:134,y:92, region:"upper"},
  {id:"elL",  label:"Left elbow",    x:52, y:150,region:"hands"},
  {id:"elR",  label:"Right elbow",   x:148,y:150,region:"hands"},
  {id:"wrL",  label:"Left wrist",    x:44, y:202,region:"hands"},
  {id:"wrR",  label:"Right wrist",   x:156,y:202,region:"hands"},
  {id:"haL",  label:"Left hand",     x:38, y:228,region:"hands"},
  {id:"haR",  label:"Right hand",    x:162,y:228,region:"hands"},
  {id:"hipL", label:"Left hip",      x:84, y:224,region:"lower"},
  {id:"hipR", label:"Right hip",     x:116,y:224,region:"lower"},
  {id:"knL",  label:"Left knee",     x:82, y:300,region:"lower"},
  {id:"knR",  label:"Right knee",    x:118,y:300,region:"lower"},
  {id:"anL",  label:"Left ankle",    x:80, y:370,region:"lower"},
  {id:"anR",  label:"Right ankle",   x:120,y:370,region:"lower"},
  {id:"ftL",  label:"Left foot",     x:76, y:396,region:"lower"},
  {id:"ftR",  label:"Right foot",    x:124,y:396,region:"lower"},
];

/* keywords in event titles → joint IDs that would conflict */
const ACTIVITY_CONFLICTS = {
  hike:    ["anL","anR","knL","knR","hipL","hipR"],
  walk:    ["anL","anR","knL","knR"],
  run:     ["anL","anR","knL","knR","hipL","hipR"],
  jog:     ["anL","anR","knL","knR"],
  swim:    ["shL","shR","elL","elR"],
  yoga:    ["wrL","wrR","shL","shR"],
  gym:     ["wrL","wrR","elL","elR","shL","shR"],
  lift:    ["wrL","wrR","elL","elR","shL","shR"],
  weights: ["wrL","wrR","elL","elR","shL","shR"],
  cycle:   ["knL","knR","hipL","hipR"],
  bike:    ["knL","knR","hipL","hipR"],
  dance:   ["anL","anR","knL","knR"],
  tennis:  ["wrL","wrR","elL","elR","shL","shR"],
  golf:    ["wrL","wrR","elL","elR","shL","shR"],
};

const INTENSITY_COLORS = {
  rest:   { bg:"#EEF3F4", text:"#5E747C" },
  low:    { bg:"#D6EAE9", text:"#0A4F50" },
  medium: { bg:"#FEF3C7", text:"#92400E" },
  high:   { bg:"#FFE6DE", text:"#C2410C" },
};

/* ── localStorage ── */
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

/* ══════════════════════════════════════════
   3-D EXOSKELETON
   ══════════════════════════════════════════ */
function Exoskeleton({ tightness, power, mode, running }) {
  const mount = useRef(null);
  const state = useRef({ tightness, power, mode, running });
  state.current = { tightness, power, mode, running };

  useEffect(() => {
    const el = mount.current; if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;
    const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0x0a2327, 7, 16);
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0.2, 8.2);
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xbfe0e0, 0.65));
    const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(4,6,6); scene.add(key);
    const rim = new THREE.DirectionalLight(0x5fd0d0, 0.6); rim.position.set(-5,2,-4); scene.add(rim);
    const glow = new THREE.PointLight(0xff7a5c, 0, 8); glow.position.set(0,0.5,2); scene.add(glow);

    const frameMat  = new THREE.MeshStandardMaterial({color:0x2a3138,metalness:0.85,roughness:0.35});
    const carbonMat = new THREE.MeshStandardMaterial({color:0x1a1f24,metalness:0.6,roughness:0.45});
    const padMat    = new THREE.MeshStandardMaterial({color:0x3a4248,metalness:0.1,roughness:0.9});
    const motorBase = new THREE.MeshStandardMaterial({color:0x10333a,metalness:0.7,roughness:0.3,emissive:0x0e6e6e,emissiveIntensity:0.4});

    const root = new THREE.Group(); scene.add(root);

    const belt = new THREE.Mesh(new THREE.TorusGeometry(1.35,0.22,16,40,Math.PI*1.25),padMat);
    belt.rotation.x = Math.PI/2; belt.rotation.z = -Math.PI*0.125-Math.PI; belt.position.y = 1.15; root.add(belt);
    const beltCore = new THREE.Mesh(new THREE.TorusGeometry(1.36,0.09,12,40,Math.PI*1.1),frameMat);
    beltCore.rotation.x = Math.PI/2; beltCore.rotation.z = -Math.PI*0.05-Math.PI; beltCore.position.y = 1.32; root.add(beltCore);

    const pack = new THREE.Mesh(new THREE.BoxGeometry(1.1,0.7,0.4),frameMat);
    pack.position.set(0,1.2,-1.25); root.add(pack);
    const backPad = new THREE.Mesh(new THREE.BoxGeometry(0.85,0.55,0.12),padMat);
    backPad.position.set(0,1.2,-1.04); root.add(backPad);

    /* RA lumbar support ridge */
    const lumbar = new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.9,12),frameMat);
    lumbar.rotation.z = Math.PI/2; lumbar.position.set(0,0.82,-1.28); root.add(lumbar);

    const legs = [];
    [-1,1].forEach(side => {
      const leg = new THREE.Group(); leg.position.set(side*1.28, 1.05, 0.15);
      const motorMat = motorBase.clone();
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.46,0.46,0.3,28),motorMat);
      motor.rotation.z = Math.PI/2; motor.rotation.x = Math.PI/2; leg.add(motor);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.34,20),frameMat);
      cap.rotation.z = Math.PI/2; cap.rotation.x = Math.PI/2; cap.position.z = 0.02; leg.add(cap);
      const armPivot = new THREE.Group(); leg.add(armPivot);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.16,1.5,0.34),carbonMat);
      arm.position.y = -0.78; armPivot.add(arm);
      const cuffPivot = new THREE.Group(); cuffPivot.position.y = -1.5; armPivot.add(cuffPivot);
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.44,0.15,14,30,Math.PI*1.35),padMat);
      cuff.rotation.y = Math.PI/2; cuff.rotation.z = side > 0 ? 0.2 : Math.PI-0.2; cuffPivot.add(cuff);
      const cuffFrame = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.5,0.34),carbonMat);
      cuffFrame.position.y = -0.1; cuffPivot.add(cuffFrame);
      root.add(leg);
      legs.push({ leg, armPivot, side, motorMat, baseX: side*1.28 });
    });
    root.position.y = -0.7;

    let drag=false, px=0, vel=0, rotY=-0.35, autoSpin=true;
    const down = e => { drag=true; autoSpin=false; px=e.touches?e.touches[0].clientX:e.clientX; };
    const move = e => { if(!drag)return; const cx=e.touches?e.touches[0].clientX:e.clientX; const d=(cx-px)*0.01; rotY+=d; vel=d; px=cx; };
    const up = () => { drag=false; };
    el.addEventListener("mousedown",down); el.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
    el.addEventListener("touchstart",down,{passive:true}); el.addEventListener("touchmove",move,{passive:true}); window.addEventListener("touchend",up);

    let raf, t=0;
    const animate = () => {
      raf = requestAnimationFrame(animate); t+=0.016;
      const s = state.current;
      if(!drag){ autoSpin?(rotY+=0.004):(rotY+=vel,vel*=0.92); }
      root.rotation.y = rotY;
      const pw = s.power/100;
      const col = new THREE.Color().lerpColors(new THREE.Color(0x0e9e9e),new THREE.Color(0xff7a5c),pw);
      const pulse = 0.35+pw*(0.9+Math.sin(t*(3+pw*4))*0.18);
      legs.forEach(({motorMat,leg,armPivot,side})=>{
        motorMat.emissive=col; motorMat.emissiveIntensity=pulse;
        leg.position.x = side*(1.28-(s.tightness/100)*0.18);
        const amp = s.running?(s.mode==="running"?0.42:0.22)*(0.4+pw):0;
        armPivot.rotation.x = Math.sin(t*(s.mode==="running"?5.5:3.2)+(side>0?Math.PI:0))*amp;
      });
      glow.color=col; glow.intensity=pw*1.6;
      renderer.render(scene,camera);
    };
    animate();

    const onResize = () => { const w=el.clientWidth,h=el.clientHeight; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); };
    window.addEventListener("resize",onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",onResize); window.removeEventListener("mouseup",up); window.removeEventListener("touchend",up);
      renderer.dispose();
      if(renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="canvas-box">
      <div ref={mount} style={{width:"100%",height:"100%"}}/>
      <div className="canvas-hint">drag to rotate · adjust below</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   WORKOUT RECOMMENDATIONS
   — specific exercises per joint + pain level
   ══════════════════════════════════════════ */
function buildWorkouts(painLevel, locations) {
  const results = [];
  const flagged  = Object.keys(locations);
  const levelFor = id => locations[id] || 0;
  const has      = region => flagged.some(id => JOINTS.find(j=>j.id===id)?.region===region);
  const hasJoint = (...ids) => ids.some(id => locations[id]);
  const highPain = painLevel >= 4;

  /* always-show base routine based on overall pain */
  if (painLevel <= 2) {
    results.push({
      title:"Morning Activation",
      why:"Low pain today — a gentle warm-up sets you up well for the day.",
      tag:"Daily", icon:Footprints, c:"#0E6E6E", duration:"15 min",
      exercises:[
        {name:"March in place", detail:"Gentle knee lifts for 60 seconds to get blood flowing"},
        {name:"Arm circles", detail:"Small to large, 10 forward + 10 backward"},
        {name:"Hip circles", detail:"Hands on hips, gentle circles × 10 each direction"},
      ],
    });
  }

  if (highPain) {
    results.push({
      title:"Flare-Day Rest Routine",
      why:`Pain is ${painLevel}/5 today. Focus on comfort, breathing, and micro-movements only.`,
      tag:"Comfort", icon:Flame, c:"#F08A45", duration:"10 min",
      exercises:[
        {name:"Deep breathing", detail:"4 counts in, hold 4, out 4 — repeat × 10"},
        {name:"Gentle hand squeezes", detail:"Soft squeeze, hold 3 sec, release — × 10 each hand"},
        {name:"Seated foot pumps", detail:"Flex and point feet slowly while seated — × 15"},
      ],
    });
  }

  /* joint-specific routines */
  if (hasJoint("anL","anR")) {
    const lvl = Math.max(levelFor("anL"), levelFor("anR"));
    results.push({
      title:"Ankle Mobility",
      why:`Ankle pain (${lvl}/5) — these moves keep range-of-motion without loading the joint.`,
      tag:"Targeted", icon:Footprints, c:"#0E6E6E", duration:"10 min",
      exercises:[
        {name:"Ankle circles", detail:"Seated, rotate ankle slowly × 10 each direction, both feet"},
        {name:"Ankle pumps", detail:"Flex and point foot × 20 reps — good for circulation"},
        {name:"Towel toe-scrunches", detail:"Place towel on floor, scrunch with toes × 15 reps"},
        ...(lvl <= 3 ? [{name:"Calf raises (seated)", detail:"Raise heels while seated, hold 2 sec, lower × 15"}] : []),
      ],
    });
  }

  if (hasJoint("knL","knR")) {
    const lvl = Math.max(levelFor("knL"), levelFor("knR"));
    results.push({
      title:"Knee Strengthening",
      why:`Knee pain (${lvl}/5) — gentle quad and hamstring work protects the joint.`,
      tag:"Targeted", icon:Activity, c:"#3a8fb0", duration:"12 min",
      exercises:[
        {name:"Quad sets", detail:"Seated, tighten thigh muscle, hold 5 sec, release × 15 reps"},
        {name:"Straight leg raises", detail:"Lying flat, raise leg 12 inches, hold 3 sec × 10 each leg"},
        {name:"Seated knee flexion", detail:"Slowly bend and straighten knee through comfortable range × 15"},
        ...(lvl <= 2 ? [{name:"Mini squats", detail:"Hands on chair, bend knees slightly (20°), rise slowly × 10"}] : []),
      ],
    });
  }

  if (hasJoint("hipL","hipR")) {
    const lvl = Math.max(levelFor("hipL"), levelFor("hipR"));
    results.push({
      title:"Hip Flexibility",
      why:`Hip pain (${lvl}/5) — gentle hip work reduces stiffness and supports exo-assisted walking.`,
      tag:"Targeted", icon:Waves, c:"#8a7bd8", duration:"10 min",
      exercises:[
        {name:"Seated hip circles", detail:"Seated on edge of chair, make small circles with hips × 10 each way"},
        {name:"Clamshells", detail:"Side-lying, knees bent, open top knee like a clamshell × 15 each side"},
        {name:"Hip flexor stretch", detail:"Seated lunge stretch, 30 seconds each side — no bouncing"},
        ...(lvl <= 3 ? [{name:"Step-ups (low step)", detail:"Use a low step or curb, slow and controlled × 10 each leg"}] : []),
      ],
    });
  }

  if (hasJoint("wrL","wrR","haL","haR","elL","elR")) {
    const lvl = Math.max(levelFor("wrL"),levelFor("wrR"),levelFor("haL"),levelFor("haR"),levelFor("elL"),levelFor("elR"));
    results.push({
      title:"Hand & Wrist Care",
      why:`Upper limb pain (${lvl}/5) — warmth and gentle motion reduce stiffness and maintain grip.`,
      tag:"Targeted", icon:HandHeart, c:"#6FB89A", duration:"10 min",
      exercises:[
        {name:"Warm-water soak", detail:"Soak hands in warm (not hot) water 5–10 min before exercises"},
        {name:"Finger spreads", detail:"Spread fingers wide, hold 5 sec, close gently × 10"},
        {name:"Wrist rotations", detail:"Slowly rotate wrists × 10 each direction — both hands"},
        {name:"Tendon glides", detail:"Make a fist, then straighten fingers × 10 — improves tendon health"},
        ...(lvl <= 3 ? [{name:"Pinch strengthening", detail:"Pinch a soft ball or putty for 3 sec × 15 reps"}] : []),
      ],
    });
  }

  if (hasJoint("shL","shR","neck")) {
    const lvl = Math.max(levelFor("shL"),levelFor("shR"),levelFor("neck"));
    results.push({
      title:"Shoulder & Neck Mobility",
      why:`Upper body pain (${lvl}/5) — pendulum exercises and gentle stretches protect the shoulder joint.`,
      tag:"Targeted", icon:Wind, c:"#6FB89A", duration:"10 min",
      exercises:[
        {name:"Neck half-circles", detail:"Slowly drop chin to chest, roll ear to shoulder (each side) × 5"},
        {name:"Shoulder blade squeezes", detail:"Pull shoulder blades together, hold 5 sec, release × 12"},
        {name:"Pendulum swings", detail:"Lean on table, let arm hang freely and swing gently × 20"},
        ...(lvl <= 3 ? [{name:"Wall slides", detail:"Stand at wall, slide arms up/down slowly × 10"}] : []),
      ],
    });
  }

  if (has("lower") && !highPain) {
    results.push({
      title:"Pool / Water Walking",
      why:"Water supports your weight, cutting joint load by 50–90%. Ideal for lower-body pain days.",
      tag:"Low impact", icon:Waves, c:"#0E6E6E", duration:"20–30 min",
      exercises:[
        {name:"Water walking", detail:"Walk slowly in chest-deep water, arms swinging naturally"},
        {name:"Leg raises in water", detail:"Hold pool edge, raise each leg forward × 10"},
        {name:"Heel-to-toe walking", detail:"Step heel → toe in water, works balance and ankle strength"},
      ],
    });
  }

  if (!highPain && flagged.length === 0) {
    results.push({
      title:"Gentle Yoga Flow",
      why:"No pain flagged today — a slow yoga flow builds flexibility and calm.",
      tag:"Restorative", icon:Wind, c:"#8a7bd8", duration:"20 min",
      exercises:[
        {name:"Child's pose", detail:"Hold 30 seconds, focus on slow breath"},
        {name:"Cat-cow", detail:"On hands and knees, arch and round spine × 10"},
        {name:"Seated forward fold", detail:"Seated, reach toward feet gently, hold 30 sec"},
        {name:"Legs-up-the-wall", detail:"Lie flat, legs up wall for 5 min — reduces inflammation"},
      ],
    });
  }

  results.push({
    title:"PT Check-In",
    why:"Bring your pain log and joint map to your PT — they can tailor this week's program.",
    tag:"Plan", icon:Dumbbell, c:"#5E747C", duration:"30–45 min",
    exercises:[
      {name:"Review logged pain data", detail:"Show your physical therapist the pain log from this app"},
      {name:"Discuss flare patterns", detail:"Note which joints are consistently affected"},
      {name:"Set this week's goals", detail:"Agree on 2–3 safe exercises to practice at home"},
    ],
  });

  return results.slice(0, 6);
}

/* ══════════════════════════════════════════
   SCHEDULE SUGGESTION ENGINE
   ══════════════════════════════════════════ */
function getSuggestions(painLevel, locations, events) {
  const suggestions = [];
  events.forEach(ev => {
    if (ev.status !== "planned") return;
    const titleLow = ev.title.toLowerCase();
    const conflictJoints = [];

    Object.entries(ACTIVITY_CONFLICTS).forEach(([kw, joints]) => {
      if (titleLow.includes(kw)) {
        joints.forEach(jid => {
          if (locations[jid] && locations[jid] >= 3) {
            const j = JOINTS.find(x => x.id === jid);
            if (j && !conflictJoints.find(c => c.id === jid))
              conflictJoints.push({ id: jid, label: j.label, level: locations[jid] });
          }
        });
      }
    });

    const highIntensityHighPain = ev.intensity === "high" && painLevel >= 4;

    if (conflictJoints.length > 0 || highIntensityHighPain) {
      const jointNames = conflictJoints.map(j => `${j.label} (${j.level}/5)`).join(", ");
      let msg = `You have "${ev.title}" at ${formatTime(ev.time)}.`;
      if (conflictJoints.length > 0)
        msg += ` You're experiencing pain in: ${jointNames}. This activity may aggravate those areas.`;
      else
        msg += ` Your overall pain is ${painLevel}/5 today — a high-intensity activity may be tough.`;
      suggestions.push({ eventId: ev.id, message: msg });
    }
  });
  return suggestions;
}

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${ampm}`;
}

/* ══════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════ */
export default function App() {
  const [tab, setTab]             = useState("home");
  const [loaded, setLoaded]       = useState(false);
  const [selected, setSelected]   = useState(null);
  const [todayLogged, setTodayLogged] = useState(false);
  const [logs, setLogs]           = useState([]);
  const [locations, setLocations] = useState({});
  const [tightness, setTightness] = useState(55);
  const [power, setPower]         = useState(40);
  const [mode, setMode]           = useState("walking");
  const [active, setActive]       = useState(true);
  const [autoAssist, setAutoAssist] = useState(true);
  const [schedule, setSchedule]   = useState([]);
  const [showAdd, setShowAdd]     = useState(false);
  const [newEvent, setNewEvent]   = useState({ title:"", time:"", intensity:"medium" });
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [messages, setMessages]   = useState([{
    role:"bot",
    text:"Hi — I'm your RA companion. Ask me anything about flares, gentle movement, joint care, or how to use the suit. I'm here to help, though I'm not a substitute for your rheumatologist.",
  }]);
  const [input, setInput]         = useState("");
  const [thinking, setThinking]   = useState(false);
  const chatEnd = useRef(null);

  const currentLevel = todayLogged && logs.length ? logs[logs.length-1].level : (selected||0);
  const todayEvents  = schedule.filter(e => e.date === new Date().toDateString());
  const suggestions  = getSuggestions(currentLevel, locations, todayEvents);

  useEffect(() => {
    const today = new Date().toDateString();
    const L   = load("ra:logs", []);
    const loc = load("ra:locations", {});
    const suit= load("ra:suit", null);
    const sch = load("ra:schedule", []);
    setLogs(L); setLocations(loc); setSchedule(sch);
    if (suit) { setTightness(suit.tightness); setPower(suit.power); setMode(suit.mode); setAutoAssist(suit.auto); }
    if (L.length && L[L.length-1].d === today) { setTodayLogged(true); setSelected(L[L.length-1].level); }
    setLoaded(true);
  }, []);

  useEffect(() => { if (autoAssist && currentLevel) setPower(Math.round(20+currentLevel*16)); }, [autoAssist, currentLevel]);
  useEffect(() => { if (loaded) save("ra:suit",{tightness,power,mode,auto:autoAssist}); }, [tightness,power,mode,autoAssist,loaded]);
  useEffect(() => { chatEnd.current?.scrollIntoView({behavior:"smooth"}); }, [messages,thinking]);

  function logPain() {
    if (!selected) return;
    const today = new Date().toDateString();
    const next = [...logs.filter(l=>l.d!==today), {d:today,level:selected}];
    setLogs(next); setTodayLogged(true); save("ra:logs",next);
  }

  function cycleJoint(id) {
    setLocations(prev => {
      const cur = prev[id];
      const next = {...prev};
      if (cur === undefined) next[id] = 1;
      else if (cur < 5) next[id] = cur + 1;
      else delete next[id];
      save("ra:locations", next);
      return next;
    });
  }

  function addEvent() {
    if (!newEvent.title.trim()) return;
    const ev = { id:Date.now(), ...newEvent, title:newEvent.title.trim(), date:new Date().toDateString(), status:"planned" };
    const next = [...schedule, ev];
    setSchedule(next); save("ra:schedule", next);
    setNewEvent({title:"",time:"",intensity:"medium"}); setShowAdd(false);
  }

  function actOnSuggestion(eventId, action) {
    const next = schedule.map(e => e.id===eventId ? {...e,status:action} : e);
    setSchedule(next); save("ra:schedule",next);
  }

  function removeEvent(id) {
    const next = schedule.filter(e=>e.id!==id);
    setSchedule(next); save("ra:schedule",next);
  }

  async function send(preset) {
    const text = (preset??input).trim(); if (!text||thinking) return;
    const userMsg = {role:"user",text};
    const history = [...messages,userMsg];
    setMessages(history); setInput(""); setThinking(true);

    const jointNames = Object.entries(locations)
      .map(([id,lvl]) => `${JOINTS.find(j=>j.id===id)?.label} (${lvl}/5)`)
      .join(", ") || "none";
    const systemContext =
      `User pain today: ${currentLevel||"not logged"}/5. ` +
      `Flagged joints: ${jointNames}. ` +
      `Suit: ${power}% assist, ${mode} mode, ${active?"active":"paused"}.`;

    try {
      const res = await fetch("/api/chat",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ systemContext, messages:history.map(m=>({role:m.role==="bot"?"assistant":"user",content:m.text})) }),
      });
      const data = await res.json();
      setMessages(m=>[...m,{role:"bot",text:data.content||data.error||"Try again in a moment."}]);
    } catch {
      setMessages(m=>[...m,{role:"bot",text:"Couldn't reach my brain just now. Check your connection."}]);
    } finally { setThinking(false); }
  }

  const greeting = () => { const h=new Date().getHours(); return h<12?"Good morning":h<18?"Good afternoon":"Good evening"; };
  const chartData = logs.slice(-14).map(l=>({day:new Date(l.d).toLocaleDateString(undefined,{weekday:"short"}),level:l.level}));
  const workouts  = buildWorkouts(currentLevel||1, locations);

  const pendingSuggestions = suggestions.filter(s => {
    const ev = schedule.find(e=>e.id===s.eventId);
    return ev && ev.status === "planned";
  });

  /* ── joint frequency for analytics ── */
  const jointFreq = JOINTS.map(j=>({
    label:j.label,
    avg: (() => {
      const lvls = logs.filter(l=>l.joints?.includes(j.id)).map(l=>l.jointLevels?.[j.id]||1);
      return lvls.length ? (lvls.reduce((a,b)=>a+b,0)/lvls.length).toFixed(1) : null;
    })(),
    count: logs.filter(l=>l.joints?.includes(j.id)).length,
  })).filter(j=>j.count>0 || locations[j.id]).sort((a,b)=>b.count-a.count).slice(0,6);

  /* ══════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════ */
  return (
    <div className="era-root">
      <style>{STYLES}</style>

      {tab !== "ask" && (
        <header className="hdr">
          <div className="eyebrow">EaseRA</div>
          <h1 className="greet display">{greeting()}</h1>
          <div className="sub">{new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}</div>
        </header>
      )}

      {/* ───── TODAY ───── */}
      {tab==="home" && (
        <main className="screen">
          <div className="card">
            <div className="card-title">How are you feeling?</div>
            <div className="scale">
              {[1,2,3,4,5].map(n=>(
                <button key={n} className={"dot"+(selected===n?" on":"")}
                  style={selected===n?{background:PAIN_COLORS[n-1]}:{}}
                  onClick={()=>!todayLogged&&setSelected(n)}>{n}</button>
              ))}
            </div>
            <div className="scale-labels"><span>No pain</span><span>Worst pain</span></div>
            <div className="feeling">{["Pick how today feels","A good day","Manageable","A bit much","Rough","Really tough"][selected||0]}</div>
            {todayLogged
              ? <div className="logged"><Check size={18}/> Logged for today — your suit and therapies are tuned to this.</div>
              : <button className="btn btn-primary" disabled={!selected} onClick={logPain}><Activity size={18}/> Log today's pain</button>}
          </div>

          {/* suggestions teaser */}
          {pendingSuggestions.length > 0 && (
            <div className="suggestion" style={{cursor:"pointer"}} onClick={()=>setTab("plan")}>
              <div className="s-title"><AlertTriangle size={16}/> {pendingSuggestions.length} schedule suggestion{pendingSuggestions.length>1?"s":""}</div>
              <div className="s-body">{pendingSuggestions[0].message.slice(0,90)}… <span style={{color:"var(--teal)",fontWeight:700}}>View in Plan →</span></div>
            </div>
          )}

          {chartData.length>=2 && (
            <div className="card">
              <div className="card-title">Your last {chartData.length} days</div>
              <div style={{height:150}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{top:6,right:6,left:-22,bottom:0}}>
                    <CartesianGrid stroke="#EEF3F4" vertical={false}/>
                    <XAxis dataKey="day" tick={{fontSize:11,fill:"#9CB0B6"}} axisLine={false} tickLine={false}/>
                    <YAxis domain={[0,5]} ticks={[1,3,5]} tick={{fontSize:11,fill:"#9CB0B6"}} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{borderRadius:12,border:"1px solid #E1EBEC",fontSize:12}}/>
                    <Line type="monotone" dataKey="level" stroke="#0E6E6E" strokeWidth={3} dot={{r:4,fill:"#0E6E6E"}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="quick">
            {[
              {id:"body",    label:"Map your pain",   sub:`${Object.keys(locations).length||"No"} areas flagged`, Icon:MapPin},
              {id:"workout", label:"Today's workouts", sub:`${workouts.length} activities ready`,                Icon:Sparkles},
              {id:"suit",    label:"Adjust your suit", sub:`${power}% assist · ${mode}`,                         Icon:Cog},
              {id:"ask",     label:"Ask EaseRA",        sub:"Questions about RA",                                Icon:MessageCircle},
            ].map(({id,label,sub,Icon})=>(
              <button key={id} onClick={()=>setTab(id)}>
                <div className="ic"><Icon size={20}/></div>
                <div><div className="qt">{label}</div><div className="qd">{sub}</div></div>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* ───── BODY MAP ───── */}
      {tab==="body" && (
        <main className="screen">
          <div className="sec-title">Where does it hurt?</div>
          <p style={{color:"var(--muted)",fontSize:14,margin:"0 2px 8px",lineHeight:1.5}}>
            Tap a joint to set its pain level 1→2→3→4→5, then tap again to clear.
          </p>
          <div className="card">
            <div className="body-wrap">
              <svg viewBox="0 0 200 420" width="220" height="420" aria-label="Body map">
                <g fill="#EAF1F1" stroke="#D6E4E4" strokeWidth="2">
                  <circle cx="100" cy="44" r="22"/>
                  <rect x="74" y="70" width="52" height="90" rx="22"/>
                  <rect x="50" y="92" width="16" height="110" rx="8" transform="rotate(8 58 150)"/>
                  <rect x="134" y="92" width="16" height="110" rx="8" transform="rotate(-8 142 150)"/>
                  <rect x="76" y="210" width="20" height="180" rx="10"/>
                  <rect x="104" y="210" width="20" height="180" rx="10"/>
                </g>
                {JOINTS.map(j=>{
                  const lvl = locations[j.id];
                  const on  = lvl !== undefined;
                  return (
                    <g key={j.id} onClick={()=>cycleJoint(j.id)} style={{cursor:"pointer"}}>
                      <circle cx={j.cx||j.x} cy={j.cy||j.y}
                        r={on?12:7}
                        fill={on?jColor(lvl):"#FFFFFF"}
                        stroke={on?"#fff":"#B9CDCD"} strokeWidth={2}/>
                      {on && <text x={j.cx||j.x} y={j.cy||j.y} className="level-badge">{lvl}</text>}
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="legend">
              {[1,2,3,4,5].map(n=>(
                <span key={n}><i style={{background:jColor(n)}}/> Level {n}</span>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Flagged joints</div>
            {Object.keys(locations).length===0
              ? <p style={{color:"var(--muted)",fontSize:14,margin:0}}>Nothing flagged yet. Tap joints above that feel sore today.</p>
              : <div className="flag-list">
                  {Object.entries(locations).sort((a,b)=>b[1]-a[1]).map(([id,lvl])=>{
                    const j=JOINTS.find(x=>x.id===id);
                    return (
                      <div className="flag-row" key={id}>
                        <span><i className="flag-dot" style={{background:jColor(lvl)}}/>{j?.label}</span>
                        <span className="level-pill" style={{background:jColor(lvl)+"22",color:jColor(lvl)}}>{lvl}/5</span>
                      </div>
                    );
                  })}
                </div>}
          </div>
        </main>
      )}

      {/* ───── WORKOUTS ───── */}
      {tab==="workout" && (
        <main className="screen">
          <div className="sec-title">Today's workouts</div>
          <p style={{color:"var(--muted)",fontSize:14,margin:"0 2px 14px",lineHeight:1.5}}>
            {currentLevel
              ? `Tailored for pain level ${currentLevel}/5${Object.keys(locations).length>0?` and ${Object.keys(locations).length} flagged joint${Object.keys(locations).length>1?"s":""}`:""}. Tap any card to expand exercises.`
              : "Log today's pain for a personalised plan."}
          </p>
          {workouts.map((w,i)=>{
            const Icon=w.icon; const open=expandedWorkout===i;
            return (
              <div className="workout" key={i}>
                <div className="workout-header" onClick={()=>setExpandedWorkout(open?null:i)}>
                  <div className="tic" style={{background:w.c+"1e",color:w.c}}><Icon size={22}/></div>
                  <div style={{flex:1}}>
                    <h3>{w.title}</h3>
                    <p className="why">{w.why}</p>
                    <div className="meta">
                      <span className="tag" style={{background:w.c+"1e",color:w.c}}>{w.tag}</span>
                      <span className="duration"><Clock size={11}/>{w.duration}</span>
                    </div>
                  </div>
                  {open ? <ChevronUp size={16} color="var(--faint)"/> : <ChevronDown size={16} color="var(--faint)"/>}
                </div>
                {open && (
                  <div className="exercises">
                    {w.exercises.map((ex,ei)=>(
                      <div className="ex-item" key={ei}>
                        <div className="ex-num">{ei+1}</div>
                        <div>
                          <div className="ex-name">{ex.name}</div>
                          <div className="ex-detail">{ex.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <p className="disclaimer">These are general suggestions — not medical advice. Always check with your PT or rheumatologist before starting a new routine, especially during a flare.</p>
        </main>
      )}

      {/* ───── PLAN / SCHEDULE ───── */}
      {tab==="plan" && (
        <main className="screen">
          <div className="sec-title">Today's plan</div>

          {/* Suggestions */}
          {pendingSuggestions.length>0 && (
            <>
              <p style={{color:"var(--muted)",fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",margin:"0 2px 8px"}}>Suggestions based on your pain</p>
              {pendingSuggestions.map(s=>{
                const ev = schedule.find(e=>e.id===s.eventId);
                return ev ? (
                  <div className="suggestion" key={s.eventId}>
                    <div className="s-title"><AlertTriangle size={16}/> Heads up</div>
                    <div className="s-body">{s.message}</div>
                    <div className="s-actions">
                      <button className="s-reschedule" onClick={()=>actOnSuggestion(s.eventId,"rescheduled")}>Reschedule it</button>
                      <button className="s-keep" onClick={()=>actOnSuggestion(s.eventId,"kept")}>Keep as planned</button>
                    </div>
                  </div>
                ) : null;
              })}
            </>
          )}

          {/* Schedule list */}
          {todayEvents.length>0 && (
            <>
              <p style={{color:"var(--muted)",fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",margin:"12px 2px 8px"}}>Schedule</p>
              <div className="schedule-list">
                {[...todayEvents].sort((a,b)=>a.time>b.time?1:-1).map(ev=>{
                  const ic = INTENSITY_COLORS[ev.intensity]||INTENSITY_COLORS.medium;
                  const rescheduled = ev.status==="rescheduled";
                  return (
                    <div className={"sched-item"+(rescheduled?" rescheduled":"")} key={ev.id}>
                      <span className="sched-time">{formatTime(ev.time)||"—"}</span>
                      <span className="sched-dot" style={{background:ic.bg,border:`2px solid ${ic.text}`}}/>
                      <span className={"sched-title"+(rescheduled?" rescheduled":"")}>{ev.title}</span>
                      <span className="intensity-badge" style={{background:ic.bg,color:ic.text}}>{ev.intensity}</span>
                      <button className="sched-remove" onClick={()=>removeEvent(ev.id)}><X size={14}/></button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Add event */}
          {showAdd ? (
            <div className="add-event-form">
              <p style={{fontWeight:700,fontSize:15,marginBottom:12}}>Add to your day</p>
              <input className="form-input" placeholder="What's on your schedule? (e.g. Hike with friends)"
                value={newEvent.title} onChange={e=>setNewEvent(p=>({...p,title:e.target.value}))}/>
              <input className="form-input" type="time"
                value={newEvent.time} onChange={e=>setNewEvent(p=>({...p,time:e.target.value}))}/>
              <p style={{fontSize:12,fontWeight:700,color:"var(--muted)",marginBottom:8,textTransform:"uppercase",letterSpacing:".05em"}}>Activity level</p>
              <div className="intensity-row">
                {["rest","low","medium","high"].map(lvl=>(
                  <button key={lvl} className={newEvent.intensity===lvl?"on":""}
                    onClick={()=>setNewEvent(p=>({...p,intensity:lvl}))}
                    style={{textTransform:"capitalize"}}>{lvl}</button>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={addEvent}>Add</button>
                <button className="btn btn-ghost btn-sm" style={{flex:1}} onClick={()=>setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="btn btn-ghost" onClick={()=>setShowAdd(true)} style={{gap:8}}>
              <Plus size={18}/> Add to your day
            </button>
          )}

          {todayEvents.length===0 && !showAdd && (
            <div style={{textAlign:"center",padding:"32px 0",color:"var(--muted)"}}>
              <Calendar size={36} style={{margin:"0 auto 12px",opacity:.4}}/>
              <p style={{fontSize:14}}>Nothing scheduled yet.<br/>Add activities to get personalized suggestions.</p>
            </div>
          )}
        </main>
      )}

      {/* ───── SUIT ───── */}
      {tab==="suit" && (
        <main className="screen">
          <div className="sec-title">Your exoskeleton</div>
          <Exoskeleton tightness={tightness} power={power} mode={mode} running={active}/>

          <div className="readout" style={{marginTop:16}}>
            <div className="ro"><div className="n">{power}%</div><div className="l">Assist</div></div>
            <div className="ro"><div className="n" style={{textTransform:"capitalize",fontSize:18,paddingTop:4}}>{mode}</div><div className="l">Mode</div></div>
            <div className="ro"><div className="n">{active?"On":"Off"}</div><div className="l">Status</div></div>
          </div>

          <div className="card" style={{marginTop:16}}>
            <div className="toggle" style={{marginBottom:4}}>
              <div>
                <div className="tg-txt">Auto-assist</div>
                <div className="tg-sub">Match power to today's pain ({currentLevel||"—"}/5)</div>
              </div>
              <div className={"switch"+(autoAssist?" on":"")} onClick={()=>setAutoAssist(a=>!a)}><div className="knob"/></div>
            </div>
          </div>

          <div className="card">
            {/* Waist straps */}
            <div className="slider-row" style={{marginTop:0}}>
              <div className="slider-top">
                <span className="lab">Waist straps</span>
                <span className="val">{tightness<33?"Loose":tightness<66?"Snug":"Firm"}</span>
              </div>
              <input type="range" min="0" max="100" value={tightness} onChange={e=>setTightness(+e.target.value)}/>
              <div className="slabels"><span>Loose</span><span>Tight</span></div>
            </div>

            {/* Skeleton power */}
            <div className="slider-row">
              <div className="slider-top">
                <span className="lab">Skeleton power</span>
                <span className="val">{power}%</span>
              </div>
              <input type="range" min="0" max="100" value={power}
                onChange={e=>setPower(+e.target.value)} disabled={autoAssist}
                style={autoAssist?{opacity:.5}:{}}/>
              <div className="slabels"><span>Low</span><span>High</span></div>
              {autoAssist && <div style={{fontSize:12,color:"var(--faint)",marginTop:8}}>Turn off auto-assist to set by hand.</div>}
            </div>

            {/* Movement mode */}
            <div className="slider-row" style={{marginBottom:6}}>
              <div className="slider-top"><span className="lab">Movement mode</span></div>
              <div className="seg">
                {["walking","running"].map(m=>(
                  <button key={m} className={mode===m?"on":""} onClick={()=>setMode(m)} style={{textTransform:"capitalize"}}>{m}</button>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-ghost" onClick={()=>setActive(a=>!a)}>
            {active?"Pause assist":"Start assist"}
          </button>
          <p className="disclaimer" style={{marginTop:12}}>
            Exoskeleton settings here are a simulation. Always follow your device manual and care team's guidance.
          </p>
        </main>
      )}

      {/* ───── ASK ───── */}
      {tab==="ask" && (
        <main className="screen" style={{paddingBottom:80}}>
          <header style={{display:"flex",alignItems:"center",gap:10,padding:"36px 4px 6px"}}>
            <div style={{width:42,height:42,borderRadius:14,background:"var(--teal-soft)",color:"var(--teal-deep)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Bot size={22}/>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:17}}>EaseRA Assistant</div>
              <div style={{fontSize:12,color:"var(--muted)"}}>Informational support · not a doctor</div>
            </div>
          </header>
          <div className="chat-scroll">
            {messages.map((m,i)=><div key={i} className={"msg "+m.role}>{m.text}</div>)}
            {thinking && <div className="msg bot"><div className="typing"><i/><i/><i/></div></div>}
            <div ref={chatEnd}/>
          </div>
          {messages.length<=1 && (
            <div className="chips">
              {["Why are my joints stiff in the morning?","Gentle moves for sore hands?","How should I set the suit during a flare?","Tips for pacing a busy day"].map(q=>(
                <button key={q} className="chip" onClick={()=>send(q)}>{q}</button>
              ))}
            </div>
          )}
          <div className="composer">
            <div className="row">
              <input value={input} placeholder="Ask about RA, flares, the suit…"
                onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
              <button className="sendb" disabled={!input.trim()||thinking} onClick={()=>send()}><Send size={18}/></button>
            </div>
          </div>
        </main>
      )}

      {/* ───── NAV ───── */}
      <nav className="nav">
        {[
          {id:"home",    label:"Today",    Icon:Home},
          {id:"body",    label:"Body",     Icon:MapPin},
          {id:"workout", label:"Workouts", Icon:Sparkles},
          {id:"plan",    label:"Plan",     Icon:Calendar},
          {id:"suit",    label:"Suit",     Icon:Cog},
          {id:"ask",     label:"Ask",      Icon:MessageCircle},
        ].map(({id,label,Icon})=>(
          <button key={id} className={tab===id?"on":""} onClick={()=>setTab(id)}>
            <span className="pip"/>
            <Icon size={19}/>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
