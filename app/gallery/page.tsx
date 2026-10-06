'use client';
import React from 'react';
import Link from 'next/link';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#FDF9FA] text-gray-900 font-sans p-6" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-black text-[#8B1538] flex items-center gap-2">
            <span>🖼️</span> صور الأعضاء وإدارة الألبوم
          </h1>
          <Link href="/myaccount" className="text-xs bg-[#8B1538] text-white font-bold px-4 py-2 rounded-xl">
            العودة للوحة التحكم ←
          </Link>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-4">
          <div className="text-4xl">🔒</div>
          <h3 className="font-black text-sm text-gray-800">خصوصية الصور مشفرة ومحمية</h3>
          <p className="text-xs text-gray-500 font-bold max-w-md mx-auto">
            في منصة قلبي لوڤي، لا يمكن لأي طرف مشاهدة الصور الخاصة إلا بعد الحصول على إذن مباشر ومتبادل احتراماً للضوابط الشرعية.
          </p>
        </div>
      </div>
    </div>
  );
}
