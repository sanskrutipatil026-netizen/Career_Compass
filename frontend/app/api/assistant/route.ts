import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq client if API key is provided
const groq = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

// Built-in intelligent fallback knowledge base for multilingual responses
const fallbackResponses: Record<string, { welcome: string; tips: string; resume: string; interview: string; default: string }> = {
    en: {
        welcome: "Hello! I am Compass Mitra, your AI career companion. How can I help you today with your interview preparation, resume building, or career guidance?",
        tips: "Here are key technical interview tips:\n1. Master core DSA & system fundamentals.\n2. Practice explaining your thought process out loud (STAR method).\n3. Prepare 2-3 deep-dive stories about past projects.\n4. Ask thoughtful questions at the end of the interview.",
        resume: "For a standout resume:\n• Keep it strictly 1 page with clear section headers.\n• Highlight quantifiable achievements (e.g., 'Boosted API speed by 40%').\n• Tailor keywords to the job description.\n• Include live links to GitHub and deployed projects.",
        interview: "Career Compass offers interactive AI Mock Interviews! Navigate to the Interview section to start a session with real-time feedback and dynamic difficulty adaptation.",
        default: "Thank you for asking! With Compass Mitra on Career Compass, you can practice mock interviews, analyze your resume for ATS score, test your skills, and get personalized course recommendations. What would you like to explore next?",
    },
    hi: {
        welcome: "नमस्ते! मैं कम्पास मित्र (Compass Mitra) हूँ, आपका AI करियर साथी। साक्षात्कार की तैयारी, रिज्यूमे या करियर मार्गदर्शन में मैं आपकी क्या सहायता कर सकता हूँ?",
        tips: "साक्षात्कार के महत्वपूर्ण सुझाव:\n1. अपनी सोच और समस्या समाधान प्रक्रिया को स्पष्ट रूप से समझाएं।\n2. डेटा स्ट्रक्चर और कोर कॉन्सेप्ट्स का अभ्यास करें।\n3. अपने प्रोजेक्ट्स के वास्तविक उदाहरण साझा करें (STAR विधि का उपयोग करें)।\n4. आत्मविश्वास बनाए रखें और स्पष्ट संचार करें।",
        resume: "एक बेहतरीन रिज्यूमे के लिए:\n• 1 पेज का साफ और स्पष्ट फॉर्मेट रखें।\n• अपने कार्यों के परिणाम आंकड़ों में दिखाएं (जैसे '40% प्रदर्शन बढ़ाया')।\n• नौकरी से जुड़े कीवर्ड्स शामिल करें।\n• GitHub और लाइव प्रोजेक्ट्स के लिंक जोड़ें।",
        interview: "करियर कम्पास में आप AI मॉक इंटरव्यू दे सकते हैं! 'Interview' सेक्शन में जाएं और वास्तविक समय में फीडबैक के साथ अभ्यास शुरू करें।",
        default: "पूछने के लिए धन्यवाद! कम्पास मित्र के साथ आप मॉक इंटरव्यू दे सकते हैं, अपना रिज्यूमे चेक कर सकते हैं और नए कौशल सीख सकते हैं। आप किस विषय में अधिक जानकारी चाहते हैं?",
    },
    mr: {
        welcome: "नमस्कार! मी कंपास मित्र (Compass Mitra), तुमचा AI करिअर मार्गदर्शक. मुलाखतीची तयारी, रेझ्युमे किंवा करिअर मार्गदर्शनात मी तुम्हाला कशी मदत करू शकतो?",
        tips: "मुलाखतीसाठी महत्त्वाच्या टिप्स:\n1. उत्तरे देताना स्पष्ट आणि आत्मविश्वासाने बोला.\n2. कोडिंग आणि तांत्रिक संकल्पनांचा सराव करा.\n3. तुमच्या मागील प्रोजेक्ट्सबद्दल सविस्तर सांगा.\n4. STAR पद्धतीचा वापर करून अनुभवाचे वर्णन करा.",
        resume: "उत्तम रेझ्युमेसाठी:\n• रेझ्युमे 1 पृष्ठाचा ठेवा.\n• प्रोजेक्ट्सच्या यशोगाथा आकड्यांमध्ये मांडा.\n• योग्य तांत्रिक कौशल्ये (Skills) ठळक करा.\n• GitHub आणि प्रोजेक्ट लिंक्स समाविष्ट करा.",
        interview: "करिअर कंपासवर तुम्ही AI मॉक इंटरव्यू देऊ शकता! 'Interview' विभागात जाऊन लगेच सराव सुरू करा आणि मूल्यांकन मिळवा.",
        default: "विचारल्याबद्दल धन्यवाद! कंपास मित्रासोबत तुम्ही मॉक इंटरव्यू, रेझ्युमे विश्लेषण आणि कौशल्य विकास करू शकता. तुम्हाला काय जाणून घ्यायला आवडेल?",
    },

    bn: {
        welcome: "নমস্কার! আমি কম্পাস মিত্র (Compass Mitra), আপনার এআই ক্যারিয়ার সহায়ক। ইন্টারভিউ প্রস্তুতি, জীবনবৃত্তান্ত বা ক্যারিয়ার নির্দেশনায় কীভাবে সাহায্য করতে পারি?",
        tips: "ইন্টারভিউয়ের জন্য জরুরি টিপস:\n1. সমস্যা সমাধানের সময় আপনার চিন্তাভাবনা পরিষ্কারভাবে ব্যাখ্যা করুন।\n2. মূল ডাটা স্ট্রাকচার ও প্রোগ্রামিং কনসেপ্ট অনুশীলন করুন।\n3. STAR মেথড ব্যবহার করে প্রকল্পের অভিজ্ঞতা শেয়ার করুন।\n4. আত্মবিশ্বাস ও স্পষ্ট যোগাযোগ বজায় রাখুন।",
        resume: "একটি চমৎকার জীবনবৃত্তান্তের জন্য:\n• ১ পৃষ্ঠার পরিষ্কার বিন্যাস রাখুন।\n• ফলাফলের সংখ্যা ও प्रभाव তুলে ধরুন।\n• কাজের সাথে সম্পর্কিত কীওয়ার্ড যোগ করুন।\n• গিটহাব ও লাইভ প্রোজেক্ট লিংক যুক্ত করুন।",
        interview: "ক্যারিয়ার কম্পাসে আপনি এআই মক ইন্টারভিউ দিতে পারেন! ইন্টারভিউ সেকশনে গিয়ে এখনই অনুশীলন শুরু করুন।",
        default: "জানতে চাওয়ার জন্য ধন্যবাদ! কম্পাস মিত্রের সাথে ক্যারিয়ার কম্পাসে মক ইন্টারভিউ, জীবনবৃত্তান্ত মূল্যায়ন ও কোর্স সুপারিশ পাওয়া যায়।",
    },
    te: {
        welcome: "నమస్కారం! నేను కంపాస్ మిత్ర (Compass Mitra), మీ AI కెరీర్ సహాయకుడిని. ఇంటర్వ్యూ ప్రిపరేషన్, రెజ్యూమ్ లేదా కెరీర్ మార్గదర్శకత్వంలో నేను మీకు ఎలా సహాయపడగలను?",
        tips: "ఇంటర్వ్యూ ముఖ్యాంశాలు:\n1. సమస్యను పరిష్కరించేటప్పుడు మీ ఆలోచనలను స్పష్టంగా వివరించండి.\n2. కోర్ కాన్సెప్ట్‌లపై పట్టు సాధించండి.\n3. ప్రాజెక్ట్ వివరాలను STAR పద్ధతిలో చెప్పండి.\n4. ఆత్మవిశ్వాసంతో మాట్లాడండి.",
        resume: "మంచి రెజ్యూమ్ కోసం:\n• 1 పేజీ స్పష్టమైన ఫార్మాట్ పాటించండి.\n• విజయాలను గణాంకాలతో చూపించండి.\n• సంబంధిత నైపుణ్యాలను హైలైట్ చేయండి.\n• GitHub లింక్‌లను జోడించండి.",
        interview: "కెరీర్ కంపాస్‌లో మీరు AI మాక్ ఇంటర్వ్యూలను ప్రాక్టీస్ చేయవచ్చు! వెంటనే ప్రారంభించి లైవ్ ఫీడ్‌బ్యాక్ పొందండి.",
        default: "అడిగినందుకు ధన్యవాదాలు! కంపాస్ మిత్ర ద్వారా మాక్ ఇంటర్వ్యూలు, రెజ్యూమ్ విశ్లేషణ మరియు నైపుణ్యాలను మెరుగుపరచుకోవచ్చు.",
    },
    ta: {
        welcome: "வணக்கம்! நான் காம்பஸ் மித்ரா (Compass Mitra), உங்கள் AI தொழில் வழிகாட்டி. நேர்காணல் தயாரிப்பு, ரெஸ்யூம் அல்லது தொழில் வழிகாட்டுதலில் நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
        tips: "நேர்காணல் குறிப்புகள்:\n1. உங்கள் சிந்தனையை தெளிவாக விளக்குங்கள்.\n2. அடிப்படை தொழில்நுட்ப கருத்துக்களை பயிற்சி செய்யுங்கள்.\n3. STAR முறையைப் பயன்படுத்தி திட்ட அனுபவங்களை பகிருங்கள்.\n4. நம்பிக்கையுடன் பதிலளியுங்கள்.",
        resume: "சிறந்த ரெஸ்யூமுக்கு:\n• 1 பக்கத்தில் நேர்த்தியாக அமைக்கவும்.\n• சாதனைகளை எண்களுடன் குறிப்பிடவும்.\n• பொருத்தமான முக்கிய சொற்களை சேர்க்கவும்.\n• GitHub மற்றும் நேரடி இணைப்புகளை சேர்க்கவும்.",
        interview: "கேரியர் காம்பஸில் AI மாக் நேர்காணல்களை பயிற்சி செய்து உடனுக்குடன் பின்னூட்டம் பெறுங்கள்!",
        default: "கேட்டதற்கு நன்றி! காம்பஸ் மித்ரா மூலம் மாக் நேர்காணல், ரெஸ்யூம் பகுப்பாய்வு மற்றும் திறன்களை வளர்க்கலாம்.",
    },
    gu: {
        welcome: "નમસ્તે! હું કંપાસ મિત્ર (Compass Mitra), તમારો AI કરિયર સાથી. ઇન્ટરવ્યુ તૈયારી, રેઝ્યૂમે અથવા કરિયર માર્ગદર્શનમાં હું તમને કેવી રીતે મદદ કરી શકું?",
        tips: "ઇન્ટરવ્યુ માટે મહત્વપૂર્ણ ટિપ્સ:\n1. સમસ્યા ઉકેલતી વખતે તમારી વિચારસરણી સ્પષ્ટપણે સમજાવો.\n2. ટેકનિકલ ખ્યાલોનો સારો અભ્યાસ કરો.\n3. STAR પદ્ધતિનો ઉપયોગ કરીને પ્રોજેક્ટ્સ સમજાવો.\n4. આત્મવિશ્વાસ સાથે વાતચીત કરો.",
        resume: "શ્રેષ્ઠ રેઝ્યૂમે માટે:\n• ૧ પેજનો સ્પષ્ટ લેઆઉટ રાખો.\n• તમારા કાર્યોના પરિણામો આંકડામાં દર્શાવો.\n• યોગ્ય ટેકનિકલ કૌશલ્યો ઉમેરો.\n• GitHub અને લાઇવ લિંક્સ જોડો.",
        interview: "કરિયર કંપાસ પર તમે AI મોક ઇન્ટરવ્યુ આપી શકો છો! ઇન્ટરવ્યુ વિભાગમાં જઈને પ્રેક્ટિસ શરૂ કરો.",
        default: "પૂછવા બદલ આભાર! કંપાસ મિત્ર સાથે કરિયર કંપાસ પર તમે મોક ઇન્ટરવ્યુ, રેઝ્યૂમે વિશ્લેષણ અને કૌશલ્ય વિકાસ કરી શકો છો.",
    },
    kn: {
        welcome: "ನಮಸ್ಕಾರ! ನಾನು ಕಂಪಾಸ್ ಮಿತ್ರ (Compass Mitra), ನಿಮ್ಮ AI ಕರಿಯರ್ ಸಹಾಯಕ. ಸಂದರ್ಶನದ ಸಿದ್ಧತೆ, ರೆಸ್ಯೂಮ್ ಅಥವಾ ಕರಿಯರ್ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
        tips: "ಸಂದರ್ಶನಕ್ಕಾಗಿ ಪ್ರಮುಖ ಸಲಹೆಗಳು:\n1. ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸುವಾಗ ನಿಮ್ಮ ಆಲೋಚನೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಿ.\n2. ಮೂಲಭೂತ ತಾಂತ್ರಿಕ ವಿಷಯಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ.\n3. STAR ವಿಧಾನವನ್ನು ಬಳಸಿ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.\n4. ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಮಾತನಾಡಿ.",
        resume: "ಉತ್ತಮ ರೆಸ್ಯೂಮ್‌ಗಾಗಿ:\n• 1 ಪುಟದ ಸರಳ ಮತ್ತು ಸ್ಪಷ್ಟ ವಿನ್ಯಾಸವಿರಲಿ.\n• ಸಾಧನೆಗಳನ್ನು ಅಂಕಿಅಂಶಗಳೊಂದಿಗೆ ತೋರಿಸಿ.\n• ಸೂಕ್ತ ಕೌಶಲ್ಯಗಳನ್ನು ನಮೂದಿಸಿ.\n• GitHub ಮತ್ತು ಪ್ರಾಜೆಕ್ಟ್ ಲಿಂಕ್‌ಗಳನ್ನು ಸೇರಿಸಿ.",
        interview: "ಕರಿಯರ್ ಕಂಪಾಸ್‌ನಲ್ಲಿ ನೀವು AI ಮಾಕ್ ಸಂದರ್ಶನಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಬಹುದು! ತಕ್ಷಣ ಅಭ್ಯಾಸ ಆರಂಭಿಸಿ.",
        default: "ಕೇಳಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು! ಕಂಪಾಸ್ ಮಿತ್ರ ಜೊತೆ ಕರಿಯರ್ ಕಂಪಾಸ್‌ನಲ್ಲಿ ಮಾಕ್ ಸಂದರ್ಶನ, ರೆಸ್ಯೂಮ್ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಹೊಸ ಕೌಶಲ್ಯಗಳನ್ನು ಕಲಿಯಬಹುದು.",
    },
};

