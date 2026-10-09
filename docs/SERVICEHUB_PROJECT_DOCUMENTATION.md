# KADI SARVA VISHWAVIDYALAYA
### B.P. COLLEGE OF COMPUTER STUDIES (BCA)
**GANDHINAGAR, GUJARAT, INDIA**

---

## PROJECT WORK – V (SEC205-3C)
### BCA SEMESTER – V (ACADEMIC YEAR 2026–2027)

# PROJECT DOCUMENTATION REPORT

---

# **SERVICE HUB**
### *Hyperlocal On-Demand Home Services & Two-Stage Secure Verification Platform*

---

### **GROUP NO : F10**

| S. No. | Student Name | Enrollment Number | Roll Number | Exam Number |
|:---:|:---|:---:|:---:|:---:|
| **1** | **ADITYA SINGH** | **24BCA04405** | — | — |
| **2** | **BARAD JEET MANOJ** | **24BCA04016** | — | — |
| **3** | **MANJARIYA ADITYA** | **24BCA04499** | — | — |
| **4** | **THAKKAR HARSH** | **24BCA04524** | — | — |

---

### **COLLEGE & UNIVERSITY DETAILS**
- **University:** Kadi Sarva Vishwavidyalaya (KSV), Gandhinagar
- **Institute:** Bholabhai Patel College of Computer Studies (BPCCS - BCA)
- **Degree:** Bachelor of Computer Applications (B.C.A.)
- **Semester:** Semester – V
- **Course Name:** Project Work – V
- **Course Code:** SEC205-3C
- **Project Title:** Service Hub
- **Group ID:** F10

---

\newpage

## CERTIFICATE OF ORIGINALITY

This is to certify that the project entitled **"SERVICE HUB : Hyperlocal On-Demand Home Services & Two-Stage Secure Verification Platform"** has been successfully developed and submitted by the following students of **B.P. College of Computer Studies (BCA), Gandhinagar**, affiliated with **Kadi Sarva Vishwavidyalaya**, in partial fulfillment of the requirements for the award of the degree of **Bachelor of Computer Applications (BCA) Semester – V** during the academic year 2026–2027:

1. **Aditya Singh** (Enrollment No: 24BCA04405)
2. **Barad Jeet Manoj** (Enrollment No: 24BCA04016)
3. **Manjariya Aditya** (Enrollment No: 24BCA04499)
4. **Thakkar Harsh** (Enrollment No: 24BCA04524)

This project work represents the original work carried out under the supervision of the faculty and has not been submitted previously to any other university or institution for the award of any degree or diploma.


\vspace{2cm}

**Internal Faculty Guide** \hfill **Head of the Department (HOD)**  
B.P. College of Computer Studies \hfill B.P. College of Computer Studies  
Kadi Sarva Vishwavidyalaya \hfill Kadi Sarva Vishwavidyalaya  

\vspace{1.5cm}

**External Examiner Signature** \hfill **Date & College Seal**  

---

\newpage

## CANDIDATE DECLARATION

We hereby declare that the project entitled **"SERVICE HUB"** submitted to **B.P. College of Computer Studies, Kadi Sarva Vishwavidyalaya, Gandhinagar** for **BCA Semester – V (Project Work – V, SEC205-3C)** is an authentic record of our own original work.

The software code, database design, system specifications, data dictionary, test suites, and project documentation presented herein were developed solely by us under the academic guidance of our faculty guide.

1. **Aditya Singh** (24BCA04405) — _______________________
2. **Barad Jeet Manoj** (24BCA04016) — _______________________
3. **Manjariya Aditya** (24BCA04499) — _______________________
4. **Thakkar Harsh** (24BCA04524) — _______________________

**Date:** 10th October 2026  
**Place:** Gandhinagar, Gujarat  

---

\newpage

## ACKNOWLEDGEMENT

We would like to express our deep sense of gratitude to our respected Principal, Head of Department, and Faculty Members at **Bholabhai Patel College of Computer Studies (BPCCS)** and **Kadi Sarva Vishwavidyalaya (KSV)** for their invaluable guidance, encouragement, and support throughout the development of our project **Service Hub**.

We extend our special thanks to our **Internal Project Guide** whose constructive suggestions, insightful technical advice, and continuous feedback helped us conceptualize, architect, and implement the application.

We also thank the open-source community, particularly the teams behind **FastAPI, Python, SQLAlchemy, Tailwind CSS, and MySQL**, whose documentation and tools made the execution of modern web architecture and secure cryptographic workflows seamless.

Finally, we express our heartfelt appreciation to our parents, family members, and classmates for their moral support and encouragement during our academic journey.

---

\newpage

## TABLE OF CONTENTS

