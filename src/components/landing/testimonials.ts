/**
 * Témoignages RÉELS uniquement.
 *
 * Tant que ce tableau est vide, la landing affiche la section honnête
 * "premiers testeurs". Dès qu'il contient au moins 1 témoignage, la section
 * témoignages classique réapparaît automatiquement.
 *
 * Format d'un témoignage :
 * {
 *   name: "Prénom N.",        // toujours avec l'accord de la personne
 *   age: "27 ans",            // optionnel, chaîne vide si non communiqué
 *   text: "Le témoignage tel qu'écrit par la personne.",
 *   color: "#BD6E4C",         // couleur de l'avatar : #BD6E4C, #8FA086 ou #CDA45C
 * }
 */

export interface Testimonial {
  name: string;
  age: string;
  text: string;
  color: string;
}

export const testimonials: Testimonial[] = [];
