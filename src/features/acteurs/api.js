import axios from "axios";

// Backend FastAPI : routes du module « Gestion des acteurs et des organisations ».
const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? "http://localhost:8000"}/api/acteurs`,
  timeout: 20000,
  // filter=a&filter=b plutôt que filter[]=a
  paramsSerializer: { indexes: null },
});

const data = (response) => response.data;

export function errorMessage(error) {
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).join(" · ");
  if (error.code === "ECONNABORTED") return "Le serveur met trop de temps à répondre.";
  if (!error.response) return "Backend injoignable : lancez FastAPI sur le port 8000.";
  return `Erreur ${error.response.status}`;
}

export const api = {
  schema: () => http.get("/schema").then(data),
  stats: () => http.get("/stats").then(data),
  list: (collection, params, signal) => http.get(`/${collection}`, { params, signal }).then(data),
  get: (collection, id) => http.get(`/${collection}/${id}`).then((response) => response.data.data[0]),
  relations: (collection, id) => http.get(`/${collection}/${id}/relations`).then(data),
  lookup: (cls, q = "", limit = 200) => http.get("/lookup", { params: { cls, q, limit } }).then(data),
  create: (collection, body) => http.post(`/${collection}`, body).then(data),
  update: (collection, id, body) => http.patch(`/${collection}/${id}`, body).then(data),
  remove: (collection, id) => http.delete(`/${collection}/${id}`).then(data),
  nlp: (prompt, execute) => http.post("/nlp", { prompt, execute }).then(data),
};
