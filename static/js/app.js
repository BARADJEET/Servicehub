// ============================= STATE =============================
const state = {
  view: "home",         // home | customer | worker
  customerTab: "browse", // browse | bookings
  workerTab: "dispatch",  // dispatch | active | history
  selectedCategory: null,
  categories: [],
  workers: [],
  myBookings: [],
  workerProfile: null,
  pollHandle: null,
};

// ============================= BOOT =============================
document.addEventListener("DOMContentLoaded", async () => {
  await loadCategories();
  const user = Auth.getUser();
  if (user) {
    if (user.role === "admin") { window.location.href = "/admin"; return; }
    state.view = user.role;
  }
  renderNavbar();
  render();
});

async function loadCategories() {
  try { state.categories = await api("/api/categories", { auth: false }); }
  catch (e) { toast("Could not load categories", "error"); }
}

function goHome() {
  state.view = Auth.getUser() ? Auth.getUser().role : "home";
  state.selectedCategory = null;
  render();
}

// ============================= NAVBAR =============================
function renderNavbar() {
  const right = document.getElementById("nav-right");
  const user = Auth.getUser();
  if (!user) {
    right.innerHTML = `
      <button onclick="openAuthModal('login')" class="px-4 py-2 text-sm font-semibold text-brand-deep hover:bg-indigo-50 rounded-xl transition">Log in</button>
      <button onclick="openAuthModal('register')" class="px-4 py-2 text-sm font-semibold text-white brand-gradient rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition">Get Started</button>
    `;
  } else {
    right.innerHTML = `
      <div class="hidden sm:flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${user.role === 'worker' ? 'bg-indigo-50 text-brand' : 'bg-emerald-50 text-emerald-700'}">
        <i data-lucide="${user.role === 'worker' ? 'hard-hat' : 'user'}" class="w-3.5 h-3.5"></i>
        ${user.role === 'worker' ? 'Worker' : 'Customer'}
      </div>
      <div class="flex items-center gap-2">
        <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background:${avatarColor(user.full_name)}">${initials(user.full_name)}</div>
        <div class="hidden md:block text-sm font-semibold text-slate-700">${user.full_name.split(" ")[0]}</div>
      </div>
      <button onclick="logout()" title="Log out" class="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition"><i data-lucide="log-out" class="w-4 h-4"></i></button>
    `;
  }
  refreshIcons();
}

function logout() {
  stopPolling();
  Auth.clear();
  state.view = "home";
  renderNavbar();
  render();
  toast("Logged out", "info");
}

// ============================= ROUTER =============================
function render() {
  const app = document.getElementById("app");
  stopPolling();
  if (state.view === "home") app.innerHTML = renderHome();
  else if (state.view === "customer") renderCustomer(app);
  else if (state.view === "worker") renderWorker(app);
  refreshIcons();
}

