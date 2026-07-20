# 🏫 Smart Campus School Management System (SaaS)

A comprehensive, Multi-Tenant SaaS platform designed to digitize and streamline school administration, academic management, and daily campus operations. Built with a strict Role-Based Access Control (RBAC) architecture, it allows a Super Admin to host and manage multiple school instances (tenants) from a single centralized cloud database.

## 🔗 Live Links
- **Frontend (Live Demo):** [Smart Campus Portal](https://smart-campus-school-management-syst.vercel.app/)
- **Backend (API Base URL):** [Smart Campus API](https://smart-campus-school-management-system-1.onrender.com/)

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS (or your preferred styling library)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Cloud Database)
- **Deployment:** Vercel (Frontend), Render (Backend)

## 🚀 Key Features
- **Multi-Tenant Architecture:** Single database, multiple isolated school environments.
- **Centralized Campus Registry:** Super Admin can deploy new campuses instantly.
- **Real-Time Data Sync:** Live metrics synchronized across administrative dashboards.
- **Role-Based Access Control (RBAC):** Distinct command centers and specific data access scopes tailored to every role.
- **Secure Authentication:** Encrypted passwords and secure session management.

## 🔐 System Hierarchy & Permissions Flow

### 1. Super Admin (Platform Owner)
- **Scope:** Complete SaaS Platform.
- **Access:** Creates new school profiles (Tenant IDs). Generates the initial Director account. Can view all active campuses but cannot manipulate internal school data.

### 2. Director (School Owner/Management)
- **Scope:** Specific Tenant ID.
- **Access:** Supreme authority within their school. Onboards the core leadership team (Principal, Accountant, Receptionist). Monitors total revenue, staff count, and macro-level growth.

### 3. Principal (Academic Head)
- **Scope:** Academic & Operational flow.
- **Access:** Onboards Faculty, Students, Guards, and Peons. Manages class sections, academic sessions, approves exam schedules, monitors overall attendance, and issues global notices.

### 4. Admin & Finance Staff
- **Accountant:** Handles fee collections, generates receipts, manages staff payroll, and tracks daily expenses.
- **Receptionist:** Manages the front desk, visitor logs, and initial student admission inquiries.

### 5. Execution Staff
- **Faculty:** Dedicated dashboard for daily student attendance, uploading exam marks, assigning homework, and managing class sections.
- **Guard:** Logs gate entry/exit for visitors, manages fleet logs, and verifies gate passes.
- **Peon:** Receives and views internal daily tasks assigned by the Principal or Admin desk.

### 6. End Users
- **Parents/Guardians & Students:** Secure, read-only login to monitor performance, view real-time attendance, track pending fee dues, download report cards, and read school notices.

## 🔑 Demo Credentials
To test the complete workflow, use the following credentials. 
*(Note: Staff default password is `123`)*

| Role | Tenant ID | Email | Password |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `SUPER` | super@gmail.com | 123456 |
| **Director** | `TEST-01` | dir@test.edu | Test@123 |
| **Principal** | `TEST-01` | piyush@school.edu | 123 |
| **Accountant** | `TEST-01` | saurabh@school.edu | 123 |
| **Receptionist** | `TEST-01` | chotu@school.edu | 123 |
| **Faculty** | `TEST-01` | shivam@school.edu | 123 |

## 👨‍💻 Author
**Himanshu Tripathi**  
*B.Tech AI and DS*
