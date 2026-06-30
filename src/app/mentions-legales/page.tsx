import { LegalPage } from "@/components/layout/legal-page";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales du service Ancrage.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      subtitle="Informations légales relatives à l'éditeur et à l'hébergeur du service."
      lastUpdated="30 juin 2026"
    >
      <h2>1. Éditeur du site</h2>
      <p>
        Le site <strong>ancrage.app</strong> est édité par :
      </p>
      <ul>
        <li><strong>Dénomination sociale :</strong> Ancrage</li>
        <li>
          <strong>Adresse e-mail :</strong>{" "}
          <a href="mailto:hello@ancrage.app">hello@ancrage.app</a>
        </li>
        <li>
          <strong>Directeur de la publication :</strong> Le représentant légal d&apos;Ancrage
        </li>
      </ul>

      <h2>2. Hébergeur</h2>
      <p>Le site est hébergé par :</p>
      <ul>
        <li><strong>Société :</strong> Vercel Inc.</li>
        <li><strong>Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</li>
        <li><strong>Site web :</strong> vercel.com</li>
      </ul>

      <h2>3. Prestataires techniques</h2>

      <h3>Intelligence artificielle</h3>
      <ul>
        <li><strong>Anthropic PBC</strong> — génération des réponses du coach et des bilans</li>
        <li>548 Market St, PMB 90375, San Francisco, CA 94104, États-Unis</li>
        <li><strong>OpenAI, L.L.C.</strong> — transcription des notes vocales</li>
        <li>3180 18th St, San Francisco, CA 94110, États-Unis</li>
      </ul>

      <h3>Authentification et base de données</h3>
      <ul>
        <li><strong>Supabase Inc.</strong> — Gestion des comptes utilisateurs et données</li>
        <li>970 Toa Payoh North, #07-04, Singapour 318992</li>
      </ul>

      <h3>Paiement</h3>
      <ul>
        <li><strong>Stripe Inc.</strong> — Traitement des paiements en ligne</li>
        <li>354 Oyster Point Blvd, South San Francisco, CA 94080, États-Unis</li>
      </ul>

      <h3>E-mail transactionnel</h3>
      <ul>
        <li><strong>Resend Inc.</strong> — Envoi des e-mails (bilans, confirmations)</li>
        <li>2261 Market Street, San Francisco, CA 94114, États-Unis</li>
      </ul>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus présents sur le site ancrage.app (textes, images,
        graphismes, logo, icônes, logiciels) est la propriété exclusive d&apos;Ancrage, à
        l&apos;exception des éléments appartenant à des tiers clairement identifiés.
      </p>
      <p>
        Toute reproduction, représentation, modification, publication, adaptation de tout ou
        partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est
        interdite, sauf autorisation écrite préalable d&apos;Ancrage.
      </p>

      <h2>5. Données personnelles</h2>
      <p>
        Le traitement des données personnelles collectées sur ce site est détaillé dans notre{" "}
        <a href="/privacy">Politique de confidentialité</a>. Conformément à la loi Informatique
        et Libertés du 6 janvier 1978 modifiée et au RGPD, tu disposes d&apos;un droit
        d&apos;accès, de rectification et de suppression de tes données, exerçable directement
        depuis la page <a href="/confidentialite-des-donnees">Mes données</a> ou en contactant{" "}
        <a href="mailto:hello@ancrage.app">hello@ancrage.app</a>.
      </p>

      <h2>6. Cookies</h2>
      <p>
        Ce site utilise des cookies fonctionnels strictement nécessaires à son fonctionnement
        (session d&apos;authentification). Aucun cookie publicitaire n&apos;est déposé sans
        consentement.
      </p>

      <h2>7. Limitation de responsabilité</h2>
      <p>
        Les informations contenues sur ce site sont aussi précises que possible et le site est
        périodiquement remis à jour. Cependant, il peut contenir des inexactitudes, des
        omissions ou des lacunes. Si tu constates une erreur ou un dysfonctionnement, merci de
        le signaler par e-mail à <a href="mailto:hello@ancrage.app">hello@ancrage.app</a>.
      </p>
      <p>
        <strong>
          Ancrage est un compagnon de réflexion personnelle. Il ne constitue pas un suivi
          thérapeutique, un diagnostic ou un avis médical, et ne saurait remplacer
          l&apos;accompagnement d&apos;un professionnel de santé. En cas de détresse ou
          d&apos;urgence, contacte le 3114, le 15 (SAMU) ou le 112.
        </strong>
      </p>

      <h2>8. Droit applicable</h2>
      <p>
        Le présent site et ses mentions légales sont soumis au <strong>droit français</strong>.
        En cas de litige, les tribunaux français seront compétents.
      </p>

      <h2>9. Contact</h2>
      <p>
        Pour toute question : <a href="mailto:hello@ancrage.app">hello@ancrage.app</a>
      </p>
    </LegalPage>
  );
}
