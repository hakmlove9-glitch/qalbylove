"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Children, isValidElement, useEffect, useMemo, useRef, useState } from "react";
import SignupAssistantRail from "./SignupAssistantRail";
import CountryFlag from "@/components/CountryFlag";
import {
  ArrowLeft, ArrowRight, BadgeCheck, Briefcase, CheckCircle2, Crown,
  GraduationCap, Heart, HeartHandshake, Home, LockKeyhole, Mail, MapPin,
  ShieldCheck, Sparkles, UserRound, UsersRound, XCircle, Eye, Camera, Upload, ChevronDown, Pencil, KeyRound, Search, HomeIcon, Shirt, CircleUserRound
} from "lucide-react";


const steps = ["الميثاق", "من أنت؟", "الحساب", "الموقع والعمر", "الدراسة والعمل", "الأسرة والسكن", "المظهر والصحة", "الشخصية والشريك", "المراجعة"];

const governorates = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية",
  "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "أسوان", "أسيوط",
  "بني سويف", "بورسعيد", "دمياط", "الشرقية", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا",
  "شمال سيناء", "سوهاج"
];

const countries = [
  { name: "أفغانستان", code: "af" },
  { name: "ألبانيا", code: "al" },
  { name: "الجزائر", code: "dz" },
  { name: "أندورا", code: "ad" },
  { name: "أنغولا", code: "ao" },
  { name: "أنتيغوا وبربودا", code: "ag" },
  { name: "الأرجنتين", code: "ar" },
  { name: "أرمينيا", code: "am" },
  { name: "أستراليا", code: "au" },
  { name: "النمسا", code: "at" },
  { name: "أذربيجان", code: "az" },
  { name: "الباهاما", code: "bs" },
  { name: "البحرين", code: "bh" },
  { name: "بنغلاديش", code: "bd" },
  { name: "باربادوس", code: "bb" },
  { name: "بيلاروس", code: "by" },
  { name: "بلجيكا", code: "be" },
  { name: "بليز", code: "bz" },
  { name: "بنين", code: "bj" },
  { name: "بوتان", code: "bt" },
  { name: "بوليفيا", code: "bo" },
  { name: "البوسنة والهرسك", code: "ba" },
  { name: "بوتسوانا", code: "bw" },
  { name: "البرازيل", code: "br" },
  { name: "بروناي", code: "bn" },
  { name: "بلغاريا", code: "bg" },
  { name: "بوركينا فاسو", code: "bf" },
  { name: "بوروندي", code: "bi" },
  { name: "الرأس الأخضر", code: "cv" },
  { name: "كمبوديا", code: "kh" },
  { name: "الكاميرون", code: "cm" },
  { name: "كندا", code: "ca" },
  { name: "جمهورية أفريقيا الوسطى", code: "cf" },
  { name: "تشاد", code: "td" },
  { name: "تشيلي", code: "cl" },
  { name: "الصين", code: "cn" },
  { name: "كولومبيا", code: "co" },
  { name: "جزر القمر", code: "km" },
  { name: "جمهورية الكونغو", code: "cg" },
  { name: "جمهورية الكونغو الديمقراطية", code: "cd" },
  { name: "كوستاريكا", code: "cr" },
  { name: "ساحل العاج", code: "ci" },
  { name: "كرواتيا", code: "hr" },
  { name: "كوبا", code: "cu" },
  { name: "قبرص", code: "cy" },
  { name: "التشيك", code: "cz" },
  { name: "الدنمارك", code: "dk" },
  { name: "جيبوتي", code: "dj" },
  { name: "دومينيكا", code: "dm" },
  { name: "جمهورية الدومينيكان", code: "do" },
  { name: "الإكوادور", code: "ec" },
  { name: "السلفادور", code: "sv" },
  { name: "غينيا الاستوائية", code: "gq" },
  { name: "إريتريا", code: "er" },
  { name: "إستونيا", code: "ee" },
  { name: "إسواتيني", code: "sz" },
  { name: "إثيوبيا", code: "et" },
  { name: "فيجي", code: "fj" },
  { name: "فنلندا", code: "fi" },
  { name: "فرنسا", code: "fr" },
  { name: "الغابون", code: "ga" },
  { name: "غامبيا", code: "gm" },
  { name: "جورجيا", code: "ge" },
  { name: "ألمانيا", code: "de" },
  { name: "غانا", code: "gh" },
  { name: "اليونان", code: "gr" },
  { name: "غرينادا", code: "gd" },
  { name: "غواتيمالا", code: "gt" },
  { name: "غينيا", code: "gn" },
  { name: "غينيا بيساو", code: "gw" },
  { name: "غيانا", code: "gy" },
  { name: "هايتي", code: "ht" },
  { name: "هندوراس", code: "hn" },
  { name: "المجر", code: "hu" },
  { name: "آيسلندا", code: "is" },
  { name: "الهند", code: "in" },
  { name: "إندونيسيا", code: "id" },
  { name: "إيران", code: "ir" },
  { name: "العراق", code: "iq" },
  { name: "أيرلندا", code: "ie" },
  { name: "إيطاليا", code: "it" },
  { name: "جامايكا", code: "jm" },
  { name: "اليابان", code: "jp" },
  { name: "الأردن", code: "jo" },
  { name: "كازاخستان", code: "kz" },
  { name: "كينيا", code: "ke" },
  { name: "كيريباتي", code: "ki" },
  { name: "كوريا الشمالية", code: "kp" },
  { name: "كوريا الجنوبية", code: "kr" },
  { name: "الكويت", code: "kw" },
  { name: "قيرغيزستان", code: "kg" },
  { name: "لاوس", code: "la" },
  { name: "لاتفيا", code: "lv" },
  { name: "لبنان", code: "lb" },
  { name: "ليسوتو", code: "ls" },
  { name: "ليبيريا", code: "lr" },
  { name: "ليبيا", code: "ly" },
  { name: "ليختنشتاين", code: "li" },
  { name: "ليتوانيا", code: "lt" },
  { name: "لوكسمبورغ", code: "lu" },
  { name: "مدغشقر", code: "mg" },
  { name: "مالاوي", code: "mw" },
  { name: "ماليزيا", code: "my" },
  { name: "المالديف", code: "mv" },
  { name: "مالي", code: "ml" },
  { name: "مالطا", code: "mt" },
  { name: "جزر مارشال", code: "mh" },
  { name: "موريتانيا", code: "mr" },
  { name: "موريشيوس", code: "mu" },
  { name: "المكسيك", code: "mx" },
  { name: "ميكرونيزيا", code: "fm" },
  { name: "مولدوفا", code: "md" },
  { name: "موناكو", code: "mc" },
  { name: "منغوليا", code: "mn" },
  { name: "الجبل الأسود", code: "me" },
  { name: "المغرب", code: "ma" },
  { name: "موزمبيق", code: "mz" },
  { name: "ميانمار", code: "mm" },
  { name: "ناميبيا", code: "na" },
  { name: "ناورو", code: "nr" },
  { name: "نيبال", code: "np" },
  { name: "هولندا", code: "nl" },
  { name: "نيوزيلندا", code: "nz" },
  { name: "نيكاراغوا", code: "ni" },
  { name: "النيجر", code: "ne" },
  { name: "نيجيريا", code: "ng" },
  { name: "مقدونيا الشمالية", code: "mk" },
  { name: "النرويج", code: "no" },
  { name: "عُمان", code: "om" },
  { name: "باكستان", code: "pk" },
  { name: "بالاو", code: "pw" },
  { name: "فلسطين", code: "ps" },
  { name: "بنما", code: "pa" },
  { name: "بابوا غينيا الجديدة", code: "pg" },
  { name: "باراغواي", code: "py" },
  { name: "بيرو", code: "pe" },
  { name: "الفلبين", code: "ph" },
  { name: "بولندا", code: "pl" },
  { name: "البرتغال", code: "pt" },
  { name: "قطر", code: "qa" },
  { name: "رومانيا", code: "ro" },
  { name: "روسيا", code: "ru" },
  { name: "رواندا", code: "rw" },
  { name: "سانت كيتس ونيفيس", code: "kn" },
  { name: "سانت لوسيا", code: "lc" },
  { name: "سانت فنسنت والغرينادين", code: "vc" },
  { name: "ساموا", code: "ws" },
  { name: "سان مارينو", code: "sm" },
  { name: "ساو تومي وبرينسيب", code: "st" },
  { name: "السعودية", code: "sa" },
  { name: "السنغال", code: "sn" },
  { name: "صربيا", code: "rs" },
  { name: "سيشل", code: "sc" },
  { name: "سيراليون", code: "sl" },
  { name: "سنغافورة", code: "sg" },
  { name: "سلوفاكيا", code: "sk" },
  { name: "سلوفينيا", code: "si" },
  { name: "جزر سليمان", code: "sb" },
  { name: "الصومال", code: "so" },
  { name: "جنوب أفريقيا", code: "za" },
  { name: "جنوب السودان", code: "ss" },
  { name: "إسبانيا", code: "es" },
  { name: "سريلانكا", code: "lk" },
  { name: "السودان", code: "sd" },
  { name: "سورينام", code: "sr" },
  { name: "السويد", code: "se" },
  { name: "سويسرا", code: "ch" },
  { name: "سوريا", code: "sy" },
  { name: "طاجيكستان", code: "tj" },
  { name: "تنزانيا", code: "tz" },
  { name: "تايلاند", code: "th" },
  { name: "تيمور الشرقية", code: "tl" },
  { name: "توغو", code: "tg" },
  { name: "تونغا", code: "to" },
  { name: "ترينيداد وتوباغو", code: "tt" },
  { name: "تونس", code: "tn" },
  { name: "تركيا", code: "tr" },
  { name: "تركمانستان", code: "tm" },
  { name: "توفالو", code: "tv" },
  { name: "أوغندا", code: "ug" },
  { name: "أوكرانيا", code: "ua" },
  { name: "الإمارات", code: "ae" },
  { name: "المملكة المتحدة", code: "gb" },
  { name: "الولايات المتحدة", code: "us" },
  { name: "أوروغواي", code: "uy" },
  { name: "أوزبكستان", code: "uz" },
  { name: "فانواتو", code: "vu" },
  { name: "الفاتيكان", code: "va" },
  { name: "فنزويلا", code: "ve" },
  { name: "فيتنام", code: "vn" },
  { name: "اليمن", code: "ye" },
  { name: "زامبيا", code: "zm" },
  { name: "زيمبابوي", code: "zw" }
];