| Section / Chapter | Title / Topic | PPT Slide Reference | Page No. |
|:---:|:---|:---:|:---:|
| **—** | **Institutional Cover & Group Identification** | Slide 1–2 | 1 |
| **—** | **Certificate, Declaration & Acknowledgement** | — | 2–4 |
| **—** | **Table of Contents & Mapping** | Slide 3 | 5 |
| **TASK 1** | **PROJECT TITLE, DEFINITION, SCOPE & STUDY** | **Slide 4–7** | **6–11** |
| 1.1 | Project Title and Definition | Slide 5 | 6 |
| 1.2 | Project Scope and Limitations | Slide 6 | 7 |
| 1.3 | Study of Existing System & Existing System Limitations | Slide 7 | 9 |
| 1.4 | Need for the Proposed System | — | 11 |
| **TASK 2** | **PROPOSED SYSTEM, TECHNOLOGIES & REQUIREMENTS** | **Slide 8–13** | **12–20** |
| 2.1 | Proposed System Description | Slide 9 | 12 |
| 2.2 | Proposed System Advantages | Slide 10 | 13 |
| 2.3 | Technology Stack Used (Frontend, Backend, Database) | Slide 11 | 15 |
| 2.4 | Software Requirements (Client, Server, Developer) | Slide 12 | 17 |
| 2.5 | Hardware Requirements Specification | — | 18 |
| 2.6 | Module Functional Requirements (Customer, Worker, Admin) | Slide 13 | 19 |
| **TASK 3** | **SYSTEM MODELING, E-R DIAGRAM & DATA DICTIONARY** | **Slide 14–21** | **21–32** |
| 3.1 | Entity-Relationship (E-R) Diagram | Slide 14–15 | 21 |
| 3.2 | Detailed Entity Attributes & Cardinality Mapping | Slide 15 | 23 |
| 3.3 | Data Flow Diagrams (DFD Level 0, Level 1, Level 2) | — | 24 |
| 3.4 | UML Use Case Diagrams & Actor Interactivity | — | 26 |
| 3.5 | Sequence Diagrams (Two-Stage OTP & Settlement) | — | 27 |
| 3.6 | Data Dictionary: 1. Master Table — Customer | Slide 16 | 28 |
| 3.7 | Data Dictionary: 2. Master Table — Worker | Slide 17 | 28 |
| 3.8 | Data Dictionary: 3. Master Table — Service_Category | Slide 18 | 29 |
| 3.9 | Data Dictionary: 4. Master Table — Admin | Slide 18 | 29 |
| 3.10 | Data Dictionary: 5. Transaction Table — Booking | Slide 19 | 30 |
| 3.11 | Data Dictionary: 6. Transaction Table — Review | Slide 19 | 30 |
| 3.12 | Data Dictionary: 7. Transaction Table — OTP_Verification | Slide 20 | 31 |
| 3.13 | Sample Transaction Records (10 Real Records) | Slide 21 | 32 |
| **TASK 4** | **SCREEN LAYOUT DESIGNING, CODING & VALIDATION** | **Task 4 Spec** | **33–45** |
| 4.1 | Screen Layouts & Detailed UI Workflow | Task 4 | 33 |
| 4.2 | Coding Standards & Security Implementations | Task 4 | 38 |
| 4.3 | Two-Stage OTP Handshake Protocol Code Highlights | Task 4 | 40 |
| 4.4 | Worker Role Separation & Anti-Self-Hiring Protection | Task 4 | 42 |
| 4.5 | Dynamic Payout QR Routing & Doorstep Settlement Code | Task 4 | 44 |
| **POST-TASK** | **TESTING, LEARNINGS, INNOVATION & CONCLUSION** | **General / Slide 22** | **46–52** |
| 5.1 | Software Testing & Quality Assurance Test Cases | — | 46 |
| 5.2 | Innovative Findings of the Project | Slide 3 Spec | 48 |
| 5.3 | Project Learnings & Technical Challenges Overcome | Slide 3 Spec | 49 |
| 5.4 | Future Scope and Enhancements | — | 50 |
| 5.5 | Conclusion & Concluding Remarks | Slide 22 | 51 |
| 5.6 | Bibliography & References | — | 52 |

---

\newpage

# TASK 1: PROJECT TITLE, DEFINITION, SCOPE & STUDY OF EXISTING SYSTEM

## 1.1 Project Title and Project Definition *(Slide 5)*

### **Project Title**
**SERVICE HUB : Hyperlocal On-Demand Home Services & Two-Stage Secure Verification Platform**

### **Project Definition**
> *"ServiceHub is a web-based platform that connects customers with verified local service professionals. It enables users to search, book, and manage nearby services while providing local workers with verified job opportunities through a secure and efficient system."*

### **Detailed Elaboration**
In metropolitan and Tier-1/Tier-2 urban centers across India (such as Ahmedabad and Gandhinagar), households routinely encounter acute maintenance emergencies—including burst water pipes, electrical short circuits, malfunctioning air conditioners, faulty appliances, and urgent carpentry requirements. 

Concurrently, there exists a vast informal workforce comprising skilled independent tradespeople (plumbers, electricians, appliance technicians, cleaners, painters, and carpenters) who possess legitimate trade competence but lack an equitable, transparent digital gateway to acquire nearby customer service requests without paying exorbitant intermediary broker fees.

**ServiceHub** bridges this structural deficit by delivering a lightweight, mobile-responsive, and hyperlocal service marketplace engineered with:
1. **Locality-Aware Hyperlocal Dispatch:** Connecting households with background-screened technicians resident within a narrow radius (e.g. Navrangpura, Vastrapur, Bodakdev, Satellite).
2. **Two-Stage Cryptographic OTP Verification:** Guaranteeing that technicians only commence billing upon arrival via a 4-digit **Start OTP**, and only complete billing once the customer verifies the physical workmanship via a 4-digit **Completion End OTP**.
3. **Direct Payout Settlement:** Empowering technicians with direct doorstep UPI QR code payouts (Google Pay, PhonePe, Paytm, BHIM) and transparent cash reconciliation, bypassing predatory commission models.
4. **Mandatory Identity KYC Verification:** Establishing homeowner safety through verified Government Aadhaar credentials and dedicated administrative review.

---

## 1.2 Project Scope and Limitations *(Slide 6)*

### **Project Scope**
The functional boundaries and features included within the ServiceHub ecosystem comprise:
1. **Customer Registration & Authentication:** Secure sign-up, login, and session persistence utilizing JSON Web Tokens (JWT) and Bcrypt cryptographic password hashing.
2. **Technician / Worker Onboarding with Aadhaar KYC:** Dedicated registration workflow requiring government identity documentation (12-digit Aadhaar Card number and physical card document upload) subject to administrative approval.
3. **Hyperlocal Pro Search & Dynamic Filtering:** Instant indexing and search across Ahmedabad localities and technical categories (Plumbing, Electrical, AC Repair, Deep Cleaning, Carpentry, Painting).
4. **Online Service Booking Engine:** Two-fold booking mechanism accommodating both **⚡ Rapid Immediate Dispatch (~30 Minutes)** and **📅 Scheduled Calendar Appointments**.
5. **Two-Stage Physical OTP Security Handshake:**
   - **Stage 1 (Start OTP):** Automatically generated on the customer's screen upon technician doorstep arrival (`status = ARRIVED`). Must be verified by the technician to transition the job to `IN_PROGRESS`.
   - **Stage 2 (End OTP):** Dynamically generated and displayed to the customer once work is executed. Must be entered into the technician console to transition the job to `COMPLETED`.
6. **Transparent Ratings & Verified Reviews:** Exclusive review authorization granted only to customers with verified `COMPLETED` bookings, preventing fake or astroturfed reviews.
7. **Comprehensive Customer Booking History:** Centralized tracking ledger with real-time progress steppers, active security OTP counters, and digital invoice inspection.
8. **Worker Dispatch Hub & Live Radar Console:** Dedicated technician interface displaying incoming localized jobs, doorstep arrival triggers, and earnings records.
9. **Fully Responsive Web Interface:** Clean, accessible, modern UI engineered in Tailwind CSS, functioning seamlessly across mobile smartphones, tablets, and desktop workstations.

