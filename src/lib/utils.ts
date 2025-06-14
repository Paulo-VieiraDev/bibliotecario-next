export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function etapaDoEnsino(anoSerie: string) {
  if (["6º ano", "7º ano", "8º ano", "9º ano"].includes(anoSerie)) return "Fundamental"
  if (["1º ano", "2º ano", "3º ano"].includes(anoSerie)) return "Médio"
  return ""
}