// ============================= HOME =============================
function renderHome() {
  const catCards = state.categories.map(c => `
    <div onclick="selectCategoryFromHome(${c.id})" class="card-hover glass rounded-3xl p-5 cursor-pointer group">
      <div class="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition">
        <i data-lucide="${iconFor(c.icon)}" class="w-6 h-6 text-white"></i>
      </div>
      <div class="font-bold text-slate-800">${c.name}</div>
      <div class="text-xs text-slate-400 mt-1 leading-relaxed">${c.description}</div>
      <div class="text-xs font-bold text-brand mt-3">From ${fmtMoney(c.base_price)}</div>
    </div>
  `).join("");

  return `
    <section class="pt-14 pb-10 grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <div class="inline-flex items-center gap-2 text-xs font-bold text-brand bg-indigo-50 px-3 py-1.5 rounded-full mb-5">
          <span class="pulse-dot"></span> 500+ verified pros online near you
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-brand-deep leading-tight tracking-tight">
          Trusted home services, <span class="text-brand">verified</span> at your door.
        </h1>
        <p class="mt-5 text-slate-500 text-lg leading-relaxed max-w-lg">
          Book a plumber, electrician, or cleaner in minutes. Every job is secured end-to-end with our two-stage OTP handshake — no more disputes about who showed up, or when.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <button onclick="openAuthModal('register', 'customer')" class="px-6 py-3.5 rounded-2xl bg-brand text-white font-bold shadow-lg shadow-indigo-200 hover:bg-brand-dark hover:-translate-y-0.5 transition">Book a Service</button>
          <button onclick="openAuthModal('register', 'worker')" class="px-6 py-3.5 rounded-2xl bg-white text-brand-deep font-bold border border-slate-200 hover:border-brand transition">Become a Pro</button>
        </div>
        <div class="mt-10 flex items-center gap-8">
          <div><div class="text-2xl font-extrabold text-brand-deep">2-Stage</div><div class="text-xs text-slate-400 font-semibold">OTP Verified Jobs</div></div>
          <div><div class="text-2xl font-extrabold text-brand-deep">~30 min</div><div class="text-xs text-slate-400 font-semibold">Instant Response</div></div>
          <div><div class="text-2xl font-extrabold text-brand-deep">4.8★</div><div class="text-xs text-slate-400 font-semibold">Avg. Pro Rating</div></div>
        </div>
      </div>
      <div class="relative">
        <div class="absolute -inset-6 brand-gradient rounded-[2.5rem] opacity-10 blur-2xl"></div>
        <div class="relative glass rounded-3xl p-6 shadow-2xl shadow-indigo-100">
          <div class="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2"><i data-lucide="shield-check" class="w-4 h-4 text-accent"></i> LIVE BOOKING TRACKER</div>
          ${renderStepper("IN_PROGRESS")}
          <div class="mt-6 rounded-2xl bg-brand-deep/95 p-5 text-center">
            <div class="text-[11px] font-bold text-indigo-200 tracking-wide mb-3">SHARE THIS START OTP WITH YOUR PRO</div>
            <div class="otp-digit-row">
              ${"7392".split("").map(d => `<div class="otp-digit">${d}</div>`).join("")}
            </div>
          </div>
          <div class="mt-4 flex items-center gap-3 text-sm">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background:${avatarColor('Ramesh Patel')}">RP</div>
            <div>
              <div class="font-bold text-slate-700">Ramesh Patel</div>
              <div class="text-xs text-slate-400">Plumbing · ★ 4.9 (128)</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-8">
      <h2 class="text-2xl font-extrabold text-brand-deep mb-1">Browse services</h2>
      <p class="text-slate-400 text-sm mb-6">Pick a category to see verified pros nearby.</p>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">${catCards}</div>
    </section>

    <section class="py-10 grid md:grid-cols-3 gap-6">
      ${[
        ["user-check", "Book & Match", "Choose a service and get matched with a verified pro near you, instantly or on schedule."],
        ["shield-check", "OTP Verified Arrival", "Your pro enters your Start OTP on arrival — no impersonation, no confusion."],
        ["star", "Rate & Review", "Confirm completion with an End OTP, then rate your experience to help the community."],
      ].map(([icon, title, desc]) => `
        <div class="glass rounded-3xl p-6">
          <div class="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4"><i data-lucide="${icon}" class="w-5 h-5 text-brand"></i></div>
          <div class="font-bold text-slate-800 mb-1">${title}</div>
          <div class="text-sm text-slate-400 leading-relaxed">${desc}</div>
        </div>
      `).join("")}
    </section>
  `;
}

function selectCategoryFromHome(catId) {
  if (!Auth.isLoggedIn()) { openAuthModal("register", "customer"); return; }
  const user = Auth.getUser();
  if (user.role !== "customer") { toast("Log in as a customer to book services", "warn"); return; }
  state.view = "customer";
  state.customerTab = "browse";
  state.selectedCategory = catId;
  render();
}

// ============================= AUTH MODAL =============================
function openAuthModal(mode = "login", presetRole = "customer") {
  const root = document.getElementById("modal-root");
  root.innerHTML = `
    <div class="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onclick="if(event.target===this) closeModal()">
      <div class="modal-panel glass rounded-3xl w-full max-w-md p-7 shadow-2xl">
        <div class="flex items-center justify-between mb-5">
          <div class="flex bg-slate-100 rounded-xl p-1 text-sm font-bold">
            <button id="tab-login" onclick="switchAuthTab('login')" class="tab-btn px-4 py-1.5 rounded-lg ${mode === 'login' ? 'bg-white shadow text-brand' : 'text-slate-400'}">Log In</button>
            <button id="tab-register" onclick="switchAuthTab('register')" class="tab-btn px-4 py-1.5 rounded-lg ${mode === 'register' ? 'bg-white shadow text-brand' : 'text-slate-400'}">Sign Up</button>
          </div>
          <button onclick="closeModal()" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <div id="auth-body"></div>
      </div>
    </div>
  `;
  window._authPresetRole = presetRole;
  switchAuthTab(mode);
  refreshIcons();
}

