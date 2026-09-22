// إعدادات Supabase
// ضع هنا بيانات مشروعك من:
// Supabase Dashboard > Project Settings > API
//
// مهم جداً:
// استخدم anon/public key فقط.
// لا تضع service_role key في هذا الملف أو GitHub.

const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
