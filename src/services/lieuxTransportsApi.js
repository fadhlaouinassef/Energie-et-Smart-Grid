/**
 * Service Lieux & Transports.
 * Reprend la même instance axios que networkApi et expose des fonctions
 * CRUD orientées REST + le point NLP partagé.
 */
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 60000,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getPlacesError(error) {
  if (error.code === "ECONNABORTED") {
    return "Le délai de réponse est dépassé. Vérifiez le serveur avant de renvoyer la demande.";
  }
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(" · ") || "La demande est invalide.";
  }
  if (!error.response) {
    return "Le backend Python est inaccessible. Vérifiez qu'il est démarré.";
  }
  return "La demande n'a pas pu être traitée. Réessayez dans quelques instants.";
}

// ─── NLP ────────────────────────────────────────────────────────────────────

/**
 * Envoie une requête en langage naturel au moteur NLP.
 * Le backend la traduit en SPARQL, l'exécute sur Fuseki et renvoie les résultats.
 * @param {string} prompt  Texte de l'utilisateur (ex. "Affiche les lieux à Tunis")
 * @param {AbortSignal} signal  Signal d'annulation pour fetch / axios
 */
export async function sendPlacesTransportPrompt(prompt, signal) {
  const { data } = await api.post("/api/nlp", { prompt, execute: true }, { signal });
  return data;
}

// ─── LIEUX ──────────────────────────────────────────────────────────────────

/**
 * Liste les lieux (collection SPARQL racine : Lieu).
 * @param {{ type?, search?, limit?, offset? }} params
 */
export async function getLieux(params = {}) {
  const { data } = await api.get("/api/lieux", { params });
  return data;
}

/**
 * Récupère un lieu par son identifiant local RDF.
 * @param {string} id  Identifiant local (ex. "maison_el_menzah_11428")
 */
export async function getLieu(id) {
  const { data } = await api.get(`/api/lieux/${id}`);
  return data;
}

/**
 * Crée un nouveau lieu.
 * @param {{ id: string, type: string, label?: string, properties?: object }} body
 */
export async function createLieu(body) {
  const { data } = await api.post("/api/lieux", body);
  return data;
}

/**
 * Modifie les propriétés d'un lieu existant.
 * @param {string} id
 * @param {{ label?: string, properties?: object }} body
 */
export async function updateLieu(id, body) {
  const { data } = await api.patch(`/api/lieux/${id}`, body);
  return data;
}

/**
 * Supprime un lieu et toutes ses relations entrantes.
 * @param {string} id
 */
export async function deleteLieu(id) {
  const { data } = await api.delete(`/api/lieux/${id}`);
  return data;
}

// ─── TRANSPORTS ─────────────────────────────────────────────────────────────

/**
 * Liste les transports (collection SPARQL racine : Transport).
 * @param {{ type?, search?, limit?, offset? }} params
 */
export async function getTransports(params = {}) {
  const { data } = await api.get("/api/transports", { params });
  return data;
}

/**
 * Récupère un transport par son identifiant local RDF.
 * @param {string} id
 */
export async function getTransport(id) {
  const { data } = await api.get(`/api/transports/${id}`);
  return data;
}

/**
 * Crée un nouveau transport.
 * @param {{ id: string, type: string, label?: string, properties?: object }} body
 */
export async function createTransport(body) {
  const { data } = await api.post("/api/transports", body);
  return data;
}

/**
 * Modifie un transport existant.
 * @param {string} id
 * @param {{ label?: string, properties?: object }} body
 */
export async function updateTransport(id, body) {
  const { data } = await api.patch(`/api/transports/${id}`, body);
  return data;
}

/**
 * Supprime un transport et toutes ses relations entrantes.
 * @param {string} id
 */
export async function deleteTransport(id) {
  const { data } = await api.delete(`/api/transports/${id}`);
  return data;
}