const governorateAreas: Record<string, string[]> = {
  "القاهرة": ["مدينة نصر", "مصر الجديدة", "النزهة", "الشروق", "بدر", "القاهرة الجديدة", "التجمع الأول", "التجمع الثالث", "التجمع الخامس", "الرحاب", "مدينتي", "القطامية", "المعادي", "زهراء المعادي", "طرة", "حلوان", "المعصرة", "15 مايو", "التبين", "شبرا", "روض الفرج", "الساحل", "الشرابية", "الزاوية الحمراء", "حدائق القبة", "الزيتون", "الأميرية", "الوايلي", "العباسية", "عين شمس", "المطرية", "المرج", "السلام أول", "السلام ثان", "وسط البلد", "عابدين", "الأزبكية", "الموسكي", "باب الشعرية", "بولاق", "الزمالك", "جاردن سيتي", "السيدة زينب", "مصر القديمة", "الخليفة", "المقطم", "منشأة ناصر", "الدرب الأحمر", "الجمالية"],
  "الجيزة": ["الجيزة", "الدقي", "العجوزة", "المهندسين", "إمبابة", "الوراق", "بولاق الدكرور", "الهرم", "فيصل", "العمرانية", "الطالبية", "6 أكتوبر", "حدائق أكتوبر", "الشيخ زايد", "أبو رواش", "كرداسة", "ناهيا", "أوسيم", "البراجيل", "منشأة القناطر", "الحوامدية", "أبو النمرس", "البدرشين", "سقارة", "العياط", "الصف", "أطفيح", "الواحات البحرية"],
  "الإسكندرية": ["سيدي جابر", "سموحة", "سبورتنج", "ستانلي", "رشدي", "جليم", "لوران", "كفر عبده", "ميامي", "سيدي بشر", "العصافرة", "المندرة", "المنتزه أول", "المنتزه ثان", "محرم بك", "الإبراهيمية", "كامب شيزار", "الشاطبي", "الأزاريطة", "العطارين", "المنشية", "بحري", "الأنفوشي", "الجمرك", "كرموز", "مينا البصل", "الدخيلة", "العجمي", "العامرية أول", "العامرية ثان", "برج العرب", "برج العرب الجديدة"],
  "الدقهلية": ["المنصورة", "طلخا", "نبروه", "ميت غمر", "أجا", "السنبلاوين", "تمي الأمديد", "دكرنس", "بني عبيد", "منية النصر", "المنزلة", "الجمالية", "ميت سلسيل", "شربين", "بلقاس", "جمصة", "الكردي", "محلة دمنة"],
  "البحر الأحمر": ["الغردقة", "رأس غارب", "سفاجا", "القصير", "مرسى علم", "الشلاتين", "حلايب"],
  "البحيرة": ["دمنهور", "كفر الدوار", "رشيد", "إدكو", "أبو المطامير", "أبو حمص", "الدلنجات", "المحمودية", "الرحمانية", "إيتاي البارود", "حوش عيسى", "شبراخيت", "كوم حمادة", "بدر", "وادي النطرون", "النوبارية"],
  "الفيوم": ["الفيوم", "الفيوم الجديدة", "سنورس", "إطسا", "طامية", "أبشواي", "يوسف الصديق"],
  "الغربية": ["طنطا", "المحلة الكبرى", "زفتى", "السنطة", "كفر الزيات", "بسيون", "قطور", "سمنود"],
  "الإسماعيلية": ["الإسماعيلية", "فايد", "القنطرة شرق", "القنطرة غرب", "التل الكبير", "أبو صوير", "القصاصين"],
  "المنوفية": ["شبين الكوم", "منوف", "أشمون", "الباجور", "قويسنا", "بركة السبع", "تلا", "الشهداء", "السادات", "سرس الليان"],
  "المنيا": ["المنيا", "المنيا الجديدة", "أبو قرقاص", "ملوي", "دير مواس", "سمالوط", "مطاي", "بني مزار", "مغاغة", "العدوة"],
  "القليوبية": ["بنها", "شبرا الخيمة", "قليوب", "القناطر الخيرية", "الخانكة", "كفر شكر", "طوخ", "شبين القناطر", "العبور", "الخصوص", "قها"],
  "الوادي الجديد": ["الخارجة", "الداخلة", "الفرافرة", "باريس", "بلاط"],
  "السويس": ["السويس", "الأربعين", "عتاقة", "الجناين", "فيصل"],
  "أسوان": ["أسوان", "أسوان الجديدة", "دراو", "كوم أمبو", "نصر النوبة", "إدفو", "أبو سمبل"],
  "أسيوط": ["أسيوط", "أسيوط الجديدة", "ديروط", "القوصية", "منفلوط", "أبنوب", "الفتح", "أبو تيج", "الغنايم", "ساحل سليم", "البداري", "صدفا"],
  "بني سويف": ["بني سويف", "بني سويف الجديدة", "الواسطى", "ناصر", "إهناسيا", "ببا", "سمسطا", "الفشن"],
  "بورسعيد": ["بورسعيد", "بورفؤاد", "الشرق", "العرب", "المناخ", "الضواحي", "الزهور", "الجنوب"],
  "دمياط": ["دمياط", "دمياط الجديدة", "رأس البر", "عزبة البرج", "فارسكور", "كفر سعد", "الزرقا", "كفر البطيخ", "السرو", "الروضة"],
  "الشرقية": ["الزقازيق", "بلبيس", "منيا القمح", "أبو حماد", "فاقوس", "الحسينية", "أبو كبير", "ههيا", "كفر صقر", "أولاد صقر", "ديرب نجم", "مشتول السوق", "الإبراهيمية", "القرين", "العاشر من رمضان", "الصالحية الجديدة", "القنايات", "صان الحجر", "منشأة أبو عمر"],
  "جنوب سيناء": ["الطور", "شرم الشيخ", "دهب", "نويبع", "طابا", "رأس سدر", "أبو زنيمة", "أبو رديس", "سانت كاترين"],
  "كفر الشيخ": ["كفر الشيخ", "دسوق", "فوه", "مطوبس", "بلطيم", "الحامول", "بيلا", "الرياض", "سيدي سالم", "قلين", "برج البرلس"],
  "مطروح": ["مرسى مطروح", "الحمام", "العلمين", "العلمين الجديدة", "الضبعة", "النجيلة", "سيدي براني", "السلوم", "سيوة"],
  "الأقصر": ["الأقصر", "الأقصر الجديدة", "البياضية", "القرنة", "الزينية", "الطود", "أرمنت", "إسنا"],
  "قنا": ["قنا", "قنا الجديدة", "قوص", "نقادة", "دشنا", "الوقف", "نجع حمادي", "فرشوط", "أبو تشت", "قفط"],
  "شمال سيناء": ["العريش", "بئر العبد", "الشيخ زويد", "رفح", "الحسنة", "نخل"],
  "سوهاج": ["سوهاج", "سوهاج الجديدة", "أخميم", "البلينا", "جرجا", "المراغة", "المنشأة", "دار السلام", "طهطا", "طما", "جهينة", "ساقلتة", "العسيرات"]
};


const ages = Array.from({ length: 82 }, (_, i) => String(i + 18)); // 18..99
const heights = Array.from({ length: 101 }, (_, i) => String(i + 130)); // 130..230
const weights = Array.from({ length: 171 }, (_, i) => String(i + 30)); // 30..200

const educationOptions = [
  "بدون مؤهل", "يقرأ ويكتب", "ابتدائي", "إعدادي", "ثانوي عام", "ثانوي أزهري", "دبلوم فني",
  "معهد متوسط", "معهد عالي", "بكالوريوس / ليسانس", "دراسات عليا", "دبلومة بعد الجامعة",
  "ماجستير", "دكتوراه"
];

const jobOptions = [
  { v: "موظف حكومي", i: "🏛️", c: "الوظائف الحكومية" }, { v: "موظف قطاع خاص", i: "🏢", c: "القطاع الخاص" }, { v: "أعمال حرة", i: "💼", c: "الأعمال الحرة" }, { v: "صاحب عمل / شركة", i: "📊", c: "الأعمال الحرة" }, { v: "تاجر", i: "🛍️", c: "التجارة" },
  { v: "مراجع حسابات", i: "🧾", c: "المحاسبة" }, { v: "محاسب", i: "🧮", c: "المحاسبة" }, { v: "مدير مالي", i: "💰", c: "المحاسبة" }, { v: "موظف بنك", i: "🏦", c: "المال والأعمال" }, { v: "خبير استثمار", i: "📈", c: "المال والأعمال" },
  { v: "طبيب", i: "🩺", c: "المهن الطبية" }, { v: "طبيب أسنان", i: "🦷", c: "المهن الطبية" }, { v: "صيدلي", i: "💊", c: "المهن الطبية" }, { v: "ممرض / ممرضة", i: "🧑‍⚕️", c: "المهن الطبية" }, { v: "أخصائي علاج طبيعي", i: "🦿", c: "المهن الطبية" }, { v: "أخصائي تحاليل", i: "🧪", c: "المهن الطبية" }, { v: "طبيب بيطري", i: "🐾", c: "المهن الطبية" },
  { v: "مهندس مدني", i: "🏗️", c: "الهندسة" }, { v: "مهندس معماري", i: "📐", c: "الهندسة" }, { v: "مهندس كهرباء", i: "⚡", c: "الهندسة" }, { v: "مهندس ميكانيكا", i: "⚙️", c: "الهندسة" }, { v: "مهندس اتصالات", i: "📡", c: "الهندسة" }, { v: "مهندس بترول", i: "🛢️", c: "الهندسة" }, { v: "مهندس زراعي", i: "🌱", c: "الهندسة" },
  { v: "مهندس برمجيات", i: "💻", c: "التقنية" }, { v: "مبرمج / مطور برمجيات", i: "⌨️", c: "التقنية" }, { v: "مصمم واجهات وتجربة مستخدم", i: "🎨", c: "التقنية" }, { v: "محلل بيانات", i: "📊", c: "التقنية" }, { v: "متخصص أمن معلومات", i: "🔐", c: "التقنية" }, { v: "دعم فني", i: "🛠️", c: "التقنية" },
  { v: "معلم / معلمة", i: "📚", c: "التعليم" }, { v: "مدرس جامعي", i: "🎓", c: "التعليم" }, { v: "أستاذ جامعي", i: "👨‍🏫", c: "التعليم" }, { v: "أخصائي اجتماعي", i: "🤝", c: "التعليم" }, { v: "أخصائي نفسي", i: "🧠", c: "التعليم" },
  { v: "محام", i: "⚖️", c: "القانون" }, { v: "مستشار قانوني", i: "📜", c: "القانون" },
  { v: "ضابط شرطة", i: "👮", c: "الشرطة والداخلية" }, { v: "فرد شرطة / أمين شرطة", i: "🛡️", c: "الشرطة والداخلية" }, { v: "موظف مدني بوزارة الداخلية", i: "🏛️", c: "الشرطة والداخلية" },
  { v: "ضابط بالقوات المسلحة", i: "🎖️", c: "القوات المسلحة" }, { v: "صف ضابط بالقوات المسلحة", i: "🪖", c: "القوات المسلحة" }, { v: "جندي بالقوات المسلحة", i: "🪖", c: "القوات المسلحة" }, { v: "متطوع بالقوات المسلحة", i: "🎗️", c: "القوات المسلحة" }, { v: "موظف مدني بالقوات المسلحة", i: "🏢", c: "القوات المسلحة" },
  { v: "طيار", i: "✈️", c: "الطيران" }, { v: "مضيف / مضيفة طيران", i: "🛫", c: "الطيران" }, { v: "مراقب جوي", i: "🛩️", c: "الطيران" },
  { v: "موظف سياحة وفنادق", i: "🏨", c: "السياحة والفنادق" }, { v: "مرشد سياحي", i: "🗺️", c: "السياحة والفنادق" }, { v: "طاه / شيف", i: "👨‍🍳", c: "السياحة والفنادق" },
  { v: "إعلامي / صحفي", i: "🎙️", c: "الإعلام" }, { v: "مصور", i: "📷", c: "الإعلام" }, { v: "مصمم جرافيك", i: "🖌️", c: "الإعلام" }, { v: "كاتب / محرر", i: "✍️", c: "الإعلام" },
  { v: "موظف موارد بشرية", i: "👥", c: "الإدارة" }, { v: "مدير / إداري", i: "📋", c: "الإدارة" }, { v: "سكرتارية", i: "🗂️", c: "الإدارة" }, { v: "خدمة عملاء", i: "🎧", c: "الخدمات" },
  { v: "مندوب مبيعات", i: "🤝", c: "التجارة" }, { v: "تسويق", i: "📣", c: "التسويق" }, { v: "تسويق إلكتروني", i: "📱", c: "التسويق" },
  { v: "عامل / فني", i: "🔧", c: "المهن الفنية" }, { v: "كهربائي", i: "💡", c: "المهن الفنية" }, { v: "سباك", i: "🚰", c: "المهن الفنية" }, { v: "نجار", i: "🪚", c: "المهن الفنية" }, { v: "ميكانيكي", i: "🔩", c: "المهن الفنية" },
  { v: "سائق", i: "🚗", c: "النقل" }, { v: "سائق نقل", i: "🚚", c: "النقل" }, { v: "بحار", i: "⚓", c: "النقل" }, { v: "مزارع", i: "🌾", c: "الزراعة" }, { v: "عامل زراعي", i: "🌿", c: "الزراعة" },
  { v: "لا أعمل حاليًا", i: "—", c: "أخرى" }, { v: "متقاعد", i: "🌿", c: "أخرى" }, { v: "ربة منزل", i: "🏠", c: "أخرى" }, { v: "وظيفة أخرى", i: "➕", c: "أخرى" },
];
const jobs = jobOptions.map(x => x.v);

const healthOptions = [
  "سليم والحمد لله", "إعاقة حركية", "إعاقة بصرية", "إعاقة سمعية", "إعاقة في النطق / التخاطب",
  "مرض مزمن", "السكري", "ضغط الدم", "أمراض القلب", "أمراض الكلى", "أمراض الكبد", "الربو",
  "الصرع", "حساسية مزمنة", "مرض مناعي", "حالة صحية أخرى"
];

