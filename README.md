# ServiceHub — Hyperlocal On-Demand Service Marketplace

A modern, fast, and verified hyperlocal service marketplace web platform connecting customers with skilled local professionals (plumbers, electricians, AC mechanics, carpenters, cleaners, and painters) protected by a **Two-Stage OTP Verification System** (*Start OTP + End OTP*).

---

## 🌟 Key Differentiators & Features

1. **Two-Stage OTP Verification System:**
   - **Start OTP:** Technician arrives at doorstep ➔ Customer reveals 4-digit Start OTP ➔ Technician inputs OTP to unlock `IN_PROGRESS` status.
   - **End OTP:** Work completed ➔ Customer inspects quality ➔ Reveals 4-digit End OTP ➔ Technician inputs OTP to mark `COMPLETED` and unlock earnings.
   - Solves disputes, eliminates fake check-ins, and guarantees work accountability.

2. **Post-Service Customer Payment & Invoicing:**
   - Once the service is verified and completed via End OTP, the customer receives an interactive **Payment Due** banner on their booking card.
   - Supports multiple payment channels:
     - **UPI & Dynamic QR Code:** Instant scan & pay or 1-click launch with Google Pay, PhonePe, Paytm, BHIM.
     - **Debit & Credit Cards:** Secure 256-bit encrypted card settlement.
     - **Net Banking:** Popular Indian banking gateways (SBI, HDFC, ICICI, Axis, Kotak, PNB).
     - **Cash on Service (COD):** Hand cash directly to the technician with technician on-spot confirmation.
   - Generates official, printable **ServiceHub Tax Invoices** with unique transaction IDs and itemized breakdowns.

3. **Three-Sided Role Architecture:**
   - **Customer Portal (`/`)**: Real-time nearby search by locality, instant (~30 mins) or scheduled booking, live status tracker with OTPs, post-service checkout, tax invoice generator, and star reviews.
   - **Worker Console (`/worker`)**: Availability toggle, incoming job dispatch radar, arrival trigger, on-site OTP verification console, and cash receipt logger.
   - **Admin Governance Portal (`/admin`)**: Worker KYC verification desk (Approve/Reject), service category & base price manager, and revenue KPI analytics with Paid vs Pending volume metrics.

4. **Modern UI/UX Design System:**
   - Google Font **Plus Jakarta Sans**, glassmorphism cards, micro-animations, and Lucide icons.

---

## 🚀 Quick Start Guide

### 1. Run with Python
```bash
cd servicehub
python run.py
```

### 2. Open in Your Browser
- **🧑‍💼 Customer Marketplace:** [http://localhost:8000/](http://localhost:8000/)
- **🔧 Worker Console:** [http://localhost:8000/worker](http://localhost:8000/worker)
- **🛡️ Admin Governance:** [http://localhost:8000/admin](http://localhost:8000/admin)
- **📚 Interactive API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔑 Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `rahul@gmail.com` | `Rahul@123` |
| **Plumber** | `ramesh.plumber@servicehub.com` | `Worker@123` |
| **Electrician** | `mukesh.electrician@servicehub.com` | `Worker@123` |
| **Admin** | `admin@servicehub.com` | `Admin@123` |
"# Servicehub" 
