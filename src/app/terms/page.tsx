import { LegalPage } from "@/components/layout/legal-page";

export const metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Conditions générales d'utilisation du service Glowy.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Conditions Générales d'Utilisation"
      subtitle="Les règles qui encadrent l'utilisation du service Glowy."
      lastUpdated="21 juin 2025"
    >
      <h2>1. Présentation du service</h2>
      <p>
        Glowy est un service d&apos;analyse cutanée par intelligence artificielle accessible
        via l&apos;application web <strong>glowy.beauty</strong>. Il permet aux utilisateurs
        d&apos;obtenir une analyse cosmétique de leur peau (score cutané, âge estimé, routine
        personnalisée) à partir d&apos;une photographie prise par leur appareil. Ce service
        est fourni à titre <strong>informatif et cosmétique uniquement</strong>.
      </p>

      <h2>2. Acceptation des conditions</h2>
      <p>
        L&apos;utilisation de Glowy implique l&apos;acceptation pleine et entière des présentes
        CGU. Si tu n&apos;acceptes pas ces conditions, tu ne dois pas utiliser le service.
        L&apos;éditeur se réserve le droit de modifier les CGU à tout moment ; la version
        applicable est celle en vigueur au moment de l&apos;utilisation.
      </p>

      <h2>3. Accès au service</h2>
      <p>
        L&apos;analyse de base est gratuite et accessible sans compte. La création d&apos;un
        compte (via e-mail ou Google) est requise pour accéder aux fonctionnalités premium
        (historique des scans, routine personnalisée complète, suivi du score).
      </p>
      <p>
        L&apos;utilisateur doit avoir au moins <strong>16 ans</strong> pour utiliser Glowy.
        En dessous de cet âge, le consentement d&apos;un représentant légal est requis.
      </p>

      <h2>4. Abonnement et tarifs</h2>

      <h3>4.1 Offres disponibles</h3>
      <p>L&apos;accès aux fonctionnalités premium est soumis à abonnement :</p>
      <ul>
        <li>
          <strong>Mensuel</strong> — 24,80 € TTC / mois, renouvelé automatiquement chaque mois.
        </li>
        <li>
          <strong>Annuel</strong> — 178,80 € TTC / an (soit 14,90 € / mois), renouvelé
          automatiquement chaque année. Économie de 40 % par rapport au mensuel.
        </li>
      </ul>
      <p>
        Les prix sont indiqués en euros toutes taxes comprises. L&apos;éditeur se réserve le
        droit de modifier ses tarifs avec un préavis d&apos;au moins 30 jours.
      </p>

      <h3>4.2 Paiement</h3>
      <p>
        Le paiement est effectué via <strong>Stripe</strong>, prestataire de paiement
        sécurisé. Les informations bancaires ne transitent jamais par nos serveurs.
        L&apos;abonnement est facturé à la date de souscription et renouvelé automatiquement
        à la même date chaque mois ou chaque année.
      </p>

      <h3>4.3 Résiliation</h3>
      <p>
        Tu peux résilier ton abonnement à tout moment depuis ton espace client ou en
        contactant <a href="mailto:hello@glowy.app">hello@glowy.app</a>. La résiliation
        prend effet à la fin de la période d&apos;abonnement en cours — aucun remboursement
        n&apos;est effectué pour la période restante, sauf disposition légale contraire.
      </p>

      <h3>4.4 Droit de rétractation</h3>
      <p>
        Conformément à l&apos;article L221-18 du Code de la consommation, tu disposes d&apos;un
        droit de rétractation de <strong>14 jours</strong> à compter de la souscription.
        Pour l&apos;exercer, contacte-nous à{" "}
        <a href="mailto:hello@glowy.app">hello@glowy.app</a> avant l&apos;expiration de ce délai.
        L&apos;accès immédiat au service entraîne la perte du droit de rétractation si tu as
        expressément renoncé à ce droit lors de la souscription.
      </p>

      <h2>5. Obligations de l&apos;utilisateur</h2>
      <p>Tu t&apos;engages à :</p>
      <ul>
        <li>Fournir des informations exactes lors de la création de ton compte.</li>
        <li>
          N&apos;utiliser le service qu&apos;à des fins personnelles et non commerciales.
        </li>
        <li>
          Ne pas tenter de contourner les mesures de sécurité, d&apos;accéder à des données
          d&apos;autres utilisateurs ou de perturber le service.
        </li>
        <li>
          Ne pas soumettre de photos représentant des mineurs ou des tiers sans leur
          consentement.
        </li>
        <li>
          Ne pas utiliser le service à des fins illégales ou contraires aux bonnes mœurs.
        </li>
      </ul>

      <h2>6. Propriété intellectuelle</h2>
      <p>
        Tous les éléments de Glowy (logo, design, algorithmes, textes, interface) sont la
        propriété exclusive de l&apos;éditeur et sont protégés par le droit de la propriété
        intellectuelle. Toute reproduction, distribution ou utilisation sans autorisation
        écrite préalable est interdite.
      </p>
      <p>
        Les résultats d&apos;analyse générés pour toi sont à usage personnel uniquement.
      </p>

      <h2>7. Limitation de responsabilité</h2>

      <h3>7.1 Caractère non médical</h3>
      <p>
        <strong>
          Les analyses fournies par Glowy sont exclusivement cosmétiques et informatives.
          Elles ne constituent en aucun cas un diagnostic médical, dermatologique ou de
          santé, et ne remplacent pas l&apos;avis d&apos;un professionnel de santé.
        </strong>{" "}
        Glowy décline toute responsabilité en cas d&apos;utilisation des résultats à des fins
        médicales.
      </p>

      <h3>7.2 Exactitude des résultats</h3>
      <p>
        Les résultats dépendent de la qualité de la photo, des conditions d&apos;éclairage et
        des limites inhérentes à l&apos;intelligence artificielle. L&apos;éditeur ne garantit pas
        l&apos;exactitude absolue des analyses et décline toute responsabilité pour les
        décisions prises sur la base de ces résultats.
      </p>

      <h3>7.3 Disponibilité du service</h3>
      <p>
        L&apos;éditeur s&apos;efforce de maintenir le service disponible en permanence mais ne peut
        garantir une disponibilité ininterrompue. Des interruptions pour maintenance ou
        cas de force majeure peuvent survenir sans préavis.
      </p>

      <h2>8. Données personnelles</h2>
      <p>
        Le traitement de tes données personnelles est décrit dans notre{" "}
        <a href="/privacy">Politique de confidentialité</a>, qui fait partie intégrante
        des présentes CGU.
      </p>

      <h2>9. Loi applicable et juridiction</h2>
      <p>
        Les présentes CGU sont régies par le <strong>droit français</strong>. En cas de
        litige, les parties s&apos;efforceront de trouver une solution amiable. À défaut, les
        tribunaux français seront seuls compétents. Pour les consommateurs résidant dans
        un autre État membre de l&apos;UE, les dispositions protectrices du droit local
        s&apos;appliquent.
      </p>
      <p>
        La Commission européenne propose une plateforme de règlement en ligne des litiges :{" "}
        <em>ec.europa.eu/consumers/odr</em>.
      </p>

      <h2>10. Contact</h2>
      <p>
        Pour toute question relative aux présentes CGU :{" "}
        <a href="mailto:hello@glowy.app">hello@glowy.app</a>
      </p>
    </LegalPage>
  );
}
