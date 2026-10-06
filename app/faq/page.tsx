'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { PAYMENT_PHONE, SUPPORT_WHATSAPP_MESSAGE, SUPPORT_WHATSAPP_PHONE } from '@/lib/constants'

interface FaqItem {
  question: string
  answer: string
  category: 'legal' | 'payment' | 'privacy'
}

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'legal' | 'payment' | 'privacy'>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const whatsappMessage = encodeURIComponent(SUPPORT_WHATSAPP_MESSAGE)

  const faqs: FaqItem[] = [
    {
      category: 'payment',
      question: 'كيف يتم الاشتراك وتفعيل باقة التميز VIP؟',
      answer: `طريقة الدفع المتاحة هي تحويل محفظة محمول إلى رقم المنصة ${PAYMENT_PHONE}. بعد التحويل، ارفع صورة الإيصال من صفحة الدفع؛ تراجع الإدارة الطلب قبل تفعيل الباقة.`
    },
    {
      category: 'legal',
      question: 'لماذا يمنع الموقع تبادل أرقام الهواتف ووسائل التواصل الخارجي؟',
      answer: 'حرصاً على كرامة بيوت المسلمين وحماية لبناتنا وشبابنا من أي استغلال أو علاقات غير جادة. المنصة تطبق محرك فحص أمني ذكي يرصد أي محاولة لكتابة الأرقام أو الحسابات الخارجية ويصدر إنذاراً فورياً، لتكون كافة المحادثات خاضعة للضوابط الشرعية حتى مرحلة موافقة الأهل الرسمية.'
    },
    {
      category: 'legal',
      question: 'ما هي قاعدة "الاهتمام المتبادل" في المراسلة؟',
      answer: 'تطبيقاً لمبدأ الحياء والاحترام، لا تفتح المحادثة المجانية بين الطرفين إلا بعد أن يبدي الطرف الأول اهتمامه ويقوم الطرف الثاني بالرد وقبول هذا الاهتمام. وفي حال رغبتك في المراسلة المباشرة دون انتظار، يمكنك الترقية إلى باقة التميز VIP.'
    },
    {
      category: 'privacy',
      question: 'هل يظهر اسمي الحقيقي أو رقم هاتفي لباقي الأعضاء؟',
      answer: 'مستحيل تماماً. نظام الخصوصية في قلبي لوف يحجب كافة البيانات الحساسة مثل رقم الهاتف والبريد والاسم بالكامل، ويكتفي بالاسم المستعار وكود العضوية ومواصفاتك الشرعية والاجتماعية فقط.'
    },
    {
      category: 'privacy',
      question: 'كيف يتم التعامل مع الصور الشخصية؟ وهل يمكن إخفاؤها؟',
      answer: 'نعم بكل تأكيد. يمكنك ضبط صورة ملفك لتكون "خاصة بطلب إذن" بحيث تظهر مشوشة ولا تفتح إلا لمن توافق عليه شخصياً. كما تخضع كافة الصور لتدقيق إداري للتأكد من التزام الأخوات بالحجاب الشرعي الساتر ووقار صور الإخوة.'
    },
    {
      category: 'legal',
      question: 'هل المنصة متاحة للمصريين المقيمين خارج مصر؟',
      answer: 'نعم، المنصة مخصصة للمصريين فقط سواء داخل محافظات جمهورية مصر العربية الـ 27 أو أبناء الوطن المغتربين في الخارج الراغبين في الارتباط بزوجة صالحة من أرض الوطن.'
    }
  ]

  const EgyptFlagBadge = () => (
    <div style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '4px', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.7)', verticalAlign: 'middle', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
      <svg width="26" height="17" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="900" height="200" fill="#CE1126" />
        <rect y="200" width="900" height="200" fill="#FFFFFF" />
        <rect y="400" width="900" height="200" fill="#000000" />
        <circle cx="450" cy="300" r="30" fill="#C09A35" />
      </svg>
    </div>
  )

  const filteredFaqs = faqs.filter(item => {
    if (activeCategory === 'all') return true
    return item.category === activeCategory
  })

  return (
    <div style={{
      direction: 'rtl',
      fontFamily: 'Cairo, system-ui, sans-serif',
      background: 'radial-gradient(circle at 50% 0%, #fff1f2 0%, #fdf2f8 50%, #faf5ff 100%)',
      minHeight: '100vh',
      color: '#1f2937'
    }}>

      {/* 1. الهيدر الفاخر الموحد */}
      <header style={{
        background: 'linear-gradient(135deg, rgba(190, 24, 93, 0.96) 0%, rgba(136, 14, 79, 0.98) 100%)',
        color: '#fff',
        padding: '12px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>💖</span>
            <span style={{ fontSize: 22, fontWeight: 900 }}>قلبي لوف</span>
            <EgyptFlagBadge />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              href="/pricing"
              style={{
                textDecoration: 'none',
                background: '#fffbeb',
                color: '#92400e',
                border: '1.5px solid #fde68a',
                padding: '7px 16px',
                borderRadius: 25,
                fontSize: 13,
                fontWeight: 900,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>💎</span>
              <span>باقة التميز VIP</span>
            </Link>
            <Link href="/dashboard" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '7px 18px', borderRadius: 20, fontSize: 13 }}>
              لوحة التحكم
            </Link>
          </div>
        </div>
      </header>

      {/* 2. المحتوى الرئيسي */}
      <main style={{ maxWidth: 920, margin: '35px auto', padding: '0 16px' }}>

        {/* البانر التوجيهي */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 100%)',
          borderRadius: 28,
          border: '1.5px solid #fbcfe8',
          padding: '36px 30px',
          boxShadow: '0 10px 30px rgba(136, 14, 79, 0.05)',
          marginBottom: 32,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>❓</div>
          <h1 style={{ color: '#880e4f', fontWeight: 900, fontSize: 28, margin: '0 0 10px' }}>
            الأسئلة الشائعة ومركز الدعم
          </h1>
          <p style={{ color: '#4b5568', fontSize: 15, lineHeight: '1.9', maxWidth: 680, margin: '0 auto 20px', fontWeight: 600 }}>
            كل ما تحتاج لمعرفته حول الضوابط الشرعية، تفعيل باقات التميز عبر الكاش، وضمان الخصوصية التامة لبياناتك.
          </p>

          {/* فلاتر التصنيفات */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '8px 20px',
                borderRadius: 20,
                fontSize: 13.5,
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none',
                background: activeCategory === 'all' ? 'linear-gradient(135deg, #db2777, #880e4f)' : '#fff',
                color: activeCategory === 'all' ? '#fff' : '#880e4f',
                boxShadow: activeCategory === 'all' ? '0 4px 12px rgba(219,39,119,0.3)' : '0 1px 6px rgba(0,0,0,0.06)'
              }}
            >
              جميع الأسئلة
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('payment')}
              style={{
                padding: '8px 20px',
                borderRadius: 20,
                fontSize: 13.5,
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none',
                background: activeCategory === 'payment' ? 'linear-gradient(135deg, #db2777, #880e4f)' : '#fff',
                color: activeCategory === 'payment' ? '#fff' : '#880e4f',
                boxShadow: activeCategory === 'payment' ? '0 4px 12px rgba(219,39,119,0.3)' : '0 1px 6px rgba(0,0,0,0.06)'
              }}
            >
              الاشتراكات والكاش 💎
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('legal')}
              style={{
                padding: '8px 20px',
                borderRadius: 20,
                fontSize: 13.5,
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none',
                background: activeCategory === 'legal' ? 'linear-gradient(135deg, #db2777, #880e4f)' : '#fff',
                color: activeCategory === 'legal' ? '#fff' : '#880e4f',
                boxShadow: activeCategory === 'legal' ? '0 4px 12px rgba(219,39,119,0.3)' : '0 1px 6px rgba(0,0,0,0.06)'
              }}
            >
              الضوابط والمراسلة ⚖️
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('privacy')}
              style={{
                padding: '8px 20px',
                borderRadius: 20,
                fontSize: 13.5,
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none',
                background: activeCategory === 'privacy' ? 'linear-gradient(135deg, #db2777, #880e4f)' : '#fff',
                color: activeCategory === 'privacy' ? '#fff' : '#880e4f',
                boxShadow: activeCategory === 'privacy' ? '0 4px 12px rgba(219,39,119,0.3)' : '0 1px 6px rgba(0,0,0,0.06)'
              }}
            >
              الأمان والخصوصية 🔒
            </button>
          </div>
        </div>

        {/* قائمة الأكورديون للأسئلة */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  border: isOpen ? '1.5px solid #be185d' : '1.5px solid #fce7f3',
                  boxShadow: isOpen ? '0 8px 25px rgba(190, 24, 93, 0.08)' : '0 2px 10px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                  transition: 'all 0.2s'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    textAlign: 'right',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 900,
                    color: isOpen ? '#880e4f' : '#1f2937'
                  }}
                >
                  <span>{faq.question}</span>
                  <span style={{ fontSize: 20, color: '#be185d', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 22px',
                    color: '#4b5563',
                    fontSize: 14.5,
                    lineHeight: '2',
                    borderTop: '1px solid #fdf2f8'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* صندوق التواصل المباشر مع الإدارة */}
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          borderRadius: 24,
          border: '1.5px solid #fde68a',
          padding: '28px 26px',
          textAlign: 'center',
          marginBottom: 40,
          boxShadow: '0 8px 25px rgba(217, 119, 6, 0.1)'
        }}>
          <h3 style={{ color: '#92400e', fontWeight: 900, fontSize: 19, margin: '0 0 8px' }}>
            لم تجد إجابة لاستفسارك؟ تواصل مع الدعم الفني مباشرة 💬
          </h3>
          <p style={{ color: '#78350f', fontSize: 14, margin: '0 0 20px', lineHeight: '1.8' }}>
            فريق خدمة الأعضاء متاح للرد على استفساراتكم والمساعدة في تفعيل الباقات طوال أيام الأسبوع.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/${SUPPORT_WHATSAPP_PHONE}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                background: '#22c55e',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: 25,
                fontSize: 14.5,
                fontWeight: 900,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.35)'
              }}
            >
              <span>محادثة واتساب مباشرة ({SUPPORT_WHATSAPP_PHONE})</span>
            </a>

            <Link
              href="/pricing"
              style={{
                textDecoration: 'none',
                background: '#fff',
                color: '#92400e',
                border: '1.5px solid #fde68a',
                padding: '12px 24px',
                borderRadius: 25,
                fontSize: 14.5,
                fontWeight: 900
              }}
            >
              عرض باقات VIP والأسعار 💎
            </Link>
          </div>
        </div>

      </main>

    </div>
  )
}
