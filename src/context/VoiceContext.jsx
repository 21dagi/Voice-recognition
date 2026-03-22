import { createContext, useContext, useState } from "react";

const VoiceContext = createContext(null);

export function VoiceProvider({ children }) {
  const [masterAudioBlob, setMasterAudioBlob] = useState(null);

  return (
    <VoiceContext.Provider value={{ masterAudioBlob, setMasterAudioBlob }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoiceContext() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoiceContext must be used within a VoiceProvider");
  }
  return context;
}
