import { useState, useEffect, useRef } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#0a0f1a;--deep:#0f1520;--card:#141c2e;--panel:#192236;
  --border:#243050;--border2:#2e3d60;--mute:#3a4f78;--dim:#5a6f99;
  --soft:#8a9dc0;--text:#c8d8f0;--bright:#eaf2ff;
  --gold:#f5c842;--gold2:#c9980a;--teal:#00d4aa;--teal2:#007a62;
  --coral:#ff6b6b;--sky:#4db8ff;--lilac:#b48cff;--r:14px;--rs:9px;
}
html{scroll-behavior:smooth;}
body{background:var(--ink);font-family:'Outfit',sans-serif;color:var(--text);min-height:100vh;}
.app{min-height:100vh;background:var(--ink);position:relative;overflow:hidden;}
.bg-grid{position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(rgba(0,212,170,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,170,0.03) 1px,transparent 1px);
  background-size:40px 40px;}
.bg-blob{position:fixed;border-radius:50%;filter:blur(100px);pointer-events:none;z-index:0;animation:blobdrift 15s ease-in-out infinite alternate;}
.bb1{width:500px;height:500px;background:radial-gradient(circle,rgba(245,200,66,0.08),transparent 70%);top:-100px;right:-100px;}
.bb2{width:600px;height:600px;background:radial-gradient(circle,rgba(0,212,170,0.05),transparent 70%);bottom:-200px;left:-150px;animation-delay:-8s;}
.bb3{width:300px;height:300px;background:radial-gradient(circle,rgba(77,184,255,0.05),transparent 70%);top:40%;left:40%;animation-delay:-4s;}
@keyframes blobdrift{from{transform:translate(0,0) scale(1);}to{transform:translate(40px,30px) scale(1.08);}}

/* ── BETA BANNER ── */
.beta-banner{
  position:relative;z-index:200;
  background:linear-gradient(90deg,#1a1200,#2a1e00,#1a1200);
  border-bottom:1px solid rgba(245,200,66,0.25);
  padding:8px 20px;
  display:flex;align-items:center;justify-content:center;gap:10px;
  overflow:hidden;
}
.beta-banner::before{
  content:'';position:absolute;inset:0;
  background:repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(245,200,66,0.03) 40px,rgba(245,200,66,0.03) 41px);
}
.beta-pill{
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  color:var(--ink);font-size:9px;font-weight:800;letter-spacing:2px;
  text-transform:uppercase;padding:3px 8px;border-radius:20px;flex-shrink:0;
  animation:betapulse 2.5s ease-in-out infinite;
}
@keyframes betapulse{0%,100%{box-shadow:0 0 6px rgba(245,200,66,0.4);}50%{box-shadow:0 0 16px rgba(245,200,66,0.8);}}
.beta-msg{font-size:12px;color:rgba(245,200,66,0.85);font-weight:500;letter-spacing:0.3px;}
.beta-msg strong{color:var(--gold);}
.beta-close{background:none;border:none;color:rgba(245,200,66,0.5);cursor:pointer;font-size:16px;padding:0 4px;margin-left:8px;transition:color 0.2s;flex-shrink:0;}
.beta-close:hover{color:var(--gold);}

/* ── HEADER ── */
.header{position:sticky;top:0;z-index:100;background:rgba(10,15,26,0.9);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:0 24px;}
.header-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px;}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;}
.logo-orbit{width:36px;height:36px;position:relative;}
.lo-r{position:absolute;inset:0;border-radius:50%;border:2px solid transparent;animation:spin 7s linear infinite;}
.lo-r1{border-top-color:var(--gold);border-right-color:rgba(245,200,66,0.2);}
.lo-r2{inset:9px;border-bottom-color:var(--teal);border-left-color:rgba(0,212,170,0.2);animation-direction:reverse;animation-duration:4.5s;}
.lo-dot{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:8px;height:8px;background:var(--gold);border-radius:50%;box-shadow:0 0 10px var(--gold);}
@keyframes spin{to{transform:rotate(360deg);}}
.logo-name{font-family:'Playfair Display',serif;font-size:20px;font-weight:900;color:var(--bright);}
.logo-name span{color:var(--gold);}
.logo-tag{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);margin-top:1px;}
.header-right{display:flex;align-items:center;gap:12px;}
.user-chip{display:flex;align-items:center;gap:8px;background:var(--panel);border:1px solid var(--border2);border-radius:30px;padding:6px 14px 6px 8px;}
.user-av{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--teal2));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--ink);}
.user-name{font-size:12px;font-weight:600;color:var(--text);}
.btn-logout{background:none;border:1px solid var(--border2);border-radius:8px;padding:6px 12px;color:var(--dim);font-size:12px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.2s;}
.btn-logout:hover{border-color:var(--coral);color:var(--coral);}
.btn-hdr-login{background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:10px;padding:8px 18px;color:var(--ink);font-size:13px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;transition:transform 0.15s,box-shadow 0.2s;box-shadow:0 4px 16px rgba(245,200,66,0.25);}
.btn-hdr-login:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(245,200,66,0.4);}

/* ── LOGIN PAGE ── */
.login-page{position:relative;z-index:1;min-height:calc(100vh - 113px);display:flex;align-items:center;justify-content:center;padding:40px 20px;}
.login-wrap{width:100%;max-width:440px;}
.login-card{background:linear-gradient(145deg,var(--card),var(--deep));border:1px solid var(--border2);border-radius:20px;padding:40px 36px 36px;box-shadow:0 0 0 1px rgba(245,200,66,0.04),0 40px 80px rgba(0,0,0,0.5);position:relative;overflow:hidden;animation:cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;}
.login-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),var(--teal),transparent);}
@keyframes cardIn{from{opacity:0;transform:translateY(32px) scale(0.97);}to{opacity:1;transform:none;}}
.login-hero{margin-bottom:28px;text-align:center;}
.login-eyebrow{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:10px;}
.login-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:900;color:var(--bright);line-height:1.2;margin-bottom:8px;}
.login-sub{font-size:13px;color:var(--dim);line-height:1.6;}

