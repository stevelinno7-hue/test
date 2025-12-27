/* =====================================================
 * 翰林 AI 助教（Gemini API 修正版）
 * ===================================================== */

// ★★★ 請務必在此填入您的 API Key ★★★
const API_KEY = "AIzaSyCfEILOin4gSmH_stCv-zuE9dORTHJ4RjA"; 

const RealAITutor = {

    /* ===============================
     * 基本設定
     * =============================== */
    name: "翰林 AI 助教 (GenAI)",
    gradeLevel: "senior",
    teacherMode: true,

    /* ===============================
     * 狀態追蹤
     * =============================== */
    history: [],
    mastery: {}, 
    
    /* ===============================
     * LLM 核心溝通層
     * =============================== */
    async callGeminiAPI(prompt) {
        // 檢查 API Key 是否已填寫
        if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
            console.error("API Key 未設定");
            return "⚠️ 系統提示：請先在程式碼中設定 Google Gemini API Key 才能啟用 AI 回覆功能。";
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800
                    }
                })
            });
            
            const data = await response.json();
            
            // 錯誤處理：如果 API 回傳錯誤結構
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                console.error("Gemini Response Error:", data);
                return "🤖 AI 暫時無法處理此請求，請檢查 API Key 或額度。";
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Network Error:", error);
            return "🤖 網路連線錯誤，請稍後再試。";
        }
    },

    /* ===============================
     * Prompt 工程
     * =============================== */
    constructPrompt(title, content, studentAns, correctAnswer) {
        // 簡易的卡關計數 (這裡簡化處理，統一視為 Level 1 引導)
        const previousStuckCount = 1; 

        return `
        你現在是【翰林出版的 AI 專業助教】。
        
        【任務】：
        1. 分析學生的提問。
        2. 使用「蘇格拉底教學法」引導，不要直接給答案。
        3. 語氣要親切、鼓勵學生。

        【輸入資訊】：
        - 問題標題：${title}
        - 問題內容：${content}
        ${studentAns ? `- 學生目前的答案/想法：${studentAns}` : ""}
        ${this.teacherMode ? `- (教師模式已開啟，請提供一點專業診斷)` : ""}

        【輸出格式】：
        請直接輸出回覆內容，可以使用 Markdown 格式 (如 **粗體**)。
        開頭請用：📘【翰林 AI 助教】
        `;
    },

    /* ===============================
     * 主入口：askGemini (修正名稱以配合 forum.html)
     * =============================== */
    // 參數說明：title(標題), content(內容), options(包含答案等額外資訊)
    async askGemini(title, content, options = {}) {
        const { answer, correctAnswer } = options;
        
        // 1. 構建 Prompt
        const prompt = this.constructPrompt(title, content, answer, correctAnswer);

        // 2. 顯示等待訊息 (可選，但在 Console 看得到)
        console.log("🧠 AI 正在思考...", title);

        // 3. 呼叫真 AI
        const aiResponse = await this.callGeminiAPI(prompt);

        // 4. 儲存歷史
        this.history.push({ 
            q: title + " - " + content, 
            a: aiResponse, 
            time: new Date() 
        });

        // 5. 回傳結果
        return aiResponse;
    }
};

/* ===============================
 * 輔助設定
 * =============================== */
function setRole(role) {
    RealAITutor.teacherMode = role === "teacher";
}