const traits = ["هادئ", "اجتماعي", "عائلي", "طموح", "عملي", "مرح", "صريح", "متفاهم", "صبور", "منظم", "رومانسي", "محب للتعلم"];
const interests = ["العائلة", "القراءة", "السفر", "الرياضة", "المشي", "الطبخ", "التطوع", "التقنية", "الفنون", "التصوير", "التعلم", "الرحلات"];

type Form = {
  username: string; email: string; password: string; confirmPassword: string; gender: "" | "male" | "female";
  displayName: string; fullName: string; phone: string; age: string; residence: "" | "egypt" | "abroad"; governorate: string; city: string; cityOther: string; country: string; abroadCity: string;
  maritalStatus: string; previousMarriage: string; hasChildren: string; childrenCount: string; childrenLiving: string;
  housing: string; marriageTimeline: string;
  education: string; job: string; jobOther: string; workStatus: string;
  height: string; weight: string; bodyType: string; skinColor: string; hairColor: string; eyeColor: string; beardStyle: string; hijabStyle: string; clothingStyle: string; smoking: string; prayer: string; religiosity: string;
  healthStatus: string; healthDetails: string;
  bio: string; partnerSpecs: string; personalityTraits: string[]; interests: string[];
};

const initial: Form = {
  username: "", email: "", password: "", confirmPassword: "", gender: "",
  displayName: "", fullName: "", phone: "", age: "", residence: "", governorate: "", city: "", cityOther: "", country: "", abroadCity: "",
  maritalStatus: "", previousMarriage: "", hasChildren: "", childrenCount: "", childrenLiving: "",
  housing: "", marriageTimeline: "",
  education: "", job: "", jobOther: "", workStatus: "",
  height: "", weight: "", bodyType: "", skinColor: "", hairColor: "", eyeColor: "", beardStyle: "", hijabStyle: "", clothingStyle: "", smoking: "", prayer: "", religiosity: "",
  healthStatus: "", healthDetails: "",
  bio: "", partnerSpecs: "", personalityTraits: [], interests: []
};

type UsernameState = "idle" | "checking" | "available" | "unavailable" | "invalid";

function hasContactInfo(text: string) {
  const normalized = text
    .replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .toLowerCase();

  if (/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/i.test(normalized)) return true;
  if (/(?:https?:\/\/|www\.)\S+/i.test(normalized)) return true;
  const candidates = normalized.match(/[+\d][\d\s().-]{6,}\d/g) || [];
  if (candidates.some(v => (v.match(/\d/g) || []).length >= 8)) return true;
  return ["واتساب", "واتس", "whatsapp", "تليجرام", "تلجرام", "telegram", "فيسبوك", "facebook", "انستا", "instagram", "سناب", "snapchat", "موبايل", "تليفون", "رقمي", "كلمني على", "اتصل بي"].some(v => normalized.includes(v));
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim().toLowerCase());
}

function passwordChecks(value: string) {
  return {
    length: value.length >= 8,
    letter: /[A-Za-z\u0600-\u06FF]/.test(value),
    number: /\d/.test(value),
  };
}

function isStrongPassword(value: string) {
  const c = passwordChecks(value);
  return c.length && c.letter && c.number;
}

function normalizeDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}

function isValidPhone(value: string, residence: Form["residence"]) {
  const normalized = normalizeDigits(value).replace(/[\s().-]/g, "");
  if (residence === "egypt") {
    return /^01[0125]\d{8}$/.test(normalized) || /^\+201[0125]\d{8}$/.test(normalized);
  }
  return /^\+[1-9]\d{7,14}$/.test(normalized);
}

const nonWorkingStatuses = new Set(["أبحث عن عمل", "طالب", "ربة منزل", "متقاعد", "لا أعمل حاليًا"]);

