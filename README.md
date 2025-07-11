# 📸 One Look Photography – MEAN Stack Project

Welcome to the official repository for **One Look Photography's** internal web application, built with the **MEAN Stack** (MongoDB, Express.js, Angular, Node.js). This project is designed for managing client enquiries, event details, team assignment, and invoice tracking for a photography/media company.
## 📁 Project Structure
MeanStack/
├── frontend/ → Angular 17 client app
├── backend/ → Node.js + Express + MongoDB API
├── README.md → You're here!
└── .gitignore


---

## 🚀 Features

### 🖥️ Frontend (Angular)
- Built using Angular 19 + PrimeNG
- Enquiry form with validation and glassmorphism UI
- Admin dashboard to manage enquiries
- Real-time isRead tracking and call status updates
- Invoice sharing, PDF download, status filters
- Responsive UI with modern components

### 🌐 Backend (Node.js + MongoDB)
- RESTful API with Express
- Enquiry CRUD operations
- OLPID auto-generation (`001OLP2025` format)
- Call status & isRead tracking
- Timestamping with createdAt, updatedAt
- Event update logic with nested subdocs

---

## 🛠️ Tech Stack

| Layer        | Tech                     |
| ------------ | ------------------------ |
| Frontend     | Angular 19, PrimeNG      |
| Backend      | Node.js, Express.js      |
| Database     | MongoDB + Mongoose       |
| Tools        | Git, GitHub, Postman     |
| PDF Export   | jsPDF + autoTable        |

---

## 📦 Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/M-Sai-Charan/MeanStack.git
cd MeanStack
cd backend                   cd frontend
npm install                  npm install