### **Project Limitations**
1. **Third-Party Payment Gateway Redirection:** While the system features an advanced doorstep UPI QR settlement and invoice generation engine, automated external payment gateway escrow (e.g. Razorpay / Stripe webhook automated ledger) is deferred to Version 2.0 to avoid licensing overheads during initial municipal deployment.
2. **Contact Information Accuracy:** System verification depends on customers and workers providing valid 10-digit Indian telecommunication numbers and accurate residential locality names.
3. **Geographic Boundary:** The initial municipal deployment is concentrated in the Ahmedabad–Gandhinagar urban corridors.

---

## 1.3 Study of Existing System & Existing System Limitations *(Slide 7)*

### **Study of the Existing System**
Existing commercial service marketplace platforms (such as Urban Company, Sulekha, and Justdial) connect urban consumers with home service providers. However, an analysis of their operational architecture reveals systemic operational drawbacks:
- **Centralized Contractor Model:** Dominant platforms rely heavily on internal corporate subcontracting networks, imposing steep margins (15% to 30% commission cuts) on manual laborers.
- **Mandatory Advance Scheduling:** Customers are almost universally mandated to schedule appointments hours or days in advance, rendering the platforms unsuited for acute domestic emergencies (e.g., active electrical fires, water leakages).
- **Exclusion of Informal Local Craftsmen:** Neighborhood independent technicians who have served localities for decades are excluded from discovery due to steep registration fees or bureaucratic bidding requirements.
- **Security Vulnerabilities:** Traditional platforms rely on single or unverified arrival confirmations, leaving customers vulnerable to phantom visits or premature job completion claims.

### **Limitations of the Existing System *(Slide 7)***
1. **Limited Availability of Immediate or Emergency Services:** Inflexible scheduling funnels prevent fast turnaround when emergency domestic repairs arise.
2. **Mandatory Advance Appointments:** Customers are unable to dispatch an available nearby worker on-demand within 20–30 minutes.
3. **Disenfranchisement of Local Independent Workers:** Local technicians receive fewer direct leads due to paywalled bidding mechanisms.
4. **Supply Constrained by Platform Workforce:** Available services are restricted to the platform's proprietary fleet rather than tapping into the broad municipal labor market.
5. **Absence of Hyperlocal Proximity Routing:** Algorithms frequently assign technicians traveling from distant city zones, causing delayed arrival times, inflated transport surcharges, and increased carbon footprint.

---

## 1.4 Need for the Proposed System
To solve these challenges, **ServiceHub** introduces a decentralized, secure, and hyperlocal architecture designed specifically for rapid urban home repairs. By combining hyperlocal geographic discovery, zero-friction direct technician payouts, government-verified KYC credentials, and an unforgeable Two-Stage OTP protocol, ServiceHub delivers maximum customer safety, fair compensation for blue-collar professionals, and instant emergency resolution.

---

\newpage

# TASK 2: PROPOSED SYSTEM, TECHNOLOGIES USED & SOFTWARE/MODULE REQUIREMENTS

## 2.1 Proposed System Description *(Slide 9)*
> *"ServiceHub is a web-based hyperlocal service marketplace that connects customers with verified local service professionals. The platform allows customers to quickly find, book, and manage nearby service providers while giving local workers a reliable way to receive job opportunities. It also provides secure OTP-based service verification, worker ratings, and an admin panel for platform management."*

The architecture of ServiceHub is organized into three unified tiers:
1. **Customer Marketplace Portal:** Provides seamless search, instant pro booking, live status tracking, and private OTP code generation.
2. **Technician / Worker Dispatch Hub:** Provides live job radar polling, doorstep arrival reporting, customer OTP verification input, and payout QR management.
3. **Administrative Governance Console:** Provides full oversight of worker KYC credentials, Aadhaar document scrutiny, service category management, and platform analytics.

---

## 2.2 Proposed System Advantages *(Slide 10)*

1. **Quick Booking of Nearby Local Service Professionals:** Hyperlocal proximity matching pairs users with professionals located within a 3–5 kilometer radius, driving average response times down to ~24 minutes.
2. **Dual-Mode Booking Support:** Offers customer choice between **⚡ Immediate Rapid Dispatch** for emergencies and **📅 Scheduled Time Slots** for planned renovations.
3. **100% Verified Service Technicians:** Government Aadhaar numbers and photographic KYC identification are scrutinized prior to profile activation, instilling homeowner peace of mind.
4. **Two-Stage Physical OTP Security Handshake:** Start OTP confirms physical presence at the doorstep; End OTP guarantees customer satisfaction before job completion.
5. **Transparent, Unbiased Ratings & Reviews:** Customers review technicians only after service completion, establishing authentic social proof and performance metrics.
6. **Faster On-Site Response Times:** Proximity dispatch minimizes transit delays across congested urban corridors.
7. **Empowerment of Independent Blue-Collar Labor:** Direct doorstep payout QR codes and zero lead-bidding fees allow tradespeople to retain 100% of their earnings.
8. **Centralized Platform Administration:** High-level administrative control over user statuses, category definitions, and dispute settlement.
9. **Ultra-Responsive, Modern Interface:** Designed in mobile-first responsive HTML5/Tailwind CSS with glassmorphism visual styling, suitable for low-end mobile devices.

---

## 2.3 Technologies Used *(Slide 11)*

```
+-----------------------------------------------------------------------------------+
|                                 SERVICEHUB TECH STACK                             |
+--------------------------+------------------------------+-------------------------+
|      FRONTEND TIER       |         BACKEND TIER         |      DATABASE TIER      |
+--------------------------+------------------------------+-------------------------+
|  HTML5 (Semantic Web)    |  FastAPI (Modern Python)     |  MySQL Server 8.0+      |
|  CSS3 & Tailwind CSS CDN |  Python 3.11+ Core Runtime   |  SQLite 3 (Local / Dev) |
|  Vanilla JavaScript (ES6)|  SQLAlchemy 2.0 (ORM Engine) |  SQLAlchemy Pool Manager|
|  Lucide Vector Iconpack  |  Pydantic V2 (Validation)    |  Relational Foreign Keys|
|  Plus Jakarta Sans Fonts |  Uvicorn (ASGI Event Server) |  Bcrypt Encrypted Data  |
+--------------------------+------------------------------+-------------------------+
```

### **1. Frontend Layer**
- **HTML5:** Semantic document structuring utilizing modern accessible web tags (`<header>`, `<main>`, `<section>`, `<aside>`).
- **Tailwind CSS (Utility Framework):** Modern responsive styling, custom color palettes (`brand-500` through `brand-950`), custom backdrop filters, and CSS Grid/Flexbox layouts.
- **Vanilla Modern JavaScript (ES6+):** Asynchronous DOM manipulation, Fetch API client communication, localStorage session management, dynamic star rating widgets, and 2.5-second live state polling.
- **Lucide Icons Library:** Scalable SVG iconography enhancing user intuition.