function resolvedJob(form: Form) {
  if (nonWorkingStatuses.has(form.workStatus)) return form.workStatus;
  if (form.job === "أخرى") return form.jobOther.trim();
  return form.job;
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState<Form>(initial);
  const [usernameState, setUsernameState] = useState<UsernameState>("idle");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [founderRemaining, setFounderRemaining] = useState<number | null>(null);
  const [stepNotice, setStepNotice] = useState("");
  const [errorField, setErrorField] = useState("");
  const [success, setSuccess] = useState(false);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm(p => ({ ...p, [key]: value }));
    if (errorField) {
      document.getElementById(errorField)?.removeAttribute("data-validation-error");
      setErrorField("");
    }
  };
  const toggle = (key: "personalityTraits" | "interests", value: string) =>
    setForm(p => ({ ...p, [key]: p[key].includes(value) ? p[key].filter(x => x !== value) : [...p[key], value] }));

  useEffect(() => {
    let active = true;
    fetch("/api/founders/remaining", { cache: "no-store" })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        if (active && typeof d.remaining === "number") setFounderRemaining(d.remaining);
      })
      .catch(() => { });
    return () => { active = false; };
  }, []);


  useEffect(() => {
    if (step === 6) {
      setForm(prev => ({
        ...prev,
        height: prev.height || "170",
        weight: prev.weight || "70",
      }));
    }
  }, [step]);
  useEffect(() => {
    return () => {
      if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
    };
  }, [profilePhotoPreview]);

  function choosePhoto(file: File | null) {
    if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
    if (!file) {
      setProfilePhoto(null);
      setProfilePhotoPreview("");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("الصورة يجب أن تكون بصيغة صور مدعومة.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة يجب ألا يزيد عن 5 ميجابايت.");
      return;
    }
    setError("");
    setProfilePhoto(file);
    setProfilePhotoPreview(URL.createObjectURL(file));
  }

  useEffect(() => {
    const username = form.displayName.trim();
    if (!username) { setUsernameState("idle"); setUsernameMessage(""); return; }
    if (Array.from(username).length > 40 || /\s/.test(username)) {
      setUsernameState("invalid"); setUsernameMessage("اسم المستخدم لا يقبل مسافات، واكتب اسمًا واحدًا بحد أقصى 40 رمزًا."); return;
    }
    const digits = username.replace(/\D/g, "");
    if (digits.length >= 8) { setUsernameState("invalid"); setUsernameMessage("لا يجوز استخدام رقم هاتف كاسم مستخدم."); return; }
    setUsernameState("checking"); setUsernameMessage("جاري فحص الاسم...");
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const r = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`, { cache: "no-store", signal: controller.signal });
        const d = await r.json();
        if (!r.ok && r.status >= 500) throw new Error();
        setUsernameState(d.available ? "available" : "unavailable");
        setUsernameMessage(d.message || (d.available ? "اسم المستخدم متاح" : "اسم المستخدم مستخدم بالفعل"));
      } catch (e) { if (e instanceof DOMException && e.name === "AbortError") return; setUsernameState("idle"); setUsernameMessage("تعذر فحص الاسم الآن"); }
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [form.displayName]);

  const requiredChecks = useMemo(() => {
    const locationDone = form.residence
      ? (form.residence === "egypt"
        ? Boolean(form.governorate) && Boolean(form.city) && (form.city !== "__other__" || Boolean(form.cityOther.trim()))
        : Boolean(form.country) && Boolean(form.abroadCity.trim()))
      : false;

    const previousMarriageDone = form.maritalStatus
      ? (form.maritalStatus === "أعزب / عزباء" ? true : form.previousMarriage === "yes")
      : false;

    const childrenCountDone = form.hasChildren
      ? (form.hasChildren === "no" ? true : Boolean(form.childrenCount))
      : false;
    const childrenLivingDone = form.hasChildren
      ? (form.hasChildren === "no" ? true : Boolean(form.childrenLiving))
      : false;

    const jobDone = form.workStatus
      ? (nonWorkingStatuses.has(form.workStatus) ? true : Boolean(resolvedJob(form)))
      : false;

    const healthDetailsDone = form.healthStatus
      ? (form.healthStatus === "سليم والحمد لله" ? true : Boolean(form.healthDetails.trim()))
      : false;

    return [
      agreed, Boolean(form.gender),
      Boolean(form.displayName.trim()) && usernameState === "available",
      isValidEmail(form.email),
      isStrongPassword(form.password),
      Boolean(form.confirmPassword) && form.password === form.confirmPassword && isStrongPassword(form.password),
      Boolean(form.age), Boolean(form.residence), locationDone,
      Boolean(form.maritalStatus), previousMarriageDone, Boolean(form.hasChildren),
      childrenCountDone, childrenLivingDone, Boolean(form.housing), Boolean(form.marriageTimeline),
      Boolean(form.education), Boolean(form.workStatus), jobDone,
      Boolean(form.height), Boolean(form.weight), Boolean(form.bodyType), Boolean(form.skinColor), Boolean(form.hairColor), Boolean(form.eyeColor), Boolean(form.clothingStyle), form.gender === "male" ? Boolean(form.beardStyle) : Boolean(form.hijabStyle), Boolean(form.smoking),
      Boolean(form.prayer), Boolean(form.religiosity), Boolean(form.healthStatus), healthDetailsDone,
      form.bio.trim().length >= 100 && !hasContactInfo(form.bio),
      form.personalityTraits.length >= 3,
      form.interests.length >= 3,
      form.partnerSpecs.trim().length >= 80 && !hasContactInfo(form.partnerSpecs),
      form.fullName.trim().split(/\s+/).filter(Boolean).length >= 2,
      isValidPhone(form.phone, form.residence),
    ];
  }, [agreed, form, usernameState]);

  const progress = requiredChecks.length ? Math.round(requiredChecks.filter(Boolean).length / requiredChecks.length * 100) : 0;

  const missing = useMemo(() => {
    if (step === 0) return !agreed;
    if (step === 1) return !form.gender;
    if (step === 2) return !form.displayName.trim() || usernameState !== "available" || !isValidEmail(form.email) || !isStrongPassword(form.password) || form.password !== form.confirmPassword;
    if (step === 3) return !form.age || !form.residence || (form.residence === "egypt" ? (!form.governorate || !form.city || (form.city === "__other__" && !form.cityOther.trim())) : (!form.country || !form.abroadCity.trim()));
    if (step === 4) return !form.education || !form.workStatus || (!nonWorkingStatuses.has(form.workStatus) && !resolvedJob(form));
    if (step === 5) {
      const previousOk = form.maritalStatus === "أعزب / عزباء" ? true : form.previousMarriage === "yes";
      return !form.housing || !form.maritalStatus || !previousOk || !form.hasChildren || (form.hasChildren === "yes" && (!form.childrenCount || !form.childrenLiving)) || !form.marriageTimeline;
    }
    if (step === 6) return !form.height || !form.weight || !form.bodyType || !form.skinColor || !form.hairColor || !form.eyeColor || !form.clothingStyle || (form.gender === "male" ? !form.beardStyle : !form.hijabStyle) || !form.smoking || !form.prayer || !form.religiosity || !form.healthStatus || (form.healthStatus !== "سليم والحمد لله" && !form.healthDetails.trim());
    if (step === 7) return form.bio.trim().length < 100 || form.partnerSpecs.trim().length < 80 || form.personalityTraits.length < 3 || form.interests.length < 3 || hasContactInfo(form.bio) || hasContactInfo(form.partnerSpecs);
    if (step === 8) return form.fullName.trim().split(/\s+/).filter(Boolean).length < 2 || !isValidPhone(form.phone, form.residence);
    return false;
  }, [step, agreed, form, usernameState]);

  function showFieldError(id: string, message: string) {
    setError(message);
    setErrorField(id);
    window.setTimeout(() => {
      const node = document.getElementById(id);
      if (node) {
        node.setAttribute("data-validation-error", "true");
        node.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
  }

  function validateCurrentStep() {
    if (step === 0 && !agreed) return ["field-oath", "يرجى الموافقة على ميثاق المنصة أولًا."] as const;
    if (step === 1 && !form.gender) return ["field-gender", "يرجى اختيار صفتك لإكمال التسجيل."] as const;
    if (step === 2) {
      if (!form.displayName.trim()) return ["field-display-name", "يرجى كتابة الاسم الذي سيظهر للأعضاء."] as const;
      if (usernameState !== "available") return ["field-display-name", "يرجى اختيار اسم مستخدم متاح بدون مسافات."] as const;
      if (!isValidEmail(form.email)) return ["field-email", "يرجى كتابة بريد إلكتروني صحيح."] as const;
      if (!isStrongPassword(form.password)) return ["field-password", "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف ورقم."] as const;
      if (form.password !== form.confirmPassword) return ["field-confirm-password", "يرجى كتابة تأكيد مطابق لكلمة المرور."] as const;
    }
    if (step === 3) {
      if (!form.age) return ["field-age", "يرجى تحديد العمر."] as const;
      if (!form.residence) return ["field-residence", "يرجى تحديد مكان الإقامة."] as const;
      if (form.residence === "egypt") {
        if (!form.governorate) return ["field-governorate", "يرجى اختيار المحافظة."] as const;
        if (!form.city) return ["field-city", "يرجى اختيار المدينة أو المركز."] as const;
        if (form.city === "__other__" && !form.cityOther.trim()) return ["field-city-other", "يرجى كتابة اسم القرية أو المنطقة."] as const;
      } else {
        if (!form.country) return ["field-country", "يرجى اختيار دولة الإقامة."] as const;
        if (!form.abroadCity.trim()) return ["field-abroad-city", "يرجى كتابة مدينة الإقامة خارج مصر."] as const;
      }
    }
    if (step === 4) {
      if (!form.education) return ["field-education", "يرجى اختيار المستوى التعليمي."] as const;
      if (!form.workStatus) return ["field-work-status", "يرجى اختيار الحالة العملية."] as const;
      if (!nonWorkingStatuses.has(form.workStatus) && !resolvedJob(form)) return ["field-job", "يرجى اختيار المهنة أو كتابة المسمى الوظيفي."] as const;
    }
    if (step === 5) {
      if (!form.housing) return ["field-housing", "يرجى تحديد السكن بعد الزواج."] as const;
      if (!form.maritalStatus) return ["field-marital", "يرجى اختيار الحالة الاجتماعية."] as const;
      if (!form.hasChildren) return ["field-children", "يرجى تحديد ما إذا كان لديك أبناء."] as const;
      if (form.hasChildren === "yes" && !form.childrenCount) return ["field-children-count", "يرجى تحديد عدد الأبناء."] as const;
      if (form.hasChildren === "yes" && !form.childrenLiving) return ["field-children-living", "يرجى تحديد إقامة الأبناء."] as const;
      if (!form.marriageTimeline) return ["field-marriage-timeline", "يرجى تحديد الفترة المتوقعة للزواج."] as const;
    }
    if (step === 6) {
      if (!form.height) return ["field-height", "يرجى تأكيد الطول."] as const;
      if (!form.weight) return ["field-weight", "يرجى تأكيد الوزن."] as const;
      if (!form.bodyType) return ["field-body-type", "يرجى اختيار بنية الجسم."] as const;
      if (!form.skinColor) return ["field-skin-color", "يرجى اختيار لون البشرة."] as const;
      if (!form.hairColor) return ["field-hair-color", "يرجى اختيار لون الشعر."] as const;
      if (!form.eyeColor) return ["field-eye-color", "يرجى اختيار لون العينين."] as const;
      if (form.gender === "male" && !form.beardStyle) return ["field-beard-style", "يرجى تحديد حالة اللحية."] as const;
      if (form.gender === "female" && !form.hijabStyle) return ["field-hijab-style", "يرجى تحديد حالة الحجاب."] as const;
      if (!form.clothingStyle) return ["field-clothing-style", "يرجى اختيار أسلوب اللباس."] as const;
      if (!form.smoking) return ["field-smoking", "يرجى تحديد حالة التدخين."] as const;
      if (!form.prayer) return ["field-prayer", "يرجى تحديد حالة المحافظة على الصلاة."] as const;
      if (!form.religiosity) return ["field-religiosity", "يرجى تحديد مستوى الالتزام الديني."] as const;
      if (!form.healthStatus) return ["field-health", "يرجى اختيار الحالة الصحية."] as const;
      if (form.healthStatus !== "سليم والحمد لله" && !form.healthDetails.trim()) return ["field-health-details", "يرجى كتابة تفاصيل الحالة الصحية باختصار."] as const;
    }
    if (step === 7) {
      if (form.bio.trim().length < 100) return ["field-bio", "يرجى كتابة نبذة عنك لا تقل عن 100 حرف."] as const;
      if (hasContactInfo(form.bio)) return ["field-bio", "يرجى حذف أي رقم هاتف أو وسيلة تواصل من النبذة."] as const;
      if (form.personalityTraits.length < 3) return ["field-traits", "يرجى اختيار 3 صفات شخصية على الأقل."] as const;
      if (form.interests.length < 3) return ["field-interests", "يرجى اختيار 3 اهتمامات على الأقل."] as const;
      if (form.partnerSpecs.trim().length < 80) return ["field-partner", "يرجى كتابة مواصفات شريك الحياة في 80 حرفًا على الأقل."] as const;
      if (hasContactInfo(form.partnerSpecs)) return ["field-partner", "يرجى حذف أي وسيلة تواصل من مواصفات شريك الحياة."] as const;
    }
    if (step === 8) {
      if (form.fullName.trim().split(/\\s+/).filter(Boolean).length < 2) return ["field-full-name", "يرجى كتابة الاسم الحقيقي من كلمتين على الأقل."] as const;
      if (!isValidPhone(form.phone, form.residence)) return ["field-phone", "يرجى كتابة رقم هاتف صحيح وفق مكان الإقامة."] as const;
    }
    return null;
  }

  function next() {
    setError("");
    const issue = validateCurrentStep();
    if (issue) {
      showFieldError(issue[0], issue[1]);
      return;
    }
    setStepNotice("تم حفظ هذه الخطوة بنجاح، يمكنك المتابعة.");
    window.setTimeout(() => setStepNotice(""), 1400);
    setStep(v => Math.min(8, v + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function finish() {
    if (missing || loading) return;
    setLoading(true); setError("");
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
          commitmentAccepted: agreed,
          ...form,
          displayName: form.displayName.trim(),
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          username: form.displayName.trim(),
          email: form.email.trim().toLowerCase(),
          age: Number(form.age),
          country: form.residence === "egypt" ? "مصر" : form.country,
          governorate: form.residence === "egypt" ? form.governorate : "",
          city: form.residence === "egypt" ? (form.city === "__other__" ? form.cityOther.trim() : form.city) : form.abroadCity.trim(),
          childrenCount: form.hasChildren === "yes" ? Number(form.childrenCount) : 0,
          height: Number(form.height), weight: Number(form.weight),
          job: resolvedJob(form),
          bio: form.bio.trim(), partnerSpecs: form.partnerSpecs.trim(),
        })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "تعذر إنشاء الحساب");
      try { localStorage.setItem("qalby_user", JSON.stringify(d.member || {})); } catch { }

      if (profilePhoto) {
        const photoData = new FormData();
        photoData.append("image", profilePhoto);
        const photoResponse = await fetch("/api/photos", { method: "POST", body: photoData });
        const photoResult = await photoResponse.json().catch(() => ({}));
        if (!photoResponse.ok) {
          sessionStorage.setItem("qalby_photo_warning", photoResult.error || "تم إنشاء الحساب، لكن تعذر رفع الصورة. ارفعها من تعديل الملف.");
        }
      }

      setSuccess(true);
      window.setTimeout(() => { router.replace("/dashboard"); router.refresh(); }, 1200);
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر إنشاء الحساب الآن"); }
    finally { setLoading(false); }
  }

  const completed = [
    agreed,
    Boolean(form.gender),
    Boolean(form.displayName.trim()) && usernameState === "available" && isValidEmail(form.email) && isStrongPassword(form.password) && form.password === form.confirmPassword,
    Boolean(form.age) && Boolean(form.residence) && (form.residence === "egypt" ? (Boolean(form.governorate) && Boolean(form.city) && (form.city !== "__other__" || Boolean(form.cityOther.trim()))) : (Boolean(form.country) && Boolean(form.abroadCity.trim()))),
    Boolean(form.education) && Boolean(form.workStatus) && (nonWorkingStatuses.has(form.workStatus) || Boolean(resolvedJob(form))),
    Boolean(form.housing) && Boolean(form.maritalStatus) && (form.maritalStatus === "أعزب / عزباء" || form.previousMarriage === "yes") && Boolean(form.hasChildren) && (form.hasChildren !== "yes" || (Boolean(form.childrenCount) && Boolean(form.childrenLiving))) && Boolean(form.marriageTimeline),
    Boolean(form.height) && Boolean(form.weight) && Boolean(form.bodyType) && Boolean(form.skinColor) && Boolean(form.hairColor) && Boolean(form.eyeColor) && Boolean(form.clothingStyle) && (form.gender === "male" ? Boolean(form.beardStyle) : Boolean(form.hijabStyle)) && Boolean(form.smoking) && Boolean(form.prayer) && Boolean(form.religiosity) && Boolean(form.healthStatus) && (form.healthStatus === "سليم والحمد لله" || Boolean(form.healthDetails.trim())),
    form.bio.trim().length >= 100 && form.partnerSpecs.trim().length >= 80 && form.personalityTraits.length >= 3 && form.interests.length >= 3 && !hasContactInfo(form.bio) && !hasContactInfo(form.partnerSpecs),
    form.fullName.trim().split(/\s+/).filter(Boolean).length >= 2 && isValidPhone(form.phone, form.residence)
  ];


  return <main dir="rtl" className="ql-signup-shell ql-floral-stage relative overflow-hidden bg-[#fff7fa] px-3 py-3 md:px-5 md:py-4">
    <div className="ql-floral-bg pointer-events-none absolute inset-0" />
    {founderRemaining !== null && founderRemaining > 0 && <div className="relative mx-auto mb-2 flex max-w-[1280px] items-center justify-center gap-2 rounded-xl border border-amber-200/80 bg-[linear-gradient(90deg,#fff9e9,#fffdf7,#fff9e9)] px-3 py-2 text-center text-[11px] font-black text-amber-900 shadow-sm">
      <Crown className="h-4 w-4 text-amber-600" />
      <span>عضوية المؤسسين: متبقي {founderRemaining} من أول 1000 عضو مكتمل الملف</span>
    </div>}

    <div className="relative mx-auto mb-3 flex max-w-[1280px] items-center justify-between gap-3 rounded-[18px] border border-rose-100 bg-white/90 px-4 py-2.5 shadow-[0_10px_30px_rgba(92,17,52,.06)] backdrop-blur">
      <div><p className="text-[10px] font-black text-rose-500">تسجيل قلبي لوڤي</p><p className="mt-0.5 text-sm font-black text-[#4A1942]">9 خطوات قصيرة لملف أوضح ومطابقة أدق</p><p className="mt-1 text-[10px] font-bold text-rose-400">الحقول المطلوبة موضحة بعلامة <b className="text-red-500">*</b></p></div>
      <div className="hidden items-center gap-2 text-[10px] font-black text-rose-500 sm:flex"><ShieldCheck className="h-4 w-4 text-emerald-500" /> بياناتك محمية وتحت سيطرتك</div>
    </div>

    <div className="ql-signup-grid relative mx-auto grid max-w-[1280px] items-start gap-3 lg:grid-cols-[216px_minmax(0,1fr)_300px]">
      <aside className="ql-reference-steps relative hidden overflow-hidden rounded-[22px] border border-rose-100 bg-white/96 p-3.5 text-[#4A1942] shadow-[0_20px_60px_rgba(74,25,66,.10)] backdrop-blur lg:sticky lg:top-[86px] lg:block">
        <div className="rounded-[16px] border border-rose-100 bg-[linear-gradient(135deg,#fff8fb,#ffffff)] p-3">
          <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-rose-500">الخطوة {step + 1} من 9</span><span className="text-[9px] font-black text-rose-500">{completed.filter(Boolean).length} خطوات مكتملة</span></div>
          <div className="mt-1 text-[15px] font-black text-[#4A1942]">{steps[step]}</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-rose-100"><div className="h-full rounded-full bg-[#E11D48] transition-all" style={{ width: `${((step + 1) / 9) * 100}%` }} /></div>
        </div>
        <div className="relative mt-3 space-y-1 before:absolute before:bottom-3 before:right-[11px] before:top-3 before:w-px before:bg-rose-100">
          {steps.map((label, index) => <button key={label} type="button" disabled={index > step} onClick={() => index < step && setStep(index)} className={`relative flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-right transition ${index === step ? "bg-rose-50" : "hover:bg-rose-50/60"} disabled:cursor-default`}>
            <span className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-black ${completed[index] ? "bg-emerald-500 text-white" : index === step ? "bg-[#E11D48] text-white shadow-[0_0_0_4px_rgba(225,29,72,.10)]" : "border border-rose-300 bg-white text-rose-400"}`}>{completed[index] ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}</span>
            <span className={`truncate text-[10px] font-black ${index === step ? "text-[#E11D48]" : "text-rose-500"}`}>{label}</span>
          </button>)}
        </div>
        {founderRemaining !== null && founderRemaining > 0 && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-2 text-center text-[10px] font-bold text-amber-800"><span className="inline-flex items-center gap-1.5"><Crown className="h-3.5 w-3.5" />متبقي {founderRemaining} من 1000</span></div>}
      </aside>

      <section className="ql-floating-card overflow-hidden rounded-[20px] border border-rose-100 bg-white shadow-[0_16px_46px_rgba(92,17,52,.08)]">
        <div className="border-b border-rose-100 bg-[linear-gradient(90deg,#fff8fb,#fff,#fff8fb)] px-4 py-3 md:px-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-black text-rose-600"><Sparkles className="h-3.5 w-3.5" /> الخطوة {step + 1} من 9</span>
              <h2 className="mt-2 text-[22px] font-black text-[#4A1942]">{steps[step]}</h2>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-rose-100 bg-white px-4 py-3 text-[11px] font-black text-rose-500 shadow-sm"><ShieldCheck className="h-4 w-4 text-emerald-500" /> الحقول المطلوبة تحسّن جودة الملف والمطابقة</div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5 lg:hidden">
            {steps.map((_, index) => <span key={index} className={`rounded-full transition-all duration-300 ${index === step ? "h-3 w-8 bg-[#E11D48] shadow-[0_0_0_4px_rgba(225,29,72,.12)]" : completed[index] ? "h-3 w-3 bg-emerald-400" : "h-3 w-3 bg-rose-300"}`} />)}
          </div>
        </div>

        <div className="p-5 md:p-8 lg:p-9">
          <div className="mx-auto max-w-4xl">
            <div key={step} className="ql-step-enter">
              {step === 0 && <Oath agreed={agreed} setAgreed={setAgreed} />}
              {step === 1 && <GenderStep gender={form.gender} setGender={v => set("gender", v)} />}
              {step === 2 && <Account form={form} set={set} state={usernameState} message={usernameMessage} showPassword={showPassword} setShowPassword={setShowPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} />}
              {step === 3 && <Identity form={form} set={set} />}
              {step === 4 && <EducationWork form={form} set={set} />}
              {step === 5 && <FamilyHousing form={form} set={set} />}
              {step === 6 && <HealthFaith form={form} set={set} />}
              {step === 7 && <PersonalityPartner form={form} set={set} toggle={toggle} />}
              {step === 8 && <FinalReviewStep form={form} set={set} preview={profilePhotoPreview} onChoose={choosePhoto} hasPhoto={Boolean(profilePhoto)} />}
            </div>

            {stepNotice && <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-black text-emerald-700"><CheckCircle2 className="h-5 w-5" /> {stepNotice}</div>}{error && <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-black text-red-700"><XCircle className="mt-0.5 h-5 w-5 shrink-0" /><span>{error}</span></div>}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-rose-100 pt-6">
              {step > 0 ? <button type="button" onClick={() => { setError(""); setStep(v => v - 1); window.scrollTo({ top: 0, behavior: "smooth" }) }} className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-white px-5 text-sm font-black text-rose-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50"><ArrowRight className="h-4 w-4" />السابق</button> : <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-white px-5 text-sm font-black text-rose-600 shadow-sm"><Home className="h-4 w-4" />الرئيسية</Link>}
              <div className="hidden text-[10px] font-bold text-rose-400 md:block">احفظ خصوصيتك ولا تكتب رقم الهاتف أو حسابات التواصل في النبذة.</div>
              {step < 8 ? <button type="button" onClick={next} disabled={step === 0 && !agreed} className="inline-flex h-10 disabled:cursor-not-allowed disabled:opacity-45 items-center gap-2 rounded-xl bg-gradient-to-l from-[#b91458] via-[#e93473] to-[#ff5f89] px-7 text-sm font-black text-white shadow-[0_12px_30px_rgba(209,19,86,.25)] transition hover:-translate-y-0.5">{step === 0 ? "أوافق وأبدأ" : "التالي"} <ArrowLeft className="h-4 w-4" /></button> : <button type="button" onClick={finish} disabled={loading || missing} className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#b91458] via-[#e93473] to-[#ff5f89] px-7 text-sm font-black text-white shadow-[0_12px_30px_rgba(209,19,86,.25)] disabled:cursor-not-allowed disabled:opacity-50">{loading ? "جاري إنشاء الحساب..." : "إنشاء حسابي"}<ArrowLeft className="h-4 w-4" /></button>}
            </div>
            {step === 8 && <div className="mt-4 flex items-center justify-center gap-2 text-center text-[12px] font-bold text-[#6B7280]"><LockKeyhole className="h-3.5 w-3.5" /> بإنشاء الحساب، فإنك توافق على شروط الاستخدام وسياسة الخصوصية.</div>}
          </div>
        </div>
      </section>

      <div className="hidden lg:block lg:sticky lg:top-[76px] lg:self-start">
        <SignupAssistantRail
          step={step}
          form={{ ...form, hasProfilePhoto: Boolean(profilePhoto) }}
          onUseBio={(bio) => set("bio", bio)}
        />
      </div>
    </div>
    {success && <div className="fixed inset-0 z-[300] grid place-items-center bg-[#4A1942]/55 p-4 backdrop-blur-sm">
      <div className="relative overflow-hidden rounded-[30px] border border-white/30 bg-white p-8 text-center shadow-2xl">
        {Array.from({ length: 16 }, (_, i) => <span key={i} className="ql-confetti absolute h-2 w-2 rounded-full bg-[#E11D48]" style={{ left: `${8 + (i * 6) % 88}%`, top: `${6 + (i * 17) % 78}%`, animationDelay: `${i * 45}ms` }} />)}
        <Heart className="mx-auto h-12 w-12 text-[#E11D48]" fill="currentColor" />
        <h3 className="mt-3 text-2xl font-black text-[#4A1942]">مرحبًا بك في عائلة قلبي لوڤي</h3>
        <p className="mt-2 text-sm font-bold text-[#6B7280]">تم إنشاء حسابك بنجاح، وسيتم نقلك إلى صفحتك الآن.</p>
      </div>
    </div>}
  </main>
}

function Required({ children }: { children: React.ReactNode }) { return <>{children} <b className="text-red-500">*</b></> }
function Field({ label, children, hint }: { label: React.ReactNode; children: React.ReactNode; hint?: string }) { return <label className="block text-[14px] font-black text-[#2c2530]"><span className="mb-2 block">{label}</span>{children}{hint && <span className="mt-1.5 block text-[11px] font-bold leading-5 text-[#81737a]">{hint}</span>}</label> }
const inputClass = "h-12 w-full rounded-[13px] border border-[#ead9df] bg-white px-3.5 text-[14px] font-bold text-[#1F2937] outline-none transition duration-200 placeholder:text-[#b7a5ad] focus:border-[#E11D48] focus:bg-[#fffafb] focus:ring-2 focus:ring-rose-100";
const textareaClass = `${inputClass} min-h-28 resize-y py-3 leading-6`;

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("ar").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
}
function Select({ value, onChange, children, placeholder = "اختر" }: { value: string; onChange: (v: string) => void; children: React.ReactNode; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const options = Children.toArray(children).filter(isValidElement).map((child: any) => ({
    value: String(child.props.value ?? child.props.children ?? ""),
    label: String(child.props.children ?? child.props.value ?? "")
  })).filter(opt => opt.value !== "");
  const selected = options.find(opt => opt.value === value);
  const q = normalizeSearch(query);
  const filtered = q ? options.filter(opt => normalizeSearch(opt.label).includes(q)) : options;

  useEffect(() => {
    const onPointer = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onPointer); document.removeEventListener("keydown", onKey); };
  }, []);

  return <div ref={ref} className="relative">
    <button type="button" onClick={() => { setOpen(v => !v); setQuery("") }} className={`${inputClass} flex items-center justify-between gap-2 text-right`}>
      <span className={selected ? "truncate text-[#1F2937]" : "text-[#a9979f]"}>{selected?.label || placeholder}</span>
      <ChevronDown className={`h-4 w-4 shrink-0 text-[#9d7f8c] transition ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <div className="absolute z-[120] mt-1.5 w-full overflow-hidden rounded-[15px] border border-rose-100 bg-white shadow-[0_18px_45px_rgba(74,25,66,.16)]">
      {options.length > 5 && <div className="border-b border-rose-50 p-2">
        <div className="relative"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400" /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} className="h-9 w-full rounded-xl border border-rose-100 bg-rose-50/40 pr-9 pl-3 text-[12px] font-bold outline-none focus:border-rose-300" placeholder="" /></div>
      </div>}
      <div className="max-h-[440px] overflow-y-auto p-1.5 ql-scroll-panel">
        {filtered.map(opt => <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); setQuery("") }} className={`block w-full rounded-[10px] px-3 py-2 text-right text-[12px] font-bold transition ${value === opt.value ? "bg-[#FFF1F5] text-[#E11D48]" : "text-[#4b4146] hover:bg-rose-50"}`}>{opt.label}</button>)}
        {!filtered.length && <div className="px-3 py-6 text-center text-[12px] font-bold text-rose-400">لا توجد نتيجة مطابقة.</div>}
      </div>
    </div>}
  </div>
}
function Oath({ agreed, setAgreed }: { agreed: boolean; setAgreed: (v: boolean) => void }) {
  return <div>
    <div className="overflow-hidden rounded-[28px] border border-rose-100 bg-[linear-gradient(135deg,#FFF5F7,#fff_58%,#fff7e8)] p-6 shadow-[0_12px_30px_rgba(111,20,58,.06)]">
      <div className="grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
        <div className="relative h-[170px] overflow-hidden rounded-[22px]"><Image src="/images/site-v2/route-banners/signup.webp" alt="عريس وعروسة" fill className="object-cover" /></div>
        <div><ShieldCheck className="h-8 w-8 text-[#E11D48]" /><h2 className="mt-3 text-[21px] font-black text-[#4A1942]">ميثاق قلبي لوڤي للزواج الجاد</h2><div className="mt-4 grid gap-2 text-[16px] font-bold leading-7 text-[#4B5563]"><p>• هدفي الحقيقي هو الزواج الجاد.</p><p>• بياناتي ومعلوماتي ستكون حقيقية.</p><p>• لن أشارك أرقام هاتف أو حسابات تواصل خارجية داخل النبذة أو الرسائل.</p><p>• سأحترم خصوصية الأعضاء وقواعد الأمان.</p></div></div>
      </div>
    </div>
    <label id="field-oath" className={`mt-6 flex cursor-pointer items-center gap-4 rounded-[20px] border-2 p-5 text-[16px] font-black transition ${agreed ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-md" : "border-[#E5E7EB] bg-white text-[#1F2937] hover:border-rose-200"}`}><input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="sr-only" /><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 ${agreed ? "border-emerald-500 bg-emerald-500 text-white" : "border-rose-300 bg-white text-transparent"}`}><CheckCircle2 className="h-5 w-5" /></span><Required>أوافق على الميثاق وقواعد المنصة</Required></label>
  </div>
}

function GenderStep({ gender, setGender }: { gender: Form["gender"]; setGender: (v: Form["gender"]) => void }) {
  return <div id="field-gender">
    <h3 className="text-center text-[28px] font-black text-[#4A1942]">من أنت؟</h3>
    <p className="mt-2 text-center text-[16px] font-bold text-[#6B7280]">اختر البطاقة التي تعبّر عنك، ويمكنك متابعة التسجيل بعد الاختيار.</p>
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      <Gender active={gender === "male"} title="أنا رجل" subtitle="أبحث عن زوجة" image="/images/site-v2/members/men-modern/01.webp" tone="blue" onClick={() => setGender("male")} />
      <Gender active={gender === "female"} title="أنا امرأة" subtitle="أبحث عن زوج" image="/images/site-v2/members/women-hijab/01.webp" tone="pink" onClick={() => setGender("female")} />
    </div>
  </div>
}

function Gender({ active, title, subtitle, image, tone, onClick }: { active: boolean; title: string; subtitle: string; image: string; tone: "blue" | "pink"; onClick: () => void }) { return <button type="button" onClick={onClick} className={`rounded-[28px] border-2 p-5 text-right transition hover:-translate-y-1 ${tone === "pink" ? "border-rose-200 bg-[linear-gradient(135deg,#fff1f6,#fff)]" : "border-sky-200 bg-[linear-gradient(135deg,#eef8ff,#fff)]"} ${active ? "scale-[1.03] ring-4 ring-rose-100 shadow-xl" : "scale-[.98] opacity-90"}`}><div className="grid grid-cols-[1fr_120px] items-center gap-3"><div><div className="text-xl font-black">{title}</div><div className="mt-1 text-xs font-bold text-rose-500">{subtitle}</div>{active && <span className="mt-4 inline-flex rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black text-white">تم الاختيار</span>}</div><div className="relative h-[120px] w-[120px] overflow-hidden rounded-full"><Image src={image} alt={title} fill className="object-cover" /></div></div></button> }

function Account({ form, set, state, message, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }: { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void; state: UsernameState; message: string; showPassword: boolean; setShowPassword: (v: boolean) => void; showConfirmPassword: boolean; setShowConfirmPassword: (v: boolean) => void }) {
  const c = state === "available" ? "text-emerald-600" : state === "unavailable" || state === "invalid" ? "text-red-600" : "text-slate-400";
  const pc = passwordChecks(form.password);
  const emailOk = isValidEmail(form.email);
  const passwordOk = isStrongPassword(form.password);
  return <div className="grid gap-6">
    <div id="field-display-name"><Field label={<Required>الاسم الذي سيظهر للأعضاء</Required>} hint="اسم واحد بدون مسافات. لا تستخدم رقم هاتف أو وسيلة تواصل.">
      <div className="relative"><UserRound className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-rose-400" /><input className={`${inputClass} pr-12`} value={form.displayName} onChange={e => { set("displayName", e.target.value); set("username", e.target.value) }} placeholder="" autoComplete="off" />{state === "available" && <CheckCircle2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500" />}{(state === "unavailable" || state === "invalid") && <XCircle className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />}</div>{message && <span className={`mt-2 block text-xs font-black ${c}`}>{message}</span>}
    </Field></div>
    <div id="field-email"><Field label={<Required>البريد الإلكتروني</Required>} hint="يُستخدم للدخول واستعادة الحساب، ولا يظهر للأعضاء."><div className="relative"><Mail className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-rose-400" /><input type="email" className={`${inputClass} pr-12 ${form.email && !emailOk ? "border-red-300" : emailOk ? "border-emerald-300" : ""}`} value={form.email} onChange={e => set("email", e.target.value)} placeholder="" autoComplete="email" />{emailOk && <CheckCircle2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500" />}</div>{form.email && !emailOk && <span className="mt-2 block text-xs font-black text-red-600">اكتب بريدًا إلكترونيًا صحيحًا.</span>}{emailOk && <span className="mt-2 block text-xs font-black text-emerald-600">البريد مكتوب بصيغة صحيحة.</span>}</Field></div>
    <div className="grid gap-5 sm:grid-cols-2">
      <div id="field-password"><Field label={<Required>كلمة المرور</Required>}>
        <div className="relative"><input type={showPassword ? "text" : "password"} className={`${inputClass} pl-12`} value={form.password} onChange={e => set("password", e.target.value)} placeholder="" autoComplete="new-password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-50 hover:text-rose-600" aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}><Eye className="h-4 w-4" /></button></div>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-black"><span className={pc.length ? "text-emerald-600" : "text-slate-400"}>✓ 8 أحرف على الأقل</span><span className={pc.letter ? "text-emerald-600" : "text-slate-400"}>✓ حرف واحد على الأقل</span><span className={pc.number ? "text-emerald-600" : "text-slate-400"}>✓ رقم واحد على الأقل</span>{passwordOk && <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">قوية</span>}</div>
      </Field></div>
      <div id="field-confirm-password"><Field label={<Required>تأكيد كلمة المرور</Required>}><div className="relative"><input type={showConfirmPassword ? "text" : "password"} className={`${inputClass} pl-12 ${form.confirmPassword && form.password !== form.confirmPassword ? "border-red-300" : ""}`} value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} placeholder="" autoComplete="new-password" /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-50 hover:text-rose-600" aria-label={showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}><Eye className="h-4 w-4" /></button></div>{form.confirmPassword && form.password !== form.confirmPassword && <span className="mt-2 block text-xs font-black text-red-600">كلمتا المرور غير متطابقتين.</span>}{form.confirmPassword && form.password === form.confirmPassword && passwordOk && <span className="mt-2 block text-xs font-black text-emerald-600">تم تأكيد كلمة المرور.</span>}</Field></div>
    </div>
  </div>
}
function Identity({ form, set }: { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const areas = form.governorate ? (governorateAreas[form.governorate] || []) : [];
  return <div className="grid gap-4">
    <div className="grid gap-4 sm:grid-cols-2">
      <div id="field-age"><Field label={<Required>العمر</Required>}><Select value={form.age} onChange={v => set("age", v)} placeholder="اختر العمر">{ages.map(v => <option key={v} value={v}>{v} سنة</option>)}</Select></Field></div>
      <div id="field-residence"><Field label={<Required>مكان الإقامة</Required>}><Select value={form.residence} onChange={v => { set("residence", v as Form["residence"]); set("governorate", ""); set("city", ""); set("cityOther", ""); set("country", ""); set("abroadCity", "") }} placeholder="اختر مكان الإقامة"><option value="egypt">داخل مصر</option><option value="abroad">مقيم خارج مصر</option></Select></Field></div>
      {form.residence === "egypt" && <>
        <div id="field-governorate"><Field label={<Required>المحافظة</Required>}><Select value={form.governorate} onChange={v => { set("governorate", v); set("city", ""); set("cityOther", "") }} placeholder="اختر المحافظة">{governorates.map(v => <option key={v} value={v}>{v}</option>)}</Select></Field></div>
        <div id="field-city"><Field label={<Required>المدينة / المركز / المنطقة</Required>}><Select value={form.city} onChange={v => { set("city", v); if (v !== "__other__") set("cityOther", "") }} placeholder={form.governorate ? "اختر المدينة أو المركز" : "اختر المحافظة أولًا"}>{areas.map(v => <option key={v} value={v}>{v}</option>)}<option value="__other__">منطقة أو قرية أخرى</option></Select></Field></div>
        {form.city === "__other__" && <div id="field-city-other" className="sm:col-span-2"><Field label={<Required>اسم المنطقة / القرية</Required>}><input className={inputClass} value={form.cityOther} onChange={e => set("cityOther", e.target.value)} /></Field></div>}
      </>}
      {form.residence === "abroad" && <>
        <div id="field-country" className="sm:col-span-2"><Field label={<Required>دولة الإقامة</Required>}><CountryPicker value={form.country} onChange={v => set("country", v)} /></Field></div>
        <div id="field-abroad-city" className="sm:col-span-2"><Field label={<Required>مدينة الإقامة</Required>}><input className={inputClass} value={form.abroadCity} onChange={e => set("abroadCity", e.target.value)} /></Field></div>
      </>}
    </div>
  </div>
}
function FamilyHousing({ form, set }: { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  function changeMaritalStatus(value: string) {
    set("maritalStatus", value);
    if (value === "أعزب / عزباء") set("previousMarriage", "no");
    else if (value) set("previousMarriage", "yes");
  }
  const houseOptions = [
    ["مسكن مستقل تمليك", "تمليك"],
    ["مسكن مستقل إيجار", "إيجار"],
    ["أجهّز لمسكن مستقل", "أجهّز لمسكن"],
    ["مع العائلة حاليًا", "مع العائلة"],
    ["يتحدد بالاتفاق", "بالاتفاق"]
  ];
  return <div className="grid gap-4">
    <div id="field-housing">
      <div className="mb-2 text-[14px] font-black text-[#2c2530]"><Required>السكن بعد الزواج</Required></div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {houseOptions.map(([value, label]) => <button key={value} type="button" onClick={() => set("housing", value)} className={`ql-mini-option ${form.housing === value ? "is-active" : ""}`}><HomeIcon className="h-5 w-5" /><span>{label}</span></button>)}
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div id="field-marital"><Field label={<Required>الحالة الاجتماعية</Required>}><Select value={form.maritalStatus} onChange={changeMaritalStatus} placeholder="اختر الحالة"><option>أعزب / عزباء</option><option>مطلق / مطلقة</option><option>أرمل / أرملة</option></Select></Field></div>
      <div id="field-children"><Field label={<Required>هل لديك أبناء؟</Required>}><Select value={form.hasChildren} onChange={v => { set("hasChildren", v); if (v === "no") { set("childrenCount", "0"); set("childrenLiving", "none") } }} placeholder="اختر"><option value="no">لا</option><option value="yes">نعم</option></Select></Field></div>
      {form.hasChildren === "yes" && <>
        <div id="field-children-count"><Field label={<Required>عدد الأبناء</Required>}><Select value={form.childrenCount} onChange={v => set("childrenCount", v)} placeholder="اختر العدد">{Array.from({ length: 10 }, (_, i) => String(i + 1)).map(v => <option key={v}>{v}</option>)}</Select></Field></div>
        <div id="field-children-living"><Field label={<Required>إقامة الأبناء</Required>}><Select value={form.childrenLiving} onChange={v => set("childrenLiving", v)} placeholder="اختر"><option>يعيشون معي</option><option>يعيش بعضهم معي</option><option>لا يعيشون معي</option></Select></Field></div>
      </>}
      <div id="field-marriage-timeline" className="sm:col-span-2"><Field label={<Required>الفترة المتوقعة للزواج</Required>}><Select value={form.marriageTimeline} onChange={v => set("marriageTimeline", v)} placeholder="اختر الفترة"><option>عند التوافق والتفاهم</option><option>عند اتخاذ القرار المناسب للطرفين</option><option>حسب التوافق والظروف</option><option>خلال 3 أشهر</option><option>خلال 6 أشهر</option><option>خلال سنة</option><option>خلال سنة إلى سنتين</option></Select></Field></div>
    </div>
  </div>
}

function JobPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const q = normalizeSearch(query);
  const filtered = q ? jobOptions.filter(x => normalizeSearch(`${x.v} ${x.c}`).includes(q)) : jobOptions;
  useEffect(() => {
    const onPointer = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false) };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false) };
    document.addEventListener("mousedown", onPointer); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onPointer); document.removeEventListener("keydown", onKey) };
  }, []);
  const selected = jobOptions.find(x => x.v === value);
  return <div ref={ref} className="relative">
    <button type="button" onClick={() => { setOpen(v => !v); setQuery("") }} className={`${inputClass} flex items-center justify-between gap-2`}>
      <span className="flex min-w-0 items-center gap-2">{selected && <span className="text-lg">{selected.i}</span>}<span className={selected ? "truncate" : "text-[#a9979f]"}>{selected?.v || "اختر المهنة"}</span></span>
      <ChevronDown className={`h-4 w-4 shrink-0 text-[#9d7f8c] transition ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <div className="absolute z-[140] mt-1.5 w-full overflow-hidden rounded-[15px] border border-rose-100 bg-white shadow-[0_20px_50px_rgba(74,25,66,.18)]">
      <div className="border-b border-rose-50 p-2"><div className="relative"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400" /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} className="h-9 w-full rounded-xl border border-rose-100 bg-rose-50/40 pr-9 pl-3 text-[12px] font-bold outline-none focus:border-rose-300" placeholder="" /></div></div>
      <div className="max-h-[460px] overflow-y-auto p-1.5 ql-scroll-panel">
        {filtered.map(job => <button key={job.v} type="button" onClick={() => { onChange(job.v); setOpen(false); setQuery("") }} className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-right transition ${value === job.v ? "bg-[#FFF1F5] text-[#E11D48]" : "hover:bg-rose-50"}`}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-50 text-lg">{job.i}</span><span className="min-w-0 flex-1"><b className="block truncate text-[12px]">{job.v}</b><small className="text-[9px] font-bold text-rose-400">{job.c}</small></span></button>)}
        {!filtered.length && <div className="px-3 py-7 text-center text-[12px] font-bold text-rose-400">لا توجد نتيجة مطابقة.</div>}
      </div>
    </div>}
  </div>
}

