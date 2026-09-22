# موقع مبادرة شباب أمدرمان

## التقنية
- HTML + CSS + JavaScript
- GitHub Pages لاستضافة الموقع
- Supabase لقاعدة البيانات + تسجيل دخول المسؤولين + تخزين الصور/PDF

## 1) إنشاء قاعدة البيانات
1. افتح Supabase وأنشئ مشروعاً جديداً.
2. افتح SQL Editor.
3. انسخ محتوى `supabase.sql` ونفذه.
4. من Storage أنشئ Bucket باسم `media` واجعله Public.

## 2) إنشاء أول مسؤول
1. من Supabase افتح Authentication > Users.
2. أنشئ مستخدماً بالبريد وكلمة المرور.
3. انسخ UUID الخاص بالمستخدم.
4. في SQL Editor نفذ:
   insert into public.profiles (id, full_name, role)
   values ('ضع-UUID-هنا', 'مسؤول المبادرة', 'admin');

## 3) ربط الموقع بـ Supabase
افتح `config.js` وضع:
- Project URL
- anon/public key

لا تضع service_role key في الموقع.

## 4) رفع المشروع إلى GitHub
- أنشئ Repository جديداً.
- ارفع كل الملفات والمجلدات.
- Settings > Pages.
- اختر Deploy from branch.
- اختر `main` و`/root`.
- احفظ وانتظر رابط GitHub Pages.

## 5) الاستخدام
- الزوار يدخلون `index.html` ويشاهدون الأنشطة.
- المسؤول يدخل `admin.html`.
- بعد تسجيل الدخول يستطيع نشر عنوان النشاط + الوصف + صورة + PDF.
- النشاط يظهر تلقائياً للزوار.

## ملاحظة
GitHub Pages لا يشغّل PHP أو MySQL؛ لذلك استخدمنا Supabase كخلفية وقاعدة بيانات، مع بقاء واجهة الموقع على GitHub Pages.
