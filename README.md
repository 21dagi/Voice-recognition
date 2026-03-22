# 🎙️ Voice Security & Biometric Authentication

A futuristic, minimal, and highly interactive voice-based security dashboard. This application uses advanced **Web Audio API** analysis and **Hugging Face AI** to verify users based on their unique vocal signatures.

![UI Preview](https://github.com/21dagi/Voice-recognition/raw/main/public/preview_placeholder.png) *(Note: Add your actual screenshot here!)*

---

## ✨ Key Features

### 🌌 Futuristic UI/UX
- **Interactive Energy Orb:** A central, 3D-morphing sound-wave orb that reacts to your voice in real-time.
- **Elastic Motion Physics:** Smooth, organic animation systems built with **Framer Motion**.
- **Glassmorphism Design:** A dark navy / cyan aesthetic with soft blurs, vibrant glows, and a high-end feel.

### 🔐 Security & AI
- **Voice Calibration:** Register a "Master Voice" signature via file upload or live recording.
- **AI Verification:** Connects to the `mawi-6/Voice-Security-API` on Hugging Face using the `@gradio/client` to compare vocal patterns.
- **Context-Aware Authentication:** Securely stores and manages audio buffers across routes using React Context.

### 🎙️ Advanced Audio Handling
- **Real-Time Visualizer:** Direct binding between microphone amplitude (volume) and UI scale/glow.
- **MediaRecorder API:** High-quality voice capture with automatic export and playback capabilities.

---

## 🚀 Technical Stack

- **Framework:** [React 18](https://reactjs.org/) (Vite)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Integration:** [Hugging Face / Gradio Client](https://www.gradio.app/docs/client)
- **Router:** [React Router DOM](https://reactrouter.com/)

---

## 🛠️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/21dagi/Voice-recognition.git
   cd Voice-recognition/voice-security-ui
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure the AI Space**
   Update `src/services/huggingface.js` with your active Hugging Face Space URL if necessary.

4. **Run in Development Mode**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
src/
├── context/       # Global State Management (VoiceContext)
├── services/      # AI API Handlers (Hugging Face)
├── pages/         # Registration & Security Check Views
├── components/    # Reusable UI Elements
└── App.jsx        # Routing & Provider Setup
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Created with ❤️ for the next generation of digital security.*
