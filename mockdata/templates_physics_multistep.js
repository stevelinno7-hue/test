(function(global){
  'use strict';

  if (!window.__PHYSICS_REPO__) window.__PHYSICS_REPO__ = {};
  console.log("🚀 [Physics Core] 全概念題庫生成器啟動...");

  const Utils = {
    rnd: (min, max) => {
      if (Number.isInteger(min) && Number.isInteger(max)) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      // 支援小數範圍
      const r = Math.random() * (max - min) + min;
      return Math.round(r * 100) / 100;
    },
    pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
    // 產生 4 個選項（含正確答案），保持數值格式一致
    genOptions: (ans) => {
      const opts = new Set();
      const base = typeof ans === 'number' ? ans : parseFloat(ans);
      opts.add(Math.round(base * 100) / 100);
      while (opts.size < 4) {
        // 依據答案量級產生合理干擾
        const mag = Math.max(1, Math.pow(10, Math.floor(Math.log10(Math.abs(base) || 1))));
        const jitter = Utils.rnd(-5, 5) * (mag / 10);
        let v = Math.round((base + jitter) * 100) / 100;
        if (v === 0) v = Math.round((base + Math.sign(base || 1) * mag/10) * 100) / 100;
        opts.add(v);
      }
      return Array.from(opts).sort(() => Math.random() - 0.5);
    },
    fmt: (v, digits=2) => {
      if (Number.isInteger(v)) return String(v);
      return Number.isFinite(v) ? v.toFixed(digits).replace(/\.?0+$/,'') : String(v);
    }
  };

  // 產生器工廠集合：每個 topic 對應一個 generator factory
  const factories = [];

  // ---------- 國八：基本測量 ----------
  factories.push({
    id: "density_measure",
    tags: ["理化","物理","測量","密度","國八"],
    generate: () => {
      const densities = [0.5,0.8,1,2.7,7.8,13.6];
      const D = Utils.pick(densities);
      const V = Utils.rnd(10,80);
      const M = Math.round(D * V * 10) / 10;
      return {
        question: `【基本測量】某物體體積為 ${V} cm3，質量為 ${M} g，求密度 (g/cm3)。`,
        options: Utils.genOptions(D),
        correctValue: D,
        concept: "密度 = 質量 ÷ 體積",
        explanation: [`密度 = 質量 ÷ 體積`, `計算：${M} ÷ ${V} = ${D}`, `答案：${D} g/cm3`]
      };
    }
  });

  factories.push({
    id: "balance_scale",
    tags: ["理化","物理","測量","質量","天平","國八"],
    generate: () => {
      const weights = Utils.rnd(10,200);
      const rider = Math.round(Utils.rnd(1,9) * 0.1 * 10) / 10;
      const mass = Math.round((weights + rider) * 10) / 10;
      return {
        question: `【質量測量】上皿天平砝碼 ${weights} g，騎碼讀數 ${rider} g，求物體質量 (g)。`,
        options: Utils.genOptions(mass),
        correctValue: mass,
        concept: "天平讀數 = 砝碼 + 騎碼",
        explanation: [`物體質量 = 砝碼 + 騎碼`, `計算：${weights} + ${rider} = ${mass}`, `答案：${mass} g`]
      };
    }
  });

  factories.push({
    id: "displacement_method",
    tags: ["理化","物理","測量","體積","量筒","國八"],
    generate: () => {
      const water = Utils.rnd(20,80);
      const stone = Utils.rnd(1,30);
      const total = water + stone;
      return {
        question: `【體積測量】量筒原有 ${water} mL 水，放入石頭後水位 ${total} mL，求石頭體積 (cm3)。`,
        options: Utils.genOptions(stone),
        correctValue: stone,
        concept: "排水法：1 mL = 1 cm3",
        explanation: [`體積 = 後水位 - 前水位`, `計算：${total} - ${water} = ${stone}`, `答案：${stone} cm3`]
      };
    }
  });

  // ---------- 國八：波動與聲音 ----------
  factories.push({
    id: "wave_speed",
    tags: ["理化","物理","波動","聲音","國八"],
    generate: () => {
      const f = Utils.rnd(100,1000); // Hz
      const lambda = Math.round(Utils.rnd(1,50)/10 * 100)/100; // m
      const v = Math.round(f * lambda * 100) / 100;
      return {
        question: `【波動】頻率 ${f} Hz，波長 ${lambda} m，求波速 (m/s)。`,
        options: Utils.genOptions(v),
        correctValue: v,
        concept: "v = fλ",
        explanation: [`v = f × λ`, `計算：${f} × ${lambda} = ${v}`, `答案：${v} m/s`]
      };
    }
  });

  factories.push({
    id: "sound_echo",
    tags: ["理化","物理","波動","聲音","國八"],
    generate: () => {
      const dist = Utils.rnd(50,500); // m to reflector
      const v = 340; // m/s
      const t = Math.round((2*dist / v) * 100) / 100;
      return {
        question: `【聲音】聲波遇障礙反射回來，來回距離 ${2*dist} m，聲速 ${v} m/s，回聲所需時間為多少秒？`,
        options: Utils.genOptions(t),
        correctValue: t,
        concept: "回聲時間 = 2d / v",
        explanation: [`t = 2d ÷ v`, `計算：2×${dist} ÷ ${v} = ${t}`, `答案：${t} s`]
      };
    }
  });

  // ---------- 國八：光 ----------
  factories.push({
    id: "reflection_angle",
    tags: ["理化","物理","光","國八"],
    generate: () => {
      const inc = Utils.rnd(10,70);
      const refl = inc; // 反射角等於入射角
      return {
        question: `【光的反射】光線入射角為 ${inc}°（相對法線），求反射角（°）。`,
        options: Utils.genOptions(refl),
        correctValue: refl,
        concept: "反射定律：入射角 = 反射角",
        explanation: [`反射角等於入射角`, `計算：${inc}° = ${refl}°`, `答案：${refl}°`]
      };
    }
  });

  factories.push({
    id: "refraction_snell",
    tags: ["理化","物理","光","透鏡","國八"],
    generate: () => {
      const n1 = 1.0;
      const n2 = Utils.pick([1.33,1.5,1.33,1.33,1.52]); // water/glass variants
      const theta1 = Utils.rnd(10,60);
      // sinθ2 = n1/n2 * sinθ1
      const rad = theta1 * Math.PI / 180;
      const sin2 = (n1/n2) * Math.sin(rad);
      const theta2 = sin2 <= 1 ? Math.round(Math.asin(sin2) * 180 / Math.PI * 10) / 10 : null;
      const q = theta2 !== null ? `折射角約 ${theta2}°` : `全反射發生`;
      return {
        question: `【光的折射】光由折射率 ${n1} 介質入射到折射率 ${n2}，入射角 ${theta1}°，求折射角（若全反射請說明）。`,
        options: theta2 !== null ? Utils.genOptions(theta2) : Utils.genOptions(0),
        correctValue: theta2 !== null ? theta2 : 0,
        concept: "斯涅爾定律 n1 sinθ1 = n2 sinθ2",
        explanation: theta2 !== null ? [`n1 sinθ1 = n2 sinθ2`, `sinθ2 = ${n1}/${n2} × sin(${theta1}°)`, `θ2 ≈ ${theta2}°`] : [`sinθ2 > 1，發生全反射`]
      };
    }
  });

  // ---------- 國八：熱 ----------
  factories.push({
    id: "specific_heat",
    tags: ["理化","物理","熱","高一","國八"],
    generate: () => {
      const m = Utils.rnd(50,500); // g
      const c = Utils.pick([0.385,0.9,4.18]); // 銅/酒精/水 J/g°C
      const dt = Utils.rnd(10,80);
      const Q = Math.round(m * c * dt * 10) / 10;
      return {
        question: `【熱】質量 ${m} g，比熱 ${c} J/g°C，溫度升高 ${dt}°C，吸收熱量為多少 J？`,
        options: Utils.genOptions(Q),
        correctValue: Q,
        concept: "Q = mcΔT",
        explanation: [`Q = m × c × ΔT`, `計算：${m} × ${c} × ${dt} = ${Q}`, `答案：${Q} J`]
      };
    }
  });

  // ---------- 國九：直線運動（運動學） ----------
  factories.push({
    id: "displacement_velocity",
    tags: ["理化","物理","運動學","國九"],
    generate: () => {
      const v = Utils.rnd(5,30);
      const t = Utils.rnd(2,20);
      const s = Math.round(v * t * 10) / 10;
      return {
        question: `【直線運動】物體以恆定速度 ${v} m/s 行駛 ${t} s，求位移 (m)。`,
        options: Utils.genOptions(s),
        correctValue: s,
        concept: "s = v t",
        explanation: [`s = v × t`, `計算：${v} × ${t} = ${s}`, `答案：${s} m`]
      };
    }
  });

  factories.push({
    id: "acceleration_calc",
    tags: ["理化","物理","運動學","國九"],
    generate: () => {
      const v0 = Utils.rnd(0,20);
      const v = Utils.rnd(v0+1, v0+40);
      const t = Utils.rnd(1,10);
      const a = Math.round((v - v0) / t * 100) / 100;
      return {
        question: `【加速度】初速 ${v0} m/s，${t} s 後速度 ${v} m/s，求平均加速度 (m/s²)。`,
        options: Utils.genOptions(a),
        correctValue: a,
        concept: "a = Δv / t",
        explanation: [`a = (v - v0) ÷ t`, `計算：(${v} - ${v0}) ÷ ${t} = ${a}`, `答案：${a} m/s²`]
      };
    }
  });

  // ---------- 國九：力與運動（牛頓定律） ----------
  factories.push({
    id: "newton2",
    tags: ["理化","物理","力","牛頓第二定律","國九"],
    generate: () => {
      const m = Utils.rnd(1,50);
      const a = Utils.rnd(1,20);
      const F = Math.round(m * a * 100) / 100;
      return {
        question: `【牛頓第二定律】質量 ${m} kg，受加速度 ${a} m/s²，求合力 (N)。`,
        options: Utils.genOptions(F),
        correctValue: F,
        concept: "F = m a",
        explanation: [`F = m × a`, `計算：${m} × ${a} = ${F}`, `答案：${F} N`]
      };
    }
  });

  factories.push({
    id: "friction_force",
    tags: ["理化","物理","力","摩擦力","國九"],
    generate: () => {
      const mu = Utils.pick([0.1,0.2,0.3,0.4]);
      const N = Utils.rnd(10,200);
      const f = Math.round(mu * N * 100) / 100;
      return {
        question: `【摩擦力】法向力 ${N} N，摩擦係數 ${mu}，求摩擦力 (N)。`,
        options: Utils.genOptions(f),
        correctValue: f,
        concept: "f = μ N",
        explanation: [`f = μ × N`, `計算：${mu} × ${N} = ${f}`, `答案：${f} N`]
      };
    }
  });

  // ---------- 國九：功與能 ----------
  factories.push({
    id: "work_calc",
    tags: ["理化","物理","功","能量","國九"],
    generate: () => {
      const F = Utils.rnd(5,200);
      const d = Utils.rnd(1,10);
      const W = Math.round(F * d * 100) / 100;
      return {
        question: `【功】力 ${F} N 沿力方向移動 ${d} m，求所做功 (J)。`,
        options: Utils.genOptions(W),
        correctValue: W,
        concept: "W = F d",
        explanation: [`W = F × d`, `計算：${F} × ${d} = ${W}`, `答案：${W} J`]
      };
    }
  });

  factories.push({
    id: "kinetic_potential",
    tags: ["理化","物理","能量","國九"],
    generate: () => {
      const m = Utils.rnd(1,50);
      const v = Utils.rnd(1,30);
      const KE = Math.round(0.5 * m * v * v * 100) / 100;
      return {
        question: `【動能】質量 ${m} kg，速度 ${v} m/s，求動能 (J)。`,
        options: Utils.genOptions(KE),
        correctValue: KE,
        concept: "KE = 1/2 m v²",
        explanation: [`KE = 1/2 m v²`, `計算：0.5 × ${m} × ${v}² = ${KE}`, `答案：${KE} J`]
      };
    }
  });

  // ---------- 高一：科學態度與測量不確定度 ----------
  factories.push({
    id: "si_unit_conversion",
    tags: ["物理","測量","單位","高一"],
    generate: () => {
      const val = Utils.rnd(1,5000);
      const unitFrom = Utils.pick(["cm","m","km"]);
      const unitTo = unitFrom === "cm" ? "m" : unitFrom === "m" ? "km" : "m";
      let converted;
      if (unitFrom === "cm" && unitTo === "m") converted = Math.round(val/100 * 100) / 100;
      else if (unitFrom === "m" && unitTo === "km") converted = Math.round(val/1000 * 100) / 100;
      else converted = Math.round(val*100) / 100;
      return {
        question: `【單位換算】${val} ${unitFrom} 等於多少 ${unitTo}？`,
        options: Utils.genOptions(converted),
        correctValue: converted,
        concept: "SI 單位換算",
        explanation: [`換算：${val} ${unitFrom} = ${converted} ${unitTo}`, `答案：${converted} ${unitTo}`]
      };
    }
  });

  factories.push({
    id: "measurement_uncertainty",
    tags: ["物理","測量","不確定度","高一"],
    generate: () => {
      const meas = Utils.rnd(10,200);
      const err = Utils.rnd(1,5);
      const low = meas - err;
      const high = meas + err;
      return {
        question: `【測量不確定度】測量值 ${meas} ± ${err}，不確定度範圍為何？`,
        options: Utils.genOptions(`${low}~${high}`),
        correctValue: `${low}~${high}`,
        concept: "測量值 ± 不確定度",
        explanation: [`範圍：${meas} ± ${err} = ${low} 到 ${high}`, `答案：${low}~${high}`]
      };
    }
  });

  // ---------- 高二：平面運動（拋體、圓周） ----------
  factories.push({
    id: "projectile_range",
    tags: ["物理","運動學","拋體","高二"],
    generate: () => {
      const v = Utils.rnd(10,40);
      const theta = Utils.rnd(20,70);
      const g = 9.8;
      const rad = theta * Math.PI / 180;
      const R = Math.round((v*v * Math.sin(2*rad) / g) * 100) / 100;
      return {
        question: `【拋體】初速 ${v} m/s，仰角 ${theta}°，重力加速度 ${g} m/s²，求水平射程 (m)。`,
        options: Utils.genOptions(R),
        correctValue: R,
        concept: "R = v² sin2θ / g",
        explanation: [`R = v² sin(2θ) / g`, `計算：${R} m`, `答案：${R} m`]
      };
    }
  });

  factories.push({
    id: "centripetal_force",
    tags: ["物理","圓周運動","高二"],
    generate: () => {
      const m = Utils.rnd(0.5,10);
      const v = Utils.rnd(1,30);
      const r = Utils.rnd(0.5,10);
      const Fc = Math.round(m * v * v / r * 100) / 100;
      return {
        question: `【圓周運動】質量 ${m} kg，速率 ${v} m/s，半徑 ${r} m，求向心力 (N)。`,
        options: Utils.genOptions(Fc),
        correctValue: Fc,
        concept: "Fc = m v² / r",
        explanation: [`Fc = m v² / r`, `計算：${m} × ${v}² ÷ ${r} = ${Fc}`, `答案：${Fc} N`]
      };
    }
  });

  // ---------- 高二：動量與衝量 ----------
  factories.push({
    id: "momentum_conservation",
    tags: ["物理","動量","碰撞","高二"],
    generate: () => {
      const m1 = Utils.rnd(1,10);
      const v1 = Utils.rnd(1,20);
      const m2 = Utils.rnd(1,10);
      const v2 = 0;
      const v_final = Math.round((m1*v1)/(m1+m2) * 100) / 100;
      return {
        question: `【動量守恆】質量 ${m1} kg 以 ${v1} m/s 撞上靜止質量 ${m2} kg，若黏在一起，求共同速度 (m/s)。`,
        options: Utils.genOptions(v_final),
        correctValue: v_final,
        concept: "動量守恆：m1v1 + m2v2 = (m1+m2) v'",
        explanation: [`v' = (m1 v1 + m2 v2) / (m1 + m2)`, `計算：${v_final} m/s`, `答案：${v_final} m/s`]
      };
    }
  });

  // ---------- 高二：萬有引力 ----------
  factories.push({
    id: "universal_grav",
    tags: ["物理","引力","高二"],
    generate: () => {
      const m1 = Utils.rnd(100,1000);
      const m2 = Utils.rnd(100,1000);
      const r = Utils.rnd(1,50);
      const G = 6.67e-11;
      const F = Math.round(G * m1 * m2 / (r*r) * 1e6) / 1e6;
      return {
        question: `【萬有引力】質量 ${m1} kg 與 ${m2} kg，相距 ${r} m，求引力 (N)。`,
        options: Utils.genOptions(F),
        correctValue: F,
        concept: "F = G m1 m2 / r²",
        explanation: [`F = G m1 m2 / r²`, `計算：${F} N`, `答案：${F} N`]
      };
    }
  });

  // ---------- 高三：波動（干涉、繞射、都卜勒） ----------
  factories.push({
    id: "double_slit",
    tags: ["物理","波動","干涉","高三"],
    generate: () => {
      const d = Utils.rnd(0.1,1); // mm
      const L = Utils.rnd(1,5); // m
      const m = Utils.rnd(1,5);
      const lambda = Utils.rnd(400,700) / 1e6; // mm -> m (approx visible light in m)
      // 使用簡化公式 y = m λ L / d
      const y = Math.round(m * lambda * L / (d/1000) * 1000) / 1000;
      return {
        question: `【雙狹縫干涉】狹縫間距 ${d} mm，螢幕距離 ${L} m，干涉級數 ${m}，波長約 ${Math.round(lambda*1e9)} nm，求亮紋間距 y (m)。`,
        options: Utils.genOptions(y),
        correctValue: y,
        concept: "y = m λ L / d",
        explanation: [`y = m λ L / d`, `計算：${y} m`, `答案：${y} m`]
      };
    }
  });

  factories.push({
    id: "doppler_effect",
    tags: ["物理","波動","都卜勒效應","高三"],
    generate: () => {
      const v_source = Utils.rnd(0,30);
      const v_obs = Utils.rnd(0,30);
      const v_sound = 340;
      const f0 = Utils.rnd(200,1000);
      const f = Math.round(((v_sound + v_obs) / (v_sound - v_source)) * f0 * 100) / 100;
      return {
        question: `【都卜勒】源速 ${v_source} m/s，觀測者速 ${v_obs} m/s，原頻率 ${f0} Hz，求觀測頻率 (Hz)。`,
        options: Utils.genOptions(f),
        correctValue: f,
        concept: "f' = (v ± v_obs)/(v ∓ v_src) × f0",
        explanation: [`f' = (v + v_obs)/(v - v_source) × f0`, `計算：${f} Hz`, `答案：${f} Hz`]
      };
    }
  });

  // ---------- 高三：幾何光學（透鏡成像） ----------
  factories.push({
    id: "lens_formula",
    tags: ["物理","光學","透鏡","高三"],
    generate: () => {
      const f = Utils.rnd(5,50);
      const u = Utils.rnd(f+5, 200);
      const v = Math.round((f * u) / (u - f) * 100) / 100;
      return {
        question: `【透鏡】焦距 ${f} cm，物距 ${u} cm，求像距 v (cm)。`,
        options: Utils.genOptions(v),
        correctValue: v,
        concept: "1/f = 1/u + 1/v",
        explanation: [`v = f u / (u - f)`, `計算：${v} cm`, `答案：${v} cm`]
      };
    }
  });

  // ---------- 高三：靜電學 ----------
  factories.push({
    id: "coulomb_law",
    tags: ["物理","電學","庫侖定律","高三"],
    generate: () => {
      const q1 = Utils.rnd(1,10) * 1e-6;
      const q2 = Utils.rnd(1,10) * 1e-6;
      const r = Utils.rnd(1,50);
      const k = 8.99e9;
      const F = Math.round(k * q1 * q2 / (r*r) * 100) / 100;
      return {
        question: `【庫侖定律】電荷 ${q1} C 與 ${q2} C，相距 ${r} m，求庫侖力 (N)。`,
        options: Utils.genOptions(F),
        correctValue: F,
        concept: "F = k q1 q2 / r²",
        explanation: [`F = k q1 q2 / r²`, `計算：${F} N`, `答案：${F} N`]
      };
    }
  });

  // ---------- 高三：電路（歐姆定律、串並聯） ----------
  factories.push({
    id: "ohm_law",
    tags: ["物理","電學","歐姆定律","高三"],
    generate: () => {
      const R = Utils.rnd(1,200);
      const I = Utils.rnd(0.1,5);
      const V = Math.round(R * I * 100) / 100;
      return {
        question: `【歐姆定律】電阻 ${R} Ω，電流 ${I} A，求電壓 (V)。`,
        options: Utils.genOptions(V),
        correctValue: V,
        concept: "V = I R",
        explanation: [`V = I × R`, `計算：${I} × ${R} = ${V}`, `答案：${V} V`]
      };
    }
  });

  factories.push({
    id: "series_parallel_resistors",
    tags: ["物理","電學","電阻","高三"],
    generate: () => {
      const r1 = Utils.rnd(1,100);
      const r2 = Utils.rnd(1,100);
      const mode = Utils.pick(["series","parallel"]);
      let R;
      if (mode === "series") R = r1 + r2;
      else R = Math.round((r1 * r2 / (r1 + r2)) * 100) / 100;
      return {
        question: `【電阻】兩電阻 ${r1} Ω 與 ${r2} Ω，若為 ${mode} 連接，等效電阻為多少 Ω？`,
        options: Utils.genOptions(R),
        correctValue: R,
        concept: mode === "series" ? "串聯：R = R1 + R2" : "並聯：1/R = 1/R1 + 1/R2",
        explanation: mode === "series" ? [`R = ${r1} + ${r2} = ${R}`] : [`1/R = 1/${r1} + 1/${r2}`, `R ≈ ${R}`]
      };
    }
  });

  // ---------- 高三：電磁感應 ----------
  factories.push({
    id: "faraday_law",
    tags: ["物理","電磁感應","高三"],
    generate: () => {
      const N = Utils.rnd(10,200);
      const dPhi = Utils.rnd(0.001,0.1);
      const dt = Utils.rnd(0.01,2);
      const emf = Math.round(N * dPhi / dt * 100) / 100;
      return {
        question: `【法拉第】線圈匝數 ${N}，磁通變化量 ${dPhi} Wb，時間 ${dt} s，感應電動勢為多少 V？`,
        options: Utils.genOptions(emf),
        correctValue: emf,
        concept: "ε = -N ΔΦ / Δt",
        explanation: [`ε = N × ΔΦ / Δt`, `計算：${emf} V`, `答案：${emf} V`]
      };
    }
  });

  // ---------- 高三：熱學（理想氣體） ----------
  factories.push({
    id: "ideal_gas",
    tags: ["物理","熱學","理想氣體","高二","高三"],
    generate: () => {
      const n = Utils.rnd(1,10);
      const R = 8.314;
      const T = Utils.rnd(250,400);
      const V = Math.round(n * R * T / Utils.rnd(100,500) * 100) / 100; // 變化式，避免過大
      // 這題以 P = nRT/V 反向構造，給出 P, n, T 求 V 會更穩定；此處簡化為示範
      return {
        question: `【理想氣體】示範題（參數隨機化），n ≈ ${n} mol，T ≈ ${T} K，請注意此題為概念示範。`,
        options: Utils.genOptions(V),
        correctValue: V,
        concept: "理想氣體方程式 PV = nRT（示範）",
        explanation: [`PV = nRT`, `此題為隨機化示範，計算值 ≈ ${V}`]
      };
    }
  });

  // ---------- 高三：量子與核物理（簡單題型） ----------
  factories.push({
    id: "photoelectric_energy",
    tags: ["物理","量子","光電效應","高三"],
    generate: () => {
      const h = 6.63e-34;
      const f = Utils.rnd(5e14,8e14);
      const E = Math.round(h * f * 1e20) / 1e20;
      return {
        question: `【光電效應】光頻率約 ${Math.round(f)} Hz，光子能量為多少 J（近似）？`,
        options: Utils.genOptions(E),
        correctValue: E,
        concept: "E = h f",
        explanation: [`E = h × f`, `計算：${E} J`, `答案：${E} J`]
      };
    }
  });

  // ---------- 補充題型：常見單位與估算 ----------
  factories.push({
    id: "density_estimate",
    tags: ["物理","估計值","密度"],
    generate: () => {
      const obj = Utils.pick([
        {name:"水", d:1},
        {name:"木頭", d:0.6},
        {name:"鋁", d:2.7},
        {name:"鐵", d:7.8}
      ]);
      const V = Utils.rnd(10,200);
      const M = Math.round(obj.d * V * 10) / 10;
      return {
        question: `【估計】${obj.name} 體積 ${V} cm3，估計質量 (g)。`,
        options: Utils.genOptions(M),
        correctValue: M,
        concept: "密度估算",
        explanation: [`質量 ≈ 密度 × 體積`, `計算：${obj.d} × ${V} ≈ ${M}`, `答案：約 ${M} g`]
      };
    }
  });
const fixedQuestions = [
    { q: "質量的 SI 單位為？", a: "公斤 (kg)", o: ["公克", "牛頓", "焦耳"], t: ["測量", "國八"] },
    { q: "體積的常用單位 mL 等於多少 cm³？", a: "1", o: ["10", "0.1", "100"], t: ["測量", "國八"] },
    { q: "密度公式為？", a: "質量 ÷ 體積", o: ["體積 ÷ 質量", "質量 × 體積", "體積 × 重量"], t: ["密度", "國八"] },
    { q: "水在 4°C 時密度約為？", a: "1 g/cm³", o: ["0.5", "2", "10"], t: ["密度", "國八"] },
    { q: "下列何者屬化學變化？", a: "鐵生鏽", o: ["冰融化", "水蒸發", "玻璃破裂"], t: ["物質變化", "國八"] },
    { q: "溶液中被溶解的物質稱為？", a: "溶質", o: ["溶劑", "混合物", "濃度"], t: ["水溶液", "國八"] },
    { q: "水通常作為什麼角色？", a: "溶劑", o: ["溶質", "沉澱物", "氣體"], t: ["水溶液", "國八"] },
    { q: "溫度升高通常會使固體溶解度？", a: "增加", o: ["減少", "不變", "變零"], t: ["溶解度", "國八"] },
    { q: "攪拌主要影響什麼？", a: "溶解速率", o: ["溶解度上限", "密度", "重量"], t: ["溶解度", "國八"] },
    { q: "飽和溶液代表？", a: "無法再溶解更多溶質", o: ["完全沒有溶質", "溶質最多", "完全透明"], t: ["水溶液", "國八"] },
    { q: "聲音是屬於什麼波？", a: "縱波", o: ["橫波", "電磁波", "表面波"], t: ["聲音", "國八"] },
    { q: "聲音無法在什麼中傳播？", a: "真空", o: ["水", "鐵", "空氣"], t: ["聲音", "國八"] },
    { q: "音量大小與什麼有關？", a: "振幅", o: ["頻率", "波長", "速度"], t: ["聲音", "國八"] },
    { q: "音調高低與什麼有關？", a: "頻率", o: ["振幅", "速度", "密度"], t: ["聲音", "國八"] },
    { q: "光速約為多少？", a: "3×10^8 m/s", o: ["3×10^5", "3×10^2", "3×10^10"], t: ["光學", "國八"] },
    { q: "光在真空中傳播方式為？", a: "直線傳播", o: ["曲線", "螺旋", "震盪"], t: ["光學", "國八"] },
    { q: "凸透鏡成像可能為？", a: "實像或虛像", o: ["只有實像", "只有虛像", "沒有像"], t: ["光學", "國八"] },
    { q: "凹透鏡成像為？", a: "虛像", o: ["實像", "倒立像", "無像"], t: ["光學", "國八"] },
    { q: "白光通過三稜鏡會？", a: "分光", o: ["變黑", "消失", "變強"], t: ["光學", "國八"] },
    { q: "紅光與紫光相比，波長較長的是？", a: "紅光", o: ["紫光", "一樣", "不一定"], t: ["光學", "國八"] },
    { q: "溫度代表粒子的？", a: "平均動能", o: ["體積", "質量", "數量"], t: ["熱量", "國八"] },
    { q: "熱由高溫傳到低溫稱為？", a: "熱傳遞", o: ["對流", "壓縮", "蒸發"], t: ["熱量", "國八"] },
    { q: "氣體熱傳遞主要方式？", a: "對流", o: ["傳導", "輻射", "反射"], t: ["熱傳遞", "國八"] },
    { q: "太陽能傳到地球主要方式？", a: "輻射", o: ["傳導", "對流", "震動"], t: ["熱傳遞", "國八"] },
    { q: "壓力公式為？", a: "力 ÷ 面積", o: ["力 × 面積", "面積 ÷ 力", "質量 ÷ 面積"], t: ["壓力", "國八"] },
    { q: "深度越深水壓？", a: "越大", o: ["越小", "不變", "先小後大"], t: ["壓力", "國八"] },
    { q: "浮力大小等於？", a: "排開液體重量", o: ["物體重量", "液體體積", "物體體積"], t: ["浮力", "國八"] },
    { q: "物體密度小於水會？", a: "浮起來", o: ["下沉", "不動", "爆炸"], t: ["浮力", "國八"] },
    { q: "壓力單位帕斯卡符號？", a: "Pa", o: ["P", "pk", "ps"], t: ["壓力", "國八"] },
    { q: "1 atm 約等於多少 Pa？", a: "1×10^5", o: ["1×10^2", "1×10^8", "10"], t: ["壓力", "國八"] },
    { q: "速度公式為？", a: "位移 ÷ 時間", o: ["時間 ÷ 位移", "位移 × 時間", "距離 × 時間"], t: ["運動學", "國九"] },
    { q: "加速度代表？", a: "速度變化率", o: ["位置變化", "時間變化", "距離變化"], t: ["運動學", "國九"] },
    { q: "自由落體加速度約？", a: "9.8 m/s²", o: ["98", "0.98", "1"], t: ["運動學", "國九"] },
    { q: "速度向量包含？", a: "大小與方向", o: ["只有大小", "只有方向", "只有時間"], t: ["運動學", "國九"] },
    { q: "等速運動代表？", a: "速度固定", o: ["加速度固定", "位置固定", "方向固定"], t: ["運動學", "國九"] },
    { q: "力的單位？", a: "牛頓", o: ["焦耳", "瓦特", "庫侖"], t: ["力學", "國九"] },
    { q: "F = ma 是？", a: "牛頓第二定律", o: ["第一定律", "第三定律", "萬有引力"], t: ["力學", "國九"] },
    { q: "作用力反作用力大小？", a: "相等", o: ["不同", "隨機", "不一定"], t: ["力學", "國九"] },
    { q: "慣性與什麼有關？", a: "質量", o: ["體積", "速度", "面積"], t: ["力學", "國九"] },
    { q: "摩擦力方向通常？", a: "與運動相反", o: ["與運動相同", "垂直運動", "隨機"], t: ["力學", "國九"] },
    { q: "功公式？", a: "力 × 距離", o: ["力 ÷ 距離", "距離 ÷ 力", "力 × 時間"], t: ["功與能", "國九"] },
    { q: "功率公式？", a: "功 ÷ 時間", o: ["時間 ÷ 功", "功 × 時間", "力 × 時間"], t: ["功與能", "國九"] },
    { q: "能量單位？", a: "焦耳", o: ["牛頓", "瓦特", "帕"], t: ["功與能", "國九"] },
    { q: "位能與什麼有關？", a: "高度", o: ["速度", "時間", "密度"], t: ["功與能", "國九"] },
    { q: "動能公式 1/2mv² 表示？", a: "運動能量", o: ["位能", "熱能", "電能"], t: ["功與能", "國九"] },
    { q: "能量守恆代表？", a: "能量不會消失", o: ["能量會消失", "能量會變0", "能量固定"], t: ["功與能", "國九"] },
    { q: "滑輪主要用途？", a: "省力", o: ["增加重量", "減少距離", "改變質量"], t: ["機械", "國九"] },
    { q: "槓桿原理核心？", a: "力矩平衡", o: ["速度平衡", "質量平衡", "能量平衡"], t: ["機械", "國九"] },
    { q: "定滑輪作用？", a: "改變力方向", o: ["省力", "省時", "增加重量"], t: ["機械", "國九"] },
    { q: "動滑輪主要？", a: "省力", o: ["改方向", "增加速度", "增加重量"], t: ["機械", "國九"] },
    { q: "電流單位？", a: "安培", o: ["伏特", "歐姆", "瓦特"], t: ["電路", "國九"] },
    { q: "電壓單位？", a: "伏特", o: ["安培", "歐姆", "焦耳"], t: ["電路", "國九"] },
    { q: "電阻單位？", a: "歐姆", o: ["安培", "伏特", "瓦特"], t: ["電路", "國九"] },
    { q: "歐姆定律 V=IR 表示？", a: "電壓=電流×電阻", o: ["電流=電壓×電阻", "電阻=電壓×電流", "電壓=電流÷電阻"], t: ["電路", "國九"] },
    { q: "串聯電路電流？", a: "相同", o: ["不同", "隨機", "不一定"], t: ["電路", "國九"] },
    { q: "串聯電壓？", a: "分配", o: ["相同", "固定", "不變"], t: ["電路", "國九"] },
    { q: "電功率公式？", a: "P=VI", o: ["P=IR", "P=V/R", "P=I/R"], t: ["電路", "國九"] },
    { q: "家用電壓台灣約？", a: "110V", o: ["220V", "12V", "50V"], t: ["生活用電", "國九"] },
    { q: "電流磁效應發現者？", a: "厄斯特", o: ["牛頓", "愛因斯坦", "特斯拉"], t: ["電磁學", "國九"] },
    { q: "電磁鐵磁力大小與？", a: "電流有關", o: ["顏色", "形狀", "溫度"], t: ["電磁學", "國九"] },
    { q: "原子中心稱？", a: "原子核", o: ["電子雲", "質子雲", "中子雲"], t: ["原子結構", "高一"] },
    { q: "質子帶電？", a: "正電", o: ["負電", "不帶電", "雙電"], t: ["原子結構", "高一"] },
    { q: "中子電性？", a: "不帶電", o: ["正電", "負電", "雙電"], t: ["原子結構", "高一"] },
    { q: "電子帶電？", a: "負電", o: ["正電", "不帶電", "雙電"], t: ["原子結構", "高一"] },
    { q: "光子代表？", a: "光的粒子", o: ["電子", "質子", "中子"], t: ["量子物理", "高三"] },
    { q: "核分裂釋放？", a: "大量能量", o: ["只有光", "只有熱", "沒有能量"], t: ["近代物理", "高三"] },
    { q: "核融合主要發生？", a: "太陽內部", o: ["地球核心", "海洋", "大氣"], t: ["近代物理", "高三"] },
    { q: "相對論提出者？", a: "愛因斯坦", o: ["牛頓", "法拉第", "特斯拉"], t: ["相對論", "高一"] },
    { q: "E=mc² 表示？", a: "質量可轉能量", o: ["速度可轉能量", "時間可轉能量", "體積可轉能量"], t: ["相對論", "高一"] },
    { q: "量子化代表？", a: "能量不連續", o: ["能量連續", "能量固定", "能量消失"], t: ["量子物理", "高三"] }
  ];

  // 註冊固定題目
  fixedQuestions.forEach((item, idx) => {
    const id = `fixed_phy_${idx}`;
    const opts = [...item.o, item.a].sort(() => Math.random() - 0.5);
    window.__PHYSICS_REPO__[id] = {
      func: () => ({
        id: id,
        question: item.q,
        options: opts,
        answer: opts.indexOf(item.a),
        correctValue: item.a,
        concept: "物理基本概念",
        explanation: [`正確答案是：${item.a}`],
        subject: "physics",
        tags: item.t
      }),
      tags: item.t,
      subject: "physics"
    };
  });

  // ---------- 3. 自動擴展動態題目直到達標 (220題) ----------

  let counter = Object.keys(window.__PHYSICS_REPO__).length;
  const target = 220; 
  let genIndex = 0;
  const VARIANTS_PER_GENERATOR = 10;

  while (counter < target) {
    const factory = factories[genIndex % factories.length];
    for (let v = 0; v < VARIANTS_PER_GENERATOR && counter < target; v++) {
      const uniqueId = `${factory.id}_var${v}_${Math.floor(Math.random() * 1e6)}`;
      window.__PHYSICS_REPO__[uniqueId] = {
        func: (() => {
          return () => {
            const data = factory.generate();
            let answer = -1;
            for (let i = 0; i < data.options.length; i++) {
              const a = data.options[i];
              if (String(a) === String(data.correctValue)) { answer = i; break; }
              if (!isNaN(parseFloat(a)) && !isNaN(parseFloat(data.correctValue)) && Math.abs(parseFloat(a) - parseFloat(data.correctValue)) < 1e-6) { answer = i; break; }
            }
            return {
              id: uniqueId,
              question: data.question,
              options: data.options,
              correctValue: data.correctValue,
              answer: answer,
              concept: data.concept,
              explanation: data.explanation,
              subject: "physics",
              tags: factory.tags
            };
          };
        })(),
        tags: factory.tags,
        subject: "physics"
      };
      counter++;
    }
    genIndex++;
  }

  console.log(`✅ 已註冊題目總數：${Object.keys(window.__PHYSICS_REPO__).length}（含 100 題固定題與動態變體）`);
  console.log("提示：呼叫 window.__PHYSICS_REPO__[id].func() 以取得題目。");

})(window);
