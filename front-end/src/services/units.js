const API = import.meta.env.VITE_API_URL;

export async function fetchUnits() {
  const response = await fetch(`${API}/recipes/units/`, { credentials: "include" });
  if (!response.ok) throw new Error("Erreur lors du chargement des unités");
  return response.json();
}
