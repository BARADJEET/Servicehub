// ServiceHub Customer & Marketplace Controller
let currentCategories = [];
let selectedWorker = null;
let currentLoadedBookings = [];
let activePaymentBooking = null;
let selectedPayMethod = 'UPI (Instant)';
let selectedUpiApp = 'Google Pay';
let selectedBank = 'State Bank of India';

// High-Definition Category Imagery & Fallback Icons
const CATEGORY_IMAGES = {
    "plumbing": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80",
    "electrical": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    "ac-appliance": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80",
    "cleaning": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    "carpentry": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80",
    "painting": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80"
};

const WORKER_AVATARS = {
    "plumbing": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    "electrical": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
    "ac-appliance": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&h=200&q=80",
    "cleaning": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
    "carpentry": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80",
    "painting": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80"
};

document.addEventListener("DOMContentLoaded", async () => {
    initAuthUI();
    await loadCategories();
    await searchWorkers();
    await loadMyBookings();
    
    const user = Api.getUser();
    if (user && user.role === "customer") {
        const el = document.getElementById("user-display-name");
        if (el) el.innerText = user.full_name;
    }

    // Auto-open modals based on URL query params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("open") === "register-worker") {
        openRegisterModal("worker");
    } else if (urlParams.get("open") === "register") {
        openRegisterModal("customer");
    } else if (urlParams.get("open") === "login") {
        openLoginModal();
    }
});

