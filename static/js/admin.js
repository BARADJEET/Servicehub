const adminState = {
  tab: "overview", // overview | verification | categories | bookings | reviews
  kpis: null,
  pendingWorkers: [],
  allWorkers: [],
  categories: [],
  bookings: [],
  bookingStatusFilter: "",
  reviews: [],
};

document.addEventListener("DOMContentLoaded", () => {
  const user = Auth.getUser();
  if (user && user.role === "admin") {
    showShell();
  } else {
    showGate();
  }
});

function showGate() {
  document.getElementById("gate").classList.remove("hidden");
  document.getElementById("admin-shell").classList.add("hidden");
  document.getElementById("gate").innerHTML = `
    <div class="adm-glass rounded-3xl w-full max-w-sm p-8 shadow-2xl">
      <div class="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center mx-auto mb-5"><i data-lucide="shield" class="w-7 h-7 text-white"></i></div>
      <div class="text-center text-white font-extrabold text-xl mb-1">Admin Control Center</div>
      <div class="text-center text-indigo-300 text-xs mb-6">Restricted access — authorized personnel only</div>
      <form onsubmit="return adminLogin(event)" class="space-y-3">
        <div>
          <label class="text-xs font-bold text-indigo-300">Email</label>
          <input required type="email" id="adm-email" class="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand transition" placeholder="admin@servicehub.demo">
        </div>
        <div>
          <label class="text-xs font-bold text-indigo-300">Password</label>
          <input required type="password" id="adm-password" class="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand transition" placeholder="••••••••">
        </div>
        <button type="submit" class="w-full py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition mt-2">Enter Dashboard</button>
        <div class="text-[11px] text-indigo-400 text-center pt-3 border-t border-white/10 mt-3">Demo: admin@servicehub.demo / Demo@1234</div>
      </form>
    </div>
  `;
  refreshIcons();
}

async function adminLogin(e) {
  e.preventDefault();
  const email = document.getElementById("adm-email").value;
  const password = document.getElementById("adm-password").value;
  try {
    const data = await api("/api/auth/login", { method: "POST", auth: false, body: { email, password } });
    if (data.user.role !== "admin") { toast("This account is not an admin", "error"); return false; }
    Auth.setSession(data.access_token, data.user);
    showShell();
  } catch (err) { toast(err.message, "error"); }
  return false;
}

function adminLogout() {
  Auth.clear();
  window.location.href = "/";
}

function showShell() {
  document.getElementById("gate").classList.add("hidden");
  document.getElementById("admin-shell").classList.remove("hidden");
  renderAdminApp();
}

// ============================= LAYOUT =============================
async function renderAdminApp() {
  const app = document.getElementById("admin-app");
  app.innerHTML = `
    <div class="flex items-center justify-between flex-wrap gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-extrabold text-white">Overview</h1>
        <p class="text-indigo-300 text-sm mt-1">Platform health at a glance.</p>
      </div>
      <div class="flex gap-2 adm-glass rounded-xl p-1 flex-wrap">
        ${tabBtn("overview", "layout-dashboard", "Overview")}
        ${tabBtn("verification", "badge-check", "Verification")}
        ${tabBtn("categories", "layers", "Categories")}
        ${tabBtn("bookings", "list-checks", "Bookings")}
        ${tabBtn("reviews", "star", "Disputes")}
      </div>
    </div>
    <div id="admin-content"></div>
  `;
  refreshIcons();
  await loadAdminData();
  renderAdminTab();
}

function tabBtn(key, icon, label) {
  const active = adminState.tab === key;
  return `<button onclick="setAdminTab('${key}')" class="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${active ? 'bg-brand text-white' : 'text-indigo-300 hover:bg-white/5'}"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i> ${label}</button>`;
}

function setAdminTab(tab) { adminState.tab = tab; renderAdminApp(); }

async function loadAdminData() {
  try {
    const [kpis, pendingWorkers, allWorkers, categories, bookings, reviews] = await Promise.all([
      api("/api/admin/kpis"),
      api("/api/admin/workers?pending_only=true"),
      api("/api/admin/workers"),
      api("/api/categories", { auth: false }),
      api("/api/admin/bookings"),
      api("/api/admin/reviews"),
    ]);
    Object.assign(adminState, { kpis, pendingWorkers, allWorkers, categories, bookings, reviews });
  } catch (e) { toast("Could not load admin data: " + e.message, "error"); }
}

