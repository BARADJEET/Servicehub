// ============================= CUSTOMER PORTAL =============================
async function renderCustomer(app) {
  app.innerHTML = `
    <div class="pt-8 mb-6">
      <h1 class="text-3xl font-extrabold text-brand-deep">Hi ${Auth.getUser().full_name.split(" ")[0]} 👋</h1>
      <p class="text-slate-400 text-sm mt-1">Find a verified pro or track your active bookings.</p>
    </div>
    <div class="flex gap-2 mb-6 bg-slate-100 rounded-xl p-1 w-fit">
      <button onclick="setCustomerTab('browse')" class="tab-btn px-5 py-2 rounded-lg text-sm font-bold ${state.customerTab === 'browse' ? 'bg-white shadow text-brand' : 'text-slate-400'}"><i data-lucide="search" class="w-3.5 h-3.5 inline mr-1"></i> Browse & Book</button>
      <button onclick="setCustomerTab('bookings')" class="tab-btn px-5 py-2 rounded-lg text-sm font-bold ${state.customerTab === 'bookings' ? 'bg-white shadow text-brand' : 'text-slate-400'}"><i data-lucide="list-checks" class="w-3.5 h-3.5 inline mr-1"></i> My Bookings</button>
    </div>
    <div id="customer-content"></div>
  `;
  refreshIcons();
  if (state.customerTab === "browse") await renderBrowse();
  else await renderMyBookings();
}

function setCustomerTab(tab) {
  state.customerTab = tab;
  render();
}

// ---------- Browse ----------
async function renderBrowse() {
  const el = document.getElementById("customer-content");
  const chips = state.categories.map(c => `
    <button onclick="pickCategory(${c.id})" class="tab-btn px-4 py-2 rounded-xl text-sm font-bold border-2 flex items-center gap-2 ${state.selectedCategory === c.id ? 'border-brand bg-indigo-50 text-brand' : 'border-slate-200 text-slate-500 hover:border-slate-300'}">
      <i data-lucide="${iconFor(c.icon)}" class="w-4 h-4"></i> ${c.name}
    </button>
  `).join("");

  el.innerHTML = `
    <div class="flex flex-wrap gap-2 mb-6">${chips}</div>
    <div id="worker-results" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      ${Array(3).fill('<div class="skeleton rounded-3xl h-56"></div>').join("")}
    </div>
  `;
  refreshIcons();

  if (!state.selectedCategory) {
    document.getElementById("worker-results").innerHTML = `
      <div class="col-span-full text-center py-16 text-slate-400">
        <i data-lucide="mouse-pointer-click" class="w-8 h-8 mx-auto mb-3"></i>
        Select a category above to see verified pros near you.
      </div>`;
    refreshIcons();
    return;
  }

  try {
    state.workers = await api(`/api/workers?category_id=${state.selectedCategory}&verified_only=true`, { auth: false });
  } catch (e) { toast("Could not load workers", "error"); state.workers = []; }

  const cat = state.categories.find(c => c.id === state.selectedCategory);
  const resultsEl = document.getElementById("worker-results");
  const postJobCard = `
    <div class="rounded-3xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-6 flex flex-col items-center justify-center text-center card-hover cursor-pointer" onclick="openBookingModal(${state.selectedCategory}, null)">
      <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow mb-3"><i data-lucide="zap" class="w-6 h-6 text-brand"></i></div>
      <div class="font-bold text-brand-deep">Post this job instead</div>
      <div class="text-xs text-slate-400 mt-1">Any available ${cat ? cat.name.toLowerCase() : ''} pro can accept it</div>
    </div>
  `;

  if (state.workers.length === 0) {
    resultsEl.innerHTML = postJobCard + `<div class="col-span-full sm:col-span-2 flex items-center justify-center text-slate-400 text-sm py-10">No verified pros in this category yet — try posting the job.</div>`;
    refreshIcons();
    return;
  }

  resultsEl.innerHTML = state.workers.map(w => `
    <div class="glass rounded-3xl p-5 card-hover">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style="background:${avatarColor(w.avatar_seed)}">${initials(w.full_name)}</div>
        <div>
          <div class="font-bold text-slate-800">${w.full_name}</div>
          <div class="text-xs text-slate-400">${w.experience_years} yrs exp · ${w.service_area || 'Nearby'}</div>
        </div>
      </div>
      <div class="flex items-center gap-3 text-xs font-bold mb-3">
        <span class="badge-verified px-2.5 py-1 rounded-full flex items-center gap-1"><i data-lucide="badge-check" class="w-3 h-3"></i> Verified</span>
        <span class="flex items-center gap-1 text-amber-500"><i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i> ${w.rating_avg || '—'} (${w.total_reviews})</span>
      </div>
      <p class="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">${w.bio}</p>
      <div class="flex items-center justify-between">
        <div class="font-extrabold text-brand-deep">${fmtMoney(w.hourly_rate)}<span class="text-xs text-slate-400 font-medium">/hr</span></div>
        <button onclick="openBookingModal(${w.category_id}, ${w.id})" class="px-4 py-2 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-dark transition">Book Now</button>
      </div>
    </div>
  `).join("") + postJobCard;
  refreshIcons();
}

