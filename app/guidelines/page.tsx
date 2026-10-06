'use client'
import React from 'react'
import Link from 'next/link'

export default function GuidelinesPage() {
  const EgyptFlagBadge = () => (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '4px',
      overflow: 'hidden',
      border: '1.5px solid rgba(255,255,255,0.7)',
      verticalAlign: 'middle',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
    }}>
      <svg width="26" height="17" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="900" height="200" fill="#CE1126" />
        <rect y="200" width="900" height="200" fill="#FFFFFF" />
        <rect y="400" width="900" height="200" fill="#000000" />
        <circle cx="450" cy="300" r="30" fill="#C09A35" />
      </svg>
    </div>
  )

  const steps = [
    {
      step: '1',
      title: 'طلب الرؤية عبر ولي الأمر رسمياً',
      desc: 'بعد تأكيد الاهتمام المتبادل والتوافق المبدئي على المنصة، ينتقل التواصل مباشرة إلى ولي أمر الفتاة (الأب أو الأخ) لتحديد موعد الزيارة في بيت الأسرة، درءاً لأي شبهة وصوناً لكرامة الفتاة.'
    },
    {
      step: '2',
      title: 'حضور المحرم ومنع الخلوة قطيعةً',
      desc: 'تنعقد الرؤية الشرعية داخل مجلس الأسرة وبحضور الولي أو محرم شرعي، ويجوز للطرفين الحديث المباشر والاستفسار عن كافة الأمور الجوهرية مع التزام الوقار وغض البصر المحمود.'
    },
    {
      step: '3',
      title: 'ما يجوز للخاطب رؤيته شرعاً',
      desc: 'جمهور الفقهاء على جواز رؤية الوجه والكفين؛ فالوجه يدل على الجمال والقبول القلبي، والكفان يدلان على خصب البدن، مع التزام الفتاة بالزي الساتر المحتشم دون تبرج مبالغ فيه.'
    },
    {
      step: '4',
      title: 'الاستخارة والرد بالمعروف',
      desc: 'يُسن للطرفين صلاة الاستخارة بعد اللقاء. وفي حال القبول، يتم استكمال الاتفاق على بركة الله، وفي حال عدم التوفيق، يكون الاعتذار بلطف وأدب دون إفشاء لأي سر، عملاً بقوله تعالى: ﴿فَإِمْسَاكٌ بِمَعْرُوفٍ أَوْ تَسْرِيحٌ بِإِحْسَانٍ﴾.'
    }
  ]

  const topicsToDiscuss = [
    { title: 'الالتزام والصلوات', tip: 'السؤال عن المحافظة على الفروض والسمت الإسلامي ومصادر تلقي العلم والتربية.' },
    { title: 'أولويات إدارة البيت', tip: 'التفاهم الصريح حول عمل الزوجة، مكان السكن، ورؤية تربية الأبناء مستقبلاً.' },
    { title: 'الاستطاعة والباءة', tip: 'وضوح الشاب بشأن استقراره الوظيفي وقدرته على فتح بيت مستقل والإنفاق بالمعروف.' },
    { title: 'العلاقة بالأهل وبر الوالدين', tip: 'التأكيد على مكانة الأهل والبر، والتوافق على نمط الزيارات والعلاقات الاجتماعية.' }
  ]

  return (
    <div style={{
      direction: 'rtl',
      fontFamily: 'Cairo, system-ui, sans-serif',
      background: 'radial-gradient(circle at 50% 0%, #fff1f2 0%, #fdf2f8 50%, #faf5ff 100%)',
      minHeight: '100vh',
      color: '#1f2937'
    }}>
      
      {/* 1. الشريط العلوي */}
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
      <main style={{ maxWidth: 960, margin: '35px auto', padding: '0 16px' }}>
        
        {/* البانر التوجيهي */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 100%)',
          borderRadius: 28,
          border: '1.5px solid #fbcfe8',
          padding: '36px 30px',
          boxShadow: '0 10px 30px rgba(136, 14, 79, 0.05)',
          marginBottom: 35,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📜</div>
          <h1 style={{ color: '#880e4f', fontWeight: 900, fontSize: 28, margin: '0 0 10px' }}>
            دليل وإرشادات الرؤية الشرعية
          </h1>
          <p style={{ color: '#4b5568', fontSize: 15, lineHeight: '2', maxWidth: 740, margin: '0 auto', fontWeight: 600 }}>
            قال النبي ﷺ للمغيرة بن شعبة حين خطب امرأة: «انْظُرْ إِلَيْهَا؛ فَإِنَّهُ أَحْرَى أَنْ يُؤْدَمَ بَيْنَكُمَا».<br />
            هذا الدليل يوضح الضوابط الفقهية والآداب الرفيعة لإتمام أول لقاء في بيت أهل العروس بكل طمأنينة واحترام.
          </p>
        </div>

        {/* مراحل وضوابط الرؤية الشرعية */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 35 }}>
          {steps.map(item => (
            <div
              key={item.step}
              style={{
                background: '#ffffff',
                borderRadius: 24,
                border: '1.5px solid #fce7f3',
                padding: '24px 22px',
                boxShadow: '0 6px 20px rgba(136, 14, 79, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 36,
                  height: 36,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #db2777, #880e4f)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 900
                }}>
                  {item.step}
                </span>
                <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 900, color: '#880e4f' }}>
                  {item.title}
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: 13.5, color: '#4b5563', lineHeight: '1.9' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* محاور النقاش البناء في اللقاء الأول */}
        <div style={{
          background: '#ffffff',
          borderRadius: 26,
          border: '1.5px solid #fbcfe8',
          padding: '30px 26px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.03)',
          marginBottom: 35
        }}>
          <h2 style={{ color: '#880e4f', fontSize: 20, fontWeight: 900, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>💡</span>
            <span>أبرز المحاور المستحبة للنقاش بين الطرفين</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {topicsToDiscuss.map((t, idx) => (
              <div key={idx} style={{ background: '#fdf7f8', border: '1px solid #fce7f3', borderRadius: 16, padding: '16px 18px' }}>
                <h4 style={{ margin: '0 0 6px', color: '#be185d', fontSize: 14.5, fontWeight: 900 }}>
                  ✔ {t.title}
                </h4>
                <p style={{ margin: 0, color: '#4b5563', fontSize: 13, lineHeight: '1.8' }}>
                  {t.tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* وصية نبوية ورسالة لأولياء الأمور في مصر */}
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          borderRadius: 24,
          border: '1.5px solid #fde68a',
          padding: '26px',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(217, 119, 6, 0.08)',
          marginBottom: 40
        }}>
          <h3 style={{ color: '#92400e', fontWeight: 900, fontSize: 18, margin: '0 0 8px' }}>
            رسالة منصة قلبي لوف إلى أولياء الأمور الكرام 🕌
          </h3>
          <p style={{ color: '#78350f', fontSize: 14, lineHeight: '2', maxWidth: 740, margin: '0 auto 18px' }}>
            «إِذَا أَتَاكُمْ مَنْ تَرْضَوْنَ دِينَهُ وَخُلُقَهُ فَزَوِّجُوهُ، إِلَّا تَفْعَلُوهُ تَكُنْ فِتْنَةٌ فِي الأَرْضِ وَفَسَادٌ عَرِيضٌ».<br />
            تيسير المهور وتخفيف الشروط على الشباب الجاد هو السبيل الأعظم لبناء بيوت يملؤها الهدوء والبركة وصيانة شباب وفتيات أمتنا.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/search"
              style={{
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #db2777, #880e4f)',
                color: '#fff',
                padding: '11px 26px',
                borderRadius: 22,
                fontSize: 14,
                fontWeight: 900,
                boxShadow: '0 4px 14px rgba(219, 39, 119, 0.3)'
              }}
            >
              البحث عن الشريك المناسب 🔍
            </Link>
            <Link
              href="/compatibility"
              style={{
                textDecoration: 'none',
                background: '#fff',
                color: '#92400e',
                border: '1.5px solid #fde68a',
                padding: '11px 22px',
                borderRadius: 22,
                fontSize: 14,
                fontWeight: 800
              }}
            >
              حاسبة التوافق الشرعي ⚖️
            </Link>
          </div>
        </div>

      </main>

    </div>
  )
}