/* locked preview strip */
.locked-preview{display:flex;gap:8px;margin-bottom:28px;overflow:hidden;border-radius:12px;border:1px solid var(--border);}
.lp-item{flex:1;background:var(--panel);padding:10px 8px;text-align:center;position:relative;}
.lp-icon{font-size:20px;margin-bottom:4px;}
.lp-label{font-size:10px;color:var(--dim);}
.lp-lock{position:absolute;inset:0;background:rgba(10,15,26,0.7);display:flex;align-items:center;justify-content:center;font-size:14px;}

.tab-row{display:flex;background:var(--panel);border-radius:12px;padding:4px;margin-bottom:24px;gap:4px;}
.tab{flex:1;padding:9px;text-align:center;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;color:var(--dim);border:none;background:none;font-family:'Outfit',sans-serif;}
.tab.active{background:var(--card);color:var(--bright);box-shadow:0 2px 8px rgba(0,0,0,0.3);}

.field{margin-bottom:14px;}
.field-label{display:block;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--dim);margin-bottom:7px;}
.field-wrap{position:relative;display:flex;align-items:center;}
.fi{position:absolute;left:13px;font-size:14px;pointer-events:none;transition:color 0.2s;color:var(--mute);}
.f-input{width:100%;background:var(--panel);border:1.5px solid var(--border2);border-radius:10px;padding:11px 13px 11px 40px;font-family:'Outfit',sans-serif;font-size:13px;color:var(--bright);outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;}
.f-input::placeholder{color:var(--mute);}
.f-input:focus{border-color:var(--gold);background:var(--deep);box-shadow:0 0 0 3px rgba(245,200,66,0.1);}
.f-input:focus~.fi,.field-wrap:focus-within .fi{color:var(--gold);}
.f-err{font-size:11px;color:var(--coral);margin-top:5px;display:flex;align-items:center;gap:4px;}
.pw-eye{position:absolute;right:12px;background:none;border:none;cursor:pointer;color:var(--dim);font-size:14px;padding:0;}
.pw-eye:hover{color:var(--soft);}

.strength-bar{display:flex;gap:4px;margin-top:6px;}
.sb-seg{flex:1;height:3px;border-radius:2px;background:var(--border2);transition:background 0.3s;}
.sb-seg.weak{background:var(--coral);}
.sb-seg.med{background:var(--gold);}
.sb-seg.str{background:var(--teal);}

.btn-primary{width:100%;padding:13px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:10px;font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--ink);cursor:pointer;transition:transform 0.15s,box-shadow 0.2s,opacity 0.2s;box-shadow:0 4px 20px rgba(245,200,66,0.28);letter-spacing:0.3px;margin-top:4px;}
.btn-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(245,200,66,0.42);}
.btn-primary:disabled{opacity:0.5;cursor:not-allowed;}
.spinner{width:14px;height:14px;border:2px solid rgba(10,15,26,0.3);border-top-color:var(--ink);border-radius:50%;animation:spin 0.6s linear infinite;display:inline-block;vertical-align:middle;margin-right:6px;}
.divider{display:flex;align-items:center;gap:10px;margin:16px 0;}
.div-line{flex:1;height:1px;background:var(--border);}
.div-txt{font-size:10px;color:var(--mute);letter-spacing:1px;text-transform:uppercase;}
.social-row{display:flex;gap:8px;}
.btn-soc{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:10px;background:var(--panel);border:1px solid var(--border2);border-radius:10px;color:var(--soft);font-size:12px;font-family:'Outfit',sans-serif;cursor:pointer;transition:border-color 0.2s,background 0.2s;}
.btn-soc:hover{border-color:var(--mute);background:var(--border);}
.card-foot{margin-top:16px;text-align:center;font-size:12px;color:var(--dim);}
.link-btn{background:none;border:none;color:var(--gold);cursor:pointer;font-size:inherit;font-family:inherit;padding:0;}
.link-btn:hover{text-decoration:underline;}
.beta-note{margin-top:14px;background:rgba(245,200,66,0.05);border:1px solid rgba(245,200,66,0.15);border-radius:10px;padding:10px 14px;font-size:11px;color:rgba(245,200,66,0.7);line-height:1.5;text-align:center;}

/* ── OTP ── */
.otp-row{display:flex;gap:8px;margin-bottom:16px;}
.otp-box{flex:1;background:var(--panel);border:1.5px solid var(--border2);border-radius:10px;padding:12px 0;font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--gold);text-align:center;outline:none;transition:border-color 0.2s,box-shadow 0.2s;caret-color:var(--gold);}
.otp-box:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(245,200,66,0.1);background:var(--deep);}
.otp-box.filled{border-color:rgba(245,200,66,0.4);background:rgba(245,200,66,0.05);}
.resend-row{display:flex;justify-content:space-between;align-items:center;margin:10px 0 18px;}
.resend-txt{font-size:11px;color:var(--dim);}
.resend-btn{font-size:11px;color:var(--gold);background:none;border:none;cursor:pointer;font-family:'Outfit',sans-serif;font-weight:500;padding:0;}
.resend-btn:disabled{color:var(--mute);cursor:default;}
.back-btn{display:flex;align-items:center;gap:5px;background:none;border:none;color:var(--dim);font-size:12px;cursor:pointer;padding:0;margin-bottom:18px;font-family:'Outfit',sans-serif;transition:color 0.2s;}
.back-btn:hover{color:var(--gold);}

