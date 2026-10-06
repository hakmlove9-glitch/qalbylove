'use client'
import React, { useState } from 'react'
import Link from 'next/link'

export default function CompatibilityPage() {
  // المعايير المختارة
  const [religionMatch, setReligionMatch] = useState('identical')
  const [locationMatch, setLocationMatch] = useState('same_city')
  const [educationMatch, setEducationMatch] = useState('equal')
  const [visionMatch, setVisionMatch] = useState('agreed')
  const [financialMatch, setFinancialMatch] = useState('capable')

  const [result, setResult] = useState<{
    score: number
    rating: string
    color: string
    advice: string
  } | null>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    let score = 50

    // 1. الدين والالتزام (الوزن الأكبر)
    if (religionMatch === 'identical') score += 25
    else if (religionMatch === 'close') score += 15
    else score += 5

    // 2. الموقع الجغرافي والمحافظة
    if (locationMatch === 'same_city') score += 10
    else if (locationMatch === 'neighbor_city') score += 7
    else score += 4

    // 3. التكافؤ التعليمي والفكري
    if (educationMatch === 'equal') score += 8
    else score += 4

    // 4. الرؤية المستقبلية والحجاب وعمل الزوجة
    if (visionMatch === 'agreed') score += 7
    else score += 2

    // ضبط الدرجة بحد أقصى 98% (الكمال لله وحده)
    if (score > 98) score = 98

    let rating = 'توافق شرعي وفكري ممتاز وواعد'
    let color = '#047857'
    let advice = 'بناءً على المعطيات، تتوافر أسس الكفاءة الشرعية والتقارب الاجتماعي المطلوب. نوصيك بصلاة الاستخارة ثم التقدم لطلب الرؤية الشرعية الرسمية في بيت أهلها.'

    if (score < 75 && score >= 60) {
      rating = 'توافق جيد يحتاج لمزيد من الاستيضاح'
      color = '#b45309'
      advice = 'هناك أرضية مشتركة طيبة، ولكن يُنصح بفتح نقاش صريح وشرعي حول النقاط غير المتطابقة قبل الإقدام على الخطوبة للتأكد من تقارب وجهات النظر.'
    } else if (score < 60) {
      rating = 'توافق منخفض يتطلب التأني والمصارحة'
      color = '#b91c1c'
      advice = 'الفروقات الجوهرية تتطلب التروي الشديد؛ الزواج مودة وسكن واستقرار، ولا بد من وضوح الشروط الجوهرية قبل اتخاذ أي خطوة.'
    }

    setResult({ score, rating, color, advice })
  }

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
            <Link href="/search" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '7px 18px', borderRadius: 20, fontSize: 13 }}>
              البحث 🔍
            </Link>
          </div>
        </div>
      </header>

      {/* 2. المحتوى الرئيسي للحاسبة */}
      <main style={{ maxWidth: 860, margin: '35px auto', padding: '0 16px' }}>
        
        <div style={{
          background: '#ffffff',
          borderRadius: 28,
          border: '1.5px solid #fbcfe8',
          boxShadow: '0 15px 40px rgba(136, 14, 79, 0.05)',
          padding: '36px 30px',
          marginBottom: 30
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>⚖️</div>
            <h1 style={{ color: '#880e4f', fontWeight: 900, fontSize: 26, margin: '0 0 8px' }}>
              حاسبة التوافق الشرعي والفكري بين الزوجين
            </h1>
            <p style={{ color: '#6b7280', fontSize: 14, maxWidth: 620, margin: '0 auto', lineHeight: '1.8' }}>
              أداة مبنية على ضوابط الكفاءة الشرعية (الدين، الخلق، الكفاءة الاجتماعية، والتقارب الأسري) لمساعدتك على تقييم مدى التوافق قبل الخطوة الرسمية.
            </p>
          </div>

          <form onSubmit={handleCalculate}>
            
            {/* المعيار 1: الالتزام الديني والصلوات */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#374151', marginBottom: 8 }}>
                1. درجة التوافق في الالتزام الديني والصلوات :
              </label>
              <select
                value={religionMatch}
                onChange={e => setReligionMatch(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #fbcfe8', fontSize: 13.5, backgroundColor: '#fdf7f8' }}
              >
                <option value="identical">متطابقان تماماً (محافظة على الصلوات في وقتها، حجاب شرعي/سمت صالح)</option>
                <option value="close">متقاربان جداً مع حرص متبادل على الطاعة والتطور للأفضل</option>
                <option value="different">يوجد تفاوت في الالتزام يحتاج لنقاش مسبق</option>
              </select>
            </div>

            {/* المعيار 2: التقارب الجغرافي والمحافظات */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#374151', marginBottom: 8 }}>
                2. التقارب الجغرافي ومكان السكن المستقبلي :
              </label>
              <select
                value={locationMatch}
                onChange={e => setLocationMatch(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #fbcfe8', fontSize: 13.5, backgroundColor: '#fdf7f8' }}
              >
                <option value="same_city">من نفس المحافظة / المدينة (تطابق تام في العادات والتقاليد)</option>
                <option value="neighbor_city">من محافظة مجاورة مع سهولة الانتقال والزيارات العائلية</option>
                <option value="travel">أحدهما مغترب بالخارج أو محافظة بعيدة مع موافقة صريحة على السفر</option>
              </select>
            </div>

            {/* المعيار 3: المؤهل العلمي والفكري */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#374151', marginBottom: 8 }}>
                3. التكافؤ التعليمي والفكري :
              </label>
              <select
                value={educationMatch}
                onChange={e => setEducationMatch(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #fbcfe8', fontSize: 13.5, backgroundColor: '#fdf7f8' }}
              >
                <option value="equal">مؤهل عالي متقارب أو متكافئ مع تقارب أسلوب الحوار</option>
                <option value="acceptable">تفاوت يسير في المؤهل مع وجود نضج وتفاهم فكري عالٍ</option>
              </select>
            </div>

            {/* المعيار 4: الاتفاق على إدارة البيت والعمل */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#374151', marginBottom: 8 }}>
                4. الاتفاق حول أولويات الأسرة وعمل الزوجة :
              </label>
              <select
                value={visionMatch}
                onChange={e => setVisionMatch(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #fbcfe8', fontSize: 13.5, backgroundColor: '#fdf7f8' }}
              >
                <option value="agreed">اتفاق تام ومحدد مسبقاً (سواء عمل الزوجة أو التفرغ لتربية الأبناء)</option>
                <option value="negotiable">مبدأ التفاهم قائم ومتروك لظروف الحياة بعد العقد</option>
              </select>
            </div>

            {/* المعيار 5: الاستطاعة المادية والباءة */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#374151', marginBottom: 8 }}>
                5. الجاهزية المادية وفتح البيت (الباءة) :
              </label>
              <select
                value={financialMatch}
                onChange={e => setFinancialMatch(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #fbcfe8', fontSize: 13.5, backgroundColor: '#fdf7f8' }}
              >
                <option value="capable">مستقر مادياً وقادر على تكاليف الزواج والنفقة بالمعروف</option>
                <option value="working">يسعى ويعمل وله دخل منتظم مع استعداد لتيسير المهور والطلبات</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 16,
                border: 'none',
                background: 'linear-gradient(135deg, #db2777 0%, #880e4f 100%)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(219, 39, 119, 0.35)'
              }}
            >
              احتساب نسبة التوافق الشرعي الآن ⚖️
            </button>
          </form>

          {/* بطاقة النتيجة والتقرير الشرعي */}
          {result && (
            <div style={{
              marginTop: 30,
              background: 'linear-gradient(135deg, #fff5f7 0%, #fdf2f8 100%)',
              borderRadius: 22,
              border: `2px solid ${result.color}`,
              padding: '26px 22px',
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease-in'
            }}>
              <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 800, marginBottom: 4 }}>
                نسبة التوافق التقريبية
              </div>
              <div style={{ fontSize: 44, fontWeight: 900, color: result.color, margin: '4px 0 10px' }}>
                {result.score}%
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: result.color, marginBottom: 14 }}>
                {result.rating}
              </div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: '2', margin: '0 auto 20px', maxWidth: 640 }}>
                {result.advice}
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  href="/search"
                  style={{
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #db2777, #880e4f)',
                    color: '#fff',
                    padding: '10px 24px',
                    borderRadius: 20,
                    fontSize: 13.5,
                    fontWeight: 900
                  }}
                >
                  البحث عن الشريك المناسب 🔍
                </Link>
                <Link
                  href="/terms"
                  style={{
                    textDecoration: 'none',
                    background: '#fff',
                    color: '#880e4f',
                    border: '1.5px solid #fbcfe8',
                    padding: '10px 20px',
                    borderRadius: 20,
                    fontSize: 13.5,
                    fontWeight: 800
                  }}
                >
                  مراجعة الضوابط الشرعية ⚖️
                </Link>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  )
}
