const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");
const loginMsg = document.getElementById("loginMsg");
const formMsg = document.getElementById("formMsg");

async function checkSession() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return showLogin();

  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (error || !profile || profile.role !== "admin") {
    await supabaseClient.auth.signOut();
    loginMsg.textContent = "هذا الحساب ليس مسؤولاً معتمداً.";
    return showLogin();
  }

  loginBox.classList.add("hidden");
  dashboard.classList.remove("hidden");
  document.getElementById("userInfo").textContent =
    `مرحباً ${profile.full_name || user.email}`;
  loadAdminActivities();
}

function showLogin() {
  loginBox.classList.remove("hidden");
  dashboard.classList.add("hidden");
}

document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  loginMsg.textContent = "جاري تسجيل الدخول...";
  const { error } = await supabaseClient.auth.signInWithPassword({
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value
  });
  if (error) {
    loginMsg.textContent = error.message;
    return;
  }
  loginMsg.textContent = "";
  checkSession();
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLogin();
});

document.getElementById("activityForm").addEventListener("submit", async e => {
  e.preventDefault();
  formMsg.textContent = "جاري رفع الملفات ونشر النشاط...";

  try {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const activityDate = document.getElementById("activityDate").value;
    const imageFile = document.getElementById("imageFile").files[0];
    const reportFile = document.getElementById("reportFile").files[0];

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("انتهت جلسة الدخول.");

    let imageUrl = null;
    let reportUrl = null;

    if (imageFile) {
      if (imageFile.size > 5 * 1024 * 1024) throw new Error("الصورة أكبر من 5MB.");
      const imagePath = `images/${user.id}/${Date.now()}-${safeName(imageFile.name)}`;
      const up = await supabaseClient.storage.from("media").upload(imagePath, imageFile, {
        cacheControl: "3600", upsert: false, contentType: imageFile.type
      });
      if (up.error) throw up.error;
      imageUrl = supabaseClient.storage.from("media").getPublicUrl(imagePath).data.publicUrl;
    }

    if (reportFile) {
      if (reportFile.size > 10 * 1024 * 1024) throw new Error("ملف PDF أكبر من 10MB.");
      const reportPath = `reports/${user.id}/${Date.now()}-${safeName(reportFile.name)}`;
      const up = await supabaseClient.storage.from("media").upload(reportPath, reportFile, {
        cacheControl: "3600", upsert: false, contentType: "application/pdf"
      });
      if (up.error) throw up.error;
      reportUrl = supabaseClient.storage.from("media").getPublicUrl(reportPath).data.publicUrl;
    }

    const { error } = await supabaseClient.from("activities").insert({
      title, description, activity_date: activityDate,
      image_url: imageUrl, report_url: reportUrl, created_by: user.id
    });
    if (error) throw error;

    formMsg.textContent = "تم نشر النشاط بنجاح.";
    e.target.reset();
    loadAdminActivities();
  } catch (err) {
    console.error(err);
    formMsg.textContent = "حدث خطأ: " + (err.message || err);
  }
});

function safeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function loadAdminActivities() {
  const box = document.getElementById("adminActivities");
  const { data, error } = await supabaseClient
    .from("activities")
    .select("*")
    .order("activity_date", { ascending: false });

  if (error) {
    box.innerHTML = `<div class="error">${error.message}</div>`;
    return;
  }

  box.innerHTML = data.length ? data.map(a => `
    <div class="admin-row">
      <div>
        <strong>${escapeHtml(a.title)}</strong>
        <small>${formatDate(a.activity_date)}</small>
      </div>
      <button class="danger" onclick="deleteActivity('${a.id}')">حذف</button>
    </div>
  `).join("") : "<p>لا توجد أنشطة.</p>";
}

async function deleteActivity(id) {
  if (!confirm("هل تريد حذف هذا النشاط؟")) return;
  const { error } = await supabaseClient.from("activities").delete().eq("id", id);
  if (error) return alert(error.message);
  loadAdminActivities();
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ar-SD", {
    year:"numeric", month:"long", day:"numeric"
  }).format(new Date(value + "T00:00:00"));
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

checkSession();