function EducationWork({ form, set }: { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const needsJob = Boolean(form.workStatus) && !nonWorkingStatuses.has(form.workStatus);
  return <div className="grid gap-6">
    <div id="field-education"><Field label={<Required>المستوى التعليمي</Required>}><Select value={form.education} onChange={v => set("education", v)} placeholder="اختر المستوى التعليمي">{educationOptions.map(v => <option key={v} value={v}>{v}</option>)}</Select></Field></div>
    <div id="field-work-status"><Field label={<Required>الحالة العملية</Required>}><Select value={form.workStatus} onChange={v => { set("workStatus", v); if (nonWorkingStatuses.has(v)) { set("job", ""); set("jobOther", "") } }}><option>أعمل بشكل كامل</option><option>أعمل بشكل جزئي</option><option>عمل حر</option><option>أبحث عن عمل</option><option>طالب</option><option>ربة منزل</option><option>متقاعد</option><option>لا أعمل حاليًا</option></Select></Field></div>
    {needsJob ? <>
      <div id="field-job"><Field label={<Required>المهنة / الوظيفة</Required>} hint="اختر المسمى الدقيق قدر الإمكان؛ وتشمل القائمة الشرطة والقوات المسلحة بتفريعاتها."><JobPicker value={form.job} onChange={v => set("job", v)} /></Field></div>
      {form.job === "أخرى" && <div className="sm:col-span-2"><Field label={<Required>اكتب وظيفتك بدقة</Required>}><input className={inputClass} value={form.jobOther} onChange={e => set("jobOther", e.target.value)} placeholder="" /></Field></div>}
    </> : form.workStatus ? <div className="sm:col-span-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs font-black leading-6 text-emerald-800">لن نطلب منك وظيفة لا تناسب حالتك الحالية. سيتم حفظ حالتك العملية كما اخترتها.</div> : null}
  </div>
}

function ImageChoice({ active, label, onClick, src }: { active: boolean; label: string; onClick: () => void; src: any }) {
  return <button type="button" onClick={onClick} className={`ql-photo-choice ${active ? "is-active" : ""}`}><span className="ql-photo-thumb"><Image src={src} alt="" fill sizes="90px" className="object-cover" /></span><span>{label}</span>{active && <CheckCircle2 className="ql-choice-check h-4 w-4" />}</button>
}
function SwatchChoice({ active, label, onClick, color }: { active: boolean; label: string; onClick: () => void; color: string }) {
  return <button type="button" onClick={onClick} className={`ql-swatch-choice ${active ? "is-active" : ""}`}><span style={{ background: color }} /><b>{label}</b></button>
}
function HealthFaith({ form, set }: { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const bodyItems = form.gender === "female" ? [["نحيف", "/images/site-v2/appearance/body/women/slim.webp"], ["متوسط", "/images/site-v2/appearance/body/women/average.webp"], ["رياضي", "/images/site-v2/appearance/body/women/athletic.webp"], ["ممتلئ", "/images/site-v2/appearance/body/women/curvy.webp"]] as const : [["نحيف", "/images/site-v2/appearance/body/men/slim.webp"], ["متوسط", "/images/site-v2/appearance/body/men/average.webp"], ["رياضي", "/images/site-v2/appearance/body/men/athletic.webp"], ["ممتلئ", "/images/site-v2/appearance/body/men/full.webp"]] as const;
  const eyeItems = [["بني", "/images/site-v2/signup-visuals/eye-brown.png"], ["عسلي", "/images/site-v2/signup-visuals/eye-hazel.png"], ["أخضر", "/images/site-v2/signup-visuals/eye-green.png"], ["أزرق", "/images/site-v2/signup-visuals/eye-blue.png"], ["رمادي", "/images/site-v2/signup-visuals/eye-gray.png"]] as const;
  const hairItems = [["أسود", "/images/site-v2/signup-visuals/hair-black.png"], ["بني", "/images/site-v2/signup-visuals/hair-brown.png"], ["أشقر", "/images/site-v2/signup-visuals/hair-blonde.png"], ["أحمر / نحاسي", "/images/site-v2/signup-visuals/hair-copper.png"], ["رمادي / أبيض", "/images/site-v2/signup-visuals/hair-white.png"]] as const;
  const hijabItems = [["غير محجبة", "/images/site-v2/appearance/hijab/no-hijab.webp"], ["حجاب", "/images/site-v2/appearance/hijab/hijab.webp"], ["خمار", "/images/site-v2/appearance/hijab/khimar.webp"], ["نقاب", "/images/site-v2/appearance/hijab/niqab.webp"]] as const;
  const femaleOutfits = [["محتشم", "/images/site-v2/appearance/outfits/women/modern-modest.webp"], ["كلاسيكي", "/images/site-v2/appearance/outfits/women/classic.webp"], ["كاجوال", "/images/site-v2/appearance/outfits/women/casual.webp"], ["رسمي", "/images/site-v2/appearance/outfits/women/formal.webp"], ["عصري محتشم", "/images/site-v2/appearance/outfits/women/modern-modest.webp"]] as const;
  const maleOutfits = [["كلاسيكي", "/images/site-v2/appearance/outfits/men/classic.webp"], ["كاجوال", "/images/site-v2/appearance/outfits/men/casual.webp"], ["رياضي", "/images/site-v2/appearance/outfits/men/modern.webp"], ["رسمي", "/images/site-v2/appearance/outfits/men/formal.webp"], ["محافظ", "/images/site-v2/appearance/outfits/men/classic.webp"]] as const;
  const outfitItems = form.gender === "female" ? femaleOutfits : maleOutfits;
  const prayerItems = [["أحافظ على الصلوات", "أحافظ عليها", "/images/site-v2/signup-visuals/prayer-often.png"], ["أصلي أغلب الأوقات", "غالبًا", "/images/site-v2/signup-visuals/prayer-regular.png"], ["أصلي أحيانًا", "أحيانًا", "/images/site-v2/signup-visuals/prayer-some.png"], ["لا أصلي حاليًا", "حاليًا لا", "/images/site-v2/signup-visuals/prayer-low.png"]] as const;
  return <div className="grid gap-5">
    <div className="grid gap-4 sm:grid-cols-2">
      <div id="field-height"><Field label={<Required>الطول</Required>}><div className="ql-slider-card"><b>{form.height || 170} سم</b><input type="range" min="140" max="200" value={form.height || "170"} onChange={e => set("height", e.target.value)} /></div></Field></div>
      <div id="field-weight"><Field label={<Required>الوزن</Required>}><div className="ql-slider-card"><b>{form.weight || 70} كجم</b><input type="range" min="40" max="180" value={form.weight || "70"} onChange={e => set("weight", e.target.value)} /></div></Field></div>
    </div>
    <div id="field-body-type"><div className="ql-group-title"><Required>بنية الجسم</Required></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{bodyItems.map(([label, src]) => <ImageChoice key={label} active={form.bodyType === label} label={label} onClick={() => set("bodyType", label)} src={src} />)}</div></div>
    <div id="field-skin-color"><div className="ql-group-title"><Required>لون البشرة</Required></div><div className="grid grid-cols-3 gap-2 sm:grid-cols-5">{([["فاتحة", "#f4d7c5"], ["قمحية فاتحة", "#ddb18c"], ["قمحية", "#c98e66"], ["سمراء", "#9a6247"], ["داكنة", "#694536"]] as const).map(([label, color]) => <SwatchChoice key={label} active={form.skinColor === label} label={label} color={color} onClick={() => set("skinColor", label)} />)}</div></div>
    <div className="grid gap-5 lg:grid-cols-2">
      <div id="field-eye-color"><div className="ql-group-title"><Required>لون العينين</Required></div><div className="grid grid-cols-3 gap-2">{eyeItems.map(([label, src]) => <ImageChoice key={label} active={form.eyeColor === label} label={label} onClick={() => set("eyeColor", label)} src={src} />)}</div></div>
      <div id="field-hair-color"><div className="ql-group-title"><Required>لون الشعر</Required></div><div className="grid grid-cols-3 gap-2">{hairItems.map(([label, src]) => <ImageChoice key={label} active={form.hairColor === label} label={label} onClick={() => set("hairColor", label)} src={src} />)}
        {form.gender === "male" && <button type="button" onClick={() => set("hairColor", "أصلع / حليق")} className={`ql-photo-choice ${form.hairColor === "أصلع / حليق" ? "is-active" : ""}`}><span className="ql-photo-thumb grid place-items-center bg-rose-50"><CircleUserRound className="h-9 w-9 text-rose-500" /></span><span>أصلع / حليق</span></button>}
      </div></div>
    </div>
    {form.gender === "female"
      ? <div id="field-hijab-style"><div className="ql-group-title"><Required>الحجاب</Required></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{hijabItems.map(([label, src]) => <ImageChoice key={label} active={form.hijabStyle === label} label={label} onClick={() => set("hijabStyle", label)} src={src} />)}</div></div>
      : <div id="field-beard-style"><div className="ql-group-title"><Required>اللحية</Required></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{([["بدون لحية", "/images/site-v2/appearance/beard/none.webp"], ["لحية خفيفة", "/images/site-v2/appearance/beard/light.webp"], ["لحية متوسطة", "/images/site-v2/appearance/beard/medium.webp"], ["لحية كاملة", "/images/site-v2/appearance/beard/full.webp"]] as const).map(([label, src]) => <ImageChoice key={label} active={form.beardStyle === label} label={label} onClick={() => set("beardStyle", label)} src={src} />)}</div></div>
    }
    <div id="field-clothing-style"><div className="ql-group-title"><Required>أسلوب اللباس</Required></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{outfitItems.map(([label, src]) => <ImageChoice key={label} active={form.clothingStyle === label} label={label} onClick={() => set("clothingStyle", label)} src={src} />)}</div></div>
    <div className="grid gap-5 lg:grid-cols-2">
      <div id="field-smoking"><div className="ql-group-title"><Required>التدخين</Required></div><div className="grid grid-cols-3 gap-2"><button type="button" onClick={() => set("smoking", "لا أدخن")} className={`ql-icon-choice ${form.smoking === "لا أدخن" ? "is-active" : ""}`}><ShieldCheck className="h-6 w-6 text-emerald-600" /><b>لا أدخن</b></button><button type="button" onClick={() => set("smoking", "أدخن أحيانًا")} className={`ql-icon-choice ${form.smoking === "أدخن أحيانًا" ? "is-active" : ""}`}><CircleUserRound className="h-6 w-6 text-amber-600" /><b>أحيانًا</b></button><button type="button" onClick={() => set("smoking", "أدخن")} className={`ql-icon-choice ${form.smoking === "أدخن" ? "is-active" : ""}`}><XCircle className="h-6 w-6 text-rose-600" /><b>أدخن</b></button></div></div>
      <div id="field-prayer"><div className="ql-group-title"><Required>المحافظة على الصلاة</Required></div><div className="grid grid-cols-2 gap-2">{prayerItems.map(([value, label, src]) => <ImageChoice key={value} active={form.prayer === value} label={label} onClick={() => set("prayer", value)} src={src} />)}</div></div>
    </div>
    <div id="field-religiosity"><div className="ql-group-title"><Required>مستوى الالتزام الديني</Required></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{([["ملتزم", "/images/site-v2/appearance/faith/committed.webp"], ["متدين", "/images/site-v2/appearance/faith/regular.webp"], ["متوسط", "/images/site-v2/appearance/faith/often.webp"], ["في بداية الالتزام", "/images/site-v2/appearance/faith/sometimes.webp"]] as const).map(([v, src]) => <ImageChoice key={v} active={form.religiosity === v} label={v} onClick={() => set("religiosity", v)} src={src} />)}</div></div>
    <div id="field-health"><Field label={<Required>الحالة الصحية</Required>}><Select value={form.healthStatus} onChange={v => set("healthStatus", v)} placeholder="اختر الحالة الصحية">{healthOptions.map(v => <option key={v} value={v}>{v}</option>)}</Select></Field></div>
    {form.healthStatus && form.healthStatus !== "سليم والحمد لله" && <div id="field-health-details"><Field label={<Required>تفاصيل الحالة الصحية أو الإعاقة</Required>}><textarea className={textareaClass} value={form.healthDetails} onChange={e => set("healthDetails", e.target.value)} /></Field></div>}
  </div>
}
function PersonalityPartner({ form, set, toggle }: { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void; toggle: (k: "personalityTraits" | "interests", v: string) => void }) {
  const warning = hasContactInfo(form.bio) || hasContactInfo(form.partnerSpecs);
  return <div>
    <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-xs font-black leading-6 text-red-700">لأمانك: لا تكتب رقم هاتف أو بريدًا شخصيًا أو رابطًا أو أي وسيلة تواصل خارجية داخل الملف الشخصي.</div>
    <div id="field-bio" className="mt-6"><div className="mb-2 flex items-center justify-between"><span className="text-[16px] font-black text-[#1F2937]">نبذة عنك <b className="text-red-500">*</b></span><span className={`text-[14px] font-black ${form.bio.trim().length >= 100 ? "text-emerald-600" : "text-[#6B7280]"}`}>{form.bio.trim().length} حرف</span></div><textarea className={textareaClass} value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="" /><span className="mt-2 block text-[14px] font-bold text-[#6B7280]">الحد الأدنى 100 حرف.</span></div>
    <div id="field-traits"><Choice title="صفات شخصيتك" items={traits} selected={form.personalityTraits} onToggle={v => toggle("personalityTraits", v)} /></div>
    <div id="field-interests"><Choice title="اهتماماتك وهواياتك" items={interests} selected={form.interests} onToggle={v => toggle("interests", v)} /></div>
    <div className="mt-5 rounded-[18px] border border-rose-100 bg-rose-50/60 p-3.5"><HeartHandshake className="h-7 w-7 text-amber-600" /><h3 className="mt-2 text-xl font-black">مواصفات شريك الحياة</h3><p className="mt-2 text-xs font-bold leading-6 text-rose-500">اكتب ما يهمك بوضوح واحترام، دون بيانات تواصل.</p></div>
    <div id="field-partner" className="mt-5"><div className="mb-2 flex items-center justify-between"><span className="text-[16px] font-black text-[#1F2937]">مواصفات الشريك المناسب <b className="text-red-500">*</b></span><span className={`text-[14px] font-black ${form.partnerSpecs.trim().length >= 80 ? "text-emerald-600" : "text-[#6B7280]"}`}>{form.partnerSpecs.trim().length} حرف</span></div><textarea className={`${textareaClass} min-h-28`} value={form.partnerSpecs} onChange={e => set("partnerSpecs", e.target.value)} placeholder="" /><span className="mt-2 block text-[14px] font-bold text-[#6B7280]">الحد الأدنى 80 حرفًا.</span></div>
    {warning && <div className="mt-4 rounded-xl bg-red-600 p-4 text-sm font-black text-white">تم اكتشاف بيانات تواصل مباشرة. احذفها قبل إنشاء الحساب.</div>}
    <div className="mt-5 grid gap-3 sm:grid-cols-3"><Mini icon={<BadgeCheck />} text="ملف متكامل" /><Mini icon={<UsersRound />} text="توافق أدق" /><Mini icon={<ShieldCheck />} text="تواصل آمن داخل المنصة" /></div>
  </div>
}
function CountryPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const q = normalizeSearch(query);
  const filtered = q ? countries.filter(c => normalizeSearch(c.name).includes(q)) : countries;
  const selected = countries.find(c => c.name === value);
  useEffect(() => {
    const onPointer = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false) };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false) };
    document.addEventListener("mousedown", onPointer); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onPointer); document.removeEventListener("keydown", onKey) };
  }, []);
  return <div ref={ref} className="relative">
    <button type="button" onClick={() => { setOpen(v => !v); setQuery("") }} className={`${inputClass} flex items-center justify-between gap-2`}>
      <span className="flex min-w-0 items-center gap-2">{selected && <CountryFlag code={selected.code} size={22} />}<span className={selected ? "truncate" : "text-[#a9979f]"}>{selected?.name || "اختر الدولة"}</span></span>
      <ChevronDown className={`h-4 w-4 text-[#9d7f8c] transition ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <div className="absolute z-[130] mt-1.5 w-full overflow-hidden rounded-[15px] border border-rose-100 bg-white shadow-[0_20px_50px_rgba(74,25,66,.17)]">
      <div className="border-b border-rose-50 p-2"><div className="relative"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400" /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} className="h-9 w-full rounded-xl border border-rose-100 bg-rose-50/40 pr-9 pl-3 text-[12px] font-bold outline-none focus:border-rose-300" placeholder="" /></div></div>
      <div className="max-h-[440px] overflow-y-auto p-1.5 ql-scroll-panel">
        {filtered.map(country => <button key={country.code} type="button" onClick={() => { onChange(country.name); setOpen(false); setQuery("") }} className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-right transition ${value === country.name ? "bg-[#FFF1F5] text-[#E11D48]" : "hover:bg-rose-50"}`}><CountryFlag code={country.code} size={22} /><span className="text-[12px] font-bold">{country.name}</span></button>)}
      </div>
    </div>}
  </div>
}
function signupFallbackAvatar(form: Form) {
  if (form.gender === "female") {
    if (form.hijabStyle === "نقاب") return "/images/site-v2/appearance/hijab/niqab.webp";
    if (form.hijabStyle === "خمار") return "/images/site-v2/appearance/hijab/khimar.webp";
    if (form.hijabStyle === "غير محجبة") return "/images/site-v2/members/women-no-hijab-modest/01.webp";
    return "/images/site-v2/members/women-hijab/01.webp";
  }
  if (form.gender === "male") {
    if (form.beardStyle && form.beardStyle !== "بدون لحية") return "/images/site-v2/members/men-bearded/01.webp";
    if (form.beardStyle === "بدون لحية") return "/images/site-v2/members/men-clean-shaven/01.webp";
    return "/images/site-v2/members/men-modern/01.webp";
  }
  return "/images/site-v2/couples/couple-02.webp";
}

