# 🧑‍🏫 Online Coding Platform

**Tom’s Classroom** is a real-time collaborative coding platform built for live mentor–student sessions.  
It allows mentors to create code exercises, view students’ progress in real-time, and provide step-by-step hints to help them solve coding challenges.


Live URL:
👉 https://online-coding-platform-adik.vercel.app
---

## 🌟 Overview
This platform simulates a classroom environment for coding mentorship.  
Each exercise (called a *Code Block*) includes:
- 💡 **Hints** revealed progressively by the student.
- 🧩 **A code editor** for real-time collaboration.
- 👥 **Live socket communication** for sync between mentor & student.
- ✅ **Automatic “solved” feedback** when a correct solution is submitted.

---

## 🛠️ Tech Stack

### 🖥️ Client (Frontend)
- React (with Vite)
- Socket.io-client
- Monaco Editor
- Custom CSS (with responsive grid layout)
- Deployed on **Vercel**

### ⚙️ Server (Backend)
- Node.js + Express.js
- Socket.io
- MongoDB with Mongoose
- Deployed on **Render**

---

## 🗂️ Project Structure

* **online-coding-platform/**
    * **client/** (Frontend: React + Vite)
        * **src/**
            * **components/**
                * EditorWrapper.jsx
                * ErrorState.jsx
                * HintsPanel.jsx
                * LoadingState.jsx
                * Modal.jsx
                * RoomHeader.jsx
            * **pages/**
                * **CodeBlock/**
                    * CodeBlock.jsx
                    * CodeBlock.css
                * **Lobby/**
                    * Lobby.jsx
                    * Lobby.css
            * **styles/**
                * theme.css
            * **utils/**
                * editorConfig.js
            * App.jsx
            * main.jsx
        * index.html
        * vite.config.js
        * vercel.json
        * package.json
    * **server/** (Backend: Node + Express + Socket.io)
        * **src/**
            * **config/**
                * db.js
            * **controllers/**
                * codeBlock.controller.js
            * **middleware/**
                * error.js
            * **models/**
                * CodeBlock.js
            * **routes/**
                * codeBlock.routes.js
            * **seed/**
                * seed.js
            * **services/**
                * roomState.js
            * **sockets/**
                * registerSocket.js
            * app.js
            * index.js
        * .env
        * package.json


---

🌐 **Deployment**  
🔹 **Client (Vercel)**  
🔹 **Server (Render)**  

---

💡 **Possible Improvements:**  
💬 Add live chat between mentor and student.  
📈 Display real-time analytics (e.g., average completion time).  
🧠 AI-generated hints based on student mistakes.  
💾 Export code and solutions as files.  

---

🚀 **Future Feature Ideas:**  
🎥 Mentor screen share (integrate with WebRTC or similar).  
📚 User authentication (Google/GitHub login).  
🏆 Leaderboard system for gamified learning.  
🪄 Dark/light themes toggle.  
🧩 Custom exercises dashboard for mentors.  
🕓 Session recording and playback for reviews.  

---

📝 **Notes:**
- The app uses **Socket.io** for all real-time updates — this enables smooth code sync.  
- Hints are dynamically fetched from **MongoDB (via Mongoose)**.  
- The code editor uses **Monaco Editor**, the same engine behind VS Code.  
- Each **CodeBlock** instance corresponds to a database document.  
- **Mentor sessions are read-only**, while students can edit and submit code.  

---

👩‍💻 **Adi Kapuri**  
📧 adikap1904@gmail.com