function pickCategory(id) {
  state.selectedCategory = id;
  renderBrowse();
}

// ---------- Booking modal ----------
function openBookingModal(categoryId, workerId) {
  const cat = state.categories.find(c => c.id === categoryId);
  const worker = workerId ? state.workers.find(w => w.id === workerId) : null;
  const root = document.getElementById("modal-root");
  root.innerHTML = `
    <div class="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onclick="if(event.target===this) closeModal()">
      <div class="modal-panel glass rounded-3xl w-full max-w-md p-7 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div class="flex items-center justify-between mb-5">
          <div>
            <div class="font-extrabold text-lg text-brand-deep">Book ${cat.name}</div>
            <div class="text-xs text-slate-400">${worker ? `with ${worker.full_name}` : 'Any available verified pro'}</div>
          </div>
          <button onclick="closeModal()" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <form onsubmit="return submitBooking(event, ${categoryId}, ${workerId || 'null'})" class="space-y-4">
          <div>
            <label class="text-xs font-bold text-slate-500">Service address</label>
            <textarea required id="bk-address" rows="2" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition" placeholder="Flat / Street / Area / City"></textarea>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-500 mb-1.5 block">When</label>
            <div class="flex gap-2">
              <button type="button" onclick="setBookingTiming('instant')" id="timing-instant" class="flex-1 py-2.5 rounded-xl border-2 border-brand bg-indigo-50 text-brand text-sm font-bold transition">Instant (~30 min)</button>
              <button type="button" onclick="setBookingTiming('scheduled')" id="timing-scheduled" class="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-400 text-sm font-bold transition">Schedule</button>
            </div>
            <input type="datetime-local" id="bk-datetime" class="hidden w-full mt-2 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition">
          </div>
          <div>
            <label class="text-xs font-bold text-slate-500">Notes for the pro (optional)</label>
            <textarea id="bk-notes" rows="2" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition" placeholder="Describe the issue..."></textarea>
          </div>
          <div class="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
            <span class="text-sm font-semibold text-slate-500">Estimated base price</span>
            <span class="font-extrabold text-brand-deep">${fmtMoney(cat.base_price)}</span>
          </div>
          <button type="submit" id="bk-submit" class="w-full py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition flex items-center justify-center gap-2">Confirm Booking</button>
        </form>
      </div>
    </div>
  `;
  refreshIcons();
}

