/* =====================================================
 * 翰林 AI 助教（單檔穩定完整版）
 * ===================================================== */

const RealAITutor = {

    /* ===============================
     * 基本設定
     * =============================== */
    name: "翰林 AI 助教",
    gradeLevel: "senior",
    examMode: "gsat",      // gsat | ast
    studentLevel: "basic", // basic | advanced
    teacherMode: true,

    /* ===============================
     * 狀態追蹤
     * =============================== */
    answered: new Set(),
    mastery: {},
    stuckCounter: {},
    errorCount: 0,
    errorHistory: [],

    /* ===============================
     * Dashboard
     * =============================== */
    dashboard: {
        totalQuestions: 0,
        typeCount: { "選擇題": 0, "計算題": 0, "申論題": 0, "綜合題": 0 },
        unitCount: {}
    },

    /* ===============================
     * 單元資料庫
     * =============================== */
    unitDB: {
        general: {
            name: "通用學習能力",
            ability: "題意理解與推理",
            mistakes: ["急著作答"],
            wrong: ["背答案就好（錯）"]
        },
        seniorCalculus: {
            name: "微分概念",
            ability: "變化率理解",
            mistakes: ["只背公式"],
            wrong: ["微分只是算數（錯）"]
        },
        physicsNewton: {
            name: "牛頓運動定律",
            ability: "因果推理",
            mistakes: ["力與運動混淆"],
            wrong: ["沒有力就不能動（錯）"]
        }
    },

    /* ===============================
     * Socratic 引導（分級）
     * =============================== */
    socraticDB: {
        general: {
            0: ["題目主要在問什麼？"],
            1: ["哪些資訊是解題一定要用的？"],
            2: ["先列條件，不要急著計算。"]
        },
        seniorCalculus: {
            0: ["這是在找瞬間變化還是平均變化？"],
            1: ["你能用圖形想像這個變化嗎？"],
            2: ["這一點的斜率代表什麼？"]
        },
        physicsNewton: {
            0: ["物體現在有沒有受力？"],
            1: ["哪些力實際作用在物體上？"],
            2: ["先畫受力圖，再選定律。"]
        }
    },

    /* ===============================
     * 補救教材推薦（Level 2）
     * =============================== */
    remedyDB: {
        general: [
            "題意拆解練習（文字 → 條件）",
            "只判斷方向、不計算的題型"
        ],
        seniorCalculus: [
            "微分定義與圖形對照練習",
            "斜率正負判斷題"
        ],
        physicsNewton: [
            "受力圖專項練習",
            "單一力牛頓第二定律題"
        ]
    },

    /* ===============================
     * 歷屆試題標籤
     * =============================== */
    examTagDB: {
        seniorCalculus: {
            gsat: ["109學測", "111學測"],
            ast: ["108指考"]
        },
        physicsNewton: {
            gsat: ["110學測"],
            ast: ["109指考"]
        }
    },

    /* ===============================
     * 錯誤知識圖譜
     * =============================== */
    errorGraph: {
        reading: "題意理解",
        concept: "核心概念",
        application: "概念應用",
        calculation: "計算執行"
    },

    /* ===============================
     * 工具方法
     * =============================== */
    detectUnit(text) {
        if (text.includes("微分")) return "seniorCalculus";
        if (text.includes("牛頓")) return "physicsNewton";
        return "general";
    },

    questionType(text) {
        if (/[ABCD]|下列何者/.test(text)) return "選擇題";
        if (/計算|求|=/.test(text)) return "計算題";
        if (/說明|解釋|為何/.test(text)) return "申論題";
        return "綜合題";
    },

    updateDashboard(unitKey, qType) {
        this.dashboard.totalQuestions++;
        this.dashboard.typeCount[qType]++;
        this.dashboard.unitCount[unitKey] =
            (this.dashboard.unitCount[unitKey] || 0) + 1;
    },

    diagnoseError(qType) {
        if (qType === "申論題") return "reading";
        if (qType === "選擇題") return "concept";
        if (qType === "計算題") return "calculation";
        return "application";
    },

    getSocraticHints(unitKey, level) {
        return (
            this.socraticDB[unitKey]?.[level] ||
            this.socraticDB.general[level]
        );
    },

    getExamTags(unitKey) {
        return this.examTagDB[unitKey]?.[this.examMode] || [];
    },

    /* ===============================
     * 主入口
     * =============================== */
    askGemini(title, content, options = {}) {
        const { answer, correctAnswer, requestHint = false } = options;
        const text = title + content;
        const unitKey = this.detectUnit(text);
        const unit = this.unitDB[unitKey];
        const qType = this.questionType(text);

        /* ===== 主動提示模式 ===== */
        if (requestHint) {
            const level = Math.min(this.stuckCounter[unitKey] || 0, 2);
            const hints = this.getSocraticHints(unitKey, level);
            return Promise.resolve([
                "🤝【提示模式】",
                `📚 單元：${unit.name}`,
                `🤔 引導（Level ${level}）：`,
                ...hints.map(h => `• ${h}`)
            ].join("\n"));
        }

        const key = title + content;
        if (this.answered.has(key)) {
            return Promise.resolve("🙂 這題已經討論過囉！");
        }
        this.answered.add(key);

        this.updateDashboard(unitKey, qType);

        /* ===== 正確性判斷 ===== */
        let isCorrect = true;
        if (answer !== undefined && correctAnswer !== undefined) {
            isCorrect = answer === correctAnswer;
        }

        /* ===== 卡關追蹤 ===== */
        if (!this.stuckCounter[unitKey]) this.stuckCounter[unitKey] = 0;
        if (!isCorrect) {
            this.errorCount++;
            this.stuckCounter[unitKey]++;
        } else {
            this.stuckCounter[unitKey] = 0;
        }

        this.errorHistory.push(this.errorCount);

        /* ===== 熟練度 ===== */
        if (!this.mastery[unitKey]) {
            this.mastery[unitKey] = { correct: 0, wrong: 0 };
        }
        isCorrect
            ? this.mastery[unitKey].correct++
            : this.mastery[unitKey].wrong++;

        const level = Math.min(this.stuckCounter[unitKey], 2);
        const hints = this.getSocraticHints(unitKey, level);
        const examTags = this.getExamTags(unitKey);
        const errorNode = !isCorrect ? this.diagnoseError(qType) : null;
        const remedy =
            level >= 2 ? this.remedyDB[unitKey] || this.remedyDB.general : null;

        /* ===== 輸出 ===== */
        const blocks = [
            `📘【${this.name}】`,
            `📌 題型：${qType}`,
            `📚 單元：${unit.name}`,
            "",
            ...hints.map((h, i) => `🤔 引導 ${i + 1}：${h}`),
            "",
            examTags.length ? `📎 歷屆標籤：${examTags.join("、")}` : null,
            errorNode ? `🧩 錯誤節點：${this.errorGraph[errorNode]}` : null,
            level >= 2 ? "🆘 已連續卡關，建議補救學習：" : null,
            ...(remedy ? remedy.map(r => `• ${r}`) : [])
        ].filter(Boolean);

        if (this.teacherMode) {
            blocks.push(
                "",
                "🧑‍🏫 教師診斷：",
                `• 核心能力：${unit.ability}`,
                `• 卡關等級：Level ${level}`,
                `• 對 / 錯：${this.mastery[unitKey].correct} / ${this.mastery[unitKey].wrong}`
            );
        }

        return Promise.resolve(blocks.join("\n"));
    }
};

/* ===============================
 * 教師 / 學生模式切換
 * =============================== */
function setRole(role) {
    RealAITutor.teacherMode = role === "teacher";
}