function renderAdminTab() {
  const el = document.getElementById("admin-content");
  if (adminState.tab === "overview") renderOverviewTab(el);
  else if (adminState.tab === "verification") renderVerificationTab(el);
  else if (adminState.tab === "categories") renderCategoriesTab(el);
  else if (adminState.tab === "bookings") renderBookingsTab(el);
  else renderReviewsTab(el);
  refreshIcons();
}

// ============================= OVERVIEW =============================
function renderOverviewTab(el) {
  const k = adminState.kpis || {};
  const cards = [
    ["indian-rupee", fmtMoney(k.total_revenue || 0), "Total Revenue", "text-emerald-400", "bg-emerald-500/10"],
    ["hard-hat", k.active_workers || 0, "Active Workers", "text-indigo-300", "bg-indigo-500/10"],
    ["list-checks", k.total_bookings || 0, "Total Bookings", "text-amber-300", "bg-amber-500/10"],
    ["hourglass", k.pending_verifications || 0, "Pending Verifications", "text-rose-300", "bg-rose-500/10"],
  ];
  const recentBookings = adminState.bookings.slice(0, 6);
  el.innerHTML = `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      ${cards.map(([icon, val, label, color, bg]) => `
        <div class="adm-glass adm-card-hover rounded-3xl p-5">
          <div class="w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4"><i data-lucide="${icon}" class="w-5 h-5 ${color}"></i></div>
          <div class="text-2xl font-extrabold text-white">${val}</div>
          <div class="text-xs text-indigo-300 font-semibold mt-1">${label}</div>
        </div>
      `).join("")}
    </div>
    <div class="adm-glass rounded-3xl p-6">
      <div class="font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="activity" class="w-4 h-4 text-brand"></i> Recent Bookings</div>
      <div class="space-y-3">
        ${recentBookings.length === 0 ? `<div class="text-indigo-300 text-sm py-6 text-center">No bookings yet.</div>` : recentBookings.map(b => `
          <div class="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0 flex-wrap gap-2">
            <div>
              <div class="font-semibold text-white text-sm">${b.category_name} · ${b.customer_name}</div>
              <div class="text-xs text-indigo-300">${b.worker_name || 'Unassigned'} · ${fmtDate(b.created_at)}</div>
            </div>
            ${statusPill(b.status)}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function statusPill(status) {
  const map = {
    PENDING: "bg-amber-500/15 text-amber-300", ACCEPTED: "bg-indigo-500/15 text-indigo-300",
    ARRIVED: "bg-indigo-500/15 text-indigo-300", IN_PROGRESS: "bg-brand/20 text-indigo-200",
    COMPLETED: "bg-emerald-500/15 text-emerald-300", CANCELLED: "bg-rose-500/15 text-rose-300",
    REJECTED: "bg-rose-500/15 text-rose-300",
  };
  return `<span class="text-[10px] font-bold px-2.5 py-1 rounded-full ${map[status] || 'bg-slate-500/15 text-slate-300'}">${status.replace('_', ' ')}</span>`;
}

// ============================= VERIFICATION =============================
function renderVerificationTab(el) {
  if (adminState.pendingWorkers.length === 0) {
    el.innerHTML = `<div class="adm-glass rounded-3xl p-16 text-center text-indigo-300"><i data-lucide="check-circle" class="w-8 h-8 mx-auto mb-3"></i>No pending verifications. All caught up!</div>`;
    return;
  }
  el.innerHTML = `<div class="grid md:grid-cols-2 gap-5">${adminState.pendingWorkers.map(w => `
    <div class="adm-glass rounded-3xl p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold" style="background:${avatarColor(w.avatar_seed)}">${initials(w.full_name)}</div>
        <div>
          <div class="font-bold text-white">${w.full_name}</div>
          <div class="text-xs text-indigo-300">${w.category_name} · ${w.experience_years} yrs exp</div>
        </div>
      </div>
      <div class="text-xs text-indigo-300 mb-3 leading-relaxed">${w.bio}</div>
      <div class="flex items-center gap-2 text-xs text-indigo-300 bg-white/5 rounded-xl px-3 py-2.5 mb-4">
        <i data-lucide="file-text" class="w-3.5 h-3.5"></i> KYC document submitted (simulated) — service area: ${w.service_area}
      </div>
      <div class="flex gap-2">
        <button onclick="rejectWorker(${w.id})" class="flex-1 py-2.5 rounded-xl bg-rose-500/15 text-rose-300 text-sm font-bold hover:bg-rose-500/25 transition">Reject</button>
        <button onclick="approveWorker(${w.id})" class="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition">Approve</button>
      </div>
    </div>
  `).join("")}</div>`;
}

async function approveWorker(id) {
  try { await api(`/api/admin/workers/${id}/approve`, { method: "POST" }); toast("Worker verified ✓", "success"); await loadAdminData(); renderAdminTab(); }
  catch (e) { toast(e.message, "error"); }
}
async function rejectWorker(id) {
  if (!confirm("Reject this worker's verification?")) return;
  try { await api(`/api/admin/workers/${id}/reject`, { method: "POST" }); toast("Worker rejected", "warn"); await loadAdminData(); renderAdminTab(); }
  catch (e) { toast(e.message, "error"); }
}

// ============================= CATEGORIES =============================
function renderCategoriesTab(el) {
  el.innerHTML = `
    <div class="flex items-center justify-between mb-5">
      <div class="font-bold text-white">Service Categories</div>
      <button onclick="openCategoryModal()" class="px-4 py-2 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-dark transition flex items-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i> Add Category</button>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      ${adminState.categories.map(c => `
        <div class="adm-glass rounded-3xl p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="w-11 h-11 rounded-2xl brand-gradient flex items-center justify-center"><i data-lucide="${iconFor(c.icon)}" class="w-5 h-5 text-white"></i></div>
            <span class="text-[10px] font-bold px-2 py-1 rounded-full ${c.is_active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}">${c.is_active ? 'Active' : 'Inactive'}</span>
          </div>
          <div class="font-bold text-white">${c.name}</div>
          <div class="text-xs text-indigo-300 mt-1 leading-relaxed h-8 overflow-hidden">${c.description}</div>
          <div class="flex items-center justify-between mt-3">
            <div class="font-extrabold text-white">${fmtMoney(c.base_price)}</div>
            <div class="flex gap-1">
              <button onclick='openCategoryModal(${JSON.stringify(c)})' class="p-2 rounded-lg hover:bg-white/10 text-indigo-300"><i data-lucide="pencil" class="w-3.5 h-3.5"></i></button>
              ${c.is_active ? `<button onclick="deactivateCategory(${c.id})" class="p-2 rounded-lg hover:bg-white/10 text-rose-300"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>` : ""}
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function openCategoryModal(existing) {
  const isEdit = !!existing;
  const root = document.getElementById("modal-root");
  root.innerHTML = `
    <div class="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onclick="if(event.target===this) closeModal()">
      <div class="modal-panel adm-glass rounded-3xl w-full max-w-md p-7 shadow-2xl">
        <div class="flex items-center justify-between mb-5">
          <div class="font-extrabold text-white">${isEdit ? 'Edit Category' : 'Add Category'}</div>
          <button onclick="closeModal()" class="p-1.5 rounded-lg hover:bg-white/10 text-indigo-300"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <form onsubmit="return submitCategory(event, ${isEdit ? existing.id : 'null'})" class="space-y-3">
          <div>
            <label class="text-xs font-bold text-indigo-300">Name</label>
            <input required id="cat-name" value="${isEdit ? existing.name : ''}" class="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand transition">
          </div>
          ${!isEdit ? `
          <div>
            <label class="text-xs font-bold text-indigo-300">Slug</label>
            <input required id="cat-slug" placeholder="e.g. pest-control" class="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand transition">
          </div>` : ""}
          <div>
            <label class="text-xs font-bold text-indigo-300">Icon (lucide name)</label>
            <input id="cat-icon" value="${isEdit ? existing.icon : 'wrench'}" class="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand transition">
          </div>
          <div>
            <label class="text-xs font-bold text-indigo-300">Description</label>
            <textarea id="cat-desc" rows="2" class="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand transition">${isEdit ? existing.description : ''}</textarea>
          </div>
          <div>
            <label class="text-xs font-bold text-indigo-300">Base price (₹)</label>
            <input required type="number" id="cat-price" value="${isEdit ? existing.base_price : ''}" class="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand transition">
          </div>
          <button type="submit" class="w-full py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition">${isEdit ? 'Save Changes' : 'Create Category'}</button>
        </form>
      </div>
    </div>
  `;
  refreshIcons();
}

async function submitCategory(e, existingId) {
  e.preventDefault();
  const name = document.getElementById("cat-name").value;
  const icon = document.getElementById("cat-icon").value || "wrench";
  const description = document.getElementById("cat-desc").value;
  const base_price = parseFloat(document.getElementById("cat-price").value);
  try {
    if (existingId) {
      await api(`/api/categories/${existingId}`, { method: "PUT", body: { name, icon, description, base_price } });
      toast("Category updated", "success");
    } else {
      const slug = document.getElementById("cat-slug").value;
      await api("/api/categories", { method: "POST", body: { name, slug, icon, description, base_price } });
      toast("Category created", "success");
    }
    closeModal();
    await loadAdminData();
    renderAdminTab();
  } catch (err) { toast(err.message, "error"); }
  return false;
}

async function deactivateCategory(id) {
  if (!confirm("Deactivate this category? It will be hidden from customers.")) return;
  try { await api(`/api/categories/${id}`, { method: "DELETE" }); toast("Category deactivated", "info"); await loadAdminData(); renderAdminTab(); }
  catch (e) { toast(e.message, "error"); }
}

function closeModal() { document.getElementById("modal-root").innerHTML = ""; }

// ============================= BOOKINGS MONITOR =============================
function renderBookingsTab(el) {
  const statuses = ["", "PENDING", "ACCEPTED", "ARRIVED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  const filtered = adminState.bookingStatusFilter
    ? adminState.bookings.filter(b => b.status === adminState.bookingStatusFilter)
    : adminState.bookings;

  el.innerHTML = `
    <div class="flex items-center gap-2 mb-5 flex-wrap">
      ${statuses.map(s => `<button onclick="setBookingFilter('${s}')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${adminState.bookingStatusFilter === s ? 'bg-brand text-white' : 'adm-glass text-indigo-300 hover:bg-white/10'}">${s || 'All'}</button>`).join("")}
    </div>
    <div class="adm-glass rounded-3xl overflow-x-auto scrollbar-thin">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-indigo-300 text-xs uppercase border-b border-white/10">
            <th class="px-5 py-3 font-bold">Customer</th>
            <th class="px-5 py-3 font-bold">Pro</th>
            <th class="px-5 py-3 font-bold">Category</th>
            <th class="px-5 py-3 font-bold">Amount</th>
            <th class="px-5 py-3 font-bold">Status</th>
            <th class="px-5 py-3 font-bold">Date</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.length === 0 ? `<tr><td colspan="6" class="text-center py-10 text-indigo-300">No bookings match this filter.</td></tr>` : filtered.map(b => `
            <tr class="border-b border-white/5 last:border-0 hover:bg-white/5 transition">
              <td class="px-5 py-3 text-white font-semibold">${b.customer_name}</td>
              <td class="px-5 py-3 text-indigo-200">${b.worker_name || '—'}</td>
              <td class="px-5 py-3 text-indigo-200">${b.category_name}</td>
              <td class="px-5 py-3 text-white font-bold">${fmtMoney(b.total_amount)}</td>
              <td class="px-5 py-3">${statusPill(b.status)}</td>
              <td class="px-5 py-3 text-indigo-300 text-xs">${fmtDate(b.created_at)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function setBookingFilter(s) { adminState.bookingStatusFilter = s; renderAdminTab(); }

// ============================= REVIEWS / DISPUTES =============================
function renderReviewsTab(el) {
  const disputes = adminState.reviews.filter(r => r.rating <= 2);
  const others = adminState.reviews.filter(r => r.rating > 2);
  el.innerHTML = `
    <div class="mb-8">
      <div class="font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="alert-triangle" class="w-4 h-4 text-rose-400"></i> Flagged for Review (≤2★)</div>
      ${disputes.length === 0 ? `<div class="adm-glass rounded-3xl p-10 text-center text-indigo-300">No disputes right now.</div>` : `
        <div class="space-y-3">${disputes.map(r => reviewRow(r, true)).join("")}</div>
      `}
    </div>
    <div>
      <div class="font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="star" class="w-4 h-4 text-amber-300"></i> All Reviews</div>
      <div class="space-y-3">${others.length === 0 ? `<div class="adm-glass rounded-3xl p-10 text-center text-indigo-300">No reviews yet.</div>` : others.map(r => reviewRow(r, false)).join("")}</div>
    </div>
  `;
}

function reviewRow(r, flagged) {
  return `
    <div class="adm-glass rounded-2xl p-4 flex items-center justify-between gap-4 ${flagged ? 'border-rose-500/30' : ''}">
      <div class="flex items-center gap-3">
        <div class="flex text-amber-400 text-sm">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        <div class="text-sm text-indigo-100">${r.review_text || '<span class="text-indigo-400 italic">No comment left</span>'}</div>
      </div>
      <div class="text-xs text-indigo-300 shrink-0">${fmtDate(r.created_at)}</div>
    </div>
  `;
}
