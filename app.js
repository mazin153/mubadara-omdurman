async function loadActivities() {
  const grid = document.getElementById("activitiesGrid");
  grid.innerHTML = '<div class="loading">جاري تحميل الأنشطة...</div>';

  const { data, error } = await supabaseClient
    .from("activities")
    .select("*")
    .order("activity_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    grid.innerHTML = `<div class="error">تعذر تحميل الأنشطة. تأكد من إعداد Supabase.</div>`;
    console.error(error);
    return;
  }

  if (!data.length) {
    grid.innerHTML = '<div class="loading">لا توجد أنشطة منشورة حتى الآن.</div>';
    return;
  }

  grid.innerHTML = data.map(a => `
    <article class="card">
      ${a.image_url ? `<img src="${escapeAttr(a.image_url)}" alt="${escapeAttr(a.title)}">` : ""}
      <div class="card-body">
        <div class="date">${formatDate(a.activity_date)}</div>
        <h3>${escapeHtml(a.title)}</h3>
        <p>${escapeHtml(a.description).replace(/\n/g, "<br>")}</p>
        ${a.report_url ? `<a class="report" href="${escapeAttr(a.report_url)}" target="_blank" rel="noopener">📄 فتح التقرير PDF</a>` : ""}
      </div>
    </article>
  `).join("");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ar-SD", {
    year: "numeric", month: "long", day: "numeric"
  }).format(new Date(value + "T00:00:00"));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}
function escapeAttr(value) { return escapeHtml(value); }

document.getElementById("refreshBtn")?.addEventListener("click", loadActivities);
loadActivities();
