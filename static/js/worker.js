// ============================= WORKER PORTAL =============================
async function renderWorker(app) {
  app.innerHTML = `<div class="pt-8"><div class="skeleton rounded-3xl h-40"></div></div>`;
  try {
    state.workerProfile = await api("/api/workers/me");
  } catch (e) {
    state.workerProfile = null;
  }

  if (!state.workerProfile) {
    renderWorkerOnboarding(app);
    return;
  }

  if (!state.workerProfile.is_verified) {
    renderWorkerPending(app);
    return;
  }

  renderWorkerDashboard(app);
}

// ---------- Onboarding ----------
function renderWorkerOnboarding(app) {
  const catOptions = state.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  app.innerHTML = `
    <div class="max-w-xl mx-auto pt-10">
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center mx-auto mb-4"><i data-lucide="hard-hat" class="w-7 h-7 text-white"></i></div>
        <h1 class="text-2xl font-extrabold text-brand-deep">Set up your Pro profile</h1>
        <p class="text-slate-400 text-sm mt-1">A few details so customers know who's coming.</p>
      </div>
      <form onsubmit="return submitOnboarding(event)" class="glass rounded-3xl p-7 space-y-4">
        <div>
          <label class="text-xs font-bold text-slate-500">Primary service category</label>
          <select required id="ob-category" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition">${catOptions}</select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-bold text-slate-500">Experience (years)</label>
            <input required type="number" min="0" max="60" id="ob-exp" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition" placeholder="5">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-500">Hourly rate (₹)</label>
            <input required type="number" min="0" id="ob-rate" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition" placeholder="349">
          </div>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-500">Service area</label>
          <input required id="ob-area" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition" placeholder="e.g. Vastrapur, Ahmedabad">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-500">Short bio</label>
          <textarea required id="ob-bio" rows="3" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition" placeholder="Tell customers about your experience..."></textarea>
        </div>
        <div>
          <label class="text-xs font-bold text-slate-500">ID proof (Aadhaar / Trade Certificate)</label>
          <label class="mt-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-brand cursor-pointer transition">
            <i data-lucide="upload" class="w-4 h-4 text-slate-400"></i>
            <span id="ob-file-label" class="text-sm text-slate-400">Click to simulate document upload</span>
            <input type="file" id="ob-file" class="hidden" onchange="document.getElementById('ob-file-label').textContent = this.files[0]?.name || 'Click to simulate document upload'">
          </label>
        </div>
        <button type="submit" id="ob-submit" class="w-full py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition">Submit for Verification</button>
      </form>
    </div>
  `;
  refreshIcons();
}

async function submitOnboarding(e) {
  e.preventDefault();
  const btn = document.getElementById("ob-submit");
  const fileInput = document.getElementById("ob-file");
  const payload = {
    category_id: parseInt(document.getElementById("ob-category").value),
    experience_years: parseInt(document.getElementById("ob-exp").value),
    hourly_rate: parseFloat(document.getElementById("ob-rate").value),
    bio: document.getElementById("ob-bio").value,
    service_area: document.getElementById("ob-area").value,
    id_proof_url: fileInput.files[0] ? fileInput.files[0].name : "id_proof_simulated.pdf",
  };
  btn.disabled = true;
  btn.textContent = "Submitting...";
  try {
    await api("/api/workers/onboard", { method: "POST", body: payload });
    toast("Profile submitted! Awaiting admin verification.", "success");
    render();
  } catch (err) {
    toast(err.message, "error");
    btn.disabled = false;
    btn.textContent = "Submit for Verification";
  }
  return false;
}

// ---------- Pending verification ----------
function renderWorkerPending(app) {
  app.innerHTML = `
    <div class="max-w-lg mx-auto pt-16 text-center">
      <div class="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5"><i data-lucide="hourglass" class="w-8 h-8 text-amber-500"></i></div>
      <h1 class="text-2xl font-extrabold text-brand-deep">Verification in progress</h1>
      <p class="text-slate-400 text-sm mt-2 leading-relaxed">Our admin team is reviewing your submitted documents for <span class="font-bold text-slate-600">${state.workerProfile.category_name}</span>. This usually takes under 24 hours — we'll unlock your dispatch dashboard the moment you're approved.</p>
      <div class="mt-6 inline-flex items-center gap-2 badge-pending px-4 py-2 rounded-full text-sm font-bold"><i data-lucide="clock" class="w-4 h-4"></i> Pending Verification</div>
    </div>
  `;
  refreshIcons();
}

