// Questions du jour — une par jour, rotation sur l'année

export const DAILY_QUESTIONS = [
  "Qu'est-ce qui t'a fait sourire aujourd'hui, même brièvement ?",
  "Quelle est la chose que tu aimerais dire à quelqu'un mais que tu gardes pour toi ?",
  "De quoi es-tu le plus fier·e cette semaine ?",
  "Qu'est-ce qui t'a demandé du courage récemment ?",
  "Si ta journée était une météo, ce serait laquelle — et pourquoi ?",
  "Quelle petite victoire mérite d'être célébrée aujourd'hui ?",
  "Qu'est-ce qui t'a pesé aujourd'hui, et que tu aimerais déposer ici ?",
  "Quel moment de la journée aimerais-tu revivre ?",
  "Y a-t-il quelque chose que tu évites en ce moment ? Qu'est-ce qui le rend difficile ?",
  "Qu'est-ce que tu ferais demain si tu n'avais peur de rien ?",
  "Quelle personne a compté pour toi aujourd'hui, et pourquoi ?",
  "Qu'est-ce que ton corps essaie de te dire en ce moment ?",
  "Quelle habitude aimerais-tu changer, et qu'est-ce qui t'en empêche ?",
  "Qu'est-ce qui t'a surpris·e aujourd'hui ?",
  "Si tu pouvais dire une phrase à toi-même d'il y a un an, ce serait laquelle ?",
  "Qu'est-ce qui te donne de l'énergie ces derniers temps ?",
  "Quelle émotion a dominé ta journée ? Où l'as-tu sentie ?",
  "Qu'as-tu appris sur toi cette semaine ?",
  "Qu'est-ce que tu remets à plus tard, et qu'est-ce que ça te coûte ?",
  "Quel compliment as-tu du mal à accepter ?",
  "Qu'est-ce qui te manque en ce moment ?",
  "Quelle limite aimerais-tu poser, et à qui ?",
  "Qu'est-ce qui t'apaise quand tout va trop vite ?",
  "De quoi as-tu besoin ce soir, là, maintenant ?",
  "Quel souvenir récent te réchauffe encore ?",
  "Qu'est-ce que tu fais uniquement pour faire plaisir aux autres ?",
  "Si demain était entièrement libre, tu en ferais quoi ?",
  "Quelle conversation récente continue de tourner dans ta tête ?",
  "Qu'est-ce que tu n'oses pas commencer ?",
  "Pour quoi éprouves-tu de la gratitude aujourd'hui ?",
  "Qu'est-ce qui t'a agacé·e aujourd'hui — et qu'est-ce que ça dit de toi ?",
] as const;

export function getDailyQuestion(date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length];
}