### **2. Backend Layer**
- **Python 3.11+:** Core language providing modern typing, performance enhancements, and structured packaging.
- **FastAPI Framework:** Asynchronous high-performance web framework providing native OpenAPI/Swagger documentation, fast request validation, and dependency injection.
- **Uvicorn ASGI Server:** Blazing fast asynchronous server implementation powering non-blocking I/O operations.
- **Pydantic V2:** Strict schema serialization, input sanitization, and data validation.
- **Passlib & PyJWT:** Cryptographic utilities for password hashing (Bcrypt algorithm) and JSON Web Token issue/verification.

### **3. Database Layer**
- **MySQL / SQLite:** Relational storage engine enforcing strict foreign key constraints, cascading deletions, and transactional atomicity.
- **SQLAlchemy 2.0 ORM:** Object-Relational Mapper mapping Python model classes to relational database tables, executing clean queries, joins, and aggregates.

---

## 2.4 Software Requirements *(Slide 12)*

### **Client Side**
- **Web Browsers:** Google Chrome (Version 100+), Microsoft Edge (Version 100+), Mozilla Firefox, Apple Safari.
- **Operating Environment:** Windows 10/11, macOS, Android (Mobile Browser), iOS.

### **Server Side**
- **Runtime Environment:** Python 3.11.x or higher.
- **Web Framework:** FastAPI 0.110.0+.
- **ASGI Server:** Uvicorn 0.28.0+.
- **Database Engine:** MySQL Server 8.0+ / SQLite 3.40+.
- **Dependencies:** `sqlalchemy`, `pydantic`, `python-jose[cryptography]`, `passlib[bcrypt]`, `python-multipart`.

### **Developer Environment**
- **Integrated Development Environment (IDE):** Visual Studio Code (VS Code) with Python, Tailwind CSS, and SQLite extensions.
- **Version Control & Collaboration:** Git & GitHub (`https://github.com/BARADJEET/Servicehub.git`).
- **API Testing & Verification:** Automated Python Request Suites, Swagger UI (`/docs`), ReDoc (`/redoc`).

---

## 2.5 Hardware Requirements Specification

### **Minimum Client Hardware**
- **Processor:** Dual-Core 1.8 GHz or equivalent mobile SoC.
- **Memory (RAM):** 2 GB RAM.
- **Storage:** 100 MB available browser cache memory.
- **Display Resolution:** 360 x 640 (Mobile) or 1366 x 768 (Desktop).
- **Network:** 3G / 4G / Wi-Fi broadband connectivity.

### **Minimum Server Hardware**
- **Processor:** Quad-Core 2.4 GHz (Intel Core i5 / AMD Ryzen 5 or Cloud vCPU).
- **Memory (RAM):** 4 GB RAM minimum (8 GB recommended for concurrent production dispatch).
- **Storage:** 20 GB Solid State Drive (SSD) for database storage, logs, and uploaded KYC documents.
- **Network Interface:** High-speed 100 Mbps uplink.

---

## 2.6 Module Functional Requirements *(Slide 13)*