// ---------- Dashboard ----------
async function renderWorkerDashboard(app) {
  const w = state.workerProfile;
  app.innerHTML = `
    <div class="pt-8 mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-brand-deep">Welcome back, ${w.full_name.split(" ")[0]}</h1>
        <div class="flex items-center gap-2 mt-1 text-sm">
          <span class="badge-verified px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><i data-lucide="badge-check" class="w-3 h-3"></i> Verified Pro</span>
          <span class="text-slate-400">${w.category_name} · ★ ${w.rating_avg || '—'} (${w.total_reviews})</span>
        </div>
      </div>
      <button onclick="toggleAvailability()" id="avail-toggle" class="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition ${w.is_available ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}">
        <span class="w-2.5 h-2.5 rounded-full ${w.is_available ? 'bg-emerald-500 pulse-dot' : 'bg-slate-300'}"></span>
        ${w.is_available ? 'Online — Accepting Jobs' : 'Offline'}
      </button>
    </div>

    <div id="worker-stats" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"></div>

    <div class="flex gap-2 mb-6 bg-slate-100 rounded-xl p-1 w-fit">
      <button onclick="setWorkerTab('dispatch')" class="tab-btn px-5 py-2 rounded-lg text-sm font-bold ${state.workerTab === 'dispatch' ? 'bg-white shadow text-brand' : 'text-slate-400'}">Dispatch Queue</button>
      <button onclick="setWorkerTab('active')" class="tab-btn px-5 py-2 rounded-lg text-sm font-bold ${state.workerTab === 'active' ? 'bg-white shadow text-brand' : 'text-slate-400'}">Active Jobs</button>
      <button onclick="setWorkerTab('history')" class="tab-btn px-5 py-2 rounded-lg text-sm font-bold ${state.workerTab === 'history' ? 'bg-white shadow text-brand' : 'text-slate-400'}">Earnings & History</button>
    </div>
    <div id="worker-content"></div>
  `;
  refreshIcons();
  await loadWorkerBookings();
  startPolling(loadWorkerBookings, 6000);
}

function setWorkerTab(tab) { state.workerTab = tab; render(); }

async function toggleAvailability() {
  try {
    state.workerProfile = await api("/api/workers/me/availability", { method: "PATCH", body: { is_available: !state.workerProfile.is_available } });
    render();
    toast(state.workerProfile.is_available ? "You're online" : "You're offline", "info");
  } catch (e) { toast(e.message, "error"); }
}

let _dispatchQueue = [];
let _myWorkerBookings = [];

async function loadWorkerBookings() {
  try {
    [_dispatchQueue, _myWorkerBookings] = await Promise.all([
      api("/api/bookings/dispatch"),
      api("/api/bookings/my"),
    ]);
  } catch (e) { return; }

  renderWorkerStats();
  const contentEl = document.getElementById("worker-content");
  if (!contentEl) return;
  if (state.workerTab === "dispatch") renderDispatchTab(contentEl);
  else if (state.workerTab === "active") renderActiveTab(contentEl);
  else renderHistoryTab(contentEl);
}

