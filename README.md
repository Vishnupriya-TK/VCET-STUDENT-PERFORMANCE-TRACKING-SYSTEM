
# 🎓 Student Performance Tracking System

A full-stack academic management platform designed for Velammal College of Engineering and Technology (VCET) to streamline student academic tracking, mentor monitoring, and class performance analytics.

Built using React + Vite for the frontend and Node.js + Express + MongoDB for the backend.

---

# 🔗 Live Demo

🚀 **Live Site:** [Visit Here](https://drive.google.com/file/d/1cZ0_Mq6qB6380akk8LKw0z8hQaYS_vwv/view?usp=drive_link)

---

# 📌 Complete Working Flow

## 🔐 1. Authentication & Role-Based Access

* Users log in using secure credentials.
* JWT token is generated and stored.
* System verifies role:

  * 👩‍🎓 Student
  * 👩‍🏫 Class In-Charge
* Based on role, dashboard access is granted.

---

## 👩‍🎓 2. Student Portal Flow

### Step 1: Login

Student logs in and is redirected to **Student Dashboard**.

### Step 2: Dashboard Overview

Student can view:

* Semester-wise marks
* GPA & CGPA (automatically calculated)
* Academic performance charts

### Step 3: Profile Management

Student can edit:

* Email
* Coding platform links
* Project links
* Project descriptions
* Domain of interest

### Step 4: GPA/CGPA Calculation

Whenever marks are updated:

```
GPA = Σ (Credit × Grade Point) / Σ Credits
CGPA = Average of Semester GPAs
```

System dynamically recalculates and updates dashboard.

---

## 👩‍🏫 3. Class In-Charge Portal Flow

### Step 1: Login

Class In-Charge logs in and accesses **Class Dashboard**.

### Step 2: Class Overview

Displays:

* Total students
* Average class GPA
* Semester performance comparison
* Performance trends

### Step 3: Excel Marks Upload

* Upload semester marks via Excel file.
* Backend processes Excel using XLSX.
* Marks stored in MongoDB.
* GPA/CGPA auto-calculated for each student.

### Step 4: Student Insights

Class In-Charge can:

* View detailed student profiles
* Analyze mentor-wise performance
* Compare semester-wise results
* Track subject-wise academic performance

---

## 📊 4. Analytics & Visualization

* Class performance graphs
* Mentor-wise analytics
* Semester comparisons
* GPA distribution charts

---

# 📂 Complete Project Structure

```
Student-Performance-Tracking-System/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       │   ├── logo.png
│       │   ├── react.svg
│       │   └── vcet.jpeg
│       │
│       ├── components/
│       │   ├── AnimatedBackground.jsx
│       │   ├── DashboardLayout.jsx
│       │   └── LoginCard.jsx
│       │
│       ├── contexts/
│       │   └── AuthContext.jsx
│       │
│       ├── pages/
│       │   ├── ClassInchargeDashboard/
│       │   │   ├── AcademicPerformance.jsx
│       │   │   ├── Header.jsx
│       │   │   ├── Home.jsx
│       │   │   ├── Layout.jsx
│       │   │   ├── MentorAnalysis.jsx
│       │   │   ├── SemesterCourses.jsx
│       │   │   ├── SemesterMarks.jsx
│       │   │   ├── SemesterMarksCourseData.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   ├── StudentDetails.jsx
│       │   │   ├── StudentList.jsx
│       │   │   ├── index.jsx
│       │   │   └── routes.jsx
│       │
│       │   ├── StudentDashboard/
│       │   │   ├── AcademicPerformance.jsx
│       │   │   ├── GPACalculator.jsx
│       │   │   ├── Header.jsx
│       │   │   ├── Layout.jsx
│       │   │   ├── Notifications.jsx
│       │   │   ├── PersonalInfo.jsx
│       │   │   ├── Portfolio.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   └── index.jsx
│       │
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Student.js
│   │   ├── ClassIncharge.js
│   │   ├── Semester.js
│   │   └── Marks.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── classRoutes.js
│   │   └── marksRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   └── gpaCalculator.js
│   ├── server.js
│   └── .env
│
└── README.md
```

---

# 🛠 Tech Stack

### Frontend

* React (Vite)
* Context API
* Axios
* Tailwind / CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* XLSX for Excel processing

---

# 🚀 Deployment Setup (Render)

### Backend

Start Command:

```
npm start
```

### Frontend

Build Command:

```
npm run build
```

Publish Directory:

```
dist
```

---

# 📊 Core Functional Capabilities

✔ Secure authentication
✔ Role-based dashboards
✔ Excel-based semester marks upload
✔ Automated GPA/CGPA calculation
✔ Mentor-wise & semester-wise analytics
✔ Academic performance visualization
✔ Dynamic profile management

---

# 👩‍💻 Team Members
1️⃣ **Vishnu Priya T K**

**Role:** Full Stack Developer


2️⃣ **Jeevajothi M**

**Role:** Frontend Developer


3️⃣**Devis Aruna Devi D**

**Role:** Frontend Developer



---

**© 2026 | Department of Computer Science & Engineering**


Velammal College of Engineering and Technology

