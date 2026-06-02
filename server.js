require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// تهيئة مكتبة جوجل
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ reply: "الرسالة فارغة" });

        // استخدام الموديل المستقر القياسي المتوافق مع جميع الشبكات والمكاتب المحلية
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(message);
        const response = await result.response;
        
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("تفاصيل الخطأ:", error.message);
        res.json({ reply: "واجه السيرفر صعوبة في معالجة النص. تأكد من أن الـ VPN متصل بنمط كامل (Global) وقيد التشغيل." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`السيرفر يعمل بنجاح وأمان على المنفذ ${PORT}`));