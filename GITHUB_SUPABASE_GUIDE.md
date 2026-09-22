# تشغيل الموقع على GitHub Pages مع Supabase

## أولاً: قاعدة البيانات

1. افتح مشروع Supabase.
2. اذهب إلى SQL Editor.
3. اختر New query.
4. افتح ملف `supabase.sql`.
5. انسخ كل محتواه والصقه.
6. اضغط Run.
7. تأكد من ظهور جدولين:
   - profiles
   - activities
8. من Storage تأكد من وجود bucket باسم `media`.

## ثانياً: حساب المسؤول

1. افتح Authentication > Users.
2. اضغط Add user.
3. أنشئ بريد المسؤول وكلمة المرور.
4. انسخ User UUID.
5. افتح SQL Editor ونفذ:

```sql
insert into public.profiles (id, full_name, role)
values ('ضع-UUID-هنا', 'مسؤول مبادرة شباب أمدرمان', 'admin');
```

## ثالثاً: ربط المشروع

افتح `config.js`.

من:
Project Settings > API

انسخ:
- Project URL
- anon/public key

وضعهما في:

```js
const SUPABASE_URL = "رابط المشروع";
const SUPABASE_ANON_KEY = "مفتاح anon/public";
```

ممنوع وضع `service_role` key في الموقع.

## رابعاً: رفع المشروع إلى GitHub

ارفع الملفات التالية إلى Repository:

- index.html
- admin.html
- app.js
- admin.js
- config.js
- style.css
- supabase.sql
- GITHUB_SUPABASE_GUIDE.md
- README.md
- assets/logo.jpg

ثم:

Repository
→ Settings
→ Pages
→ Build and deployment
→ Deploy from a branch
→ Branch: main
→ Folder: / (root)
→ Save

بعد النشر سيعطيك GitHub رابط الموقع.

## خامساً: الروابط

رابط الزوار:
`https://USERNAME.github.io/REPOSITORY/`

لوحة المسؤول:
`https://USERNAME.github.io/REPOSITORY/admin.html`

## كيف يضيف المسؤول نشاطاً؟

يدخل لوحة المسؤول، ثم:
1. البريد الإلكتروني
2. كلمة المرور
3. دخول
4. عنوان النشاط
5. التاريخ
6. التقرير المختصر
7. صورة النشاط
8. PDF اختياري
9. نشر النشاط

ويظهر النشاط تلقائياً في الصفحة الرئيسية.

## ملاحظة أمنية

`anon/public key` مصمم للاستخدام في الواجهة مع Row Level Security.

لا تضع:
`service_role key`

في:
- GitHub
- config.js
- HTML
- JavaScript
- أي ملف يصل للزوار.
