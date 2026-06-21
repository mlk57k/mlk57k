import { LegalPage } from "@/components/layout/legal-page";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales du service Glowy.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      subtitle="Informations légales relatives à l'éditeur et à l'hébergeur du service."
      lastUpdated="21 juin 2025"
    >
      <h2>1. Éditeur du site</h2>
      <p>
        Le site <strong>glowy.beauty</strong> est édité par :
      </p>
      <ul>
        <li><strong>Dénomination sociale :</strong> Glowy</li>
        <li>
          <strong>Adresse e-mail :</strong>{" "}
          <a href="mailto:hello@glowy.app">hello@glowy.app</a>
        </li>
        <li>
          <strong>Directeur de la publication :</strong> Le représentant légal de Glowy
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
        <li><strong>Anthropic PBC</strong> — Analyse IA des images cutanées</li>
        <li>548 Market St, PMB 90375, San Francisco, CA 94104, États-Unis</li>
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

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus présents sur le site glowy.beauty (textes, images,
        graphismes, logo, icônes, sons, logiciels) est la propriété exclusive de
        Glowy, à l&apos;exception des éléments appartenant à des tiers clairement identifiés.
      </p>
      <p>
        Toute reproduction, représentation, modification, publication, adaptation de tout
        ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé,
        est interdite, sauf autorisation écrite préalable de Glowy.
      </p>

      <h2>5. Données personnelles</h2>
      <p>
        Le traitement des données personnelles collectées sur ce site est détaillé dans
        notre <a href="/privacy">Politique de confidentialité</a>. Conformément à la loi
        Informatique et Libertés du 6 janvier 1978 modifiée et au RGPD, vous disposez
        d&apos;un droit d&apos;accès, de rectification et de suppression de vos données en contactant{" "}
        <a href="mailto:hello@glowy.app">hello@glowy.app</a>.
      </p>

      <h2>6. Cookies</h2>
      <p>
        Ce site utilise des cookies fonctionnels strictement nécessaires à son
        fonctionnement (session d&apos;authentification). Aucun cookie publicitaire
        n&apos;est déposé sans votre consentement.
      </p>

      <h2>7. Limitation de responsabilité</h2>
      <p>
        Les informations contenues sur ce site sont aussi précises que possible et le site
        est périodiquement remis à jour. Cependant, il peut contenir des inexactitudes,
        des omissions ou des lacunes. Si vous constatez une erreur ou ce qui peut être un
        dysfonctionnement, merci de le signaler par e-mail à{" "}
        <a href="mailto:hello@glowy.app">hello@glowy.app</a>.
      </p>
      <p>
        <strong>
          Les analyses fournies par Glowy sont exclusivement cosmétiques et informatives.
          Elles ne constituent pas un diagnostic médical et ne sauraient remplacer l&apos;avis
          d&apos;un professionnel de santé.
        </strong>
      </p>

      <h2>8. Droit applicable</h2>
      <p>
        Le présent site et ses mentions légales sont soumis au <strong>droit français</strong>.
        En cas de litige, les tribunaux français seront compétents.
      </p>

      <h2>9. Contact</h2>
      <p>
        Pour toute question :{" "}
        <a href="mailto:hello@glowy.app">hello@glowy.app</a>
      </p>
    </LegalPage>
  );
}
