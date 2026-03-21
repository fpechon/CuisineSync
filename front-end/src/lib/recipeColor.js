const CARD_COLORS = [
  "#C4451A", // paprika
  "#8B5E3C", // caramel chaud
  "#2D6A4F", // olive
  "#A33815", // paprika foncé
  "#5C7A3E", // sauge
  "#6B4E2A", // brun épicé
];

export function getRecipeColor(name) {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CARD_COLORS[hash % CARD_COLORS.length];
}
