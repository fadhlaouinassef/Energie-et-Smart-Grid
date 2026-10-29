import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 60000,
});

export async function sendNetworkPrompt(prompt, signal) {
  const { data } = await api.post("/api/nlp", { prompt, execute: true }, { signal });
  return data;
}

export function getRequestError(error) {
  if (error.code === "ECONNABORTED") {
    return "Le délai de réponse est dépassé. Vérifiez le résultat côté serveur avant de renvoyer une modification.";
  }
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(" · ") || "La demande est invalide.";
  }
  if (!error.response) {
    return "Le backend Python est inaccessible. Vérifiez qu’il est démarré et que son adresse est correcte.";
  }
  return "La demande n’a pas pu être traitée. Réessayez dans quelques instants.";
}
