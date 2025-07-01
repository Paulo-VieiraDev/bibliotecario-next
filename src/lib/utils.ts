export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function etapaDoEnsino(anoSerie: string) {
  const valor = anoSerie.toLowerCase().trim();
  if (["6º ano", "7º ano", "8º ano", "9º ano"].includes(valor)) return "Fundamental";
  if (["1º ano", "2º ano", "3º ano"].includes(valor)) return "Médio";
  return "";
}