const API_BASE = "";

const Auth = {
  getToken() { return localStorage.getItem("sh_token"); },
  getUser() {
    const raw = localStorage.getItem("sh_user");
    return raw ? JSON.parse(raw) : null;
  },
  setSession(token, user) {
    localStorage.setItem("sh_token", token);
    localStorage.setItem("sh_user", JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem("sh_token");
    localStorage.removeItem("sh_user");
  },
  isLoggedIn() { return !!this.getToken(); },
};

async function api(path, { method = "GET", body = null, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && Auth.getToken()) {
    headers["Authorization"] = `Bearer ${Auth.getToken()}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch (e) { /* no body */ }

  if (!res.ok) {
    const message = (data && data.detail) ? data.detail : `Request failed (${res.status})`;
    if (res.status === 401) {
      Auth.clear();
    }
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }
  return data;
}

function toast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) { alert(message); return; }
  const colors = {
    success: "bg-emerald-500",
    error: "bg-rose-500",
    info: "bg-indigo-600",
    warn: "bg-amber-500",
  };
  const el = document.createElement("div");
  el.className = `toast ${colors[type] || colors.info} text-white px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold flex items-center gap-2 max-w-sm`;
  const icon = { success: "check-circle", error: "alert-circle", info: "info", warn: "alert-triangle" }[type] || "info";
  el.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 shrink-0"></i><span>${message}</span>`;
  container.appendChild(el);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => el.remove(), 3000);
}

function refreshIcons() {
  if (window.lucide) lucide.createIcons();
}

function fmtMoney(n) {
  return `\u20b9${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function fmtDate(iso) {
  if (!iso) return "Instant (~30 min)";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function initials(name) {
  return (name || "?").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

const ICON_MAP = {
  wrench: "wrench", zap: "zap", snowflake: "snowflake", sparkles: "sparkles",
  hammer: "hammer", "paint-roller": "paint-bucket",
};
function iconFor(name) { return ICON_MAP[name] || "wrench"; }

function avatarColor(seed) {
  const colors = ["#4f46e5", "#4338ca", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed"];
  let hash = 0;
  for (const ch of (seed || "x")) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