/* ── PLANNER PAGE ── */
.main{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:32px 20px 60px;}
.page-hero{margin-bottom:36px;}
.page-kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:8px;}
.page-title{font-family:'Playfair Display',serif;font-size:clamp(26px,4vw,42px);font-weight:900;color:var(--bright);line-height:1.1;margin-bottom:10px;}
.page-title em{color:var(--gold);font-style:normal;}
.page-sub{font-size:13px;color:var(--dim);max-width:520px;line-height:1.6;}
.two-col{display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start;}
@media(max-width:860px){.two-col{grid-template-columns:1fr;}}
.sec{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:24px;margin-bottom:20px;position:relative;overflow:hidden;}
.sec::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:0.35;}
.sec-head{display:flex;align-items:center;gap:10px;margin-bottom:20px;}
.sec-icon{width:36px;height:36px;background:linear-gradient(135deg,rgba(245,200,66,0.15),rgba(245,200,66,0.04));border:1px solid rgba(245,200,66,0.18);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}
.sec-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:var(--bright);}
.sec-sub{font-size:11px;color:var(--dim);margin-top:2px;}
.dest-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
@media(max-width:600px){.dest-grid{grid-template-columns:repeat(2,1fr);}}
.dest-card{border:2px solid var(--border);border-radius:12px;overflow:hidden;cursor:pointer;position:relative;transition:border-color 0.2s,transform 0.2s,box-shadow 0.2s;aspect-ratio:1.1;}
.dest-card:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(0,0,0,0.4);}
.dest-card.sel{border-color:var(--gold);box-shadow:0 0 0 2px rgba(245,200,66,0.2),0 12px 30px rgba(0,0,0,0.4);}
.dest-bg{position:absolute;inset:0;font-size:52px;display:flex;align-items:center;justify-content:center;background:var(--panel);}
.dest-overlay{position:absolute;inset:0;background:linear-gradient(0deg,rgba(10,15,26,0.92) 0%,transparent 60%);}
.dest-label{position:absolute;bottom:10px;left:0;right:0;text-align:center;}
.dest-name{font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:var(--bright);}
.dest-state{font-size:10px;color:var(--soft);margin-top:1px;}
.dest-check{position:absolute;top:8px;right:8px;width:20px;height:20px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--ink);font-weight:700;opacity:0;transition:opacity 0.2s;}
.dest-card.sel .dest-check{opacity:1;}
.pill-row{display:flex;flex-wrap:wrap;gap:10px;}
.pill{border:1.5px solid var(--border2);border-radius:30px;padding:9px 18px;font-size:13px;font-weight:500;color:var(--soft);cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:6px;white-space:nowrap;background:var(--panel);}
.pill:hover{border-color:var(--gold);color:var(--gold);}
.pill.sel{border-color:var(--gold);background:rgba(245,200,66,0.1);color:var(--gold);box-shadow:0 0 12px rgba(245,200,66,0.14);}
.pill.teal.sel,.pill.teal:hover{border-color:var(--teal);color:var(--teal);background:rgba(0,212,170,0.08);}
.stepper{display:flex;align-items:center;border:1.5px solid var(--border2);border-radius:12px;overflow:hidden;width:fit-content;}
.step-btn{width:40px;height:40px;background:var(--panel);border:none;color:var(--soft);font-size:20px;cursor:pointer;transition:background 0.15s,color 0.15s;display:flex;align-items:center;justify-content:center;}
.step-btn:hover{background:var(--border2);color:var(--bright);}
.step-val{width:52px;height:40px;background:var(--card);border:none;border-left:1px solid var(--border);border-right:1px solid var(--border);text-align:center;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--bright);outline:none;}
.toggle-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;}
.toggle-item{border:1.5px solid var(--border2);border-radius:12px;padding:12px 10px;text-align:center;cursor:pointer;transition:all 0.2s;background:var(--panel);position:relative;}
.toggle-item:hover{border-color:var(--gold);background:rgba(245,200,66,0.05);}
.toggle-item.sel{border-color:var(--gold);background:rgba(245,200,66,0.1);box-shadow:0 0 16px rgba(245,200,66,0.1);}
.toggle-item.teal:hover,.toggle-item.teal.sel{border-color:var(--teal);background:rgba(0,212,170,0.08);}
.toggle-item.coral:hover,.toggle-item.coral.sel{border-color:var(--coral);background:rgba(255,107,107,0.08);}
.toggle-item.sky:hover,.toggle-item.sky.sel{border-color:var(--sky);background:rgba(77,184,255,0.08);}
.toggle-item.lilac:hover,.toggle-item.lilac.sel{border-color:var(--lilac);background:rgba(180,140,255,0.08);}
.ti-icon{font-size:24px;margin-bottom:6px;}
.ti-name{font-size:12px;font-weight:600;color:var(--text);}
.ti-price{font-size:10px;color:var(--dim);margin-top:2px;}
.ti-check{position:absolute;top:6px;right:6px;width:16px;height:16px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:8px;color:var(--ink);font-weight:800;opacity:0;transition:opacity 0.15s;}
.toggle-item.sel .ti-check{opacity:1;}
.toggle-item.teal.sel .ti-check{background:var(--teal);}
.toggle-item.coral.sel .ti-check{background:var(--coral);}
.toggle-item.sky.sel .ti-check{background:var(--sky);}
.toggle-item.lilac.sel .ti-check{background:var(--lilac);}
.charger-row{display:flex;flex-direction:column;gap:10px;}
.charger-item{display:flex;align-items:center;justify-content:space-between;background:var(--panel);border:1px solid var(--border2);border-radius:12px;padding:12px 16px;}
.charger-info{display:flex;align-items:center;gap:10px;}
.charger-icon{font-size:20px;}
.charger-name{font-size:13px;font-weight:600;color:var(--bright);}
.charger-desc{font-size:10px;color:var(--dim);}
.budget-display{font-family:'Playfair Display',serif;font-size:30px;font-weight:900;color:var(--gold);margin-bottom:4px;}
.budget-display span{font-size:15px;color:var(--dim);font-family:'Outfit',sans-serif;font-weight:400;}
.range-input{width:100%;-webkit-appearance:none;height:4px;border-radius:2px;background:linear-gradient(90deg,var(--gold) var(--fill,50%),var(--border2) var(--fill,50%));outline:none;margin:12px 0 6px;display:block;}
.range-input::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--gold);cursor:pointer;box-shadow:0 0 10px rgba(245,200,66,0.4);}
.range-labels{display:flex;justify-content:space-between;font-size:11px;color:var(--dim);}
.mini-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:10px;margin-top:16px;}
.mini-label:first-child{margin-top:0;}
.info-chip{display:inline-flex;align-items:center;gap:5px;background:rgba(0,212,170,0.08);border:1px solid rgba(0,212,170,0.18);border-radius:20px;padding:4px 10px;font-size:10px;color:var(--teal);margin-top:8px;}
.summary{background:linear-gradient(145deg,#1a2438,#111826);border:1px solid var(--border2);border-radius:var(--r);padding:24px;position:sticky;top:84px;}
.summary::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--teal));border-radius:var(--r) var(--r) 0 0;}
.sum-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:900;color:var(--bright);margin-bottom:14px;}
.sum-row{display:flex;justify-content:space-between;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--border);}
.sum-row:last-of-type{border-bottom:none;}
.sum-key{font-size:10px;color:var(--dim);text-transform:uppercase;letter-spacing:1px;flex-shrink:0;margin-right:8px;}
.sum-val{font-size:12px;color:var(--text);font-weight:500;text-align:right;flex:1;}
.sum-total{margin-top:14px;background:rgba(245,200,66,0.07);border:1px solid rgba(245,200,66,0.18);border-radius:12px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;}
.sum-total-label{font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:1px;}
.sum-total-amount{font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:var(--gold);}
.sum-total-per{font-size:10px;color:var(--dim);margin-top:2px;text-align:right;}
.btn-book{width:100%;margin-top:14px;padding:14px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:12px;font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--ink);cursor:pointer;transition:transform 0.15s,box-shadow 0.2s;box-shadow:0 6px 24px rgba(245,200,66,0.28);letter-spacing:0.3px;}
.btn-book:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 30px rgba(245,200,66,0.44);}
.btn-book:disabled{opacity:0.45;cursor:not-allowed;}
.toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(120px);background:linear-gradient(135deg,var(--gold),var(--teal2));color:var(--ink);padding:13px 28px;border-radius:40px;font-weight:700;font-size:14px;z-index:999;transition:transform 0.4s cubic-bezier(0.22,1,0.36,1);box-shadow:0 8px 32px rgba(0,0,0,0.5);white-space:nowrap;}
.toast.show{transform:translateX(-50%) translateY(0);}
.reveal{opacity:0;transform:translateY(24px);transition:opacity 0.5s ease,transform 0.5s ease;}
.reveal.visible{opacity:1;transform:none;}
.play-qty-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.play-qty-label{font-size:12px;color:var(--soft);flex:1;}
`;

// ─── data ────────────────────────────────────────────────────────────────────
const DESTINATIONS = [
  { id:"mysore",  name:"Mysore",  state:"Karnataka", emoji:"🏰", base:2400 },
  { id:"munnar",  name:"Munnar",  state:"Kerala",    emoji:"🍃", base:3200 },
  { id:"delhi",   name:"Delhi",   state:"Delhi NCR", emoji:"🕌", base:2800 },
  { id:"gokarna", name:"Gokarna", state:"Karnataka", emoji:"🏖", base:2600 },
  { id:"ooty",    name:"Ooty",    state:"Tamil Nadu",emoji:"🚂", base:2200 },
];
const DURATIONS = [
  { id:"1d", label:"1 Day",  icon:"☀️", nights:0, mul:1 },
  { id:"2d", label:"2 Days", icon:"🌅", nights:1, mul:1.9 },
  { id:"1w", label:"1 Week", icon:"🗓", nights:6, mul:6.5 },
];
const STAYS   = [
  { id:"homestay", name:"Homestay",  icon:"🏡", color:"teal",  price:800  },
  { id:"tent",     name:"Tent Stay", icon:"⛺", color:"coral", price:600  },
  { id:"hotel",    name:"Hotel",     icon:"🏨", color:"sky",   price:1800 },
];
const FOODS   = [
  { id:"veg",    name:"Pure Veg",  icon:"🥦", color:"teal",  price:350 },
  { id:"nonveg", name:"Non-Veg",   icon:"🍗", color:"coral", price:480 },
  { id:"both",   name:"Veg + Non", icon:"🍽", color:"",      price:430 },
];
const DRINKS  = [
  { id:"soft", name:"Soft Drink", icon:"🥤", price:60  },
  { id:"beer", name:"Beer",       icon:"🍺", price:140 },
  { id:"wine", name:"Wine",       icon:"🍷", price:220 },
];
const SNACKS  = [
  { id:"vadapav", name:"Vada Pav", icon:"🍔", price:30 },
  { id:"samosa",  name:"Samosa",   icon:"🥟", price:25 },
  { id:"chips",   name:"Chips",    icon:"🥔", price:40 },
];
const PLAY    = [
  { id:"cricket",    name:"Cricket Kit",  icon:"🏏", price:200 },
  { id:"frisbee",    name:"Frisbee",      icon:"🥏", price:80  },
  { id:"football",   name:"Football",     icon:"⚽", price:120 },
  { id:"basketball", name:"Basketball",   icon:"🏀", price:150 },
];

const fmt = n => "₹" + n.toLocaleString("en-IN");
const strengthOf = pw => {
  let s=0;
  if(pw.length>=8) s++;
  if(/[A-Z]/.test(pw)&&/[a-z]/.test(pw)) s++;
  if(/\d/.test(pw)) s++;
  if(/[^a-zA-Z0-9]/.test(pw)) s++;
  return s;
};

// ─── sub-components ──────────────────────────────────────────────────────────
function Stepper({ value, min=0, max=20, onChange }) {
  return (
    <div className="stepper">
      <button className="step-btn" onClick={()=>onChange(Math.max(min,value-1))}>−</button>
      <input className="step-val" type="number" value={value} min={min} max={max}
        onChange={e=>onChange(Math.max(min,Math.min(max,+e.target.value||0)))} />
      <button className="step-btn" onClick={()=>onChange(Math.min(max,value+1))}>+</button>
    </div>
  );
}
function ToggleItem({ item, sel, onToggle, color="" }) {
  return (
    <div className={`toggle-item ${color} ${sel?"sel":""}`} onClick={onToggle}>
      <div className="ti-check">✓</div>
      <div className="ti-icon">{item.icon}</div>
      <div className="ti-name">{item.name}</div>
      {item.price!=null&&<div className="ti-price">+{fmt(item.price)}/person</div>}
    </div>
  );
}
function OTPInput({ value, onChange }) {
  const refs = [useRef(),useRef(),useRef(),useRef(),useRef(),useRef()];
  const digits = value.split("").concat(Array(6).fill("")).slice(0,6);
  const handle = (i,e)=>{
    const v=e.target.value.replace(/\D/g,"").slice(-1);
    const a=[...digits]; a[i]=v; onChange(a.join(""));
    if(v&&i<5) refs[i+1].current?.focus();
  };
  const handleKey=(i,e)=>{
    if(e.key==="Backspace"&&!digits[i]&&i>0){
      refs[i-1].current?.focus();
      const a=[...digits]; a[i-1]=""; onChange(a.join(""));
    }
  };
  const handlePaste=e=>{
    const t=e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    onChange(t.padEnd(6,"").slice(0,6));
    refs[Math.min(t.length,5)].current?.focus();
    e.preventDefault();
  };
  return (
    <div className="otp-row">
      {digits.map((d,i)=>(
        <input key={i} ref={refs[i]} className={`otp-box${d?" filled":""}`}
          type="text" inputMode="numeric" maxLength={1} value={d}
          onChange={e=>handle(i,e)} onKeyDown={e=>handleKey(i,e)} onPaste={handlePaste} />
      ))}
    </div>
  );
}

// ─── Beta Banner ─────────────────────────────────────────────────────────────
function BetaBanner({ onClose }) {
  return (
    <div className="beta-banner">
      <span className="beta-pill">BETA</span>
      <span className="beta-msg">
        🚧 <strong>Trial Beta Version</strong> — OrbitEdge is in early access. Features may change and bookings are simulated. <strong>Free to explore!</strong>
      </span>
      <button className="beta-close" onClick={onClose} title="Dismiss">×</button>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="logo">
      <div className="logo-orbit">
        <div className="lo-r lo-r1"/><div className="lo-r lo-r2"/><div className="lo-dot"/>
      </div>
      <div>
        <div className="logo-name">Orbit<span>Edge</span></div>
        <div className="logo-tag">Trip Planner</div>
      </div>
    </div>
  );
}

// ─── Login / Signup Flow ──────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [tab, setTab]         = useState("login"); // login | signup
  const [step, setStep]       = useState(0);       // 0=form 1=otp
  const [email, setEmail]     = useState("");
  const [password, setPassword]= useState("");
  const [name, setName]       = useState("");
  const [otp, setOtp]         = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [countdown, setCountdown]=useState(0);

  useEffect(()=>{ if(countdown<=0)return; const t=setTimeout(()=>setCountdown(c=>c-1),1000); return()=>clearTimeout(t); },[countdown]);

  const fakeLoad=(cb,ms=1300)=>{ setLoading(true); setTimeout(()=>{ setLoading(false); cb(); },ms); };

  const submitForm=()=>{
    const e={};
    if(!email.includes("@")) e.email="Enter a valid email address";
    if(password.length<8) e.password="Minimum 8 characters required";
    if(tab==="signup"&&!name.trim()) e.name="Full name is required";
    if(Object.keys(e).length){ setErrors(e); return; }
    setErrors({});
    fakeLoad(()=>{ setStep(1); setCountdown(30); });
  };

  const submitOtp=()=>{
    if(otp.length<6){ setErrors({otp:"Enter the complete 6-digit code"}); return; }
    setErrors({});
    fakeLoad(()=>onLogin({ name: name||email.split("@")[0], email }));
  };

  const sw=strengthOf(password);
  const swCls=sw<=1?"weak":sw===2?"med":"str";

  return (
    <div className="login-page">
      <div className="login-wrap">
        <div className="login-card">
          {step===0 ? (
            <>
              <div className="login-hero">
                <div className="login-eyebrow">✈ OrbitEdge Trip Planner</div>
                <div className="login-title">{tab==="login"?"Welcome Back, Explorer":"Start Your Journey"}</div>
                <div className="login-sub">{tab==="login"?"Sign in to access all trip planning options & personalised offers.":"Create your account to unlock destinations, stays, food & more."}</div>
              </div>

              {/* locked preview */}
              <div className="locked-preview">
                {["🏰 Mysore","🍃 Munnar","🏖 Gokarna","⛺ Tent","🍗 Food","🏏 Play"].map((l,i)=>(
                  <div key={i} className="lp-item">
                    <div className="lp-icon">{l.split(" ")[0]}</div>
                    <div className="lp-label">{l.split(" ")[1]}</div>
                    <div className="lp-lock">🔒</div>
                  </div>
                ))}
              </div>

              <div className="tab-row">
                <button className={`tab ${tab==="login"?"active":""}`} onClick={()=>{ setTab("login"); setErrors({}); }}>Sign In</button>
                <button className={`tab ${tab==="signup"?"active":""}`} onClick={()=>{ setTab("signup"); setErrors({}); }}>Create Account</button>
              </div>

              {tab==="signup"&&(
                <div className="field">
                  <label className="field-label">Full Name</label>
                  <div className="field-wrap">
                    <span className="fi">👤</span>
                    <input className="f-input" placeholder="Rahul Sharma" value={name} onChange={e=>setName(e.target.value)} />
                  </div>
                  {errors.name&&<div className="f-err">⚠ {errors.name}</div>}
                </div>
              )}

              <div className="field">
                <label className="field-label">Email Address</label>
                <div className="field-wrap">
                  <span className="fi">✉️</span>
                  <input className="f-input" placeholder="you@example.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
                </div>
                {errors.email&&<div className="f-err">⚠ {errors.email}</div>}
              </div>

              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <span className="fi">🔒</span>
                  <input className="f-input" placeholder="Min. 8 characters" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} />
                  <button className="pw-eye" onClick={()=>setShowPw(v=>!v)}>{showPw?"🙈":"👁"}</button>
                </div>
                {errors.password&&<div className="f-err">⚠ {errors.password}</div>}
                {tab==="signup"&&password&&(
                  <>
                    <div className="strength-bar">{[1,2,3,4].map(i=><div key={i} className={`sb-seg${i<=sw?" "+swCls:""}`}/>)}</div>
                    <div style={{fontSize:10,color:sw<=1?"var(--coral)":sw===2?"var(--gold)":"var(--teal)",marginTop:4}}>
                      {["","Weak","Fair","Good","Strong"][sw]} password
                    </div>
                  </>
                )}
              </div>

              {tab==="login"&&(
                <div style={{textAlign:"right",marginBottom:14,marginTop:-6}}>
                  <button className="link-btn" style={{fontSize:11}}>Forgot password?</button>
                </div>
              )}

              <button className="btn-primary" onClick={submitForm} disabled={loading}>
                {loading?<><span className="spinner"/>{tab==="login"?"Signing in...":"Creating account..."}</>:tab==="login"?"Sign In & Plan Trip →":"Continue →"}
              </button>

              <div className="divider"><div className="div-line"/><span className="div-txt">or</span><div className="div-line"/></div>
              <div className="social-row">
                <button className="btn-soc">🌐 Google</button>
                <button className="btn-soc">📱 Apple</button>
              </div>
              <div className="card-foot">
                {tab==="login"
                  ?<>New here? <button className="link-btn" onClick={()=>{setTab("signup");setErrors({});}}>Create account</button></>
                  :<>Already have one? <button className="link-btn" onClick={()=>{setTab("login");setErrors({});}}>Sign in</button></>}
              </div>
              <div className="beta-note">
                🧪 <strong>Trial Beta</strong> — This is a free preview. No real payments are processed.
              </div>
            </>
          ) : (
            <>
              <button className="back-btn" onClick={()=>{ setStep(0); setOtp(""); setErrors({}); }}>← Back</button>
              <div className="login-hero" style={{textAlign:"left"}}>
                <div className="login-eyebrow">Email Verification</div>
                <div className="login-title" style={{fontSize:22}}>Check your inbox</div>
                <div className="login-sub">We sent a 6-digit code to <strong style={{color:"var(--bright)"}}>{email}</strong>. Expires in 10 min.</div>
              </div>
              <OTPInput value={otp} onChange={setOtp} />
              {errors.otp&&<div className="f-err" style={{marginBottom:10}}>⚠ {errors.otp}</div>}
              <div className="resend-row">
                <span className="resend-txt">{countdown>0?`Resend in ${countdown}s`:"Didn't get it?"}</span>
                <button className="resend-btn" disabled={countdown>0} onClick={()=>{setOtp("");setCountdown(30);}}>Resend Code</button>
              </div>
              <button className="btn-primary" onClick={submitOtp} disabled={loading||otp.length<6}>
                {loading?<><span className="spinner"/>Verifying...</>:"Verify & Enter Planner →"}
              </button>
              <div className="beta-note" style={{marginTop:14}}>
                🔐 Verification is simulated in this Beta. Use any 6-digit code.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Planner ──────────────────────────────────────────────────────────────────
function Planner({ user }) {
  const [dest,setDest]     = useState(null);
  const [duration,setDur]  = useState(null);
  const [persons,setPersons]= useState(2);
  const [babies,setBabies] = useState(0);
  const [budget,setBudget] = useState(15000);
  const [stay,setStay]     = useState(null);
  const [food,setFood]     = useState(null);
  const [drinks,setDrinks] = useState([]);
  const [snacks,setSnacks] = useState([]);
  const [play,setPlay]     = useState([]);
  const [chargers,setChargers]=useState({android:0,iphone:0,laptop:0});
  const [toast,setToast]   = useState(false);
  const revRefs = useRef([]);

  const tog=(arr,set,id)=>set(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("visible"); }),{threshold:0.1});
    revRefs.current.forEach(el=>el&&obs.observe(el));
    return()=>obs.disconnect();
  },[]);
  const ar=i=>el=>{revRefs.current[i]=el;};

  const destObj  = DESTINATIONS.find(d=>d.id===dest);
  const durObj   = DURATIONS.find(d=>d.id===duration);
  const stayObj  = STAYS.find(s=>s.id===stay);
  const foodObj  = FOODS.find(f=>f.id===food);
  const drinkCost= drinks.reduce((s,id)=>s+(DRINKS.find(d=>d.id===id)?.price||0),0);
  const snackCost= snacks.reduce((s,id)=>s+(SNACKS.find(d=>d.id===id)?.price||0),0);
  const playCost = play.reduce((s,id)=>s+(PLAY.find(d=>d.id===id)?.price||0),0);
  const chCost   = (chargers.android+chargers.iphone+chargers.laptop)*50;
  const perPerson= (destObj?.base||0)*(durObj?.mul||1)+(stayObj?.price||0)*(durObj?.nights||0)+(foodObj?.price||0)+drinkCost+snackCost+playCost+chCost;
  const total    = perPerson*persons + babies*500;
  const budgetPct= Math.min(100,(budget/80000)*100);

  const book=()=>{ setToast(true); setTimeout(()=>setToast(false),3200); };

  return (
    <main className="main">
      <div className="page-hero" ref={ar(0)}>
        <div className="page-kicker">✈ Logged in as {user.name}</div>
        <div className="page-title">Craft Your <em>Perfect</em><br/>Indian Escape</div>
        <div className="page-sub">Customize every detail of your trip — destinations, stay, food, gear & more. Live pricing updates as you choose.</div>
      </div>

      <div className="two-col">
        <div>
          {/* Destination */}
          <div className="sec reveal" ref={ar(1)}>
            <div className="sec-head"><div className="sec-icon">📍</div><div><div className="sec-title">Choose Destination</div><div className="sec-sub">Where do you want to go?</div></div></div>
            <div className="dest-grid">
              {DESTINATIONS.map(d=>(
                <div key={d.id} className={`dest-card ${dest===d.id?"sel":""}`} onClick={()=>setDest(d.id)}>
                  <div className="dest-bg">{d.emoji}</div>
                  <div className="dest-overlay"/>
                  <div className="dest-check">✓</div>
                  <div className="dest-label"><div className="dest-name">{d.name}</div><div className="dest-state">{d.state}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="sec reveal" ref={ar(2)}>
            <div className="sec-head"><div className="sec-icon">⏱</div><div><div className="sec-title">Trip Duration</div><div className="sec-sub">How long are you travelling?</div></div></div>
            <div className="pill-row">
              {DURATIONS.map(d=>(
                <div key={d.id} className={`pill ${duration===d.id?"sel":""}`} onClick={()=>setDur(d.id)}>
                  <span>{d.icon}</span> {d.label}
                </div>
              ))}
            </div>
          </div>

          {/* Group size */}
          <div className="sec reveal" ref={ar(3)}>
            <div className="sec-head"><div className="sec-icon">👥</div><div><div className="sec-title">Group Size</div><div className="sec-sub">Adults and infants</div></div></div>
            <div style={{display:"flex",gap:32,flexWrap:"wrap"}}>
              <div>
                <div className="mini-label">Adults / Persons</div>
                <Stepper value={persons} min={1} max={30} onChange={setPersons}/>
                <div className="info-chip">👤 {persons} traveller{persons!==1?"s":""}</div>
              </div>
              <div>
                <div className="mini-label">Baby Seats (Infants)</div>
                <Stepper value={babies} min={0} max={10} onChange={setBabies}/>
                <div className="info-chip">🍼 {babies} seat{babies!==1?"s":""} · +₹500 each</div>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="sec reveal" ref={ar(4)}>
            <div className="sec-head"><div className="sec-icon">💰</div><div><div className="sec-title">Your Budget</div><div className="sec-sub">Drag to set total trip budget</div></div></div>
            <div className="budget-display">{fmt(budget)} <span>total budget</span></div>
            <input className="range-input" type="range" min={2000} max={80000} step={500} value={budget} style={{"--fill":budgetPct+"%"}} onChange={e=>setBudget(+e.target.value)}/>
            <div className="range-labels"><span>₹2,000</span><span>₹80,000</span></div>
            {total>0&&budget<total&&<div style={{marginTop:10,fontSize:12,color:"var(--coral)",display:"flex",alignItems:"center",gap:5}}>⚠ Estimated {fmt(total)} exceeds budget</div>}
          </div>

          {/* Stay */}
          <div className="sec reveal" ref={ar(5)}>
            <div className="sec-head"><div className="sec-icon">🏠</div><div><div className="sec-title">Stay Type</div><div className="sec-sub">Per night per person</div></div></div>
            <div className="toggle-grid">{STAYS.map(s=><ToggleItem key={s.id} item={s} sel={stay===s.id} color={s.color} onToggle={()=>setStay(stay===s.id?null:s.id)}/>)}</div>
          </div>

          {/* Food */}
          <div className="sec reveal" ref={ar(6)}>
            <div className="sec-head"><div className="sec-icon">🍽️</div><div><div className="sec-title">Food Preference</div><div className="sec-sub">Daily meal plan per person</div></div></div>
            <div className="toggle-grid">{FOODS.map(f=><ToggleItem key={f.id} item={f} sel={food===f.id} color={f.color} onToggle={()=>setFood(food===f.id?null:f.id)}/>)}</div>
          </div>

          {/* Drinks */}
          <div className="sec reveal" ref={ar(7)}>
            <div className="sec-head"><div className="sec-icon">🍹</div><div><div className="sec-title">Drinks</div><div className="sec-sub">Beverages per person/day</div></div></div>
            <div className="toggle-grid">{DRINKS.map(d=><ToggleItem key={d.id} item={d} sel={drinks.includes(d.id)} color="sky" onToggle={()=>tog(drinks,setDrinks,d.id)}/>)}</div>
          </div>

          {/* Snacks */}
          <div className="sec reveal" ref={ar(8)}>
            <div className="sec-head"><div className="sec-icon">🥪</div><div><div className="sec-title">Snacks</div><div className="sec-sub">Street food per person/day</div></div></div>
            <div className="toggle-grid">{SNACKS.map(s=><ToggleItem key={s.id} item={s} sel={snacks.includes(s.id)} color="coral" onToggle={()=>tog(snacks,setSnacks,s.id)}/>)}</div>
          </div>

          {/* Chargers */}
          <div className="sec reveal" ref={ar(9)}>
            <div className="sec-head"><div className="sec-icon">🔌</div><div><div className="sec-title">Charger Slots</div><div className="sec-sub">Book charging stations — ₹50/device/day</div></div></div>
            <div className="charger-row">
              {[{key:"android",icon:"🤖",name:"Android / USB-C",desc:"Type-C fast charger"},{key:"iphone",icon:"🍎",name:"iPhone / Lightning",desc:"MFi certified cable"},{key:"laptop",icon:"💻",name:"Laptop Slot",desc:"Universal adapter 65W"}].map(c=>(
                <div key={c.key} className="charger-item">
                  <div className="charger-info"><div className="charger-icon">{c.icon}</div><div><div className="charger-name">{c.name}</div><div className="charger-desc">{c.desc}</div></div></div>
                  <Stepper value={chargers[c.key]} min={0} max={persons} onChange={v=>setChargers(p=>({...p,[c.key]:v}))}/>
                </div>
              ))}
            </div>
          </div>

          {/* Play */}
          <div className="sec reveal" ref={ar(10)}>
            <div className="sec-head"><div className="sec-icon">🎮</div><div><div className="sec-title">Rent Play Items</div><div className="sec-sub">Sports gear for the group (per day)</div></div></div>
            <div className="toggle-grid">{PLAY.map(p=><ToggleItem key={p.id} item={p} sel={play.includes(p.id)} color="lilac" onToggle={()=>tog(play,setPlay,p.id)}/>)}</div>
            {play.length>0&&(
              <div style={{marginTop:14}}>
                <div className="mini-label">Selected Gear</div>
                {play.map(id=>{const p=PLAY.find(x=>x.id===id);return(<div key={id} className="play-qty-row"><span className="play-qty-label">{p.icon} {p.name}</span><span style={{fontSize:11,color:"var(--dim)"}}>{fmt(p.price)}/day</span></div>);})}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="summary">
            <div className="sum-title">📋 Trip Summary</div>
            {[
              ["Destination", destObj?`${destObj.emoji} ${destObj.name}`:"—"],
              ["Duration",    durObj?durObj.label:"—"],
              ["Persons",     `${persons} adult${persons!==1?"s":""}${babies>0?` + ${babies} baby`:""}` ],
              ["Stay",        stayObj?stayObj.name:"—"],
              ["Food",        food?FOODS.find(f=>f.id===food)?.name:"—"],
              ["Drinks",      drinks.length?drinks.map(id=>DRINKS.find(d=>d.id===id)?.name).join(", "):"None"],
              ["Snacks",      snacks.length?snacks.map(id=>SNACKS.find(s=>s.id===id)?.name).join(", "):"None"],
              ["Chargers",    [chargers.android>0&&`Android×${chargers.android}`,chargers.iphone>0&&`iPhone×${chargers.iphone}`,chargers.laptop>0&&`Laptop×${chargers.laptop}`].filter(Boolean).join(", ")||"None"],
              ["Play Gear",   play.length?play.map(id=>PLAY.find(p=>p.id===id)?.name).join(", "):"None"],
              ["Budget",      fmt(budget)],
            ].map(([k,v])=>(
              <div key={k} className="sum-row">
                <span className="sum-key">{k}</span>
                <span className="sum-val" style={k==="Budget"?{color:"var(--gold)"}:{}}>{v}</span>
              </div>
            ))}
            {total>0&&(
              <div className="sum-total">
                <div><div className="sum-total-label">Estimated Cost</div><div style={{fontSize:10,color:"var(--dim)",marginTop:4}}>All inclusions</div></div>
                <div><div className="sum-total-amount">{fmt(total)}</div><div className="sum-total-per">{fmt(Math.round(total/persons))} /person</div></div>
              </div>
            )}
            <button className="btn-book" onClick={book} disabled={!dest||!duration}>
              {!dest||!duration?"Select destination & duration":"🚀 Book This Trip"}
            </button>
            {(!dest||!duration)&&<div style={{textAlign:"center",fontSize:11,color:"var(--dim)",marginTop:8}}>Pick a destination and duration first</div>}
            <div style={{marginTop:12,textAlign:"center",fontSize:10,color:"var(--dim)",lineHeight:1.6}}>
              🧪 <span style={{color:"rgba(245,200,66,0.6)"}}>Beta trial</span> — no real charges apply
            </div>
          </div>
        </div>
      </div>

      <div className={`toast ${toast?"show":""}`}>🎉 Trip booked! Check your email for confirmation.</div>
    </main>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]         = useState(null);
  const [showBeta, setShowBeta] = useState(true);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="bg-grid"/>
        <div className="bg-blob bb1"/><div className="bg-blob bb2"/><div className="bg-blob bb3"/>

        {showBeta && <BetaBanner onClose={()=>setShowBeta(false)}/>}

        <header className="header">
          <div className="header-inner">
            <Logo/>
            <div className="header-right">
              {user ? (
                <>
                  <div className="user-chip">
                    <div className="user-av">{user.name[0].toUpperCase()}</div>
                    <span className="user-name">{user.name}</span>
                  </div>
                  <button className="btn-logout" onClick={()=>setUser(null)}>Sign Out</button>
                </>
              ) : (
                <button className="btn-hdr-login" onClick={()=>{}}>Sign In</button>
              )}
            </div>
          </div>
        </header>

        {user ? <Planner user={user}/> : <LoginPage onLogin={setUser}/>}
      </div>
    </>
  );
}
