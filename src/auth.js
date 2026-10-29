// Authentification de démonstration : aucune base de données, un cookie indique la session ouverte.
const COOKIE = "vortex_session";
const ADMIN = { email: "admin@vortex.com", password: "admin" };
const SESSION_SECONDS = 60 * 60 * 8;

export function isAuthenticated() {
  return document.cookie.split("; ").includes(`${COOKIE}=authenticated`);
}

export function signIn(email, password) {
  if (email.trim().toLowerCase() !== ADMIN.email || password !== ADMIN.password) return false;
  document.cookie = `${COOKIE}=authenticated; path=/; max-age=${SESSION_SECONDS}; SameSite=Strict`;
  return true;
}

export function signOut() {
  document.cookie = `${COOKIE}=; path=/; max-age=0; SameSite=Strict`;
}
