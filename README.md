# 🎙️ Voice Security & Biometric Authentication

A professional, minimal, and futuristic voice-based security application. This project enables secure registration and authentication using unique vocal signatures, integrated with AI models via Hugging Face.

---

## 🚀 Quick Start

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/21dagi/Voice-recognition.git
cd Voice-recognition/voice-security-ui
npm install
```

### Running the App
Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✨ Key Features

- **Biometric Calibration:** Register a master voice signature through a sleek, interactive UI.
- **AI Verification:** Real-time identity matching powered by the `mawi-6/Voice-Security-API` on Hugging Face.
- **Dynamic Visuals:** High-performance sound-reactive animations using **Framer Motion** and **Web Audio API**.
- **Futuristic Aesthetic:** Clean, minimal "Digital Safe" design with glassmorphism and cyan glow accents.

---

## 🛠️ Technical Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **AI Integration:** @gradio/client (Hugging Face)
- **Icons:** Lucide React
- **State Management:** React Context

---

## 📂 Project Structure

- `src/pages/RegistrationPage.jsx`: Master voice signature setup.
- `src/pages/LoginPage.jsx`: Real-time voice authentication and verification.
- `src/services/huggingface.js`: API service layer for model interaction.
- `src/context/VoiceContext.jsx`: Global state for cross-page audio data.

---

## 📝 Usage

1. **Register:** Go to `/register` and hold the microphone button to record your master signature.
2. **Authenticate:** Go to `/login` and hold the microphone button. The system will compare your current voice with the registered signature.
3. **Analyze:** Watch the real-time frequency analysis and wait for the AI verification result.

---
*Developed for secure, AI-driven authentication systems.*