function ProfilePhotoStep({ form, preview, onChoose }: { form: Form; preview: string; onChoose: (file: File | null) => void }) {
  const fallback = signupFallbackAvatar(form);
  return <div className="rounded-[20px] border border-rose-100 bg-[#fffafb] p-4">
    <div className="text-center"><Camera className="mx-auto h-8 w-8 text-[#E11D48]" /><h3 className="mt-3 text-[28px] font-black text-[#4A1942]">صورتك الشخصية <span className="text-base font-bold text-[#6B7280]">(اختيارية)</span></h3><p className="mt-2 text-[14px] font-bold text-[#6B7280]">إذا لم ترغب في رفع صورة الآن، يمكنك المتابعة بالصورة الافتراضية وتغييرها لاحقًا.</p></div>
    <label className="mx-auto mt-6 block h-[160px] w-[160px] cursor-pointer overflow-hidden rounded-full border-4 border-dashed border-rose-200 bg-white shadow-sm transition hover:border-[#E11D48]">
      <div className="relative h-full w-full"><img src={preview || fallback} alt="معاينة الصورة الشخصية" className="h-full w-full object-cover" />{!preview && <div className="absolute inset-0 grid place-items-center bg-white/55 text-center text-sm font-black text-[#E11D48] backdrop-blur-[1px]"><span>صورة افتراضية<br /><small className="font-bold text-[#6B7280]">تتوافق مع اختياراتك حتى ترفع صورتك</small></span></div>}</div>
      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => onChoose(e.target.files?.[0] || null)} />
    </label>
    <div className="mx-auto mt-5 grid max-w-2xl gap-2 text-[13px] font-bold text-[#4B5563] sm:grid-cols-2"><div>وجه واضح وإضاءة طبيعية</div><div>بدون نظارة شمس</div><div>بدون فلاتر تغيّر الملامح</div><div>أقل من 5 ميجابايت</div></div>
  </div>
}