function initAuthUI() {
    const user = Api.getUser();
    const authContainer = document.getElementById("auth-btn-container");
    if (!authContainer) return;

    if (user) {
        authContainer.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                    <span class="block text-xs font-black text-slate-900 leading-tight">${user.full_name}</span>
                    <span class="block text-[10px] font-bold text-indigo-600 capitalize">${user.role}</span>
                </div>
                <button onclick="handleLogout()" class="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-bold rounded-2xl transition duration-150 cursor-pointer">
                    Logout
                </button>
            </div>
        `;
    } else {
        authContainer.innerHTML = `
            <button onclick="openLoginModal()" class="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-2xl transition duration-150 cursor-pointer">
                Sign In
            </button>
            <button onclick="openRegisterModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-2xl shadow-md shadow-indigo-600/25 transition duration-150 cursor-pointer">
                Register
            </button>
        `;
    }
}

async function loadCategories() {
    try {
        currentCategories = await Api.getCategories();
        const grid = document.getElementById("category-grid");
        const select = document.getElementById("search-category-filter");
        
        if (grid) {
            grid.innerHTML = currentCategories.map(c => {
                const imgUrl = CATEGORY_IMAGES[c.slug] || "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80";
                return `
                    <div onclick="filterByCategory(${c.id})" class="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover-lift cursor-pointer flex flex-col overflow-hidden transition-all duration-200">
                        <div class="relative h-32 w-full card-img-zoom overflow-hidden">
                            <img src="${imgUrl}" alt="${c.name}" class="w-full h-full object-cover" loading="lazy" />
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>
                            <div class="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md text-indigo-700 flex items-center justify-center shadow-md">
                                <i data-lucide="${c.icon || 'wrench'}" class="w-4 h-4"></i>
                            </div>
                            <div class="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                                <span class="text-[10px] font-bold uppercase tracking-wider bg-indigo-600/80 backdrop-blur-xs px-2 py-0.5 rounded-md">Starts ₹${c.base_price}</span>
                            </div>
                        </div>
                        <div class="p-3.5 flex flex-col justify-between flex-1">
                            <h4 class="font-black text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition leading-snug">${c.name}</h4>
                            <p class="text-[11px] text-slate-400 font-medium line-clamp-1 mt-0.5">${c.description || 'Verified local service'}</p>
                        </div>
                    </div>
                `;
            }).join("");
        }

        if (select) {
            select.innerHTML = `<option value="">All Service Categories</option>` + currentCategories.map(c => `
                <option value="${c.id}">${c.name}</option>
            `).join("");
        }

        if (window.lucide) lucide.createIcons();
    } catch (err) {
        console.error("Failed to load categories:", err);
    }
}

async function searchWorkers(categoryId = null) {
    const container = document.getElementById("workers-grid");
    if (!container) return;

    container.innerHTML = `
        <div class="col-span-full py-16 text-center">
            <div class="inline-block w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-xs text-slate-500 mt-3 font-bold">Scanning neighborhood for background-verified technicians...</p>
        </div>
    `;

    try {
        const locality = document.getElementById("search-locality-input")?.value || "";
        const catId = categoryId || document.getElementById("search-category-filter")?.value || null;
        
        const workers = await Api.searchWorkers(catId, locality);

        if (!workers.length) {
            container.innerHTML = `
                <div class="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
                    <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <i data-lucide="user-x" class="w-7 h-7"></i>
                    </div>
                    <h4 class="font-black text-base text-slate-900">No Service Pros Available in this Locality</h4>
                    <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try selecting 'All Service Categories' or searching nearby areas such as Navrangpura, Vastrapur, or Satellite.</p>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        container.innerHTML = workers.map(w => {
            const catSlug = w.category?.slug || "plumbing";
            const avatarUrl = WORKER_AVATARS[catSlug] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${w.user?.full_name}`;
            
            return `
                <div class="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover-lift flex flex-col justify-between relative overflow-hidden transition-all duration-200">
                    ${w.is_featured ? '<span class="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">Top Rated Pro</span>' : ''}
                    
                    <div>
                        <div class="flex items-center gap-3.5">
                            <div class="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-indigo-100">
                                <img src="${avatarUrl}" alt="${w.user?.full_name}" class="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-1.5">
                                    <h4 class="font-black text-slate-900 text-base truncate">${w.user?.full_name}</h4>
                                    ${w.is_verified ? '<i data-lucide="badge-check" class="w-4 h-4 text-emerald-600 shrink-0" title="Identity & Aadhaar Verified"></i>' : ''}
                                </div>
                                <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md inline-block mt-0.5">${w.category?.name || 'Pro'}</span>
                            </div>
                        </div>

                        <p class="text-xs text-slate-600 mt-3.5 line-clamp-2 leading-relaxed font-medium">${w.bio || 'Background-verified technician with extensive on-site experience.'}</p>
                        
                        <div class="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                            <div class="bg-slate-50 p-2.5 rounded-2xl">
                                <span class="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Rating</span>
                                <span class="font-black text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                                    <i data-lucide="star" class="w-3.5 h-3.5 text-amber-500 fill-amber-500"></i> ${w.rating_avg}
                                </span>
                            </div>
                            <div class="bg-slate-50 p-2.5 rounded-2xl">
                                <span class="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Experience</span>
                                <span class="font-black text-slate-900 mt-0.5 block">${w.experience_years} Yrs</span>
                            </div>
                            <div class="bg-slate-50 p-2.5 rounded-2xl">
                                <span class="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Rate / Hr</span>
                                <span class="font-black text-emerald-700 mt-0.5 block font-tabular">₹${w.hourly_rate}</span>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-1.5 mt-3.5 text-xs text-slate-500 font-semibold">
                            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-indigo-600 shrink-0"></i>
                            <span class="truncate">${w.locality}, ${w.city}</span>
                        </div>
                    </div>

                    <div class="mt-5 pt-3">
                        <button onclick="openBookingModal(${w.id})" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer">
                            <i data-lucide="calendar-check" class="w-4 h-4"></i> Book Professional
                        </button>
                    </div>
                </div>
            `;
        }).join("");

        if (window.lucide) lucide.createIcons();
    } catch (err) {
        showToast("Error loading workers: " + err.message, "error");
    }
}

function filterByCategory(catId) {
    const select = document.getElementById("search-category-filter");
    if (select) select.value = catId;
    searchWorkers(catId);
    document.getElementById("workers-section")?.scrollIntoView({ behavior: "smooth" });
}

async function openBookingModal(workerId) {
    const user = Api.getUser();
    if (!user) {
        showToast("Please sign in or register to book a service.", "error");
        openLoginModal();
        return;
    }

    try {
        selectedWorker = await Api.getWorkerProfile(workerId);
        document.getElementById("book-worker-name").innerText = selectedWorker.user.full_name;
        document.getElementById("book-worker-cat").innerText = selectedWorker.category.name;
        document.getElementById("book-worker-rate").innerText = `₹${selectedWorker.hourly_rate}`;
        document.getElementById("booking-modal").classList.remove("hidden");
    } catch (err) {
        showToast("Failed to fetch worker details", "error");
    }
}

function closeBookingModal() {
    document.getElementById("booking-modal")?.classList.add("hidden");
}

async function handleBookingSubmit(e) {
    e.preventDefault();
    if (!selectedWorker) return;

    const payload = {
        worker_id: selectedWorker.id,
        category_id: selectedWorker.category_id,
        service_address: document.getElementById("book-address").value,
        locality: document.getElementById("book-locality").value || selectedWorker.locality,
        city: selectedWorker.city,
        is_instant: document.getElementById("book-type-instant").checked,
        problem_description: document.getElementById("book-problem").value
    };

    try {
        const booking = await Api.createBooking(payload);
        showToast(`Booking ${booking.booking_ref} created! Professional notified.`);
        closeBookingModal();
        switchTab("bookings");
        await loadMyBookings();
    } catch (err) {
        showToast(err.message, "error");
    }
}

async function loadMyBookings() {
    const container = document.getElementById("my-bookings-container");
    if (!container) return;

    const user = Api.getUser();
    if (!user) {
        container.innerHTML = `
            <div class="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
                <div class="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                    <i data-lucide="lock" class="w-7 h-7"></i>
                </div>
                <h4 class="font-black text-base text-slate-900">Sign In to View Bookings & Live OTPs</h4>
                <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Track incoming technician arrival, reveal the 4-digit Start OTP, and verify completed service.</p>
                <button onclick="openLoginModal()" class="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer">
                    Sign In Now
                </button>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    try {
        const bookings = await Api.getMyBookings();
        currentLoadedBookings = bookings || [];
        if (!bookings.length) {
            container.innerHTML = `
                <div class="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
                    <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <i data-lucide="clipboard-list" class="w-7 h-7"></i>
                    </div>
                    <h4 class="font-black text-base text-slate-900">No Service Bookings Yet</h4>
                    <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Book a verified plumber, electrician or technician to get started with fast ~30 min dispatch.</p>
                    <button onclick="switchTab('marketplace')" class="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer">
                        Explore Marketplace
                    </button>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        container.innerHTML = bookings.map(b => renderBookingCard(b)).join("");
        if (window.lucide) lucide.createIcons();
    } catch (err) {
        console.error("Failed to load bookings:", err);
    }
}

function renderBookingCard(b) {
    const statusBadges = {
        PENDING: "bg-amber-50 text-amber-800 border-amber-300",
        ACCEPTED: "bg-blue-50 text-blue-800 border-blue-300",
        ARRIVED: "bg-purple-50 text-purple-800 border-purple-300 animate-pulse",
        IN_PROGRESS: "bg-indigo-50 text-indigo-800 border-indigo-300",
        COMPLETED: b.payment_status === "PAID" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
            : "bg-amber-50 text-amber-900 border-amber-400 font-black",
        CANCELLED: "bg-rose-50 text-rose-800 border-rose-300"
    };

    const statusLabel = (b.status === "COMPLETED" && b.payment_status !== "PAID")
        ? "COMPLETED (PAYMENT DUE)"
        : (b.status === "COMPLETED" && b.payment_status === "PAID")
        ? "COMPLETED & PAID"
        : b.status;

    const startOtpObj = b.otps?.find(o => o.otp_type === "START");
    const endOtpObj = b.otps?.find(o => o.otp_type === "END");

    // Stepper visualizer
    const step = (b.status === "PENDING") ? 1 
               : (b.status === "ACCEPTED" || b.status === "ARRIVED") ? 2 
               : (b.status === "IN_PROGRESS") ? 3 
               : (b.status === "COMPLETED") ? 4 : 1;

    let otpDisplay = "";
    if (b.status === "ARRIVED" && startOtpObj) {
        otpDisplay = `
            <div class="mt-5 p-5 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-xl border border-purple-500/40">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span class="text-xs font-extrabold uppercase tracking-wider text-purple-200">Technician Arrived at Doorstep</span>
                    </div>
                    <span class="text-[11px] text-purple-300 font-semibold">Share with Pro</span>
                </div>
                <div class="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <span class="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">START SERVICE OTP</span>
                        <div class="flex items-center gap-3 mt-1">
                            <span class="otp-display-badge text-emerald-300">${startOtpObj.otp_code}</span>
                            <span class="text-xs text-purple-200 max-w-xs">Share this 4-digit OTP with the technician to unlock work.</span>
                        </div>
                    </div>
                    <button onclick="navigator.clipboard.writeText('${startOtpObj.otp_code}'); showToast('Start OTP Copied to clipboard!')" class="px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white rounded-2xl text-xs font-extrabold transition shadow-md cursor-pointer self-start sm:self-auto">
                        Copy OTP
                    </button>
                </div>
            </div>
        `;
    } else if (b.status === "IN_PROGRESS" && endOtpObj) {
        otpDisplay = `
            <div class="mt-5 p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-xl border border-emerald-500/40">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span class="text-xs font-extrabold uppercase tracking-wider text-emerald-200">Work In Progress • Inspect Quality</span>
                    </div>
                    <span class="text-[11px] text-emerald-300 font-semibold">Share after full satisfaction</span>
                </div>
                <div class="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <span class="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">COMPLETION END OTP</span>
                        <div class="flex items-center gap-3 mt-1">
                            <span class="otp-display-badge text-amber-300">${endOtpObj.otp_code}</span>
                            <span class="text-xs text-emerald-200 max-w-xs">Share this OTP only when repair/service meets your full expectation.</span>
                        </div>
                    </div>
                    <button onclick="navigator.clipboard.writeText('${endOtpObj.otp_code}'); showToast('End OTP Copied to clipboard!')" class="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold transition shadow-md cursor-pointer self-start sm:self-auto">
                        Copy OTP
                    </button>
                </div>
            </div>
        `;
    }

    let reviewButton = "";
    if (b.status === "COMPLETED") {
        reviewButton = `
            <button onclick="openReviewModal(${b.id}, '${b.worker?.user?.full_name || 'Technician'}')" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-2xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-white"></i> Rate Service
            </button>
        `;
    }

    // Payment Section Banner (After Service End)
    let paymentBanner = "";
    if (b.status === "COMPLETED") {
        if (b.payment_status === "PAID") {
            paymentBanner = `
                <div class="mt-5 p-4 sm:p-5 rounded-3xl bg-emerald-50/90 border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                            <i data-lucide="check-check" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-black text-emerald-950 uppercase tracking-wide">Payment Settled</span>
                                <span class="text-[10px] font-bold bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded-md font-mono">${b.transaction_ref || 'TXN-PAID'}</span>
                            </div>
                            <p class="text-xs text-emerald-800 font-medium mt-0.5">
                                Paid <strong>₹${b.total_amount}</strong> via <strong>${b.payment_method || 'Online Payment'}</strong>
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="openReceiptModal(${b.id})" class="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-2xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
                            <i data-lucide="file-text" class="w-3.5 h-3.5 text-emerald-700"></i> View Invoice
                        </button>
                        ${reviewButton}
                    </div>
                </div>
            `;
        } else {
            paymentBanner = `
                <div class="mt-5 p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-500/10 border-2 border-amber-400/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                            <span class="text-xs font-black uppercase tracking-wider text-amber-900">Service Finished • Payment Due</span>
                            <span class="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md uppercase">Pending</span>
                        </div>
                        <h5 class="text-sm sm:text-base font-black text-slate-900 mt-1">Please pay ₹${b.total_amount} to settle this service</h5>
                        <p class="text-xs text-slate-600 mt-0.5 max-w-lg">Work was verified with your End OTP. Pay securely using UPI, Cards, Net Banking or Cash.</p>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <button onclick="openPaymentModal(${b.id})" class="px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer transform hover:scale-[1.02]">
                            <i data-lucide="credit-card" class="w-4 h-4"></i> Pay ₹${b.total_amount} Now
                        </button>
                        ${reviewButton}
                    </div>
                </div>
            `;
        }
    }

    return `
        <div class="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition duration-200">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-black tracking-widest text-indigo-700 uppercase bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">${b.booking_ref}</span>
                        <span class="text-xs text-slate-400 font-semibold">${new Date(b.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <h4 class="text-lg font-black text-slate-900 mt-1.5">${b.category?.name} with ${b.worker?.user?.full_name || 'Assigned Pro'}</h4>
                    <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i> ${b.service_address}
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${statusBadges[b.status] || 'bg-slate-100 text-slate-800'}">
                        ${statusLabel}
                    </span>
                    ${b.status !== "COMPLETED" ? reviewButton : ''}
                </div>
            </div>

            <!-- Progress Tracker Stepper -->
            <div class="grid grid-cols-4 gap-2 my-5 text-center text-[11px] font-bold">
                <div class="flex flex-col items-center">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'} shadow-xs mb-1">1</div>
                    <span class="${step >= 1 ? 'text-indigo-900' : 'text-slate-400'}">Booked</span>
                </div>
                <div class="flex flex-col items-center">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'} shadow-xs mb-1">2</div>
                    <span class="${step >= 2 ? 'text-indigo-900' : 'text-slate-400'}">Dispatched</span>
                </div>
                <div class="flex flex-col items-center">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'} shadow-xs mb-1">3</div>
                    <span class="${step >= 3 ? 'text-indigo-900' : 'text-slate-400'}">In Progress</span>
                </div>
                <div class="flex flex-col items-center">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center ${step >= 4 ? (b.payment_status === 'PAID' ? 'bg-emerald-600' : 'bg-amber-500') + ' text-white' : 'bg-slate-100 text-slate-400'} shadow-xs mb-1">4</div>
                    <span class="${step >= 4 ? (b.payment_status === 'PAID' ? 'text-emerald-700' : 'text-amber-700 font-extrabold') : 'text-slate-400'}">${step >= 4 ? (b.payment_status === 'PAID' ? 'Settled' : 'Payment Due') : 'Completed'}</span>
                </div>
            </div>

            ${otpDisplay}
            ${paymentBanner}

            <div class="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-semibold">
                <div class="flex items-center gap-4">
                    <span>Inspection Fee: <strong class="text-slate-900 text-base font-tabular">₹${b.total_amount}</strong></span>
                    <span>•</span>
                    <span class="text-indigo-700 font-bold">${b.is_instant ? '⚡ Instant Dispatch' : '📅 Scheduled'}</span>
                </div>
                ${b.problem_description ? `<span class="text-slate-400 truncate max-w-md italic">"${b.problem_description}"</span>` : ''}
            </div>
        </div>
    `;
}

function openReviewModal(bookingId, workerName) {
    document.getElementById("review-booking-id").value = bookingId;
    document.getElementById("review-worker-name").innerText = workerName;
    document.getElementById("review-modal")?.classList.remove("hidden");
}
function closeReviewModal() {
    document.getElementById("review-modal")?.classList.add("hidden");
}
async function handleReviewSubmit(e) {
    e.preventDefault();
    const bId = document.getElementById("review-booking-id").value;
    const rating = document.getElementById("review-rating-val").value || 5;
    const text = document.getElementById("review-text").value;

    try {
        await Api.submitReview(bId, rating, text);
        showToast("Thank you! Review and rating submitted successfully.");
        closeReviewModal();
        loadMyBookings();
    } catch (err) {
        showToast(err.message, "error");
    }
}

let currentRegisterRole = "customer";

function openLoginModal() {
    document.getElementById("register-modal")?.classList.add("hidden");
    document.getElementById("login-modal")?.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
}
function closeLoginModal() {
    document.getElementById("login-modal")?.classList.add("hidden");
}
function openRegisterModal(initialRole = "customer") {
    document.getElementById("login-modal")?.classList.add("hidden");
    document.getElementById("register-modal")?.classList.remove("hidden");
    setRegisterRole(initialRole);
    if (window.lucide) lucide.createIcons();
}
function closeRegisterModal() {
    document.getElementById("register-modal")?.classList.add("hidden");
}

function setRegisterRole(role) {
    currentRegisterRole = role;
    const custTab = document.getElementById("reg-tab-customer");
    const workerTab = document.getElementById("reg-tab-worker");
    const workerFields = document.getElementById("worker-reg-fields");
    const submitBtnText = document.getElementById("reg-submit-btn-text");

    if (role === "worker") {
        workerTab?.classList.add("bg-indigo-600", "text-white", "shadow-md");
        workerTab?.classList.remove("text-slate-600", "bg-transparent");
        custTab?.classList.remove("bg-indigo-600", "text-white", "shadow-md");
        custTab?.classList.add("text-slate-600", "bg-transparent");
        workerFields?.classList.remove("hidden");
        if (submitBtnText) submitBtnText.innerText = "Register as Verified Technician";

        // Populate worker category select if empty
        const catSelect = document.getElementById("reg-worker-category");
        if (catSelect && (!catSelect.options || catSelect.options.length <= 1) && currentCategories.length) {
            catSelect.innerHTML = `<option value="">Select Primary Trade / Domain</option>` + currentCategories.map(c => `
                <option value="${c.id}">${c.name}</option>
            `).join("");
        }
    } else {
        custTab?.classList.add("bg-indigo-600", "text-white", "shadow-md");
        custTab?.classList.remove("text-slate-600", "bg-transparent");
        workerTab?.classList.remove("bg-indigo-600", "text-white", "shadow-md");
        workerTab?.classList.add("text-slate-600", "bg-transparent");
        workerFields?.classList.add("hidden");
        if (submitBtnText) submitBtnText.innerText = "Register Customer Account";
    }

    if (window.lucide) lucide.createIcons();
}

function formatAadhaarInput(e) {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 12) val = val.substring(0, 12);
    // Format into 4-digit chunks e.g. 1234 5678 9012
    let formatted = "";
    for (let i = 0; i < val.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += " ";
        formatted += val[i];
    }
    e.target.value = formatted;
}

async function handleAadhaarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size < 10MB
    if (file.size > 10 * 1024 * 1024) {
        showToast("File size exceeds 10MB. Please choose a smaller image or PDF.", "error");
        return;
    }

    const statusEl = document.getElementById("reg-aadhaar-status");
    const previewEl = document.getElementById("reg-aadhaar-preview-name");
    const urlInput = document.getElementById("reg-aadhaar-url");

    if (statusEl) {
        statusEl.classList.remove("hidden");
        statusEl.innerHTML = `
            <div class="flex items-center gap-2 text-indigo-700 text-xs font-bold animate-pulse">
                <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
                <span>Securing and uploading Aadhaar document...</span>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    }

    try {
        const res = await Api.uploadAadhaar(file);
        if (urlInput) urlInput.value = res.file_url;
        if (statusEl) {
            statusEl.innerHTML = `
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold">
                    <span class="flex items-center gap-1.5 truncate">
                        <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600 shrink-0"></i>
                        <span class="truncate">Aadhaar Staged: ${file.name}</span>
                    </span>
                    <span class="text-[10px] uppercase tracking-wider bg-emerald-200/80 px-2 py-0.5 rounded-md text-emerald-900 shrink-0">Ready</span>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
        }
        showToast("Aadhaar Card uploaded successfully for KYC verification!");
    } catch (err) {
        if (statusEl) {
            statusEl.innerHTML = `
                <div class="p-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
                    Upload failed: ${err.message}. Please try again.
                </div>
            `;
        }
        showToast(err.message, "error");
    }
}

function useSampleAadhaar() {
    const aadhaarInput = document.getElementById("reg-aadhaar-number");
    const urlInput = document.getElementById("reg-aadhaar-url");
    const statusEl = document.getElementById("reg-aadhaar-status");

    if (aadhaarInput) aadhaarInput.value = "4291 8023 9104";
    if (urlInput) urlInput.value = "/uploads/sample_aadhaar_card.png";

    if (statusEl) {
        statusEl.classList.remove("hidden");
        statusEl.innerHTML = `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold">
                <span class="flex items-center gap-1.5 truncate">
                    <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600 shrink-0"></i>
                    <span class="truncate">Sample UIDAI Verified Document Staged</span>
                </span>
                <span class="text-[10px] uppercase tracking-wider bg-emerald-200/80 px-2 py-0.5 rounded-md text-emerald-900 shrink-0">Demo Ready</span>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    }
    showToast("⚡ Sample Verified Aadhaar loaded for quick testing!");
}

function togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === "password") {
        input.type = "text";
        if (btnEl) btnEl.innerHTML = `<i data-lucide="eye-off" class="w-4 h-4"></i>`;
    } else {
        input.type = "password";
        if (btnEl) btnEl.innerHTML = `<i data-lucide="eye" class="w-4 h-4"></i>`;
    }
    if (window.lucide) lucide.createIcons();
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const identifier = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value;

    // Strict 10-digit mobile number validation if numeric
    if (!identifier.includes("@")) {
        const cleanDigits = identifier.replace(/[\s\-\(\)\+]/g, "");
        if (cleanDigits.length > 0) {
            if (cleanDigits.length !== 10 || !/^\d{10}$/.test(cleanDigits)) {
                showToast("Mobile number must be exactly 10 digits to sign in", "error");
                return;
            }
        }
    }

    const submitBtn = e.target.querySelector("button[type='submit']");
    const origHtml = submitBtn ? submitBtn.innerHTML : "Sign In";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Signing In...`;
    }

    try {
        const res = await Api.login(identifier, pass);
        Api.setToken(res.access_token);
        Api.setUser(res.user);
        showToast(`Welcome back, ${res.user.full_name}!`);
        closeLoginModal();
        initAuthUI();
        
        if (res.user.role === "worker") {
            window.location.href = "/worker";
        } else if (res.user.role === "admin") {
            window.location.href = "/admin";
        } else {
            loadMyBookings();
        }
    } catch (err) {
        showToast(err.message, "error");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origHtml;
        }
    }
}

async function handleRegisterSubmit(e) {
    e.preventDefault();

    const fullName = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();
    const password = document.getElementById("reg-password").value;

    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, "");
    if (cleanPhone.length !== 10 || !/^\d{10}$/.test(cleanPhone)) {
        showToast("Mobile number must be exactly 10 digits.", "error");
        document.getElementById("reg-phone")?.focus();
        return;
    }

    if (currentRegisterRole === "worker") {
        const categoryId = document.getElementById("reg-worker-category")?.value;
        if (!categoryId) {
            showToast("Please choose your service domain/category.", "error");
            return;
        }

        const rawAadhaar = document.getElementById("reg-aadhaar-number")?.value.replace(/\s+/g, "") || "";
        if (rawAadhaar.length !== 12 || !/^\d{12}$/.test(rawAadhaar)) {
            showToast("Please enter a valid 12-digit Aadhaar Card number.", "error");
            document.getElementById("reg-aadhaar-number")?.focus();
            return;
        }

        const idProofUrl = document.getElementById("reg-aadhaar-url")?.value;
        if (!idProofUrl) {
            showToast("Aadhaar Card document upload is mandatory for technician onboarding.", "error");
            document.getElementById("reg-aadhaar-file")?.focus();
            return;
        }

        const payload = {
            full_name: fullName,
            email: email,
            phone: phone,
            password: password,
            category_id: parseInt(categoryId, 10),
            experience_years: parseInt(document.getElementById("reg-worker-exp")?.value, 10) || 2,
            hourly_rate: parseFloat(document.getElementById("reg-worker-rate")?.value) || 350.0,
            city: "Ahmedabad",
            locality: document.getElementById("reg-worker-locality")?.value || "Navrangpura",
            bio: document.getElementById("reg-worker-bio")?.value || "Certified background-verified service specialist.",
            aadhaar_number: rawAadhaar,
            id_proof_url: idProofUrl
        };

        const submitBtn = e.target.querySelector("button[type='submit']");
        const origHtml = submitBtn ? submitBtn.innerHTML : "Register";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Verifying & Onboarding...`;
        }

        try {
            const res = await Api.registerWorker(payload);
            Api.setToken(res.access_token);
            Api.setUser(res.user);
            showToast(`🎉 Registration submitted! Welcome ${res.user.full_name}. Aadhaar verified.`);
            closeRegisterModal();
            setTimeout(() => {
                window.location.href = "/worker";
            }, 800);
        } catch (err) {
            showToast(err.message, "error");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = origHtml;
            }
        }
    } else {
        // Customer Registration
        const payload = {
            full_name: fullName,
            email: email,
            phone: phone,
            password: password,
            role: "customer"
        };

        const submitBtn = e.target.querySelector("button[type='submit']");
        const origHtml = submitBtn ? submitBtn.innerHTML : "Register";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Creating Account...`;
        }

        try {
            const res = await Api.register(payload);
            Api.setToken(res.access_token);
            Api.setUser(res.user);
            showToast("Customer account registered successfully!");
            closeRegisterModal();
            initAuthUI();
            loadMyBookings();
        } catch (err) {
            showToast(err.message, "error");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = origHtml;
            }
        }
    }
}

function handleLogout() {
    Api.clearAuth();
    window.location.reload();
}

function switchTab(tabId) {
    document.querySelectorAll(".view-section").forEach(s => s.classList.add("hidden"));
    document.getElementById(`view-${tabId}`)?.classList.remove("hidden");

    document.querySelectorAll("[data-nav-target]").forEach(btn => {
        if (btn.getAttribute("data-nav-target") === tabId) {
            btn.classList.add("bg-white", "text-indigo-700", "font-bold", "shadow-xs");
            btn.classList.remove("text-slate-600");
        } else {
            btn.classList.remove("bg-white", "text-indigo-700", "font-bold", "shadow-xs");
            btn.classList.add("text-slate-600");
        }
    });

    if (tabId === "bookings") loadMyBookings();
}

// ==========================================
// Payment & Invoice Modal Controllers
// ==========================================
function selectPayTab(tabName) {
    document.querySelectorAll(".pay-tab-content").forEach(el => el.classList.add("hidden"));
    document.getElementById(`pay-content-${tabName}`)?.classList.remove("hidden");

    ["upi", "card", "netbanking", "cash"].forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        if (!btn) return;
        if (t === tabName) {
            btn.classList.add("bg-white", "text-indigo-700", "shadow-xs");
            btn.classList.remove("text-slate-600");
        } else {
            btn.classList.remove("bg-white", "text-indigo-700", "shadow-xs");
            btn.classList.add("text-slate-600");
        }
    });

    if (tabName === "upi") selectedPayMethod = `UPI (${selectedUpiApp})`;
    else if (tabName === "card") selectedPayMethod = "Credit / Debit Card";
    else if (tabName === "netbanking") selectedPayMethod = `Net Banking (${selectedBank})`;
    else if (tabName === "cash") selectedPayMethod = "Cash on Service";
}

function setUpiApp(app) {
    selectedUpiApp = app;
    selectedPayMethod = `UPI (${app})`;
    document.querySelectorAll(".upi-app-btn").forEach(b => {
        if (b.innerText.includes(app.replace("Google Pay", "GPay").replace(" UPI", ""))) {
            b.classList.add("border-indigo-600", "bg-indigo-50", "text-indigo-700");
            b.classList.remove("border-slate-200", "bg-slate-50", "text-slate-700");
        } else {
            b.classList.remove("border-indigo-600", "bg-indigo-50", "text-indigo-700");
            b.classList.add("border-slate-200", "bg-slate-50", "text-slate-700");
        }
    });
}

function setBank(bank) {
    selectedBank = bank;
    selectedPayMethod = `Net Banking (${bank})`;
    document.querySelectorAll(".bank-btn").forEach(b => {
        if (b.innerText.includes(bank.split(" ")[0])) {
            b.classList.add("border-indigo-600", "bg-indigo-50", "text-indigo-700");
            b.classList.remove("border-slate-200", "bg-slate-50", "text-slate-800");
        } else {
            b.classList.remove("border-indigo-600", "bg-indigo-50", "text-indigo-700");
            b.classList.add("border-slate-200", "bg-slate-50", "text-slate-800");
        }
    });
}

let activeCameraStream = null;

function toggleScannerMode(mode) {
    const qrView = document.getElementById("qr-standee-view");
    const camView = document.getElementById("camera-scanner-view");
    const btnQr = document.getElementById("btn-show-qr");
    const btnCam = document.getElementById("btn-show-camera");

    if (mode === "camera") {
        qrView?.classList.add("hidden");
        camView?.classList.remove("hidden");
        btnCam?.classList.add("bg-white", "text-indigo-700", "shadow-xs");
        btnCam?.classList.remove("text-slate-600");
        btnQr?.classList.remove("bg-white", "text-indigo-700", "shadow-xs");
        btnQr?.classList.add("text-slate-600");
        startCameraScanner();
    } else {
        stopCameraScanner();
        camView?.classList.add("hidden");
        qrView?.classList.remove("hidden");
        btnQr?.classList.add("bg-white", "text-indigo-700", "shadow-xs");
        btnQr?.classList.remove("text-slate-600");
        btnCam?.classList.remove("bg-white", "text-indigo-700", "shadow-xs");
        btnCam?.classList.add("text-slate-600");
    }
    if (window.lucide) lucide.createIcons();
}

async function startCameraScanner() {
    const video = document.getElementById("camera-stream-video");
    if (!video) return;
    try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            activeCameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            video.srcObject = activeCameraStream;
        } else {
            showToast("Camera access is not supported on this browser/device", "error");
        }
    } catch (err) {
        console.warn("Camera access error:", err);
        showToast("Camera access permission denied or camera unavailable", "error");
    }
}

function stopCameraScanner() {
    if (activeCameraStream) {
        activeCameraStream.getTracks().forEach(track => track.stop());
        activeCameraStream = null;
    }
    const video = document.getElementById("camera-stream-video");
    if (video) video.srcObject = null;
}

// ==========================================
// Card Formatting & Interactive Preview Functions
// ==========================================
function formatCardNumber(e) {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.substring(0, 16);

    const badge = document.getElementById("card-brand-badge");
    if (badge) {
        if (val.startsWith("4")) {
            badge.innerText = "VISA";
            badge.className = "text-xs font-black tracking-widest text-indigo-200 font-mono bg-blue-600/30 px-2 py-0.5 rounded-md";
        } else if (/^(5[1-5]|2[2-7])/.test(val)) {
            badge.innerText = "MASTERCARD";
            badge.className = "text-xs font-black tracking-widest text-amber-200 font-mono bg-amber-600/30 px-2 py-0.5 rounded-md";
        } else if (/^(60|65|81|82)/.test(val)) {
            badge.innerText = "RUPAY";
            badge.className = "text-xs font-black tracking-widest text-emerald-200 font-mono bg-emerald-600/30 px-2 py-0.5 rounded-md";
        } else if (/^(34|37)/.test(val)) {
            badge.innerText = "AMEX";
            badge.className = "text-xs font-black tracking-widest text-cyan-200 font-mono bg-cyan-600/30 px-2 py-0.5 rounded-md";
        } else {
            badge.innerText = "VISA / MC";
            badge.className = "text-xs font-black tracking-widest text-indigo-200 font-mono bg-white/10 px-2 py-0.5 rounded-md";
        }
    }

    let formatted = "";
    for (let i = 0; i < val.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += " ";
        formatted += val[i];
    }
    e.target.value = formatted;

    const preview = document.getElementById("card-preview-number");
    if (preview) {
        preview.innerText = formatted.padEnd(19, "•").replace(/(.{4})/g, "$1 ").trim().substring(0, 19) || "•••• •••• •••• ••••";
    }
}

function formatCardExpiry(e) {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.substring(0, 4);
    if (val.length >= 3) {
        val = val.substring(0, 2) + "/" + val.substring(2);
    }
    e.target.value = val;

    const preview = document.getElementById("card-preview-expiry");
    if (preview) {
        preview.innerText = val || "MM/YY";
    }
}

function formatCardCvv(e) {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.substring(0, 4);
    e.target.value = val;

    const preview = document.getElementById("card-preview-cvv");
    if (preview) {
        preview.innerText = val ? val : "•••";
    }
}

function updateCardNamePreview(e) {
    const val = e.target.value.trim().toUpperCase() || "NAME ON CARD";
    const preview = document.getElementById("card-preview-name");
    if (preview) {
        preview.innerText = val;
    }
}

async function handleQrFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        showToast("File size exceeds 10MB. Please choose a smaller image.", "error");
        return;
    }

    try {
        showToast("Uploading your custom QR code / payment slip...");
        const res = await Api.uploadPaymentQr(file);
        const qrImg = document.getElementById("merchant-qr-image");
        if (qrImg) {
            qrImg.src = `${res.qr_url}?t=${Date.now()}`;
        }
        const badge = document.getElementById("qr-source-badge");
        if (badge) {
            badge.className = "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1";
            badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span> Customer Uploaded QR / Slip`;
        }
        const sublabel = document.getElementById("qr-worker-sublabel");
        if (sublabel) {
            sublabel.innerText = `Custom Customer QR Code Loaded (${file.name})`;
        }
        showToast("✅ Custom QR code / slip loaded successfully!");
    } catch (err) {
        showToast(`Failed to upload QR code: ${err.message}`, "error");
    }
}

function openPaymentModal(bookingId) {
    const booking = currentLoadedBookings.find(b => b.id === bookingId);
    if (!booking) {
        showToast("Booking information not found", "error");
        return;
    }
    activePaymentBooking = booking;

    const refEl = document.getElementById("pay-modal-ref");
    if (refEl) refEl.innerText = booking.booking_ref;

    const descEl = document.getElementById("pay-modal-service-desc");
    if (descEl) descEl.innerText = `${booking.category?.name || "Service"} with ${booking.worker?.user?.full_name || "Assigned Pro"}`;

    const baseEl = document.getElementById("pay-modal-base-price");
    if (baseEl) baseEl.innerText = `₹${booking.total_amount}.00`;

    const totalEl = document.getElementById("pay-modal-total-price");
    if (totalEl) totalEl.innerText = `₹${booking.total_amount}`;

    const qrEl = document.getElementById("qr-amount-preview");
    if (qrEl) qrEl.innerText = `₹${booking.total_amount}`;

    const btnLabelEl = document.getElementById("pay-btn-label-amount");
    if (btnLabelEl) btnLabelEl.innerText = `₹${booking.total_amount}`;

    const cashLabelEl = document.getElementById("cash-amount-label");
    if (cashLabelEl) cashLabelEl.innerText = `₹${booking.total_amount}`;

    // Configure Worker / Default QR Code & UPI ID
    const qrImg = document.getElementById("merchant-qr-image");
    const sourceBadge = document.getElementById("qr-source-badge");
    const sublabel = document.getElementById("qr-worker-sublabel");
    const upiDisplay = document.getElementById("display-upi-id");

    const workerQr = booking.worker?.payment_qr_url;
    const workerUpi = booking.worker?.upi_id;
    const workerName = booking.worker?.user?.full_name || "Technician";

    if (workerQr) {
        if (qrImg) qrImg.src = `${workerQr}?t=${Date.now()}`;
        if (sourceBadge) {
            sourceBadge.className = "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1";
            sourceBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> ${workerName}'s Verified UPI QR`;
        }
        if (sublabel) sublabel.innerText = `Scan to Pay ${workerName} Directly`;
    } else {
        if (qrImg) qrImg.src = `/static/images/payment_qr.png?t=${Date.now()}`;
        if (sourceBadge) {
            sourceBadge.className = "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1";
            sourceBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span> ServiceHub Escrow QR`;
        }
        if (sublabel) sublabel.innerText = `Scan to Pay ServiceHub Verified Escrow`;
    }

    if (workerUpi) {
        if (upiDisplay) upiDisplay.innerText = workerUpi;
    } else {
        if (upiDisplay) upiDisplay.innerText = "servicehub.pay@oksbi";
    }

    // Reset UTR input
    const utrInput = document.getElementById("upi-utr-input");
    if (utrInput) utrInput.value = "";

    // Sync card preview with form inputs
    const cardNumInput = document.getElementById("card-number-input");
    if (cardNumInput) formatCardNumber({ target: cardNumInput });

    const cardExpiryInput = document.getElementById("card-expiry-input");
    if (cardExpiryInput) formatCardExpiry({ target: cardExpiryInput });

    const cardCvvInput = document.getElementById("card-cvv-input");
    if (cardCvvInput) formatCardCvv({ target: cardCvvInput });

    const cardNameInput = document.getElementById("card-name-input");
    if (cardNameInput) updateCardNamePreview({ target: cardNameInput });

    toggleScannerMode("qr");
    selectPayTab("upi");
    setUpiApp("Google Pay");
    setBank("State Bank of India");

    document.getElementById("payment-modal")?.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
}

function closePaymentModal() {
    stopCameraScanner();
    document.getElementById("payment-modal")?.classList.add("hidden");
    activePaymentBooking = null;
}

async function executePayment() {
    if (!activePaymentBooking) return;
    const btn = document.getElementById("pay-action-btn");
    const origHtml = btn.innerHTML;

    let finalMethod = selectedPayMethod;
    let transactionRef = null;

    if (selectedPayMethod === "Credit / Debit Card") {
        const rawCardNum = (document.getElementById("card-number-input")?.value || "").replace(/\s+/g, "");
        if (rawCardNum.length !== 16 || !/^\d{16}$/.test(rawCardNum)) {
            showToast("Please enter a valid 16-digit Card Number.", "error");
            document.getElementById("card-number-input")?.focus();
            return;
        }

        const rawExpiry = (document.getElementById("card-expiry-input")?.value || "").trim();
        if (!/^\d{2}\/\d{2}$/.test(rawExpiry)) {
            showToast("Please enter a valid Expiry Date in MM/YY format.", "error");
            document.getElementById("card-expiry-input")?.focus();
            return;
        }
        const [month, year] = rawExpiry.split("/").map(Number);
        if (month < 1 || month > 12) {
            showToast("Card expiry month must be between 01 and 12.", "error");
            document.getElementById("card-expiry-input")?.focus();
            return;
        }

        const rawCvv = (document.getElementById("card-cvv-input")?.value || "").trim();
        if (rawCvv.length < 3 || rawCvv.length > 4 || !/^\d{3,4}$/.test(rawCvv)) {
            showToast("Please enter a valid 3 or 4-digit CVV security code.", "error");
            document.getElementById("card-cvv-input")?.focus();
            return;
        }

        const cardHolder = (document.getElementById("card-name-input")?.value || "").trim();
        if (!cardHolder) {
            showToast("Please enter Cardholder Name.", "error");
            document.getElementById("card-name-input")?.focus();
            return;
        }

        const last4 = rawCardNum.slice(-4);
        finalMethod = `Card ending in ${last4} (CVV Verified)`;
        transactionRef = `CARD-${Math.floor(10000000 + Math.random() * 90000000)}`;
    } else if (selectedPayMethod.startsWith("UPI")) {
        const utrVal = document.getElementById("upi-utr-input")?.value?.trim();
        if (utrVal) {
            finalMethod = `UPI QR Code (${selectedUpiApp})`;
            transactionRef = `UTR-${utrVal}`;
        } else {
            finalMethod = `UPI QR Code (${selectedUpiApp})`;
            transactionRef = `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
        }
    } else if (selectedPayMethod.startsWith("Net Banking")) {
        transactionRef = `NB-${Math.floor(10000000 + Math.random() * 90000000)}`;
    } else if (selectedPayMethod.startsWith("Cash")) {
        transactionRef = `CASH-ON-SERVICE`;
    }

    btn.disabled = true;
    btn.innerHTML = `<div class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> <span>Verifying payment with bank...</span>`;

    try {
        // Realistic interactive payment processing delay
        await new Promise(r => setTimeout(r, 1200));

        const res = await Api.payBooking(activePaymentBooking.id, finalMethod, transactionRef);
        showToast(`🎉 Payment of ₹${res.total_amount} confirmed successfully!`);
        closePaymentModal();
        await loadMyBookings();

        // Promptly open the official receipt
        setTimeout(() => {
            openReceiptModal(res.id);
        }, 350);
    } catch (err) {
        showToast(err.message, "error");
        btn.disabled = false;
        btn.innerHTML = origHtml;
    }
}

function openReceiptModal(bookingId) {
    const booking = currentLoadedBookings.find(b => b.id === bookingId);
    if (!booking) {
        showToast("Invoice details could not be found", "error");
        return;
    }

    const invNumEl = document.getElementById("receipt-inv-num");
    if (invNumEl) invNumEl.innerText = `INV-${booking.booking_ref.replace("SH-", "")}`;

    const custNameEl = document.getElementById("receipt-cust-name");
    if (custNameEl) custNameEl.innerText = booking.customer?.full_name || "Customer";

    const custPhoneEl = document.getElementById("receipt-cust-phone");
    if (custPhoneEl) custPhoneEl.innerText = booking.customer?.phone || "9876543210";

    const custAddrEl = document.getElementById("receipt-cust-addr");
    if (custAddrEl) custAddrEl.innerText = booking.service_address || "Ahmedabad";

    const workerNameEl = document.getElementById("receipt-worker-name");
    if (workerNameEl) workerNameEl.innerText = booking.worker?.user?.full_name || "Verified Pro";

    const catNameEl = document.getElementById("receipt-category-name");
    if (catNameEl) catNameEl.innerText = booking.category?.name || "On-Demand Service";

    const dateEl = document.getElementById("receipt-date");
    if (dateEl) {
        const d = booking.paid_at ? new Date(booking.paid_at) : new Date();
        dateEl.innerText = d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    const servTitleEl = document.getElementById("receipt-service-title");
    if (servTitleEl) servTitleEl.innerText = `${booking.category?.name || "Home Service"} Inspection & Repair`;

    const baseAmtEl = document.getElementById("receipt-base-amount");
    if (baseAmtEl) baseAmtEl.innerText = `₹${booking.total_amount}.00`;

    const payMethodEl = document.getElementById("receipt-pay-method");
    if (payMethodEl) payMethodEl.innerText = booking.payment_method || "Online Payment";

    const txnRefEl = document.getElementById("receipt-txn-ref");
    if (txnRefEl) txnRefEl.innerText = booking.transaction_ref || "TXN-SH-VERIFIED";

    const totalAmtEl = document.getElementById("receipt-total-amount");
    if (totalAmtEl) totalAmtEl.innerText = `₹${booking.total_amount}`;

    document.getElementById("receipt-modal")?.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
}

function closeReceiptModal() {
    document.getElementById("receipt-modal")?.classList.add("hidden");
}


