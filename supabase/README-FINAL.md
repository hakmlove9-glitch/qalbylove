# QalbyLove — Supabase Final

هذا هو مجلد Supabase المعتمد للنسخة النهائية.

## قواعد النسخة
- `supabase/migrations` هو المصدر الوحيد الرسمي للـ migrations.
- مجلد `migrations/` القديم في جذر المشروع لا يُستخدم بعد دمج النسخة النهائية.
- مجلد `supabase/.temp` غير موجود في التسليم لأنه يحتوي بيانات ربط محلية ولا ينتمي للإنتاج.
- تم حل تعارض رقمي في آخر migration: ملف appearance كان يحمل نفس version الخاص بملف membership/safety، وأصبح اسمه `202610040002_member_appearance_fields.sql` لضمان ترتيب فريد.
- كل migrations الحالية محافظة على البيانات قدر الإمكان وتعتمد بكثافة على `if exists` / `if not exists`.

## ترتيب آخر migrations
1. `202610040001_final_membership_verification_safety.sql`
2. `202610040002_member_appearance_fields.sql`

## قبل التطبيق على قاعدة حية
خذ Backup من قاعدة البيانات، ثم شغّل migrations على بيئة staging أولاً. لو كانت migrations السابقة مطبقة على المشروع البعيد بالفعل، لا تعيد كتابة سجل migration يدويًا؛ استخدم آلية Supabase migration repair/status حسب حالة قاعدة البيانات الفعلية.