function FinalReviewStep({ form, set, preview, onChoose, hasPhoto }: { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void; preview: string; onChoose: (file: File | null) => void; hasPhoto: boolean }) {
  return <div className="grid gap-7">
    <PrivateIdentity form={form} set={set} />
    <ProfilePhotoStep form={form} preview={preview} onChoose={onChoose} />
    <ReviewSummary form={form} hasPhoto={hasPhoto} />
  </div>
}

function PrivateIdentity({ form, set }: { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const nameOk = form.fullName.trim().split(/\s+/).filter(Boolean).length >= 2;
  const phoneOk = isValidPhone(form.phone, form.residence);
  return <div><div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-5"><ShieldCheck className="h-7 w-7 text-emerald-700" /><h3 className="mt-2 text-xl font-black text-rose-900">بيانات سرية للإدارة فقط</h3><p className="mt-2 text-xs font-bold leading-6 text-rose-600">لن يظهر الاسم الكامل أو رقم الهاتف للأعضاء. نستخدمهما للأمان واستعادة الحساب والتحقق عند الحاجة.</p></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><div id="field-full-name"><Field label={<Required>الاسم الكامل الحقيقي</Required>} hint="اكتب اسمك الحقيقي من كلمتين على الأقل."><input className={`${inputClass} ${form.fullName && !nameOk ? "border-red-300" : ""}`} value={form.fullName} onChange={e => set("fullName", e.target.value)} autoComplete="name" />{form.fullName && !nameOk && <span className="mt-2 block text-xs font-black text-red-600">اكتب الاسم الحقيقي من كلمتين على الأقل.</span>}</Field></div><div id="field-phone"><Field label={<Required>رقم الهاتف</Required>} ><div className="flex overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white focus-within:border-[#E11D48] focus-within:bg-[#FFF5F7]"><span className="grid min-w-[54px] place-items-center border-l border-[#E5E7EB] bg-rose-50 text-sm font-black text-rose-600">{form.residence === "egypt" ? "+20" : "+"}</span><input className={`h-12 w-full bg-transparent px-4 text-[16px] font-bold text-[#1F2937] outline-none ${form.phone && !phoneOk ? "text-red-700" : ""}`} value={form.phone} onChange={e => set("phone", e.target.value)} inputMode="tel" autoComplete="tel" /></div>{form.phone && !phoneOk && <span className="mt-2 block text-xs font-black text-red-600">صيغة رقم الهاتف غير صحيحة.</span>}</Field></div></div></div>
}
function ReviewSummary({ form, hasPhoto }: { form: Form; hasPhoto: boolean }) {
  const place = form.residence === "egypt"
    ? [form.governorate, form.city === "__other__" ? form.cityOther : form.city].filter(Boolean).join(" - ")
    : [form.country, form.abroadCity].filter(Boolean).join(" - ");
  const rows = [
    ["الاسم الظاهر", form.displayName, 2],
    ["العمر", form.age ? `${form.age} سنة` : "", 3],
    ["الإقامة", place, 3],
    ["الحالة الاجتماعية", form.maritalStatus, 5],
    ["العمل", resolvedJob(form), 4],
    ["المؤهل", form.education, 4],
    ["الصورة الشخصية", hasPhoto ? "تم اختيار صورة" : "الصورة الافتراضية", 8],
  ] as const;
  return <div className="mt-5 rounded-[20px] border border-rose-100 bg-[linear-gradient(135deg,#fff8fb,#fff)] p-4">
    <div className="flex items-center gap-2"><BadgeCheck className="h-6 w-6 text-amber-600" /><h3 className="text-[17px] font-black text-[#5b102d]">راجع بياناتك قبل إنشاء الحساب</h3></div>
    <p className="mt-2 text-xs font-bold leading-6 text-rose-500">تأكد من أهم البيانات قبل إنشاء الحساب. استخدم قائمة الخطوات الجانبية للرجوع إلى أي خطوة وتعديلها.</p>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">{rows.map(([label, value, stepNo]) => <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-rose-100 bg-white p-2.5"><div><span className="block text-[10px] font-black text-rose-400">{label}</span><b className="mt-1 block text-sm text-rose-800">{value || "—"}</b></div><span className="grid h-8 w-8 place-items-center rounded-full bg-rose-50 text-rose-600" title={`يمكن تعديل هذه البيانات من الخطوة ${stepNo + 1}`}><Pencil className="h-3.5 w-3.5" /></span></div>)}</div>
  </div>
}
function Choice({ title, items, selected, onToggle }: { title: string; items: string[]; selected: string[]; onToggle: (v: string) => void }) { return <div className="mt-5"><h3 className="text-[14px] font-black">{title} <b className="text-red-500">*</b> <span className="text-[11px] font-bold text-rose-400">اختر 3 على الأقل</span></h3><div className="mt-2 flex flex-wrap gap-1.5">{items.map(v => <button key={v} type="button" onClick={() => onToggle(v)} className={`rounded-full border px-3 py-1.5 text-[11px] font-black transition ${selected.includes(v) ? "border-rose-500 bg-rose-600 text-white" : "border-rose-100 bg-rose-50/60 text-rose-700 hover:bg-rose-100"}`}>{v}</button>)}</div></div> }
function Mini({ icon, text }: { icon: React.ReactNode; text: string }) { return <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-black text-emerald-800"><span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>{text}</div> }
