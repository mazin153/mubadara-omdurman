// إعدادات Supabase
// ضع هنا بيانات مشروعك من:
// Supabase Dashboard > Project Settings > API
//
// مهم جداً:
// استخدم anon/public key فقط.
// لا تضع service_role key في هذا الملف أو GitHub.

// إعدادات Supabase
const SUPABASE_URL = "https://fkojmjghrqzmcapfdicz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrb2ptamd..."; // المفتاح الطويل كاملاً هنا

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