function getSmartFallback(message: string, langCode: string): string {
    const code = fallbackResponses[langCode] ? langCode : "en";
    const pack = fallbackResponses[code];
    const lower = message.toLowerCase();

    if (lower.includes("tip") || lower.includes("prepare") || lower.includes("guide") || lower.includes("सुझाव") || lower.includes("ટિપ્સ") || lower.includes("సలహా") || lower.includes("குறிப்பு")) {
        return pack.tips;
    }
    if (lower.includes("resume") || lower.includes("cv") || lower.includes("बायोडाटा") || lower.includes("રેઝ્યૂમે") || lower.includes("రెజ్యూమ్")) {
        return pack.resume;
    }
    if (lower.includes("interview") || lower.includes("mock") || lower.includes("साक्षात्कार") || lower.includes("मुलाखत") || lower.includes("ઇન્ટરવ્યુ") || lower.includes("ఇంటర్వ్యూ")) {
        return pack.interview;
    }
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("नमस्ते") || lower.includes("नमस्कार") || lower.includes("வணக்கம்") || lower.includes("నమస్కారం")) {
        return pack.welcome;
    }
    return pack.default;
}

function cleanAssistantResponse(text: string): string {
    if (!text) return "";
    return text
        // Remove markdown headers like ### or ##
        .replace(/^#{1,6}\s+/gm, "")
        // Replace markdown bullet lists (* or -) at line start with clean bullets (• )
        .replace(/^(\s*)[*\-]\s+/gm, (_match, spaces) => spaces + "• ")
        // Remove bold/italic markdown asterisks: **text** or *text* -> text
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, (_match, content) => content)
        // Remove any remaining stray asterisks
        .replace(/\*/g, "")
        // Clean up excessive blank lines
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

export async function POST(req: Request) {
    try {
        const { message, language = "English", languageCode = "en", history = [] } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Try AI generation with Groq if API key is present
        if (groq) {
            try {
                const systemPrompt = `You are a helpful, empathetic, and expert multilingual AI Career Assistant for "Career Compass" — an AI-powered career platform providing AI Mock Interviews, Resume ATS Analysis, Skill Gap Assessments, SWAYAM Course Recommendations, and Placement Insights.

Instructions:
1. ALWAYS reply in the user's requested language: "${language}" (Language Code: "${languageCode}").
2. Answer career, technical interview, resume, coding, and platform navigation questions clearly, concisely, and encouragingly.
3. Keep answers compact (max 3-5 short paragraphs or bullet points) suitable for a popup chat window.
4. If asked about platform features, guide them to:
   - Mock Technical Interview (Adaptive difficulty & instant scoring)
   - Resume ATS Analysis & Feedback
   - Skill Self-Rating & Gap Identifier
   - SWAYAM Government Certified Courses
   - Placement & Salary Trends
5. Maintain a polite, professional, yet warm tone.
6. FORMATTING: NEVER use asterisks (* or **) anywhere in your response. Do not use bold stars or italic stars. Use standard bullet points (•) for lists, numbered steps (1., 2.), and clean, readable spacing with clear titles instead.`;

                const formattedMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
                    { role: "system", content: systemPrompt },
                ];

                // Append past history if available
                if (Array.isArray(history)) {
                    for (const item of history.slice(-6)) {
                        if (item.sender === "user" || item.sender === "assistant") {
                            formattedMessages.push({
                                role: item.sender === "user" ? "user" : "assistant",
                                content: String(item.text),
                            });
                        }
                    }
                }

                formattedMessages.push({ role: "user", content: message });

                let reply: string | null | undefined = null;
                try {
                    const completion = await groq.chat.completions.create({
                        model: "openai/gpt-oss-120b",
                        temperature: 0.6,
                        max_tokens: 1024,
                        messages: formattedMessages,
                    });
                    reply = completion.choices[0]?.message?.content;
                } catch (primaryModelError) {
                    console.warn("Primary Groq model error, retrying with openai/gpt-oss-20b:", primaryModelError);
                    const fallbackCompletion = await groq.chat.completions.create({
                        model: "openai/gpt-oss-20b",
                        temperature: 0.6,
                        max_tokens: 1024,
                        messages: formattedMessages,
                    });
                    reply = fallbackCompletion.choices[0]?.message?.content;
                }

                if (reply && reply.trim().length > 0) {
                    return NextResponse.json({ reply: cleanAssistantResponse(reply) });
                }
            } catch (aiError) {
                console.warn("Groq assistant API error, using smart multilingual fallback:", aiError);
            }
        }

        // Fallback response if Groq is unavailable or key not configured
        const fallbackReply = getSmartFallback(message, languageCode);
        return NextResponse.json({ reply: cleanAssistantResponse(fallbackReply) });
    } catch (err: any) {
        console.error("Assistant API handler error:", err);
        return NextResponse.json(
            { error: "Failed to process assistant message", details: err?.message },
            { status: 500 }
        );
    }
}