function renderWorkerStats() {
  const el = document.getElementById("worker-stats");
  if (!el) return;
  const completed = _myWorkerBookings.filter(b => b.status === "COMPLETED");
  const earnings = completed.reduce((sum, b) => sum + b.total_amount, 0);
  const active = _myWorkerBookings.filter(b => ["ACCEPTED", "ARRIVED", "IN_PROGRESS"].includes(b.status)).length;
  const stats = [
    ["wallet", fmtMoney(earnings), "Total Earnings"],
    ["briefcase", completed.length, "Jobs Completed"],
    ["activity", active, "Active Jobs"],
    ["inbox", _dispatchQueue.length, "Queue Waiting"],
  ];
  el.innerHTML = stats.map(([icon, val, label]) => `
    <div class="glass rounded-2xl p-4">
      <i data-lucide="${icon}" class="w-4 h-4 text-brand mb-2"></i>
      <div class="text-xl font-extrabold text-brand-deep">${val}</div>
      <div class="text-xs text-slate-400 font-semibold">${label}</div>
    </div>
  `).join("");
  refreshIcons();
}

function renderDispatchTab(el) {
  if (_dispatchQueue.length === 0) {
    el.innerHTML = `<div class="text-center py-16 text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-3"></i>No jobs waiting in your category right now.</div>`;
    refreshIcons();
    return;
  }
  el.innerHTML = `<div class="space-y-4">${_dispatchQueue.map(b => `
    <div class="glass rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <div class="font-extrabold text-slate-800">${b.category_name} · ${b.customer_name}</div>
        <div class="text-xs text-slate-400 mt-1">${b.service_address}</div>
        <div class="text-xs text-slate-400 mt-1">${fmtDate(b.scheduled_time)}${b.notes ? ' · ' + b.notes : ''}</div>
      </div>
      <div class="flex items-center gap-3">
        <div class="font-extrabold text-brand-deep">${fmtMoney(b.total_amount)}</div>
        <button onclick="rejectDispatch(${b.id})" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-sm font-bold hover:bg-slate-200 transition">Skip</button>
        <button onclick="acceptDispatch(${b.id})" class="px-4 py-2 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-dark transition">Accept</button>
      </div>
    </div>
  `).join("")}</div>`;
  refreshIcons();
}

async function acceptDispatch(id) {
  try { await api(`/api/bookings/${id}/accept`, { method: "POST" }); toast("Job accepted — head over when ready!", "success"); loadWorkerBookings(); }
  catch (e) { toast(e.message, "error"); }
}
async function rejectDispatch(id) {
  try { await api(`/api/bookings/${id}/reject`, { method: "POST" }); toast("Job skipped", "info"); loadWorkerBookings(); }
  catch (e) { toast(e.message, "error"); }
}

function renderActiveTab(el) {
  const active = _myWorkerBookings.filter(b => ["ACCEPTED", "ARRIVED", "IN_PROGRESS"].includes(b.status));
  if (active.length === 0) {
    el.innerHTML = `<div class="text-center py-16 text-slate-400"><i data-lucide="briefcase" class="w-8 h-8 mx-auto mb-3"></i>No active jobs. Check the Dispatch Queue.</div>`;
    refreshIcons();
    return;
  }
  el.innerHTML = `<div class="space-y-5">${active.map(activeJobCard).join("")}</div>`;
  refreshIcons();
}

function activeJobCard(b) {
  return `
  <div class="glass rounded-3xl p-6">
    <div class="flex items-start justify-between mb-4 flex-wrap gap-2">
      <div>
        <div class="font-extrabold text-slate-800">${b.category_name} · ${b.customer_name}</div>
        <div class="text-xs text-slate-400 mt-0.5">${b.service_address}</div>
        ${b.notes ? `<div class="text-xs text-slate-400 mt-0.5">"${b.notes}"</div>` : ""}
      </div>
      <div class="font-extrabold text-brand-deep">${fmtMoney(b.total_amount)}</div>
    </div>
    ${renderStepper(b.status)}
    <div class="mt-5">${jobActionPanel(b)}</div>
  </div>`;
}

