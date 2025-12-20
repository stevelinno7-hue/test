/* =====================================================
 * 翰林 AI 助教（高速展示完整版｜單檔案）
 * ===================================================== */

const RealAITutor = {
    /* ===============================
     * 基本設定
     * =============================== */
    name: "翰林 AI 助教（高速展示版）",
    gradeLevel: "senior",          // junior | senior
    examMode: "gsat",              // gsat | ast
    studentLevel: "basic",         // basic | advanced
    teacherMode: true,

    answered: new Set(),

    /* ===============================
     * Dashboard 資料
     * =============================== */
    dashboard: {
        totalQuestions: 0,
        typeCount: {
            "選擇題": 0,
            "計算題": 0,
            "申論題": 0,
            "綜合題": 0
        },
        unitCount: {}
    },

    /* ===============================
     * 錯誤趨勢（折線圖用）
     * =============================== */
    errorCount: 0,
    errorHistory: [], // 每題累積錯誤數

    /* ===============================
     * 單元資料庫（精簡高速）
     * =============================== */
    unitDB: {
        general: {
            name: "通用學習能力",
            ability: "理解題意與基本推理",
            mistakes: ["太快作答"],
            wrong: ["背答案就會（錯）"]
        },
        seniorCalculus: {
            name: "微分概念",
            ability: "變化率理解",
            mistakes: ["只背公式"],
            wrong: ["微分只是計算（錯）"]
        },
        physicsNewton: {
            name: "牛頓運動定律",
            ability: "因果推理",
            mistakes: ["力與運動混淆"],
            wrong: ["沒有力就不能動（錯）"]
        },
        chemEquilibrium: {
            name: "化學平衡",
            ability: "動態平衡理解",
            mistakes: ["以為反應停止"],
            wrong: ["平衡等於靜止（錯）"]
        },
        chineseReading: {
            name: "閱讀理解",
            ability: "主旨與推論",
            mistakes: ["只找關鍵字"],
            wrong: ["答案一定在原文（錯）"]
        },
        englishTense: {
            name: "時態判斷",
            ability: "語意與時間對應",
            mistakes: ["只看時間副詞"],
            wrong: ["看到過去就用過去式（錯）"]
        }
    },

    /* ===============================
     * 關鍵字 → 單元
     * =============================== */
    unitKeywords: [
        ["微分", "seniorCalculus"],
        ["牛頓", "physicsNewton"],
        ["化學平衡", "chemEquilibrium"],
        ["閱讀", "chineseReading"],
        ["時態", "englishTense"]
    ],

    detectUnit(text) {
        for (const [k, v] of this.unitKeywords) {
            if (text.includes(k)) return v;
        }
        return "general";
    },

    /* ===============================
     * 題型判斷
     * =============================== */
    questionType(text) {
        if (/[ABCD]|下列何者/.test(text)) return "選擇題";
        if (/計算|求|=/.test(text)) return "計算題";
        if (/說明|解釋|為何/.test(text)) return "申論題";
        return "綜合題";
    },

    /* ===============================
     * Dashboard 累積
     * =============================== */
    updateDashboard(unitKey, qType) {
        this.dashboard.totalQuestions++;
        this.dashboard.typeCount[qType]++;
        this.dashboard.unitCount[unitKey] =
            (this.dashboard.unitCount[unitKey] || 0) + 1;
    },

    /* ===============================
     * Canvas 折線圖（錯誤趨勢）
     * =============================== */
    renderErrorTrend() {
        const c = document.getElementById("errorTrend");
        if (!c) return;

        const ctx = c.getContext("2d");
        const w = c.width;
        const h = c.height;
        const pad = 40;

        ctx.clearRect(0, 0, w, h);

        // 座標軸
        ctx.strokeStyle = "#333";
        ctx.beginPath();
        ctx.moveTo(pad, pad);
        ctx.lineTo(pad, h - pad);
        ctx.lineTo(w - pad, h - pad);
        ctx.stroke();

        if (this.errorHistory.length === 0) return;

        const maxY = Math.max(...this.errorHistory, 1);
        const stepX =
            (w - pad * 2) / Math.max(this.errorHistory.length - 1, 1);

        ctx.strokeStyle = "#e74c3c";
        ctx.lineWidth = 2;
        ctx.beginPath();

        this.errorHistory.forEach((v, i) => {
            const x = pad + i * stepX;
            const y = h - pad - (v / maxY) * (h - pad * 2);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });

        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.font = "14px sans-serif";
        ctx.fillText("錯誤趨勢（累積）", pad, 20);
    },

    /* ===============================
     * 主入口（穩定版）
     * =============================== */
    askGemini(title, content) {
        const key = title + content;
        if (this.answered.has(key)) {
            return Promise.resolve("🙂 這題我們之前已經討論過囉，先消化再繼續！");
        }
        this.answered.add(key);
    
        const text = title + content;
        const qType = this.questionType(text);
        const unitKey = this.detectUnit(text);
        const unit = this.unitDB[unitKey] || this.unitDB.general;
    
        /* ===============================
         * Dashboard 累積
         * =============================== */
        this.updateDashboard(unitKey, qType);
    
        /* ===============================
         * 假錯誤產生（展示用）
         * =============================== */
        const fakeErrors = Math.floor(Math.random() * 3); // 0~2
        this.errorCount += fakeErrors;
        this.errorHistory.push(this.errorCount);
        this.renderErrorTrend();
    
        const blocks = [
            `📘【${this.name}】`,
            ``,
            `📌 題型：${qType}`,
            `📚 單元：${unit.name}`,
            ``,
            `⚠️ 常見錯誤：`,
            ...unit.mistakes.map(m => `• ${m}`),
            ``,
            `❌ 常見錯誤觀念：`,
            ...unit.wrong.map(w => `• ${w}`),
            ``,
            `🧠 學習建議：${
                this.studentLevel === "basic"
                    ? "先穩住核心概念，不急著算"
                    : "可比較不同題型與變化"
            }`,
            ``,
            `🎓 考試取向：${this.examMode === "gsat"
                ? "學測（重理解）"
                : "指考（重計算）"
            }`
        ];
    
        if (this.teacherMode) {
            blocks.push(
                ``,
                `🧑‍🏫 教師提示：本題重點在「${unit.ability}」`
            );
        }
    
        return Promise.resolve(blocks.join("\n"));
    }

};

/* =====================================================
 * 教師 / 學生模式切換（可選）
 * ===================================================== */
function setRole(role) {
    RealAITutor.teacherMode = role === "teacher";
}
