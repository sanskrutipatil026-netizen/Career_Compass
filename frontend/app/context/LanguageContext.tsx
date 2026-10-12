"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
}

export const INDIAN_LANGUAGES: LanguageItem[] = [
  { code: "en", name: "English", nativeName: "English", speechCode: "en-US" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", speechCode: "hi-IN" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", speechCode: "mr-IN" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", speechCode: "bn-IN" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", speechCode: "te-IN" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", speechCode: "ta-IN" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", speechCode: "gu-IN" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", speechCode: "kn-IN" },
];

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const platformTranslations: Record<string, Record<string, string>> = {
  en: {
    brand_name: "Career Compass",
    tagline: "AI-Powered Career & Placement Platform",
    nav_features: "Features",
    nav_how_it_works: "How It Works",
    nav_dashboard: "Dashboard",
    nav_practice: "Practice",
    nav_my_sessions: "My Sessions",
    nav_logout: "Logout",
    nav_login: "Sign In",
    nav_signup: "Create Account",
    
    // Auth Page
    hero_badge: "Your Personal AI Career Growth Hub",
    hero_title_1: "Master Technical Interviews with ",
    hero_title_2: "Adaptive AI",
    hero_desc: "Practice real-time technical interviews, evaluate your ATS resume score, discover skill gaps, and explore certified courses.",
    feature_mock_title: "Adaptive Mock Interviews",
    feature_mock_desc: "Real-time technical scoring & feedback",
    feature_resume_title: "ATS Resume Analyzer",
    feature_resume_desc: "Instant match score & skill breakdown",
    feature_multilingual_title: "Multilingual Assistant",
    feature_multilingual_desc: "Speak & learn in 8+ Indian languages",
    feature_courses_title: "Certified Courses",
    feature_courses_desc: "SWAYAM & NPTEL course recommendations",

    auth_welcome_back: "Welcome back!",
    auth_welcome_sub: "Enter your email & password to access your interviews.",
    auth_join: "Join Career Compass",
    auth_join_sub: "Fill in your details to start practicing today.",
    auth_name_label: "Full Name",
    auth_name_placeholder: "e.g. Alex Johnson",
    auth_email_label: "Email Address",
    auth_email_placeholder: "student@example.com",
    auth_password_label: "Password",
    auth_confirm_password: "Confirm Password",
    auth_remember: "Remember me",
    auth_forgot: "Forgot password?",
    auth_btn_signin: "Sign In to Dashboard →",
    auth_btn_signup: "Create Account & Continue →",
    auth_switch_to_signup: "Don't have an account?",
    auth_switch_to_signin: "Already have an account?",

    // Dashboard
    dash_greeting: "Welcome Back 👋",
    dash_title: "Your Dashboard",
    dash_btn_new_interview: "⚡ New Interview",
    dash_total_sessions: "Total Sessions",
    dash_avg_score: "Average Score",
    dash_highest_score: "Highest Score",
    dash_practice_time: "Practice Time",
    dash_recent_activity: "Recent Activity & History",
    dash_hi: "Hi",

    // Personal Details Onboarding
    pd_title: "Student Profile & Details",
    pd_subtitle: "Complete your profile to get personalized recommendations and ATS resume matching",
    pd_phone_label: "Phone Number",
    pd_city_label: "City / Location",
    pd_college_label: "College / University Name",
    pd_branch_label: "Branch / Specialization",
    pd_cgpa_label: "CGPA / Percentage",
    pd_experience_label: "Years of Experience",
    pd_btn_save: "Save & Continue to Dashboard →",
    pd_btn_draft: "Save Draft",

    // Assistant Widget
    assistant_title: "Career Compass AI",
    assistant_subtitle: "Multilingual Career & Interview Assistant",
    assistant_placeholder: "Ask anything about interviews, resume, careers...",
    assistant_badge: "Multilingual Career AI",
  },

  hi: {
    brand_name: "करियर कम्पास",
    tagline: "एआई-संचालित करियर और प्लेसमेंट प्लेटफॉर्म",
    nav_features: "विशेषताएं",
    nav_how_it_works: "यह कैसे काम करता है",
    nav_dashboard: "डैशबोर्ड",
    nav_practice: "अभ्यास",
    nav_my_sessions: "मेरे सत्र",
    nav_logout: "लॉग आउट",
    nav_login: "साइन इन",
    nav_signup: "खाता बनाएं",

    // Auth Page
    hero_badge: "आपका व्यक्तिगत एआई करियर ग्रोथ हब",
    hero_title_1: "तकनीकी इंटरव्यू में महारत हासिल करें ",
    hero_title_2: "अनुकूली एआई के साथ",
    hero_desc: "वास्तविक समय में तकनीकी इंटरव्यू का अभ्यास करें, अपने रिज्यूमे का एटीएस स्कोर जांचें, कौशल अंतराल खोजें और प्रमाणित पाठ्यक्रम देखें।",
    feature_mock_title: "अनुकूली मॉक इंटरव्यू",
    feature_mock_desc: "रियल-टाइम स्कोरिंग और त्वरित फीडबैक",
    feature_resume_title: "एटीएस रिज्यूमे विश्लेषक",
    feature_resume_desc: "त्वरित मैच स्कोर और कौशल विवरण",
    feature_multilingual_title: "बहुभाषी सहायक",
    feature_multilingual_desc: "भारतीय भाषाओं में बात करें और सीखें",
    feature_courses_title: "प्रमाणित पाठ्यक्रम",
    feature_courses_desc: "स्वयं (SWAYAM) कोर्स अनुशंसाएं",

    auth_welcome_back: "वापसी पर स्वागत है!",
    auth_welcome_sub: "अपने इंटरव्यू तक पहुँचने के लिए ईमेल और पासवर्ड दर्ज करें।",
    auth_join: "करियर कम्पास से जुड़ें",
    auth_join_sub: "आज ही अभ्यास शुरू करने के लिए अपना विवरण भरें।",
    auth_name_label: "पूरा नाम",
    auth_name_placeholder: "उदा. राहुल शर्मा",
    auth_email_label: "ईमेल पता",
    auth_email_placeholder: "student@example.com",
    auth_password_label: "पासवर्ड",
    auth_confirm_password: "पासवर्ड की पुष्टि करें",
    auth_remember: "मुझे याद रखें",
    auth_forgot: "पासवर्ड भूल गए?",
    auth_btn_signin: "डैशबोर्ड में साइन इन करें →",
    auth_btn_signup: "खाता बनाएं और आगे बढ़ें →",
    auth_switch_to_signup: "खाता नहीं है?",
    auth_switch_to_signin: "पहले से खाता है?",

    // Dashboard
    dash_greeting: "वापसी पर स्वागत है 👋",
    dash_title: "आपका डैशबोर्ड",
    dash_btn_new_interview: "⚡ नया इंटरव्यू",
    dash_total_sessions: "कुल सत्र",
    dash_avg_score: "औसत स्कोर",
    dash_highest_score: "सर्वोच्च स्कोर",
    dash_practice_time: "अभ्यास समय",
    dash_recent_activity: "हाल की गतिविधियाँ और इतिहास",
    dash_hi: "नमस्ते",

    // Personal Details Onboarding
    pd_title: "छात्र प्रोफ़ाइल और विवरण",
    pd_subtitle: "व्यक्तिगत अनुशंसाएं और एटीएस रिज्यूमे मिलान प्राप्त करने के लिए अपनी प्रोफ़ाइल पूरी करें",
    pd_phone_label: "फ़ोन नंबर",
    pd_city_label: "शहर / स्थान",
    pd_college_label: "कॉलेज / विश्वविद्यालय का नाम",
    pd_branch_label: "शाखा / विशेषज्ञता",
    pd_cgpa_label: "सीजीपीए / प्रतिशत",
    pd_experience_label: "अनुभव (वर्ष)",
    pd_btn_save: "सहेजें और डैशबोर्ड पर जाएं →",
    pd_btn_draft: "ड्राफ्ट सहेजें",

    // Assistant Widget
    assistant_title: "करियर कम्पास एआई",
    assistant_subtitle: "बहुभाषी करियर और इंटरव्यू सहायक",
    assistant_placeholder: "इंटरव्यू, रिज्यूमे या करियर के बारे में पूछें...",
    assistant_badge: "बहुभाषी करियर एआई",
  },

  mr: {
    brand_name: "करिअर कंपास",
    tagline: "एआय-संचलित करिअर आणि प्लेसमेंट प्लॅटफॉर्म",
    nav_features: "वैशिष्ट्ये",
    nav_how_it_works: "कसे कार्य करते",
    nav_dashboard: "डॅशबोर्ड",
    nav_practice: "सराव",
    nav_my_sessions: "माझे सेशन्स",
    nav_logout: "लॉग आउट",
    nav_login: "साइन इन",
    nav_signup: "खाते तयार करा",

    // Auth Page
    hero_badge: "तुमचे वैयक्तिक एआय करिअर ग्रोथ हब",
    hero_title_1: "तांत्रिक मुलाखतींवर प्रभुत्व मिळवा ",
    hero_title_2: "स्मार्ट एआयच्या साथीने",
    hero_desc: "रिअल-टाइम तांत्रिक मुलाखतींचा सराव करा, रेझ्युमेचा ATS स्कोअर तपासा, कौशल्ये वाढवा आणि सरकारी प्रमाणित कोर्सेस शोधा.",
    feature_mock_title: "अ‍ॅडॉप्टिव्ह मॉक मुलाखती",
    feature_mock_desc: "रिअल-टाइम स्कोअरिंग आणि फीडबॅक",
    feature_resume_title: "ATS रेझ्युमे विश्लेषक",
    feature_resume_desc: "त्वरित स्कोअर आणि कौशल्य विश्लेषण",
    feature_multilingual_title: "बहुभाषिक सहाय्यक",
    feature_multilingual_desc: "मराठी आणि भारतीय भाषांमध्ये शिका",
    feature_courses_title: "प्रमाणित कोर्सेस",
    feature_courses_desc: "स्वयं (SWAYAM) कोर्स शिफारसी",

    auth_welcome_back: "पुन्हा स्वागत आहे!",
    auth_welcome_sub: "मुलाखतींमध्ये प्रवेश करण्यासाठी ईमेल आणि पासवर्ड टाका.",
    auth_join: "करिअर कंपासमध्ये सामील व्हा",
    auth_join_sub: "सराव सुरू करण्यासाठी माहिती भरा.",
    auth_name_label: "पूर्ण नाव",
    auth_name_placeholder: "उदा. अमित पाटील",
    auth_email_label: "ईमेल पत्ता",
    auth_email_placeholder: "student@example.com",
    auth_password_label: "पासवर्ड",
    auth_confirm_password: "पासवर्ड पुष्टी करा",
    auth_remember: "लक्षात ठेवा",
    auth_forgot: "पासवर्ड विसरलात?",
    auth_btn_signin: "डॅशबोर्डवर साइन इन करा →",
    auth_btn_signup: "खाते तयार करा आणि पुढे जा →",
    auth_switch_to_signup: "खाते नाही का?",
    auth_switch_to_signin: "आधीच खाते आहे?",

    // Dashboard
    dash_greeting: "पुन्हा स्वागत आहे 👋",
    dash_title: "तुमचा डॅशबोर्ड",
    dash_btn_new_interview: "⚡ नवीन मुलाखत",
    dash_total_sessions: "एकूण सेशन्स",
    dash_avg_score: "सरासरी गुण",
    dash_highest_score: "सर्वोच्च गुण",
    dash_practice_time: "सरावाचा वेळ",
    dash_recent_activity: "अलीकडील इतिहास",
    dash_hi: "नमस्कार",

    // Personal Details Onboarding
    pd_title: "विद्यार्थी प्रोफाइल आणि तपशील",
    pd_subtitle: "योग्य मार्गदर्शन आणि रेझ्युमे तपासणीसाठी प्रोफाइल पूर्ण करा",
    pd_phone_label: "फोन नंबर",
    pd_city_label: "शहर / ठिकाण",
    pd_college_label: "कॉलेज / विद्यापीठाचे नाव",
    pd_branch_label: "शाखा / पदवी",
    pd_cgpa_label: "सीजीपीए (CGPA)",
    pd_experience_label: "अनुभव (वर्षे)",
    pd_btn_save: "जतन करा आणि डॅशबोर्डवर जा →",
    pd_btn_draft: "मसुदा जतन करा",

    // Assistant Widget
    assistant_title: "करिअर कंपास एआय",
    assistant_subtitle: "बहुभाषिक करिअर आणि मुलाखत सहाय्यक",
    assistant_placeholder: "मुलाखत, रेझ्युमे किंवा करिअरबद्दल विचारा...",
    assistant_badge: "बहुभाषिक करिअर एआय",
  },

  bn: {
    brand_name: "ক্যারিয়ার কম্পাস",
    tagline: "এআই-চালিত ক্যারিয়ার ও প্লেসমেন্ট প্ল্যাটফর্ম",
    nav_features: "বৈশিষ্ট্য",
    nav_how_it_works: "কীভাবে কাজ করে",
    nav_dashboard: "ড্যাশবোর্ড",
    nav_practice: "অনুশীলন",
    nav_my_sessions: "আমার সেশন",
    nav_logout: "লগ আউট",
    nav_login: "সাইন ইন",
    nav_signup: "অ্যাকাউন্ট তৈরি করুন",

    hero_badge: "আপনার ব্যক্তিগত এআই ক্যারিয়ার গ্রোথ হাব",
    hero_title_1: "টেকনিক্যাল ইন্টারভিউতে দক্ষতা অর্জন করুন ",
    hero_title_2: "অ্যাডাপ্টিভ এআই-এর সাথে",
    hero_desc: "রিয়েল-টাইম মক ইন্টারভিউ অনুশীলন করুন, জীবনবৃত্তান্তের ATS স্কোর জানুন এবং কোর্স খুঁজুন।",
    feature_mock_title: "অ্যাডাপ্টিভ মক ইন্টারভিউ",
    feature_mock_desc: "তাৎক্ষণিক মূল্যায়ন ও মতামত",
    feature_resume_title: "ATS সিভি বিশ্লেষক",
    feature_resume_desc: "দ্রুত ম্যাচ স্কোর ও দক্ষতা বিশ্লেষণ",
    feature_multilingual_title: "বহুভাষিক সহকারী",
    feature_multilingual_desc: "বাংলা ও ভারতীয় ভাষায় শিখুন",
    feature_courses_title: "প্রমাণিত কোর্স",
    feature_courses_desc: "SWAYAM কোর্স সুপারিশ",

    auth_welcome_back: "স্বাগতম!",
    auth_welcome_sub: "আপনার অ্যাকাউন্টে প্রবেশ করতে ইমেল ও পাসওয়ার্ড দিন।",
    auth_join: "ক্যারিয়ার কম্পাসে যোগ দিন",
    auth_join_sub: "অনুশীলন শুরু করতে তথ্য পূরণ করুন।",
    auth_name_label: "পুরো নাম",
    auth_name_placeholder: "উদাঃ রাহুল ব্যানার্জি",
    auth_email_label: "ইমেল ঠিকানা",
    auth_email_placeholder: "student@example.com",
    auth_password_label: "পাসওয়ার্ড",
    auth_confirm_password: "পাসওয়ার্ড নিশ্চিত করুন",
    auth_remember: "মনে রাখুন",
    auth_forgot: "পাসওয়ার্ড ভুলে গেছেন?",
    auth_btn_signin: "ড্যাশবোর্ডে সাইন ইন করুন →",
    auth_btn_signup: "অ্যাকাউন্ট তৈরি করুন →",
    auth_switch_to_signup: "অ্যাকাউন্ট নেই?",
    auth_switch_to_signin: "ইতিমধ্যে অ্যাকাউন্ট আছে?",

    dash_greeting: "স্বাগতম 👋",
    dash_title: "আপনার ড্যাশবোর্ড",
    dash_btn_new_interview: "⚡ নতুন ইন্টারভিউ",
    dash_total_sessions: "মোট সেশন",
    dash_avg_score: "গড় স্কোর",
    dash_highest_score: "সর্বোচ্চ স্কোর",
    dash_practice_time: "অনুশীলন সময়",
    dash_recent_activity: "সাম্প্রতিক ইতিহাস",
    dash_hi: "নমস্কার",

    pd_title: "শিক্ষার্থীর প্রোফাইল ও তথ্য",
    pd_subtitle: "সুপারিশ পেতে আপনার প্রোফাইল সম্পূর্ণ করুন",
    pd_phone_label: "ফোন নম্বর",
    pd_city_label: "শহর",
    pd_college_label: "কলেজ / বিশ্ববিদ্যালয়ের নাম",
    pd_branch_label: "বিভাগ / শাখা",
    pd_cgpa_label: "সিজিপিএ (CGPA)",
    pd_experience_label: "অভিজ্ঞতা (বছর)",
    pd_btn_save: "সংরক্ষণ করুন ও ড্যাশবোর্ডে যান →",
    pd_btn_draft: "ড্রাফট সংরক্ষণ করুন",

    assistant_title: "ক্যারিয়ার কম্পাস এআই",
    assistant_subtitle: "বহুভাষিক ক্যারিয়ার সহকারী",
    assistant_placeholder: "ইন্টারভিউ বা ক্যারিয়ার নিয়ে প্রশ্ন করুন...",
    assistant_badge: "বহুভাষিক ক্যারিয়ার এআই",
  },

  te: {
    brand_name: "కెరీర్ కంపాస్",
    tagline: "AI ఆధారిత కెరీర్ & ప్లేస్‌మెంట్ ప్లాట్‌ఫామ్",
    nav_features: "ఫీచర్లు",
    nav_how_it_works: "ఇది ఎలా పనిచేస్తుంది",
    nav_dashboard: "డ్యాష్‌బోర్డ్",
    nav_practice: "ప్రాక్టీస్",
    nav_my_sessions: "నా సెషన్‌లు",
    nav_logout: "లాగ్ అవుట్",
    nav_login: "సైన్ ఇన్",
    nav_signup: "ఖాతా సృష్టించండి",

    hero_badge: "మీ వ్యక్తిగత AI కెరీర్ గ్రోత్ హబ్",
    hero_title_1: "టెక్నికల్ ఇంటర్వ్యూలలో నైపుణ్యం పొందండి ",
    hero_title_2: "స్మార్ట్ AI తో",
    hero_desc: "రియల్-టైమ్ మాక్ ఇంటర్వ్యూలను ప్రాక్టీస్ చేయండి, రెజ్యూమ్ ATS స్కోర్ తెలుసుకోండి మరియు సర్టిఫైడ్ కోర్సులను కనుగొనండి.",
    feature_mock_title: "అడాప్టివ్ మాక్ ఇంటర్వ్యూలు",
    feature_mock_desc: "రియల్ టైమ్ స్కోరింగ్ & ఫీడ్‌బ్యాక్",
    feature_resume_title: "ATS రెజ్యూమ్ ఎనలైజర్",
    feature_resume_desc: "తక్షణ స్కోర్ & నైపుణ్యాల వివరాలు",
    feature_multilingual_title: "బహుభాషా సహాయకుడు",
    feature_multilingual_desc: "తెలుగు & భారతీయ భాషల్లో నేర్చుకోండి",
    feature_courses_title: "సర్టిఫైడ్ కోర్సులు",
    feature_courses_desc: "SWAYAM కోర్సు సిఫార్సులు",

    auth_welcome_back: "తిరిగి స్వాగతం!",
    auth_welcome_sub: "మీ ఖాతాలోకి ప్రవేశించడానికి ఈమెయిల్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.",
    auth_join: "కెరీర్ కంపాస్‌లో చేరండి",
    auth_join_sub: "ప్రాక్టీస్ ప్రారంభించడానికి మీ వివరాలను పూరించండి.",
    auth_name_label: "పూర్తి పేరు",
    auth_name_placeholder: "ఉదా. రమేష్ వర్మ",
    auth_email_label: "ఈమెయిల్ చిరునామా",
    auth_email_placeholder: "student@example.com",
    auth_password_label: "పాస్‌వర్డ్",
    auth_confirm_password: "పాస్‌వర్డ్ నిర్ధారించండి",
    auth_remember: "నన్ను గుర్తుంచుకో",
    auth_forgot: "పాస్‌వర్డ్ మర్చిపోయారా?",
    auth_btn_signin: "డ్యాష్‌బోర్డ్‌లోకి సైన్ ఇన్ చేయండి →",
    auth_btn_signup: "ఖాతా సృష్టించండి & కొనసాగండి →",
    auth_switch_to_signup: "ఖాతా లేదా?",
    auth_switch_to_signin: "ఇప్పటికే ఖాతా ఉందా?",

    dash_greeting: "స్వాగతం 👋",
    dash_title: "మీ డ్యాష్‌బోర్డ్",
    dash_btn_new_interview: "⚡ కొత్త ఇంటర్వ్యూ",
    dash_total_sessions: "మొత్తం సెషన్‌లు",
    dash_avg_score: "సగటు స్కోరు",
    dash_highest_score: "అత్యధిక స్కోరు",
    dash_practice_time: "ప్రాక్టీస్ సమయం",
    dash_recent_activity: "ఇటీవలి చరిత్ర",
    dash_hi: "నమస్కారం",

    pd_title: "విద్యార్థి ప్రొఫైల్ & వివరాలు",
    pd_subtitle: "వ్యక్తిగతీకరించిన సిఫార్సుల కోసం మీ ప్రొఫైల్‌ను పూర్తి చేయండి",
    pd_phone_label: "ఫోన్ నంబర్",
    pd_city_label: "నగరం",
    pd_college_label: "కళాశాల / విశ్వవిద్యాలయం పేరు",
    pd_branch_label: "బ్రాంచ్ / స్పెషలైజేషన్",
    pd_cgpa_label: "CGPA / శాతం",
    pd_experience_label: "అనుభవం (సంవత్సరాలు)",
    pd_btn_save: "సేవ్ చేసి డ్యాష్‌బోర్డ్‌కు వెళ్లండి →",
    pd_btn_draft: "డ్రాఫ్ట్ సేవ్ చేయండి",

    assistant_title: "కెరీర్ కంపాస్ AI",
    assistant_subtitle: "బహుభాషా కెరీర్ సహాయకుడు",
    assistant_placeholder: "ఇంటర్వ్యూలు, రెజ్యూమ్ గురించి అడగండి...",
    assistant_badge: "బహుభాషా కెరీర్ AI",
  },

  ta: {
    brand_name: "கேரியர் காம்பஸ்",
    tagline: "AI-ஆல் இயங்கும் தொழில் & வேலைவாய்ப்பு தளம்",
    nav_features: "அம்சங்கள்",
    nav_how_it_works: "எப்படி செயல்படுகிறது",
    nav_dashboard: "டாஷ்போர்டு",
    nav_practice: "பயிற்சி",
    nav_my_sessions: "எனது அமர்வுகள்",
    nav_logout: "வெளியேறு",
    nav_login: "உள்நுழைக",
    nav_signup: "கணக்கு தொடங்க",

    hero_badge: "உங்கள் தனிப்பயன் AI தொழில் வழிகாட்டி",
    hero_title_1: "தொழில்நுட்ப நேர்காணல்களில் வெல்லுங்கள் ",
    hero_title_2: "AI வழிகாட்டுதலுடன்",
    hero_desc: "நேர்காணல் பயிற்சி பெறுங்கள், ரெஸ்யூம் ATS மதிப்பெண் அறியுங்கள் மற்றும் சிறந்த சான்றிதழ் படிப்புகளை கண்டறியுங்கள்.",
    feature_mock_title: "AI மாக் நேர்காணல்",
    feature_mock_desc: "உடனடி மதிப்பீடு மற்றும் பின்னூட்டம்",
    feature_resume_title: "ATS ரெஸ்யூம் பகுப்பாய்வு",
    feature_resume_desc: "மதிப்பெண் & திறன்கள் ஆய்வு",
    feature_multilingual_title: "பன்மொழி உதவியாளர்",
    feature_multilingual_desc: "தமிழ் & இந்திய மொழிகளில் கற்றிடுங்கள்",
    feature_courses_title: "சான்றிதழ் படிப்புகள்",
    feature_courses_desc: "SWAYAM பாடநெறி பரிந்துரைகள்",

    auth_welcome_back: "மீண்டும் வருக!",
    auth_welcome_sub: "உங்கள் கணக்கில் நுழைய மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.",
    auth_join: "கேரியர் காம்பஸில் இணையுங்கள்",
    auth_join_sub: "பயிற்சியை தொடங்க விவரங்களை பூர்த்தி செய்க.",
    auth_name_label: "முழு பெயர்",
    auth_name_placeholder: "எ.கா. கார்த்திக் ராஜா",
    auth_email_label: "மின்னஞ்சல் முகவரி",
    auth_email_placeholder: "student@example.com",
    auth_password_label: "கடவுச்சொல்",
    auth_confirm_password: "கடவுச்சொல்லை உறுதி செய்க",
    auth_remember: "என்னை நினைவில் கொள்",
    auth_forgot: "கடவுச்சொல் மறந்துவிட்டதா?",
    auth_btn_signin: "டாஷ்போர்டில் உள்நுழைக →",
    auth_btn_signup: "கணக்கு உருவாக்கி தொடரவும் →",
    auth_switch_to_signup: "கணக்கு இல்லையா?",
    auth_switch_to_signin: "ஏற்கனவே கணக்கு உள்ளதா?",

    dash_greeting: "வணக்கம் 👋",
    dash_title: "உங்கள் டாஷ்போர்டு",
    dash_btn_new_interview: "⚡ புதிய நேர்காணல்",
    dash_total_sessions: "மொத்த அமர்வுகள்",
    dash_avg_score: "சராசரி மதிப்பெண்",
    dash_highest_score: "அதிகபட்ச மதிப்பெண்",
    dash_practice_time: "பயிற்சி நேரம்",
    dash_recent_activity: "சமீபத்திய வரலாறு",
    dash_hi: "வணக்கம்",

    pd_title: "மாணவர் சுயவிவரம்",
    pd_subtitle: "சிறந்த பரிந்துரைகளுக்கு சுயவிவரத்தை முழுமையாக்குங்கள்",
    pd_phone_label: "தொலைபேசி எண்",
    pd_city_label: "நகரம்",
    pd_college_label: "கல்லூரி / பல்கலைக்கழக பெயர்",
    pd_branch_label: "துறை / படிப்பு",
    pd_cgpa_label: "CGPA / சதவீதம்",
    pd_experience_label: "அனுபவம் (ஆண்டுகள்)",
    pd_btn_save: "சேமித்து டாஷ்போர்டுக்கு செல்க →",
    pd_btn_draft: "வரைவை சேமிக்க",

    assistant_title: "கேரியர் காம்பஸ் AI",
    assistant_subtitle: "பன்மொழி தொழில் உதவியாளர்",
    assistant_placeholder: "நேர்காணல் அல்லது ரெஸ்யூம் பற்றி கேட்கவும்...",
    assistant_badge: "பன்மொழி AI உதவியாளர்",
  },

  gu: {
    brand_name: "કરિયર કંપાસ",
    tagline: "AI-સંચાલિત કરિયર અને પ્લેસમેન્ટ પ્લેટફોર્મ",
    nav_features: "વિશેષતાઓ",
    nav_how_it_works: "કેવી રીતે કામ કરે છે",
    nav_dashboard: "ડેશબોર્ડ",
    nav_practice: "પ્રેક્ટિસ",
    nav_my_sessions: "મારા સત્રો",
    nav_logout: "લૉગ આઉટ",
    nav_login: "સાઇન ઇન",
    nav_signup: "ખાતું બનાવો",

    hero_badge: "તમારું વ્યક્તિગત AI કરિયર હબ",
    hero_title_1: "ટેકનિકલ ઇન્ટરવ્યુમાં શ્રેષ્ઠતા મેળવો ",
    hero_title_2: "સ્માર્ટ AI ની સાથે",
    hero_desc: "રિયલ-ટાઇમ મોક ઇન્ટરવ્યુની પ્રેક્ટિસ કરો, રેઝ્યૂમે ATS સ્કોર જાણો અને પ્રમાણિત અભ્યાસક્રમો શોધો.",
    feature_mock_title: "અનુકૂલનક્ષમ મોક ઇન્ટરવ્યુ",
    feature_mock_desc: "રિયલ-ટાઇમ સ્કોરિંગ અને પ્રતિસાદ",
    feature_resume_title: "ATS રેઝ્યૂમે વિશ્લેષક",
    feature_resume_desc: "ઝડપી સ્કોર અને કૌશલ્ય વિશ્લેષણ",
    feature_multilingual_title: "બહુભાષી સહાયક",
    feature_multilingual_desc: "ગુજરાતી અને ભારતીય ભાષાઓમાં શીખો",
    feature_courses_title: "પ્રમાણિત અભ્યાસક્રમો",
    feature_courses_desc: "SWAYAM કોર્સ ભલામણો",

    auth_welcome_back: "સ્વાગત છે!",
    auth_welcome_sub: "તમારા એકાઉન્ટમાં પ્રવેશવા ઇમેઇલ અને પાસવર્ડ દાખલ કરો.",
    auth_join: "કરિયર કંપાસમાં જોડાઓ",
    auth_join_sub: "પ્રેક્ટિસ શરૂ કરવા માટે માહિતી ભરો.",
    auth_name_label: "પૂરું નામ",
    auth_name_placeholder: "દા.ત. હાર્દિક પટેલ",
    auth_email_label: "ઇમેઇલ સરનામું",
    auth_email_placeholder: "student@example.com",
    auth_password_label: "પાસવર્ડ",
    auth_confirm_password: "પાસવર્ડ કન્ફર્મ કરો",
    auth_remember: "મને યાદ રાખો",
    auth_forgot: "પાસવર્ડ ભૂલી ગયા?",
    auth_btn_signin: "ડેશબોર્ડમાં સાઇન ઇન કરો →",
    auth_btn_signup: "ખાતું બનાવો અને આગળ વધો →",
    auth_switch_to_signup: "ખાતું નથી?",
    auth_switch_to_signin: "પહેલેથી ખાતું છે?",

    dash_greeting: "સ્વાગત છે 👋",
    dash_title: "તમારું ડેશબોર્ડ",
    dash_btn_new_interview: "⚡ નવો ઇન્ટરવ્યુ",
    dash_total_sessions: "કુલ સત્રો",
    dash_avg_score: "સરેરાશ સ્કોર",
    dash_highest_score: "સર્વોચ્ચ સ્કોર",
    dash_practice_time: "પ્રેક્ટિસ સમય",
    dash_recent_activity: "તાજેતરનો ઇતિહાસ",
    dash_hi: "નમસ્તે",

    pd_title: "વિદ્યાર્થી પ્રોફાઇલ અને વિગતો",
    pd_subtitle: "યોગ્ય માર્ગદર્શન માટે તમારી પ્રોફાઇલ પૂર્ણ કરો",
    pd_phone_label: "ફોન નંબર",
    pd_city_label: "શહેર",
    pd_college_label: "કોલેજ / યુનિવર્સિટીનું નામ",
    pd_branch_label: "શાખા / સ્પેશિયલાઇઝેશન",
    pd_cgpa_label: "CGPA / ટકાવારી",
    pd_experience_label: "અનુભવ (વર્ષ)",
    pd_btn_save: "સેવ કરો અને ડેશબોર્ડ પર જાઓ →",
    pd_btn_draft: "ડ્રાફ્ટ સેવ કરો",

    assistant_title: "કરિયર કંપાસ AI",
    assistant_subtitle: "બહુભાષી કરિયર સહાયક",
    assistant_placeholder: "ઇન્ટરવ્યુ અથવા રેઝ્યૂમે વિશે પૂછો...",
    assistant_badge: "બહુભાષી AI સહાયક",
  },

  kn: {
    brand_name: "ಕರಿಯರ್ ಕಂಪಾಸ್",
    tagline: "AI-ಆಧಾರಿತ ವೃತ್ತಿಜೀವನ ಮತ್ತು ಉದ್ಯೋಗ ವೇದಿಕೆ",
    nav_features: "ವೈಶಿಷ್ಟ್ಯಗಳು",
    nav_how_it_works: "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    nav_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    nav_practice: "ಅಭ್ಯಾಸ",
    nav_my_sessions: "ನನ್ನ ಸೆಷನ್‌ಗಳು",
    nav_logout: "ಲಾಗ್ ಔಟ್",
    nav_login: "ಸೈನ್ ಇನ್",
    nav_signup: "ಖಾತೆ ರಚಿಸಿ",

    hero_badge: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ AI ಕರಿಯರ್ ಹಬ್",
    hero_title_1: "ತಾಂತ್ರಿಕ ಸಂದರ್ಶನಗಳಲ್ಲಿ ಯಶಸ್ಸು ಸಾಧಿಸಿ ",
    hero_title_2: "ಸ್ಮಾರ್ಟ್ AI ಜೊತೆಗೆ",
    hero_desc: "ನೈಜ ಸಮಯದ ಮಾಕ್ ಸಂದರ್ಶನಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ, ರೆಸ್ಯೂಮ್ ATS ಸ್ಕೋರ್ ತಿಳಿಯಿರಿ ಮತ್ತು ಪ್ರಮಾಣೀಕೃತ ಕೋರ್ಸ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
    feature_mock_title: "ಅಡಾಪ್ಟಿವ್ ಮಾಕ್ ಸಂದರ್ಶನಗಳು",
    feature_mock_desc: "ನೈಜ ಸಮಯದ ಸ್ಕೋರಿಂಗ್ ಮತ್ತು ಪ್ರತಿಕ್ರಿಯೆ",
    feature_resume_title: "ATS ರೆಸ್ಯೂಮ್ ವಿಶ್ಲೇಷಕ",
    feature_resume_desc: "ತಕ್ಷಣದ ಸ್ಕೋರ್ ಮತ್ತು ಕೌಶಲ್ಯ ವಿಶ್ಲೇಷಣೆ",
    feature_multilingual_title: "ಬಹುಭಾಷಾ ಸಹಾಯಕ",
    feature_multilingual_desc: "ಕನ್ನಡ ಮತ್ತು ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಕಲಿಯಿರಿ",
    feature_courses_title: "ಪ್ರಮಾಣೀಕೃತ ಕೋರ್ಸ್‌ಗಳು",
    feature_courses_desc: "SWAYAM ಕೋರ್ಸ್ ಶಿಫಾರಸುಗಳು",

    auth_welcome_back: "ಮರಳಿ ಸುಸ್ವಾಗತ!",
    auth_welcome_sub: "ನಿಮ್ಮ ಖಾತೆಗೆ ಪ್ರವೇಶಿಸಲು ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.",
    auth_join: "ಕರಿಯರ್ ಕಂಪಾಸ್‌ಗೆ ಸೇರಿ",
    auth_join_sub: "ಅಭ್ಯಾಸ ಆರಂಭಿಸಲು ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
    auth_name_label: "ಪೂರ್ಣ ಹೆಸರು",
    auth_name_placeholder: "ಉದಾ. ಪ್ರವೀಣ್ ಕುಮಾರ್",
    auth_email_label: "ಇಮೇಲ್ ವಿಳಾಸ",
    auth_email_placeholder: "student@example.com",
    auth_password_label: "ಪಾಸ್‌ವರ್ಡ್",
    auth_confirm_password: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    auth_remember: "ನನ್ನನ್ನು ನೆನಪಿನಲ್ಲಿಡಿ",
    auth_forgot: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?",
    auth_btn_signin: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ →",
    auth_btn_signup: "ಖಾತೆ ರಚಿಸಿ & ಮುಂದುವರಿಯಿರಿ →",
    auth_switch_to_signup: "ಖಾತೆ ಇಲ್ಲವೇ?",
    auth_switch_to_signin: "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",

    dash_greeting: "ಸುಸ್ವಾಗತ 👋",
    dash_title: "ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    dash_btn_new_interview: "⚡ ಹೊಸ ಸಂದರ್ಶನ",
    dash_total_sessions: "ಒಟ್ಟು ಸೆಷನ್‌ಗಳು",
    dash_avg_score: "ಸರಾಸರಿ ಸ್ಕೋರ್",
    dash_highest_score: "ಗರಿಷ್ಠ ಸ್ಕೋರ್",
    dash_practice_time: "ಅಭ್ಯಾಸದ ಸಮಯ",
    dash_recent_activity: "ಇತ್ತೀಚಿನ ಇತಿಹಾಸ",
    dash_hi: "ನಮಸ್ಕಾರ",

    pd_title: "ವಿದ್ಯಾರ್ಥಿ ಪ್ರೊಫೈಲ್ ಮತ್ತು ವಿವರಗಳು",
    pd_subtitle: "ವೈಯಕ್ತಿಕ ಶಿಫಾರಸುಗಳಿಗಾಗಿ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ",
    pd_phone_label: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
    pd_city_label: "ನಗರ",
    pd_college_label: "ಕಾಲೇಜು / ವಿಶ್ವವಿದ್ಯಾಲಯದ ಹೆಸರು",
    pd_branch_label: "ವಿಭಾಗ / ಪದವಿ",
    pd_cgpa_label: "CGPA / ಶೇಕಡಾವಾರು",
    pd_experience_label: "ಅನುಭವ (ವರ್ಷಗಳು)",
    pd_btn_save: "ಉಳಿಸಿ ಮತ್ತು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ →",
    pd_btn_draft: "ಕರಡು ಉಳಿಸಿ",

    assistant_title: "ಕರಿಯರ್ ಕಂಪಾಸ್ AI",
    assistant_subtitle: "ಬಹುಭಾಷಾ ಕರಿಯರ್ ಸಹಾಯಕ",
    assistant_placeholder: "ಸಂದರ್ಶನ ಅಥವಾ ರೆಸ್ಯೂಮ್ ಬಗ್ಗೆ ಕೇಳಿ...",
    assistant_badge: "ಬಹುಭಾಷಾ AI ಸಹಾಯಕ",
  },
};

interface LanguageContextType {
  currentLang: LanguageItem;
  setLanguage: (langCode: string) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageItem[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<LanguageItem>(INDIAN_LANGUAGES[0]);

  useEffect(() => {
    const saved = localStorage.getItem("career_platform_lang");
    if (saved) {
      const found = INDIAN_LANGUAGES.find((l) => l.code === saved);
      if (found) setCurrentLang(found);
    }
  }, []);

  const setLanguage = (langCode: string) => {
    const found = INDIAN_LANGUAGES.find((l) => l.code === langCode);
    if (found) {
      setCurrentLang(found);
      localStorage.setItem("career_platform_lang", found.code);
      localStorage.setItem("career_assistant_lang", found.code);
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDictionary = platformTranslations[currentLang.code] || platformTranslations.en;
    if (langDictionary && langDictionary[key]) {
      return langDictionary[key];
    }
    const defaultDict = platformTranslations.en;
    return (defaultDict && defaultDict[key]) || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        setLanguage,
        t,
        languages: INDIAN_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      currentLang: INDIAN_LANGUAGES[0],
      setLanguage: () => {},
      t: (key: string, fallback?: string) => fallback || key,
      languages: INDIAN_LANGUAGES,
    };
  }
  return context;
}
