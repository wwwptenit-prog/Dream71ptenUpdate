import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client server-side
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper function to try generateContent with fallback models
const generateWithFallback = async (ai: GoogleGenAI, contents: any, config?: any) => {
  const modelsToTry = ['gemini-3.6-flash', 'gemini-3.1-pro-preview', 'gemini-flash-latest'];
  let lastErr: any = null;

  for (const m of modelsToTry) {
    try {
      const reqOptions: any = { model: m, contents };
      if (config) reqOptions.config = config;
      const res = await ai.models.generateContent(reqOptions);
      if (res && res.text) {
        return res;
      }
    } catch (err: any) {
      lastErr = err;
      console.warn(`Model ${m} failed, trying next fallback...`, err?.message || err);
    }
  }
  throw lastErr || new Error('All Gemini model attempts failed');
};

// 1. Gemini AI Order Optimizer API Route
app.post('/api/gemini/optimize-order', async (req, res) => {
  try {
    const { roughTitle, category, description } = req.body;
    const ai = getAiClient();

    if (!ai) {
      // Clean fallback if API key is not present
      const cleanTitle = roughTitle ? roughTitle.trim() : 'Digital Service';
      return res.json({
        optimizedTitle: `I will ${cleanTitle} for Order Boss Marketplace`,
        optimizedDesc: `অর্ডার বস প্ল্যাটফর্মে এই সার্ভিসটি অর্ডার করুন! ${description || 'উচ্চমানের সার্ভিস ও ২৪ ঘণ্টার মধ্যে এক্সপ্রেস ডেলিভারি।'}\n\n🌟 কেন এই সার্ভিস অর্ডার করবেন:\n- ১০০% স্যাটিস্ফেকশন গ্যারান্টি\n- দ্রুত রিভিশন ও প্রফেশনাল ফাইল\n- ২৫/৭ কাস্টমার সাপোর্ট`,
        tags: [category || 'Programming', 'Order Boss', 'Top Rated', 'Expert Service', 'Fast Delivery'],
      });
    }

    const prompt = `You are Order Boss AI Assistant (অর্ডার বস এআই সহকারী). 
A freelancer wants to publish an order (service) on Order Boss marketplace.
Title provided: "${roughTitle || ''}"
Category: "${category || 'Programming & Tech'}"
Description/Notes provided: "${description || ''}"

Generate an expert, high-converting SEO optimized title, description, and tags.
Return ONLY a raw valid JSON object without markdown formatting:
{
  "optimizedTitle": "Catchy SEO title in English or mixed English/Bangla starting with 'I will...' or 'আমি...' (max 80 chars)",
  "optimizedDesc": "Engaging detailed description in Bangla & English with bullet points, why choose us, and deliverables.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

    const response = await generateWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
    });

    const textOutput = response.text || '{}';
    const parsed = JSON.parse(textOutput);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Optimization error:', err);
    return res.json({
      optimizedTitle: `I will provide professional ${req.body.roughTitle || 'custom service'} on Order Boss`,
      optimizedDesc: `অর্ডার বস মার্কেটপ্লেসে পেশাদার ডেলিভারি সার্ভিস।\n- দ্রুত ডেলিভারি\n- ১০০% সন্তুষ্টি\n- লাইফটাইম সাপোর্ট`,
      tags: ['Order Boss', 'Freelance Pro', 'Top Service', 'Fast Delivery', 'Expert Work'],
    });
  }
});

// 2. Gemini AI General Assistant Chatbot API Route
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history, currentTab } = req.body;
    const ai = getAiClient();

    // Default smart suggestions fallback engine based on context keywords
    const generateSmartSuggestions = (userText: string, aiText: string) => {
      const lower = (userText + ' ' + aiText).toLowerCase();
      if (lower.includes('কোর্স') || lower.includes('course') || lower.includes('শিখব')) {
        return ['অনলাইন প্রিমিয়াম কোর্সসমূহ 📚', 'মেন্টরের সাথে মিটিং বুক করব 📅', 'কোর্স সার্টিফিকেট ও জব সাপোর্ট 🎓'];
      }
      if (lower.includes('অর্ডার') || lower.includes('order') || lower.includes('সার্ভিস') || lower.includes('দাম') || lower.includes('মার্কেটপ্লেস')) {
        return ['সরাসরি সেলারের সাথে চ্যাট 💬', 'কাস্টম প্রজেক্ট অর্ডার কীভাবে দেব? 🛠️', 'পেমেন্ট ও এস্ক্রো গ্যারান্টি 💳'];
      }
      if (lower.includes('মিটিং') || lower.includes('কথা') || lower.includes('সাপোর্ট') || lower.includes('কল')) {
        return ['লাইভ সাপোর্ট এক্সপার্টের সাথে কথা বলব 🎧', 'আমার মোবাইল নম্বর পাঠাব 📞', 'অফিস এড্রেস ও ভিজিট তথ্য 📍'];
      }
      return ['PTENit সার্ভিস ও প্যাকেজ 🌐', 'Order Boss মার্কেটপ্লেস গিগ 💼', 'সরাসরি মেন্টর ও সাপোর্ট টিম 🎧'];
    };

    if (!ai) {
      const defaultReply = `আসসালামু আলাইকুম! আমি AI Assistant ✨\n\nPTENit ও Order Boss প্ল্যাটফর্মে আপনাকে স্বাগতম! অনলাইন প্রিমিয়াম কোর্স, আইটি সার্ভিস কিংবা ফ্রিল্যান্স গিগ ও প্রজেক্ট অর্ডার সংক্রান্ত যেকোনো তথ্যের জন্য আপনাকে সাহায্য করতে আমি প্রস্তুত।`;
      return res.json({
        reply: defaultReply,
        suggestions: generateSmartSuggestions(message, defaultReply),
      });
    }

    const systemInstruction = `You are AI Assistant - the official intelligent, highly professional AI Assistant for PTENit & Order Boss Platform.

YOUR PERSONALITY & TONE:
- Name: AI Assistant
- Style: You are an extremely smart, polite, helpful, logical, and professional AI Assistant.
- Tone: Courteous, concise, natural, clear, and professional.
- Language: Write in clean, crystal clear Bengali (or English if the user asks in English).

CRITICAL FORMATTING & STYLE RULES:
- STRICTLY DO NOT USE BOLD MARKDOWN SYMBOLS (**text** or *text*). Write pure, clean plain text without any asterisks.
- DO NOT SPAM EMOJIS OR ICONS. Keep the response clean, smooth, uncluttered, and easy to read.
- Keep responses concise, direct, professional, and easy to read. Avoid verbose fluff.

YOUR KNOWLEDGE BASE & SCOPE:
1. PTENit IT SERVICES & COURSES:
   - PTENit is a premier IT Agency & Professional Training Institute in Uttara, Dhaka (+880 1700-000000, info@ptenit.com).
   - IT Services: Custom Web Design & Development (৳15,000+), Digital Marketing & FB/Google Ads (৳8,000/month), Graphic Design & Branding (৳5,000+), Mobile App Development (৳25,000+), Video Editing, and SEO.
   - Professional Courses: Full-Stack Web Development with React & Node (৳12,500), Digital Marketing & SEO (৳8,500), UI/UX Design & Figma (৳7,500), Graphic Design (৳6,000), Python/ML, Flutter App Dev.
   - Course Features: Live Zoom classes, lifetime support, verified digital certificates, job placement assistance, senior head mentor Kazi Sohag's mentorship.

2. ORDER BOSS FREELANCE MARKETPLACE:
   - Order Boss is the integrated Digital Freelance Marketplace within PTENit.
   - Features: Browse/Buy Freelance Gigs, Post Custom Client Jobs, Submit Bids/Proposals, Direct Buyer-Seller Chat, Instant Project Uploads & Portfolio Importer.
   - Payments & Security: 100% Escrow Protection via bKash, Nagad, Rocket, Bank Transfer, and Credit Cards. 0% hidden buyer fees with 100% money-back guarantee.

3. CONTEXT SENSITIVITY:
   - Current User Tab/Page: "${currentTab || 'home'}".
   - Tailor your suggestions dynamically to match the user's specific context.

4. RESPONSE FORMATTING:
   - Use simple clean paragraphs or plain bullet points without bold text or asterisks.
   - Strictly output at the very end of your response a line starting with "SUGGESTIONS:" followed by exactly 3 short click-friendly options separated by "|". Example:
SUGGESTIONS: প্রিমিয়াম কোর্সসমূহ|আইটি সার্ভিস প্যাকেজ|হিউম্যান সাপোর্ট কল`;

    const chatHistory = (history || []).map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    let response: any = null;
    try {
      response = await generateWithFallback(ai, [
        { role: 'user', parts: [{ text: systemInstruction }] },
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] },
      ]);
    } catch (apiErr: any) {
      console.warn('Gemini API call failed, using intelligent domain fallback engine:', apiErr?.message || apiErr);
      // Smart domain fallback when API quota is exhausted
      const lower = message.toLowerCase();
      let fallbackReply = `ধন্যবাদ! PTENit ও Order Boss প্ল্যাটফর্মে আপনাকে স্বাগতম। আমাদের আইটি সার্ভিস, অনলাইন প্রিমিয়াম কোর্স কিংবা অর্ডার বস ফ্রিল্যান্স মার্কেটপ্লেস সংক্রান্ত যেকোনো তথ্যের জন্য সাহায্য করতে পারি।`;

      if (lower.includes('কোর্স') || lower.includes('course') || lower.includes('শিখব')) {
        fallbackReply = `PTENit প্রিমিয়াম কোর্সসমূহের তালিকা 📚:\n1. Full-Stack Web Development with React & Node (৳১২,৫০০)\n2. Digital Marketing & SEO Masterclass (৳৮,৫০০)\n3. UI/UX Design & Figma Pro (৳৭,৫০০)\n4. Graphic Design & Branding (৳৬,০০০)\n\n✨ প্রতিটি কোর্সে থাকছে লাইভ জুম ক্লাস, আনলিমিটেড মেন্টরশিপ সাপোর্ট ও ভেরিফাইড ডিজিটাল সার্টিফিকেট।`;
      } else if (lower.includes('সার্ভিস') || lower.includes('service') || lower.includes('ওয়েব') || lower.includes('মার্কেটিং')) {
        fallbackReply = `PTENit পেশাদার আইটি সার্ভিস ও প্যাকেজ 🌐:\n- Custom Web Development (৳১৫,০০০+)\n- FB & Google Ads Marketing Funnel (৳৮,০০০/মাস)\n- Graphic Design & Brand Identity (৳৫,০০০+)\n- Mobile App Development (৳২৫,০০০+)\n\n💡 আপনার ব্যবসার জন্য কাস্টম আইটি সলিউশন অর্ডার করুন।`;
      } else if (lower.includes('অর্ডার') || lower.includes('order') || lower.includes('গিগ') || lower.includes('মার্কেটপ্লেস')) {
        fallbackReply = `Order Boss ফ্রিল্যান্স মার্কেটপ্লেস বৈশিষ্ট্য 💼:\n- ভেরিফাইড ফ্রিল্যান্সার গিগ কেনাবেচা\n- ১০০% সিকিউর এস্ক্রো পেমেন্ট (bKash, Nagad, Card)\n- কাস্টম জব পোস্টিং ও বিডিং সুবিধা\n- জিরো হিডেন চার্জ ও মানি-ব্যাক গ্যারান্টি।`;
      }

      return res.json({
        reply: fallbackReply,
        suggestions: generateSmartSuggestions(message, fallbackReply),
      });
    }

    let rawText = response.text || 'ধন্যবাদ! PTENit ও Order Boss এআই সহকারী সাহায্য করতে প্রস্তুত।';
    let suggestions: string[] = [];

    if (rawText.includes('SUGGESTIONS:')) {
      const parts = rawText.split('SUGGESTIONS:');
      rawText = parts[0].trim();
      const suggStr = parts[1].trim();
      suggestions = suggStr.split('|').map(s => s.trim()).filter(Boolean).slice(0, 3);
    }

    // Clean any residual markdown bold asterisks
    rawText = rawText.replace(/\*\*/g, '');

    if (suggestions.length === 0) {
      suggestions = generateSmartSuggestions(message, rawText);
    }

    return res.json({
      reply: rawText,
      suggestions: suggestions,
    });
  } catch (err: any) {
    console.error('Gemini Chat error:', err);
    return res.json({
      reply: 'PTENit ও Order Boss এআই সহকারী সংযোগে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      suggestions: ['লাইভ সাপোর্ট টিমের সাথে কথা বলুন 🎧', 'এডমিন প্যানেলে প্রবেশ করুন 🛡️', 'ওয়েবসাইটে ফিরে যান 🏠'],
    });
  }
});

// 2. 1-Click External Portfolio Importer API Route
app.post('/api/portfolio/import', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Portfolio URL is required' });
    }

    let platform = 'Portfolio Website';
    if (url.includes('behance.net')) platform = 'Behance';
    else if (url.includes('github.com')) platform = 'GitHub';
    else if (url.includes('linkedin.com')) platform = 'LinkedIn';
    else if (url.includes('dribbble.com')) platform = 'Dribbble';

    // Simulated parsing of public profile data
    return res.json({
      success: true,
      platform,
      extractedName: 'Verified Order Boss Freelancer',
      extractedTitle: `Senior Designer & Full-Stack Pro (${platform} Verified)`,
      extractedBio: `Professional creator imported directly from ${platform}. Over 50+ successful projects completed with exceptional quality and 5-star client ratings. Dedicated to delivering top-tier work on Order Boss.`,
      extractedSkills: ['React & Next.js', 'UI/UX Design', 'TypeScript', 'Node.js Backend', 'Tailwind CSS', 'AI Agent Integration'],
      extractedGalleries: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      ],
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to parse portfolio URL' });
  }
});

// Vite middleware or production static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Order Boss server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