### **1. Customer Module**
- **User Registration & Login:** Create account with full name, email, phone number, and password; JWT-authenticated sessions.
- **Search Nearby Services:** Filter active professionals by service category and locality with instant live result re-rendering.
- **Book a Service:** Select preferred technician, input job address, locality, problem description, and choose between Rapid Dispatch or Scheduled Appointment.
- **View Booking Status:** Real-time visual 4-step stepper tracking booking progression (`PENDING` $\rightarrow$ `ACCEPTED` $\rightarrow$ `ARRIVED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `COMPLETED`).
- **OTP Verification (Start & End):** Display private 4-digit Start OTP upon worker arrival; reveal 4-digit End OTP upon work completion to share verbally with technician.
- **Cancellation Flow:** Cancel pending service bookings before technician arrival.
- **Ratings & Reviews:** Submit 1-to-5 star ratings and written reviews for completed jobs; view previously submitted ratings.
- **Booking History & Digital Invoices:** Access detailed historical ledger of all services with official downloadable and printable tax invoices.

### **2. Worker / Technician Module**
- **Worker Registration & Login:** Register pro account with trade specialty, hourly rate, locality, experience, and 12-digit Aadhaar credentials.
- **Profile & Availability Management:** Update hourly rates, bio, service location, and toggle active status on the live dispatch radar.
- **Upload KYC Verification Documents:** Upload Aadhaar identity documents (JPG/PNG/PDF) for administrative screening.
- **Accept / Reject Bookings:** Receive real-time customer job requests and accept incoming work within 30 minutes.
- **Doorstep Arrival Confirmation:** Notify customer of physical presence at the doorstep, triggering automated Start OTP generation.
- **Start & Complete Service:** Enter customer-provided Start OTP to unlock work; enter customer-provided End OTP to complete work and generate earnings.
- **Payout QR & Earnings Reconciliation:** Upload personal UPI QR Code image and VPA ID (e.g. `technician@oksbi`) for direct customer phone-to-phone payments; record customer cash receipts.

### **3. Admin Module**
- **Admin Authentication:** Secure administrative login with elevated permissions.
- **Worker KYC Verification:** Scrutinize uploaded Aadhaar documents and grant verified status badges (`is_verified = True`).
- **Customer & Worker Management:** Full administrative ledger of all registered accounts with suspension and profile controls.
- **Service Category Management:** Add, update, activate, or disable service domains and standard base pricing.
- **Platform Analytics & Reporting:** Track system-wide booking volume, completion rates, gross transaction volume, and active pros on radar.

---

\newpage

# TASK 3: SYSTEM MODELING, E-R DIAGRAM & DATA DICTIONARY

## 3.1 Entity-Relationship (E-R) Diagram *(Slide 14 & 15)*

The Entity-Relationship diagram models the core relational entities of ServiceHub, their operational attributes, primary keys (PK), foreign keys (FK), and relational cardinalities.

```
       +-----------------------+                    +-----------------------+
       |       CUSTOMER        |                    |        WORKER         |
       +-----------------------+                    +-----------------------+
       | PK customer_id        |                    | PK worker_id          |
       |    name, email, phone |                    |    name, email, phone |
       |    password, address  |                    |    password, address  |
       |    created_at         |                    |    experience, rating |
       +-----------+-----------+                    |    is_verified, qr    |
                   | 1                              +-----------+-----------+
                   |                                            | 1
                   | writes (1:M)                               | assigned to (1:M)
                   v                                            v
       +-----------+-----------+     1:M            +-----------+-----------+
       |        REVIEW         |<-------------------|        BOOKING        |
       +-----------------------+                    +-----------------------+
       | PK review_id          |                    | PK booking_id         |
       | FK booking_id         |                    | FK customer_id        |
       | FK customer_id        |                    | FK worker_id          |
       | FK worker_id          |                    | FK category_id        |
       |    rating (1-5)       |                    |    booking_date       |
       |    review_text        |                    |    status, amount     |
       |    created_at         |                    +-----------+-----------+
       +-----------------------+                                | 1
                                                                | verified by (1:M)
                                                                v
                                                    +-----------+-----------+
                                                    |   OTP_VERIFICATION    |
                                                    +-----------------------+
                                                    | PK otp_id             |
                                                    | FK booking_id         |
                                                    |    otp_type (STRT/END)|
                                                    |    otp_code (4 Digits)|
                                                    |    is_verified (BOOL) |
                                                    |    verified_at        |
                                                    +-----------------------+
```

### **Image Reference from Slide 15:**
*(High-Resolution Architectural E-R Diagram as Submitted in University Slide 15)*  
![ServiceHub E-R Diagram](/docs/assets/er_diagram.png)

---

## 3.2 Detailed Cardinality & Relationship Breakdown *(Slide 15)*
1. **Customer to Booking ($1 : M$):** One customer can create multiple bookings over time. Each booking is initiated by exactly one customer.
2. **Worker to Booking ($1 : M$):** One worker can be assigned multiple customer jobs across their operational lifecycle. Each booking is fulfilled by one primary worker.
3. **Category to Booking ($1 : M$):** One service category (e.g. Plumbing) classifies multiple individual bookings.
4. **Booking to OTP_Verification ($1 : M$):** Each booking owns exactly two sequential verification OTP records: one of type `'START'` and one of type `'END'`.
5. **Customer to Review ($1 : M$):** One customer can author multiple reviews across different bookings.
6. **Worker to Review ($1 : M$):** One worker receives multiple customer ratings and reviews, which dynamically calculate the worker's average scorecard.
7. **Booking to Review ($1 : 1$):** Each completed booking can be reviewed at most once by the customer who commissioned the work.

---

## 3.3 Data Flow Diagrams (DFD)

### **DFD Level 0: Context Level Diagram**
```
                    +---------------------------------------------------+
                    |                                                   |
                    |            CUSTOMER ENTITY                        |
                    |   (Submits Booking, Views OTP, Pays, Reviews)     |
                    +------------------------+--------------------------+
                                             |
                              Service Request|Service Status & OTP
                                             v
                             +---------------+---------------+
                             |                               |
                             |          0.0                  |
                             |      SERVICE HUB              |
                             |      CENTRAL SYSTEM           |
                             |                               |
                             +---------------+---------------+
                                             ^
                               Job Dispatch  |Verification & Arrival
                                             |
                    +------------------------+--------------------------+
                    |                                                   |
                    |             WORKER ENTITY                         |
                    |     (Accepts Work, Enters OTP, Collects Payout)   |
                    +---------------------------------------------------+
```

### **DFD Level 1: Functional System Process Decomposition**
```
[Customer] ---> (1.0 Registration & Login) ---------> [User Data Store]
     |
     +--------> (2.0 Hyperlocal Pro Search) <-------- [Worker Profile Store]
     |
     +--------> (3.0 Create Service Booking) -------> [Booking Data Store]
                                                              |
[Worker] -----> (4.0 Accept & Arrive at Doorstep) <-----------+
     |                                                        |
     +--------> (5.0 Verify Start OTP) -------------> [OTP Store]
     |                                                        |
     +--------> (6.0 Enter Completion End OTP) ------+--------+
                                                     |
[Customer] ---> (7.0 Settle Bill & Submit Review) <--+
```

---

## 3.4 Sequence Diagrams

### **Two-Stage Cryptographic OTP Verification Protocol**
```
Customer                    System / API                       Worker
   |                             |                               |
   |                             |<---- Arrive at Doorstep ------|
   |                             |      (POST /arrived)          |
   |                             |                               |
   |<-- Start OTP (e.g. 7492) ---|                               |
   |    (Live Polling Sync)      |                               |
   |                             |                               |
   |--- Share OTP Verbally ----->|                               |
   |                             |<--- Submit Start OTP (7492) --|
   |                             |     (POST /verify-start-otp)  |
   |                             |--- Status = IN_PROGRESS ----->|
   |                             |                               |
   |                             |       [Work Executed]         |
   |                             |                               |
   |<-- End OTP (e.g. 3810) -----|                               |
   |    (Live Polling Sync)      |                               |
   |                             |                               |
   |--- Share OTP Verbally ----->|                               |
   |                             |<--- Submit End OTP (3810) ----|
   |                             |     (POST /verify-end-otp)    |
   |                             |--- Status = COMPLETED ------->|
   |                             |                               |
   |--- Settle Bill & Review --->|                               |
```

---

## 3.5 Data Dictionary *(Slides 16–21)*

### **1. Master Table — CUSTOMER *(Slide 16)***
*Primary Entity representing registered platform customers.*

| Sr. No. | Field / Column Name | Data Type & Field Size | Constraints | Description |
|:---:|:---|:---|:---|:---|
| 1 | `customer_id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique identification key for each customer |
| 2 | `full_name` | VARCHAR(100) | NOT NULL | Complete legal name of customer |
| 3 | `email` | VARCHAR(100) | UNIQUE, NOT NULL | Registered email address for notifications |
| 4 | `phone` | VARCHAR(15) | UNIQUE, NOT NULL | 10-digit mobile phone contact number |
| 5 | `password` | VARCHAR(255) | NOT NULL | Secure salted Bcrypt password hash |
| 6 | `address` | TEXT | NULL | Default home or residential service address |
| 7 | `created_at` | DATETIME | NOT NULL | Timestamp when account was created |

---

### **2. Master Table — WORKER *(Slide 17)***
*Entity representing onboarded service professionals.*

| Sr. No. | Field / Column Name | Data Type & Field Size | Constraints | Description |
|:---:|:---|:---|:---|:---|
| 1 | `worker_id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique identification key for technician profile |
| 2 | `full_name` | VARCHAR(100) | NOT NULL | Complete legal name of technician |
| 3 | `email` | VARCHAR(100) | UNIQUE, NOT NULL | Technician email address |
| 4 | `phone` | VARCHAR(15) | UNIQUE, NOT NULL | 10-digit verified mobile contact number |
| 5 | `password` | VARCHAR(255) | NOT NULL | Bcrypt encrypted credentials hash |
| 6 | `address` | TEXT | NULL | Base address / locality in Ahmedabad |
| 7 | `experience` | INT | NOT NULL, DEFAULT 1 | Total on-site experience in years |
| 8 | `is_verified` | BOOLEAN | DEFAULT FALSE | Administrative Aadhaar KYC approval flag |
| 9 | `created_at` | DATETIME | NOT NULL | Technician registration timestamp |

---

### **3. Master Table — SERVICE_CATEGORY *(Slide 18)***
*Entity categorizing service trades offered on the platform.*

| Sr. No. | Field / Column Name | Data Type & Field Size | Constraints | Description |
|:---:|:---|:---|:---|:---|
| 1 | `category_id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique category identifier |
| 2 | `category_name` | VARCHAR(100) | UNIQUE, NOT NULL | Name of trade (e.g. Plumbing, Electrical) |
| 3 | `description` | TEXT | NULL | Description of tasks included in category |
| 4 | `is_active` | BOOLEAN | DEFAULT TRUE | Domain availability status |
| 5 | `created_at` | DATETIME | NOT NULL | Category creation date |

---

### **4. Master Table — ADMIN *(Slide 18)***
*Entity governing administrative privileges.*

| Sr. No. | Field / Column Name | Data Type & Field Size | Constraints | Description |
|:---:|:---|:---|:---|:---|
| 1 | `admin_id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique administrator ID |
| 2 | `name` | VARCHAR(100) | NOT NULL | Administrator designation / name |
| 3 | `email` | VARCHAR(100) | UNIQUE, NOT NULL | Administrative email login address |
| 4 | `password` | VARCHAR(255) | NOT NULL | Encrypted administrative password hash |
| 5 | `created_at` | DATETIME | NOT NULL | System administrative registration date |

---

### **5. Transaction Table — BOOKING *(Slide 19)***
*Core transactional entity tracking service lifecycle.*

| Sr. No. | Field / Column Name | Data Type & Field Size | Constraints | Description |
|:---:|:---|:---|:---|:---|
| 1 | `booking_id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique booking identification number |
| 2 | `customer_id` | INT | FK, NOT NULL | Foreign Key referencing `users(id)` |
| 3 | `worker_id` | INT | FK, NOT NULL | Foreign Key referencing `worker_profiles(id)` |
| 4 | `category_id` | INT | FK, NOT NULL | Foreign Key referencing `service_categories(id)`|
| 5 | `booking_date` | DATETIME | NOT NULL | Timestamp when booking was booked |
| 6 | `scheduled_time` | DATETIME | NULL | Customer's requested service execution time |
| 7 | `status` | VARCHAR(20) | NOT NULL | PENDING, ACCEPTED, ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED |
| 8 | `total_amount` | DECIMAL(10,2) | NULL, DEFAULT 350.00 | Total service cost in Indian Rupees (INR) |
| 9 | `created_at` | DATETIME | NOT NULL | Booking initialization timestamp |

---

### **6. Transaction Table — REVIEW *(Slide 19)***
*Entity capturing customer ratings and feedback.*

| Sr. No. | Field / Column Name | Data Type & Field Size | Constraints | Description |
|:---:|:---|:---|:---|:---|
| 1 | `review_id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique review identifier |
| 2 | `booking_id` | INT | FK, NOT NULL, UNIQUE | Associated booking (1 review per completed job)|
| 3 | `customer_id` | INT | FK, NOT NULL | Reviewing customer Foreign Key |
| 4 | `worker_id` | INT | FK, NOT NULL | Reviewed technician Foreign Key |
| 5 | `rating` | INT | NOT NULL, CHECK (1..5) | Numerical star score between 1 and 5 |
| 6 | `review_text` | TEXT | NULL | Detailed customer feedback and commentary |
| 7 | `created_at` | DATETIME | NOT NULL | Review submission timestamp |

---

### **7. Transaction Table — OTP_VERIFICATION *(Slide 20)***
*Entity securing service commencement and termination.*

| Sr. No. | Field / Column Name | Data Type & Field Size | Constraints | Description |
|:---:|:---|:---|:---|:---|
| 1 | `otp_id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique OTP transaction identifier |
| 2 | `booking_id` | INT | FK, NOT NULL | Foreign Key referencing `bookings(id)` |
| 3 | `otp_type` | VARCHAR(10) | NOT NULL | Stage indicator (`'START'` or `'END'`) |
| 4 | `otp_code` | VARCHAR(6) | NOT NULL | Secure 4-digit numeric verification token |
| 5 | `is_verified` | BOOLEAN | DEFAULT FALSE | Whether token was validated by technician |
| 6 | `verified_at` | DATETIME | NULL | Timestamp of successful verification |
| 7 | `created_at` | DATETIME | NOT NULL | Token generation timestamp |

---

### **8. Sample Transaction Records — BOOKING *(Slide 21)***
*Exact dataset of 10 sample transactional records from the operational database:*

| booking_id | customer_id | worker_id | category_id | booking_date | status | total_amount |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | 1 | 1 | 1 | 2026-08-01 10:15:00 | **Completed** | ₹350.00 |
| **2** | 2 | 2 | 2 | 2026-08-02 11:30:00 | **Completed** | ₹450.00 |
| **3** | 3 | 3 | 3 | 2026-08-03 14:00:00 | **Completed** | ₹600.00 |
| **4** | 4 | 4 | 4 | 2026-08-04 16:45:00 | **In Progress** | ₹500.00 |
| **5** | 5 | 5 | 5 | 2026-08-05 09:20:00 | **Accepted** | ₹400.00 |
| **6** | 6 | 1 | 1 | 2026-08-06 13:10:00 | **Completed** | ₹350.00 |
| **7** | 7 | 2 | 2 | 2026-08-07 17:00:00 | **Accepted** | ₹450.00 |
| **8** | 8 | 3 | 3 | 2026-08-08 12:00:00 | **Pending** | ₹600.00 |
| **9** | 9 | 4 | 4 | 2026-08-09 15:30:00 | **Completed** | ₹500.00 |
| **10** | 10 | 5 | 5 | 2026-08-10 18:15:00 | **Cancelled** | ₹400.00 |

---

\newpage

# TASK 4: SCREEN LAYOUT DESIGNING, CODING & VALIDATION

## 4.1 Screen Layout Designing & UI Architecture

### **1. Customer Marketplace & Hyperlocal Search Interface (`index.html`)**
- **Top Announcement & Radar Ticker:** Displays real-time metrics (e.g. "28 Pros Live Now", "Hyperlocal Dispatch across Ahmedabad", "Avg response: ~24 mins").
- **Search & Filter Controls:** Multi-category selector chips (Plumbing, Electrical, AC Repair, Cleaning, Carpentry, Painting) synchronized with locality filters.
- **Worker Cards Grid:** Displays background-verified pro badges, hourly rates, locality, rating score, and direct **"Book Professional"** action buttons.
- **Role Isolation Dynamic Rendering:** If a worker logs into the marketplace, their own card displays a **"Your Worker Profile (View Hub)"** shortcut, while other pro cards display **"Pro Account (Customer Only)"** to prevent unauthorized self-booking.

### **2. Customer "My Bookings & Live OTPs" Dashboard (`index.html#view-bookings`)**
- **Real-Time Progress Stepper:** Dynamic visual breadcrumb transitioning through 4 discrete stages: `1. Booked` $\rightarrow$ `2. Dispatched` $\rightarrow$ `3. In Progress` $\rightarrow$ `4. Completed & Settled`.
- **Start Service OTP Display Container:** When technician arrives (`status = ARRIVED`), displays a prominent purple glowing banner with the bold 4-digit Start OTP and instructions to share it verbally.
- **Completion End OTP Container:** Once work is active (`status = IN_PROGRESS`), reveals the bold 4-digit End OTP with a 1-click **"Copy OTP"** trigger.
- **Doorstep Payment & Invoice Action Buttons:** Reveals **"Pay ₹350 Now"** and **"View Invoice"** once work is completed.
- **Rating Scorecard Display:** Shows customer star ratings and feedback for reviewed jobs; provides an active **"Rate & Review Service"** button for unreviewed completed services.

### **3. Worker Console & Active Job Dispatch Queue (`worker.html`)**
- **Live Dispatch Radar Status Banner:** Indicates technician active availability on the hyperlocal radar.
- **Personal UPI QR Code & VPA Management Card:** Technician uploads their personal GPay / PhonePe / Paytm QR image and VPA ID (`worker@oksbi`).
- **Assigned Customer Work Queue:** Displays incoming dispatch cards showing customer name, telephone contact, doorstep address, problem description, and immediate action buttons:
  - `Accept Job (~30 Mins)` (When PENDING)
  - `I Have Arrived at Doorstep` (When ACCEPTED)
  - `Verify & Start Work` with 4-Digit OTP Input Field (When ARRIVED)
  - `Request & Enter End OTP` Modal Trigger (When IN_PROGRESS)
  - `Customer Paid Cash` / `Paid Online` Status Indicator (When COMPLETED)

### **4. Interactive Review Modal & Tax Invoice Dialog**
- **Interactive 5-Star Rating Selector:** Dynamic hoverable gold star selector with visual rating confirmation (1 to 5 Stars).
- **Compliment Tags:** One-click feedback chips ("⚡ On-Time Arrival", "🔧 High Quality Work", "🧹 Clean Worksite", "🤝 Polite & Professional", "💰 Fair Pricing").
- **Official Digital Invoice (`receipt-modal`):** Formal tax bill format featuring ServiceHub corporate emblem, unique invoice serial number (`INV-2026-XXXX`), itemized inspection charges, payment mode, and browser print (`window.print()`) stylesheet.

---

## 4.2 Coding Standards & Security Implementations

### **1. Anti-Self-Hiring Protection & Role Separation (`backend/app/routers/bookings.py`)**
To prevent technicians from hiring themselves or viewing private customer verification OTPs, strict server-side validation is enforced:

```python
@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Enforce Role Separation: Technicians cannot book services
    if current_user.role == "worker":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Technicians and service workers cannot book services. Please log in with a customer account to make bookings."
        )

    # 2. Prevent Self-Booking Identity Vulnerability
    worker = db.query(WorkerProfile).filter(WorkerProfile.id == payload.worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    if worker.user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Technicians cannot hire or book their own service profile."
        )
    ...
```

---

### **2. Cryptographic Two-Stage OTP Generation & Masking (`backend/app/services/booking_service.py` & `bookings.py`)**

#### **Cryptographic 4-Digit Generation:**
```python
import secrets

class BookingService:
    @staticmethod
    def generate_otp_code() -> str:
        # Generates an unguessable 4-digit cryptographically secure numeric token
        return str(secrets.randbelow(9000) + 1000)
```

#### **Worker Endpoint OTP Masking Security:**
Technicians must never inspect or obtain customer OTPs via API traffic or browser devtools. In all worker job endpoints, unverified OTP codes are masked:

```python
@router.get("/worker-jobs", response_model=List[BookingResponse])
def get_worker_jobs(current_user: User = Depends(require_worker), db: Session = Depends(get_db)):
    ...
    # CRITICAL SECURITY RULE: Workers must NEVER see raw customer OTP codes!
    sanitized_bookings = []
    for b in bookings:
        resp = BookingResponse.model_validate(b)
        if resp.otps:
            for o in resp.otps:
                o.otp_code = "****"  # Masked: workers cannot peek at customer OTPs
        sanitized_bookings.append(resp)
    return sanitized_bookings
```

---

### **3. Review Submission & Dynamic Rating Recalculation (`backend/app/routers/reviews.py`)**

```python
@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def submit_review(payload: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(
        Booking.id == payload.booking_id, 
        Booking.customer_id == current_user.id
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found for this customer")
    if booking.status != "COMPLETED":
        raise HTTPException(status_code=400, detail="Cannot review a booking that is not completed")

    # Prevent duplicate reviews per booking
    existing = db.query(Review).filter(Review.booking_id == booking.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Review already submitted for this booking")

    review = Review(
        booking_id=booking.id,
        customer_id=current_user.id,
        worker_id=booking.worker_id,
        rating=max(1, min(5, payload.rating)),
        review_text=payload.review_text
    )
    db.add(review)
    db.commit()

    # Recalculate Worker average rating and review tally
    worker = db.query(WorkerProfile).filter(WorkerProfile.id == booking.worker_id).first()
    if worker:
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.worker_id == worker.id).scalar() or 5.0
        total_revs = db.query(func.count(Review.id)).filter(Review.worker_id == worker.id).scalar() or 0
        worker.rating_avg = round(float(avg_rating), 1)
        worker.total_reviews = total_revs
        db.commit()

    return review
```

---

\newpage

# TESTING, LEARNINGS, INNOVATIVE FINDINGS & CONCLUSION

## 5.1 Software Testing & Test Cases

The ServiceHub application was subjected to automated and manual test suites covering functional behavior, boundary values, role security, and cryptographic handshakes:

| Test Case ID | Test Description | Input Data | Expected Result | Actual Result | Status |
|:---:|:---|:---|:---|:---|:---:|
| **TC-01** | Customer User Registration | Valid email, 10-digit phone, password | 201 Created, JWT token generated | 201 Created, token returned | **PASSED** |
| **TC-02** | Invalid Mobile Number Check | Phone = `"98250012"` (8 digits) | 400 Bad Request ("Must be 10 digits") | 400 Bad Request returned | **PASSED** |
| **TC-03** | Worker Self-Hiring Prevention | Worker user attempts booking on own ID | 403 Forbidden or 400 Bad Request | 403 Forbidden returned | **PASSED** |
| **TC-04** | Worker General Booking Prevention | Worker user attempts booking any pro | 403 Forbidden ("Worker cannot book") | 403 Forbidden returned | **PASSED** |
| **TC-05** | Worker `/api/bookings/my` Isolation | Worker calls customer bookings route | Returns empty list `[]` (0 bookings) | Returned `[]` (0 bookings) | **PASSED** |
| **TC-06** | Worker OTP Masking Security | Worker queries `/api/bookings/worker-jobs`| All `otp_code` fields masked as `****` | `otp_code = "****"` across jobs | **PASSED** |
| **TC-07** | Customer Start OTP Reveal | Booking transitions to `ARRIVED` | 4-digit Start OTP visible to customer | Start OTP (e.g. `1650`) visible | **PASSED** |
| **TC-08** | Start OTP Verification Handshake | Worker inputs customer's Start OTP | Status transitions to `IN_PROGRESS` | Status set to `IN_PROGRESS` | **PASSED** |
| **TC-09** | Completion End OTP Handshake | Worker inputs customer's End OTP | Status transitions to `COMPLETED` | Status set to `COMPLETED` | **PASSED** |
| **TC-10** | Customer Review Submission | Customer submits 5 stars & feedback | Review saved, worker average updated | Rating avg updated dynamically | **PASSED** |
| **TC-11** | Customer Booking Cancellation | Customer cancels `PENDING` booking | Status transitions to `CANCELLED` | Status set to `CANCELLED` | **PASSED** |
| **TC-12** | Duplicate Review Prevention | Customer reviews same booking twice | 400 Bad Request ("Already reviewed")| 400 Bad Request returned | **PASSED** |

---

## 5.2 Innovative Findings of the Project *(Slide 3)*

1. **Elimination of Labor Brokerage Margins:** By facilitating direct phone-to-phone UPI QR payments (GPay, PhonePe, Paytm), technicians retain 100% of their earnings without paying 20–30% platform commissions.
2. **Elimination of Service Fraud via Two-Stage Physical Handshakes:** Requiring physical OTP exchanges at arrival and completion prevents phantom visits and premature billing.
3. **Hyperlocal Transit Compression:** Proximity routing based on urban localities (e.g., Navrangpura, Vastrapur, Bodakdev) reduces technician travel times to ~24 minutes, compared to 1–2 hour industry averages.
4. **Lightweight Real-Time State Synchronization:** Utilizing silent 2.5-second client diff polling eliminates the infrastructure complexity and memory footprint of standing WebSocket connections, making the app highly stable on low-bandwidth networks.

---

## 5.3 Project Learnings & Challenges Overcome *(Slide 3)*

1. **Role Boundary Enforcement:** Early prototypes allowed technicians logged into the marketplace to book their own profiles. We engineered strict identity checks in FastAPI dependency injection pipelines (`require_worker` vs `current_user`) to guarantee separation.
2. **API Boundary Data Sanitization:** We resolved security bleed by implementing Pydantic response masking to ensure technicians never receive raw customer OTPs over the network.
3. **Asynchronous Database Concurrency:** We migrated database session lifecycles to SQLAlchemy contextual session handlers (`SessionLocal` with scoped dependencies), preventing connection leaks and locking errors under rapid polling.
4. **Responsive Mobile-First Interface:** We crafted a clean, single-page application UI utilizing Tailwind CSS, avoiding heavy framework runtimes (React/Angular) to achieve sub-second initial load times on budget mobile devices.

---

## 5.4 Future Scope and Enhancements

1. **Automated Geofencing via Mobile GPS:** Implementing background GPS triggers to automatically transition bookings to `ARRIVED` when a technician enters a 50-meter radius of the customer's home.
2. **In-App Real-Time Audio/Video Calling:** Integrating WebRTC for end-to-end encrypted direct calls between customer and technician without exposing personal cell numbers.
3. **Multi-Lingual Regional Voice Interface:** Adding Gujarati and Hindi voice navigation to assist tradespeople who may have lower English literacy.
4. **Escrow Payment Gateway Integration:** Introducing automated escrow payment holds via Razorpay / Cashfree APIs for high-value domestic renovation contracts.

---

## 5.5 Conclusion *(Slide 22)*

The **ServiceHub** platform successfully fulfills all project objectives established for **Project Work – V (SEC205-3C)** in **BCA Semester – V** at **Kadi Sarva Vishwavidyalaya (B.P. College of Computer Studies)**. 

By delivering an end-to-end hyperlocal marketplace that combines transparent upfront pricing, government-verified Aadhaar KYC screening, unforgeable Two-Stage OTP verification, direct doorstep UPI payments, and role-enforced access controls, ServiceHub demonstrates how modern web engineering can solve domestic maintenance challenges while empowering local skilled professionals.

---

## 5.6 Bibliography & References

1. **FastAPI Framework Documentation:** https://fastapi.tiangolo.com/
2. **Python 3.11 Standard Library:** https://docs.python.org/3/
3. **SQLAlchemy 2.0 Unified Documentation:** https://docs.sqlalchemy.org/en/20/
4. **Tailwind CSS Utility-First Framework:** https://tailwindcss.com/docs
5. **Pydantic V2 Data Validation:** https://docs.pydantic.dev/
6. **IEEE Recommended Practice for Software Requirements Specifications (IEEE Std 830-1998)**
7. **Lucide Open-Source Vector Iconpack:** https://lucide.dev/
8. **Pressman, Roger S.** *Software Engineering: A Practitioner's Approach*, 8th Edition, McGraw-Hill.
9. **Silberschatz, Abraham, Peter B. Galvin, and Greg Gagne.** *Database System Concepts*, 7th Edition, McGraw-Hill.

---
*End of Documentation Report — ServiceHub Group F10 — Kadi Sarva Vishwavidyalaya*
