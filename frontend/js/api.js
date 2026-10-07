// ServiceHub Unified API Client
const API_BASE = "";

const Api = {
    getToken() {
        return localStorage.getItem("sh_token");
    },
    setToken(token) {
        localStorage.setItem("sh_token", token);
    },
    getUser() {
        const u = localStorage.getItem("sh_user");
        return u ? JSON.parse(u) : null;
    },
    setUser(user) {
        localStorage.setItem("sh_user", JSON.stringify(user));
    },
    clearAuth() {
        localStorage.removeItem("sh_token");
        localStorage.removeItem("sh_user");
    },

    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const headers = options.headers || {};

        const token = this.getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
            headers["Content-Type"] = "application/json";
        }

        const config = {
            ...options,
            headers
        };

        try {
            const res = await fetch(url, config);
            const data = await res.json().catch(() => ({}));
            
            if (!res.ok) {
                const errorMsg = data.detail || "An unexpected error occurred";
                throw new Error(errorMsg);
            }
            return data;
        } catch (err) {
            console.error(`API Error [${endpoint}]:`, err);
            throw err;
        }
    },

    // Auth
    login(email, password) {
        return this.request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });
    },
    register(payload) {
        return this.request("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    },
    getProfile() {
        return this.request("/api/auth/me");
    },

    // Categories
    getCategories() {
        return this.request("/api/categories/");
    },
    createCategory(payload) {
        return this.request("/api/categories/", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    },

    // Workers
    searchWorkers(categoryId = null, locality = null) {
        let qs = "/api/workers/search?";
        if (categoryId) qs += `category_id=${categoryId}&`;
        if (locality) qs += `locality=${encodeURIComponent(locality)}&`;
        return this.request(qs);
    },
    getWorkerProfile(workerId) {
        return this.request(`/api/workers/profile/${workerId}`);
    },
    registerWorker(payload) {
        return this.request("/api/workers/register", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    },
    uploadKyc(formData) {
        return this.request("/api/workers/upload-id", {
            method: "POST",
            body: formData
        });
    },
    uploadAadhaar(file) {
        const formData = new FormData();
        formData.append("file", file);
        return this.request("/api/workers/upload-aadhaar-public", {
            method: "POST",
            body: formData
        });
    },
    updateWorkerProfile(payload) {
        return this.request("/api/workers/me/profile", {
            method: "PATCH",
            body: JSON.stringify(payload)
        });
    },

    // Bookings & 2-Stage OTPs
    createBooking(payload) {
        return this.request("/api/bookings/", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    },
    getMyBookings() {
        return this.request("/api/bookings/my");
    },
    getBookingDetails(bookingId) {
        return this.request(`/api/bookings/${bookingId}`);
    },
    acceptBooking(bookingId) {
        return this.request(`/api/bookings/${bookingId}/accept`, { method: "POST" });
    },
    markArrived(bookingId) {
        return this.request(`/api/bookings/${bookingId}/arrived`, { method: "POST" });
    },
    verifyStartOtp(bookingId, otpCode) {
        return this.request(`/api/bookings/${bookingId}/verify-start-otp`, {
            method: "POST",
            body: JSON.stringify({ otp_code: otpCode })
        });
    },
    requestCompletion(bookingId) {
        return this.request(`/api/bookings/${bookingId}/request-completion`, { method: "POST" });
    },
    verifyEndOtp(bookingId, otpCode) {
        return this.request(`/api/bookings/${bookingId}/verify-end-otp`, {
            method: "POST",
            body: JSON.stringify({ otp_code: otpCode })
        });
    },
    payBooking(bookingId, paymentMethod, transactionRef = null, notes = null) {
        return this.request(`/api/bookings/${bookingId}/pay`, {
            method: "POST",
            body: JSON.stringify({
                payment_method: paymentMethod,
                transaction_ref: transactionRef,
                notes: notes
            })
        });
    },
    uploadPaymentQr(file) {
        const formData = new FormData();
        formData.append("file", file);
        return this.request("/api/bookings/upload-qr", {
            method: "POST",
            body: formData
        });
    },

    // Reviews
    submitReview(bookingId, rating, reviewText) {
        return this.request("/api/reviews/", {
            method: "POST",
            body: JSON.stringify({ booking_id: bookingId, rating, review_text: reviewText })
        });
    },

    // Admin
    getAdminDashboard() {
        return this.request("/api/admin/dashboard");
    },
    getPendingWorkers() {
        return this.request("/api/admin/workers/pending");
    },
    verifyWorker(workerId, statusVerify = true) {
        return this.request(`/api/admin/workers/${workerId}/verify?status_verify=${statusVerify}`, {
            method: "PATCH"
        });
    },
    featureWorker(workerId, isFeatured = true) {
        return this.request(`/api/admin/workers/${workerId}/feature?is_featured=${isFeatured}`, {
            method: "PATCH"
        });
    }
};

// Animated Toast Notifications
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    const isError = type === "error";
    const bgClass = isError ? "bg-rose-600 text-white" : "bg-slate-900 text-white";
    const iconName = isError ? "alert-circle" : "check-circle-2";

    toast.className = `${bgClass} px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold transform transition-all duration-300 translate-y-4 opacity-0 pointer-events-auto border border-slate-700/50`;
    toast.innerHTML = `
        <i data-lucide="${iconName}" class="w-4 h-4 ${isError ? 'text-rose-200' : 'text-emerald-400'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
        toast.classList.remove("translate-y-4", "opacity-0");
        toast.classList.add("translate-y-0", "opacity-100");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("translate-y-0", "opacity-100");
        toast.classList.add("translate-y-4", "opacity-0");
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