function jobActionPanel(b) {
  if (b.status === "ACCEPTED") {
    return `<button onclick="markArrived(${b.id})" class="w-full py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition flex items-center justify-center gap-2"><i data-lucide="map-pin" class="w-4 h-4"></i> Mark Arrived</button>`;
  }
  if (b.status === "ARRIVED") {
    return `
      <div class="bg-indigo-50 rounded-2xl p-4 text-center mb-3">
        <div class="text-xs font-bold text-brand mb-1">Ask the customer for their 4-digit Start OTP</div>
        <div class="text-[11px] text-slate-400">It's shown on their booking tracker screen.</div>
      </div>
      ${otpEntryForm(b.id, "START")}
    `;
  }
  if (b.status === "IN_PROGRESS") {
    return `
      <div id="completion-panel-${b.id}">
        <button onclick="requestCompletion(${b.id})" class="w-full py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition flex items-center justify-center gap-2"><i data-lucide="check-circle" class="w-4 h-4"></i> Request Completion</button>
      </div>
    `;
  }
  return "";
}

function otpEntryForm(bookingId, type) {
  return `
    <form onsubmit="return submitOtp(event, ${bookingId}, '${type}')" class="flex items-center gap-3 justify-center">
      <input maxlength="4" inputmode="numeric" pattern="[0-9]{4}" required id="otp-input-${bookingId}-${type}" class="otp-input" placeholder="0000" oninput="this.value=this.value.replace(/\\D/g,'')">
      <button type="submit" class="px-5 py-3.5 rounded-xl bg-accent text-white font-bold hover:bg-emerald-600 transition flex items-center gap-1.5"><i data-lucide="check" class="w-4 h-4"></i> Verify</button>
    </form>
  `;
}

async function markArrived(id) {
  try { await api(`/api/bookings/${id}/arrived`, { method: "POST" }); toast("Arrival marked — a Start OTP was sent to the customer's screen.", "success"); loadWorkerBookings(); }
  catch (e) { toast(e.message, "error"); }
}

async function submitOtp(e, bookingId, type) {
  e.preventDefault();
  const input = document.getElementById(`otp-input-${bookingId}-${type}`);
  const code = input.value;
  if (code.length !== 4) { toast("Enter the full 4-digit code", "warn"); return false; }
  try {
    await api(`/api/bookings/${bookingId}/verify-otp`, { method: "POST", body: { otp_type: type, otp_code: code } });
    toast(type === "START" ? "Start OTP verified — job is now in progress!" : "End OTP verified — job completed!", "success");
    loadWorkerBookings();
  } catch (e) {
    toast(e.message, "error");
    input.value = "";
    input.focus();
  }
  return false;
}

async function requestCompletion(id) {
  const panel = document.getElementById(`completion-panel-${id}`);
  try {
    await api(`/api/bookings/${id}/request-completion`, { method: "POST" });
    toast("An End OTP was sent to the customer's screen.", "success");
    if (panel) {
      panel.innerHTML = `
        <div class="bg-indigo-50 rounded-2xl p-4 text-center mb-3">
          <div class="text-xs font-bold text-brand mb-1">Ask the customer for their 4-digit End OTP</div>
          <div class="text-[11px] text-slate-400">Confirms the work is done to their satisfaction.</div>
        </div>
        ${otpEntryForm(id, "END")}
      `;
      refreshIcons();
    }
  } catch (e) { toast(e.message, "error"); }
}

function renderHistoryTab(el) {
  const completed = _myWorkerBookings.filter(b => b.status === "COMPLETED");
  if (completed.length === 0) {
    el.innerHTML = `<div class="text-center py-16 text-slate-400"><i data-lucide="history" class="w-8 h-8 mx-auto mb-3"></i>No completed jobs yet.</div>`;
    refreshIcons();
    return;
  }
  el.innerHTML = `<div class="space-y-3">${completed.map(b => `
    <div class="glass rounded-2xl p-5 flex items-center justify-between flex-wrap gap-2">
      <div>
        <div class="font-bold text-slate-800">${b.category_name} · ${b.customer_name}</div>
        <div class="text-xs text-slate-400 mt-0.5">${b.service_address} · ${fmtDate(b.created_at)}</div>
      </div>
      <div class="flex items-center gap-2">
        <span class="badge-verified px-2.5 py-1 rounded-full text-xs font-bold">Completed</span>
        <div class="font-extrabold text-brand-deep">${fmtMoney(b.total_amount)}</div>
      </div>
    </div>
  `).join("")}</div>`;
  refreshIcons();
}
