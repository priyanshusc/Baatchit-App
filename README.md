# 🗣️ Baatchit - Real-Time Secure Chat Application

<img width="1365" height="767" alt="Screenshot 2025-09-16 184045" src="https://github.com/user-attachments/assets/cbb87478-84e2-4f19-b352-bb0d585de596" />

*(Replace the link above with your actual screenshot or GIF after uploading)*

**Baatchit** is a robust, full-stack real-time messaging application built using the **MERN Stack** (MongoDB, Express, React, Node.js) and **Socket.io**.

It goes beyond basic messaging by implementing **end-to-end security** practices, including **email verification**, **message encryption**, and granular message control (Delete for Everyone).

---

## 🚀 Key Features

### 🔐 **Security & Authentication**
- **Email Verification:** Users must verify their email via a magic link (powered by **Nodemailer**) before logging in.
- **Secure Sessions:** **JWT (JSON Web Tokens)** authentication with HTTP-only cookies.
- **Password Hashing:** Industry-standard **Bcrypt** hashing for user passwords.
- **Message Encryption:** Messages are encrypted before being stored in the database to ensure privacy.

### ⚡ **Real-Time Communication**
- **Instant Messaging:** Zero-latency chat powered by **Socket.io**.
- **Live Status:** Real-time **Online/Offline** indicators for all users.
- **Unread Counters:** Live unread message badges that update instantly.
- **Typing Indicators:** Real-time feedback when a user is typing (if implemented).

### 🛠️ **Advanced Functionality**
- **Message Controls:** Options to **"Delete for Me"** or **"Delete for Everyone"** (syncs across all clients).
- **Forwarding:** Easily forward messages to other users.
- **Profile Management:** Fully customizable profiles (Avatar, Bio, Details).
- **Theme Support:** Native **Dark Mode** and Light Mode toggling.

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, React Router DOM |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Real-Time** | Socket.io (Client & Server) |
| **Security** | BcryptJS, JWT, Crypto (Node module) |
| **Utilities** | Nodemailer (Email), React Hot Toast (Notifications) |

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

## 1. Clone the Repository
```bash
git clone [https://github.com/your-username/baatchit-app.git](https://github.com/your-username/baatchit-app.git)
cd baatchit-app
```
## 2. Backend Setup
```bash
cd Backend
npm install
```
### Create a .env file in the Backend directory and add the following:
```bash
PORT=5000
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development

# Email Configuration (for verification)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
FRONTEND_URL=http://localhost:5173

# Message Encryption Keys (Must be 32 chars and 16 chars respectively)
ENCRYPTION_KEY=abcdefghijklmnopqrstuvwxyz123456
ENCRYPTION_IV=1234567890abcdef
```
## Start the server
```bash
npm start
```
## 3. Frontend Setup
```bash
cd Frontend
npm install
```
### Create a .env file in the Frontend directory:
```bash
VITE_API_URL=http://localhost:5000
```
### Run the React App:
```bash
npm run dev
```

### 📄 License
Distributed under the MIT License. See LICENSE for more information.

## 👨‍💻 Author
Priyanshu Singh Chauhan
Linkedin: https://www.linkedin.com/in/priyanshusinghchauhan/