function switchAuthTab(mode) {
  document.getElementById("tab-login").className = `tab-btn px-4 py-1.5 rounded-lg ${mode === 'login' ? 'bg-white shadow text-brand' : 'text-slate-400'}`;
  document.getElementById("tab-register").className = `tab-btn px-4 py-1.5 rounded-lg ${mode === 'register' ? 'bg-white shadow text-brand' : 'text-slate-400'}`;
  const body = document.getElementById("auth-body");
  if (mode === "login") {
    body.innerHTML = `
      <form onsubmit="return handleLogin(event)" class="space-y-3">
        <div>
          <label class="text-xs font-bold text-slate-500">Email</label>
          <input required type="email" id="login-email" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition" placeholder="you@example.com">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-500">Password</label>
          <input required type="password" id="login-password" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition" placeholder="••••••••">
        </div>
        <button type="submit" class="w-full py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition mt-2">Log In</button>
        <div class="text-[11px] text-slate-400 text-center leading-relaxed pt-2 border-t border-slate-100 mt-3">
          Demo password for all seeded accounts: <span class="font-mono font-bold text-slate-500">Demo@1234</span><br>
          Try <span class="font-mono">aditya.customer@servicehub.demo</span> or <span class="font-mono">ramesh.plumb@servicehub.demo</span>
        </div>
      </form>
    `;
  } else {
    const role = window._authPresetRole || "customer";
    body.innerHTML = `
      <form onsubmit="return handleRegister(event)" class="space-y-3">
        <div class="flex gap-2 mb-1">
          <button type="button" onclick="setRegRole('customer')" id="role-customer" class="flex-1 py-2 rounded-xl border-2 text-sm font-bold transition ${role === 'customer' ? 'border-brand bg-indigo-50 text-brand' : 'border-slate-200 text-slate-400'}">
            <i data-lucide="user" class="w-4 h-4 inline mr-1"></i> I need a service
          </button>
          <button type="button" onclick="setRegRole('worker')" id="role-worker" class="flex-1 py-2 rounded-xl border-2 text-sm font-bold transition ${role === 'worker' ? 'border-brand bg-indigo-50 text-brand' : 'border-slate-200 text-slate-400'}">
            <i data-lucide="hard-hat" class="w-4 h-4 inline mr-1"></i> I'm a pro
          </button>
        </div>
        <input type="hidden" id="reg-role" value="${role}">
        <div>
          <label class="text-xs font-bold text-slate-500">Full name</label>
          <input required id="reg-name" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition" placeholder="Jordan Lee">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-500">Email</label>
          <input required type="email" id="reg-email" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition" placeholder="you@example.com">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-500">Phone</label>
          <input required id="reg-phone" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition" placeholder="98765 43210">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-500">Password</label>
          <input required type="password" minlength="6" id="reg-password" class="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand outline-none transition" placeholder="Min. 6 characters">
        </div>
        <button type="submit" class="w-full py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition mt-2">Create Account</button>
      </form>
    `;
  }
  refreshIcons();
}

function setRegRole(role) {
  document.getElementById("reg-role").value = role;
  document.getElementById("role-customer").className = `flex-1 py-2 rounded-xl border-2 text-sm font-bold transition ${role === 'customer' ? 'border-brand bg-indigo-50 text-brand' : 'border-slate-200 text-slate-400'}`;
  document.getElementById("role-worker").className = `flex-1 py-2 rounded-xl border-2 text-sm font-bold transition ${role === 'worker' ? 'border-brand bg-indigo-50 text-brand' : 'border-slate-200 text-slate-400'}`;
}

function closeModal() { document.getElementById("modal-root").innerHTML = ""; }

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    const data = await api("/api/auth/login", { method: "POST", auth: false, body: { email, password } });
    Auth.setSession(data.access_token, data.user);
    closeModal();
    onAuthSuccess(data.user);
  } catch (err) { toast(err.message, "error"); }
  return false;
}

async function handleRegister(e) {
  e.preventDefault();
  const payload = {
    full_name: document.getElementById("reg-name").value,
    email: document.getElementById("reg-email").value,
    phone: document.getElementById("reg-phone").value,
    password: document.getElementById("reg-password").value,
    role: document.getElementById("reg-role").value,
  };
  try {
    const data = await api("/api/auth/register", { method: "POST", auth: false, body: payload });
    Auth.setSession(data.access_token, data.user);
    closeModal();
    toast(`Welcome to ServiceHub, ${data.user.full_name.split(" ")[0]}!`, "success");
    onAuthSuccess(data.user);
  } catch (err) { toast(err.message, "error"); }
  return false;
}

function onAuthSuccess(user) {
  state.view = user.role;
  renderNavbar();
  render();
}

// ============================= POLLING =============================
function stopPolling() {
  if (state.pollHandle) { clearInterval(state.pollHandle); state.pollHandle = null; }
}
function startPolling(fn, ms = 6000) {
  stopPolling();
  state.pollHandle = setInterval(fn, ms);
}

// ============================= SHARED: STEPPER =============================
const STEPS = [
  ["PENDING", "clock", "Requested"],
  ["ACCEPTED", "check", "Accepted"],
  ["ARRIVED", "map-pin", "Arrived"],
  ["IN_PROGRESS", "loader", "In Progress"],
  ["COMPLETED", "party-popper", "Completed"],
];
function renderStepper(status) {
  if (status === "CANCELLED" || status === "REJECTED") {
    return `<div class="flex items-center gap-2 text-rose-500 font-bold text-sm bg-rose-50 rounded-xl px-4 py-3"><i data-lucide="x-circle" class="w-4 h-4"></i> Booking ${status === 'CANCELLED' ? 'cancelled' : 'rejected'}</div>`;
  }
  const idx = STEPS.findIndex(s => s[0] === status);
  return `<div class="stepper">
    ${STEPS.map(([key, icon, label], i) => `
      <div class="step ${i < idx ? 'done' : ''} ${i === idx ? 'active' : ''}">
        <div class="step-line ${i <= idx ? 'done' : ''}"></div>
        <div class="step-dot">${i < idx ? '<i data-lucide=\"check\" class=\"w-4 h-4\"></i>' : i + 1}</div>
        <div class="step-label">${label}</div>
      </div>
    `).join("")}
  </div>`;
}

// ============================= INCLUDE: customer / worker views =============================
