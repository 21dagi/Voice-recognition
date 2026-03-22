import { Client } from "@gradio/client";

export async function verifyVoice(masterBlob, attemptBlob) {
  try {
    console.log("🚀 SENDING PAYLOAD TO GRADIO API:");
    console.log("- Master Signature Blob:", masterBlob);
    console.log("- Attempt Verification Blob:", attemptBlob);

    const client = await Client.connect("mawi-6/Voice-Security-API");
    const result = await client.predict("/check_voice", {
      master_key_path: masterBlob,
      attempt_path: attemptBlob,
    });

    console.log("✅ RECEIVED RESPONSE FROM GRADIO API:", result);
    return result.data[0]; // Returns the text string
  } catch (error) {
    console.error("❌ Error communicating with Hugging Face API:", error);
    throw error;
  }
}