function setBookingTiming(mode) {
  const dt = document.getElementById("bk-datetime");
  document.getElementById("timing-instant").className = `flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${mode === 'instant' ? 'border-brand bg-indigo-50 text-brand' : 'border-slate-200 text-slate-400'}`;
  document.getElementById("timing-scheduled").className = `flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${mode === 'scheduled' ? 'border-brand bg-indigo-50 text-brand' : 'border-slate-200 text-slate-400'}`;
  dt.classList.toggle("hidden", mode !== "scheduled");
  dt.required = mode === "scheduled";
}

async function submitBooking(e, categoryId, workerId) {
  e.preventDefault();
  const btn = document.getElementById("bk-submit");
  const scheduled = document.getElementById("bk-datetime");
  const payload = {
    category_id: categoryId,
    worker_id: workerId,
    service_address: document.getElementById("bk-address").value,
    notes: document.getElementById("bk-notes").value,
    scheduled_time: (!scheduled.classList.contains("hidden") && scheduled.value) ? new Date(scheduled.value).toISOString() : null,
  };
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 spin"></i> Booking...`;
  refreshIcons();
  try {
    await api("/api/bookings", { method: "POST", body: payload });
    closeModal();
    toast(workerId ? "Booking sent — waiting for pro to accept!" : "Job posted — nearby pros will pick it up shortly!", "success");
    state.customerTab = "bookings";
    render();
  } catch (err) {
    toast(err.message, "error");
    btn.disabled = false;
    btn.innerHTML = "Confirm Booking";
  }
  return false;
}

// ---------- My Bookings ----------
async function renderMyBookings() {
  const el = document.getElementById("customer-content");
  el.innerHTML = `<div class="space-y-4">${Array(2).fill('<div class="skeleton rounded-3xl h-40"></div>').join("")}</div>`;
  await loadMyBookings();
  startPolling(loadMyBookings, 6000);
}

async function loadMyBookings() {
  try { state.myBookings = await api("/api/bookings/my"); }
  catch (e) { toast("Could not refresh bookings", "error"); return; }
  const el = document.getElementById("customer-content");
  if (!el) return;

  if (state.myBookings.length === 0) {
    el.innerHTML = `<div class="text-center py-16 text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-3"></i>No bookings yet. Browse services to get started.</div>`;
    refreshIcons();
    return;
  }

  el.innerHTML = `<div class="space-y-5">${state.myBookings.map(bookingCard).join("")}</div>`;
  refreshIcons();

  // fetch OTPs live for anything in ARRIVED/IN_PROGRESS state
  for (const b of state.myBookings) {
    if (b.status === "ARRIVED") revealOtp(b.id, "START");
    if (b.status === "IN_PROGRESS") revealOtp(b.id, "END", true);
  }
}

function bookingCard(b) {
  const active = ["PENDING", "ACCEPTED", "ARRIVED", "IN_PROGRESS"].includes(b.status);
  return `
  <div class="glass rounded-3xl p-6">
    <div class="flex items-start justify-between mb-4 flex-wrap gap-2">
      <div>
        <div class="font-extrabold text-slate-800">${b.category_name}</div>
        <div class="text-xs text-slate-400 mt-0.5">${b.service_address}</div>
        <div class="text-xs text-slate-400 mt-0.5">${fmtDate(b.scheduled_time)} · Booked ${fmtDate(b.created_at)}</div>
      </div>
      <div class="text-right">
        <div class="font-extrabold text-brand-deep">${fmtMoney(b.total_amount)}</div>
        ${b.worker_name ? `<div class="text-xs text-slate-400 mt-0.5">${b.worker_name}</div>` : `<div class="text-xs text-amber-500 font-bold mt-0.5">Finding a pro...</div>`}
      </div>
    </div>
    ${renderStepper(b.status)}
    <div id="otp-slot-${b.id}" class="mt-4"></div>
    <div class="mt-4 flex items-center gap-2 flex-wrap">
      ${["PENDING", "ACCEPTED"].includes(b.status) ? `<button onclick="cancelBooking(${b.id})" class="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"><i data-lucide="x" class="w-3.5 h-3.5"></i> Cancel booking</button>` : ""}
      ${b.status === "COMPLETED" ? `<button onclick="openReviewModal(${b.id}, '${b.worker_name}')" id="review-btn-${b.id}" class="px-4 py-2 rounded-xl bg-amber-50 text-amber-600 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 transition"><i data-lucide="star" class="w-3.5 h-3.5"></i> Rate this service</button>` : ""}
    </div>
  </div>`;
}

