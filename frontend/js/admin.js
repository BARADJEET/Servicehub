// ServiceHub Admin Governance Controller
document.addEventListener("DOMContentLoaded", async () => {
    checkAdminAuth();
    await loadAdminDashboard();
});

function checkAdminAuth() {
    const user = Api.getUser();
    const token = Api.getToken();

    if (!token || !user || user.role !== "admin") {
        document.getElementById("admin-login-modal")?.classList.remove("hidden");
    } else {
        const el = document.getElementById("admin-user-email");
        if (el) el.innerText = user.email;
        document.getElementById("admin-login-modal")?.classList.add("hidden");
    }
}

async function loadAdminDashboard() {
    try {
        const data = await Api.getAdminDashboard();
        
        document.getElementById("kpi-total-cust").innerText = data.total_customers;
        document.getElementById("kpi-total-workers").innerText = data.total_workers;
        document.getElementById("kpi-pending-kyc").innerText = data.pending_verifications;
        document.getElementById("kpi-total-rev").innerText = `₹${Number(data.total_revenue).toLocaleString('en-IN')}`;
        
        const paidRevEl = document.getElementById("kpi-paid-rev");
        if (paidRevEl) paidRevEl.innerText = `₹${Number(data.paid_revenue || 0).toLocaleString('en-IN')}`;
        const pendingRevEl = document.getElementById("kpi-pending-rev");
        if (pendingRevEl) pendingRevEl.innerText = `₹${Number(data.pending_revenue || 0).toLocaleString('en-IN')}`;

        await loadPendingWorkers();

        const statusBadges = {
            PENDING: "bg-amber-500/15 text-amber-300 border-amber-500/30",
            ACCEPTED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
            ARRIVED: "bg-purple-500/15 text-purple-300 border-purple-500/30 animate-pulse",
            IN_PROGRESS: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
            COMPLETED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
            CANCELLED: "bg-rose-500/15 text-rose-300 border-rose-500/30"
        };

        const paymentBadges = {
            PAID: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
            UNPAID: "bg-amber-500/15 text-amber-300 border-amber-500/30"
        };

        const tbody = document.getElementById("admin-bookings-tbody");
        if (tbody) {
            if (!data.recent_bookings || !data.recent_bookings.length) {
                tbody.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-xs text-slate-500 font-semibold">No bookings recorded in platform ledger yet.</td></tr>`;
            } else {
                tbody.innerHTML = data.recent_bookings.map(b => `
                    <tr class="border-b border-slate-800/80 hover:bg-slate-800/40 text-xs transition duration-150">
                        <td class="py-4 px-5 font-mono font-bold text-indigo-400">${b.ref}</td>
                        <td class="py-4 px-5 font-bold text-white">${b.customer}</td>
                        <td class="py-4 px-5 text-slate-300 font-medium">${b.worker}</td>
                        <td class="py-4 px-5 text-slate-400">${b.category}</td>
                        <td class="py-4 px-5 font-black text-emerald-400 font-tabular">₹${b.amount}</td>
                        <td class="py-4 px-5">
                            <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${statusBadges[b.status] || 'bg-slate-800 text-slate-300 border-slate-700'}">
                                ${b.status}
                            </span>
                        </td>
                        <td class="py-4 px-5">
                            <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${paymentBadges[b.payment_status] || 'bg-slate-800 text-slate-300 border-slate-700'}">
                                ${b.payment_status === 'PAID' ? '✓ ' + (b.payment_method || 'PAID') : 'UNPAID'}
                            </span>
                        </td>
                        <td class="py-4 px-5 text-slate-400 font-medium">${b.created_at}</td>
                    </tr>
                `).join("");
            }
        }
        if (window.lucide) lucide.createIcons();
    } catch (e) {
        console.error("Failed to load admin dashboard:", e);
    }
}

async function loadPendingWorkers() {
    const container = document.getElementById("admin-pending-workers");
    if (!container) return;

    try {
        const pending = await Api.getPendingWorkers();
        if (!pending.length) {
            container.innerHTML = `
                <div class="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 text-xs">
                    <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
                        <i data-lucide="check-check" class="w-5 h-5"></i>
                    </div>
                    <span class="font-bold text-white block">All Worker KYC Applications Audited</span>
                    <span class="text-slate-400 text-[11px] mt-0.5 block">No pending verification requests in the queue.</span>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        container.innerHTML = pending.map(w => `
            <div class="p-5 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-lg hover:border-slate-700 transition">
                <div class="flex items-center gap-3.5">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                        ${w.user?.full_name?.charAt(0) || 'W'}
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h5 class="font-black text-white text-sm">${w.user?.full_name}</h5>
                            <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending KYC</span>
                        </div>
                        <span class="text-indigo-400 font-bold block mt-0.5">${w.category?.name} • ${w.experience_years} Yrs Experience • ₹${w.hourly_rate}/hr</span>
                        <p class="text-slate-400 mt-1 flex items-center gap-3">
                            <span>📍 ${w.locality}, ${w.city}</span>
                            <span>•</span>
                            <span>📞 ${w.user?.phone || 'N/A'}</span>
                            <span>•</span>
                            <span>✉️ ${w.user?.email || 'N/A'}</span>
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
                    <button onclick="approveWorker(${w.id})" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer">
                        <i data-lucide="check" class="w-4 h-4"></i> Approve Pro
                    </button>
                    <button onclick="rejectWorker(${w.id})" class="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl font-extrabold text-xs border border-rose-500/30 transition flex items-center gap-1.5 cursor-pointer">
                        <i data-lucide="x" class="w-4 h-4"></i> Reject
                    </button>
                </div>
            </div>
        `).join("");
        if (window.lucide) lucide.createIcons();
    } catch (e) {
        console.error("Failed to load pending workers:", e);
    }
}

async function approveWorker(wId) {
    try {
        await Api.verifyWorker(wId, true);
        showToast("Worker approved & verified! Activated on public marketplace.");
        loadAdminDashboard();
    } catch (e) {
        showToast(e.message, "error");
    }
}

async function rejectWorker(wId) {
    if (!confirm("Are you sure you want to reject this worker application?")) return;
    try {
        await Api.verifyWorker(wId, false);
        showToast("Worker application rejected.");
        loadAdminDashboard();
    } catch (e) {
        showToast(e.message, "error");
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById("admin-login-email").value;
    const pass = document.getElementById("admin-login-password").value;

    try {
        const res = await Api.login(email, pass);
        if (res.user.role !== "admin") throw new Error("Access Denied: Not an administrator account");
        Api.setToken(res.access_token);
        Api.setUser(res.user);
        showToast("Admin authenticated successfully!");
        checkAdminAuth();
        loadAdminDashboard();
    } catch (e) {
        showToast(e.message, "error");
    }
}

function handleAdminLogout() {
    Api.clearAuth();
    window.location.reload();
}