async function revealOtp(bookingId, type, quiet = false) {
  const slot = document.getElementById(`otp-slot-${bookingId}`);
  try {
    const data = await api(`/api/bookings/${bookingId}/otp/${type}`);
    if (!slot) return;
    slot.innerHTML = `
      <div class="rounded-2xl bg-brand-deep p-5 text-center">
        <div class="text-[11px] font-bold text-indigo-200 tracking-wide mb-3 flex items-center justify-center gap-1.5">
          <i data-lucide="shield" class="w-3.5 h-3.5"></i> SHARE THIS ${type === 'START' ? 'START' : 'END'} OTP WITH YOUR PRO
        </div>
        <div class="otp-digit-row">${data.otp_code.split("").map(d => `<div class="otp-digit">${d}</div>`).join("")}</div>
        <div class="text-[11px] text-indigo-300 mt-3">${type === 'START' ? 'Confirms your pro has arrived' : 'Confirms the job is done to your satisfaction'}</div>
      </div>`;
    refreshIcons();
  } catch (e) {
    if (slot && !quiet) slot.innerHTML = "";
  }
}

async function cancelBooking(id) {
  if (!confirm("Cancel this booking?")) return;
  try {
    await api(`/api/bookings/${id}/cancel`, { method: "POST" });
    toast("Booking cancelled", "info");
    loadMyBookings();
  } catch (e) { toast(e.message, "error"); }
}

// ---------- Review modal ----------
function openReviewModal(bookingId, workerName) {
  let rating = 0;
  const root = document.getElementById("modal-root");
  const draw = () => {
    root.innerHTML = `
      <div class="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onclick="if(event.target===this) closeModal()">
        <div class="modal-panel glass rounded-3xl w-full max-w-sm p-7 shadow-2xl text-center">
          <div class="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center mx-auto mb-4"><i data-lucide="party-popper" class="w-7 h-7 text-white"></i></div>
          <div class="font-extrabold text-lg text-brand-deep">How was ${workerName}?</div>
          <div class="text-xs text-slate-400 mt-1 mb-5">Your feedback helps other customers choose confidently.</div>
          <div class="flex justify-center gap-2 mb-5" id="star-row">
            ${[1,2,3,4,5].map(i => `<button type="button" onclick="setReviewRating(${i}, ${bookingId}, '${workerName.replace(/'/g, "\\'")}')" class="star-btn"><i data-lucide="star" class="w-8 h-8 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}"></i></button>`).join("")}
          </div>
          <textarea id="review-text" rows="3" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition text-sm" placeholder="Tell us more (optional)"></textarea>
          <button onclick="submitReview(${bookingId})" class="w-full mt-4 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition">Submit Review</button>
        </div>
      </div>`;
    refreshIcons();
  };
  window._reviewRating = 0;
  draw();
}

function setReviewRating(n, bookingId, workerName) {
  window._reviewRating = n;
  document.querySelectorAll("#star-row i").forEach((icon, idx) => {
    icon.setAttribute("class", `w-8 h-8 ${idx < n ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`);
  });
}

async function submitReview(bookingId) {
  const rating = window._reviewRating || 0;
  if (rating === 0) { toast("Please select a star rating", "warn"); return; }
  const text = document.getElementById("review-text").value;
  try {
    await api("/api/reviews", { method: "POST", body: { booking_id: bookingId, rating, review_text: text } });
    closeModal();
    toast("Thanks for your feedback!", "success");
    loadMyBookings();
  } catch (e) { toast(e.message, "error"); }
}
