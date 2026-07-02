import { LegalPage } from "@/components/layout/legal-page";

export const metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Conditions générales d'utilisation du service Ancrage.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Conditions Générales d'Utilisation"
      subtitle="Les règles qui encadrent l'utilisation du service Ancrage."
      lastUpdated="30 juin 2026"
    >
      <h2>1. Présentation du service</h2>
      <p>
        Ancrage est un compagnon de réflexion quotidienne accessible via l&apos;application web{" "}
        <strong>ancrage.xyz</strong>. Il permet de tenir un journal personnel (texte ou note
        vocale), d&apos;échanger avec un coach IA inspiré des thérapies cognitivo-comportementales
        et de l&apos;entretien motivationnel, de suivre son humeur dans le temps, et de recevoir
        des bilans hebdomadaires. Ce service est fourni à titre{" "}
        <strong>informatif et de bien-être uniquement</strong>.
      </p>
      <p>
        <strong>
          Ancrage n&apos;est ni un dispositif médical, ni un service de télémédecine, ni un
          remplacement d&apos;un suivi thérapeutique. En cas de détresse ou d&apos;urgence,
          contacte le 3114 (numéro national de prévention du suicide), le 15 (SAMU) ou le 112.
        </strong>
      </p>

      <h2>2. Acceptation des conditions</h2>
      <p>
        L&apos;utilisation d&apos;Ancrage implique l&apos;acceptation pleine et entière des
        présentes CGU. Si tu n&apos;acceptes pas ces conditions, tu ne dois pas utiliser le
        service. L&apos;éditeur se réserve le droit de modifier les CGU à tout moment ; la
        version applicable est celle en vigueur au moment de l&apos;utilisation.
      </p>

      <h2>3. Accès au service</h2>
      <p>
        La création d&apos;un compte (par e-mail ou Google) est nécessaire pour utiliser
        Ancrage. Chaque semaine, <strong>3 entrées de journal sont gratuites</strong>. Au-delà,
        l&apos;accès illimité nécessite un abonnement.
      </p>
      <p>
        L&apos;utilisateur doit avoir au moins <strong>16 ans</strong> pour utiliser Ancrage.
        En dessous de cet âge, le consentement d&apos;un représentant légal est requis.
      </p>

      <h2>4. Abonnement et tarifs</h2>

      <h3>4.1 Offres disponibles</h3>
      <p>L&apos;accès illimité à Ancrage est soumis à abonnement :</p>
      <ul>
        <li><strong>Hebdomadaire</strong> — 4,99 € TTC / semaine, renouvelé automatiquement chaque semaine.</li>
        <li><strong>Mensuel</strong> — 9,99 € TTC / mois, renouvelé automatiquement chaque mois.</li>
        <li><strong>Annuel</strong> — 49,99 € TTC / an, renouvelé automatiquement chaque année.</li>
      </ul>
      <p>
        Chaque abonnement débute par un essai gratuit de 3 jours. Les prix sont indiqués en
        euros toutes taxes comprises. L&apos;éditeur se réserve le droit de modifier ses tarifs
        avec un préavis d&apos;au moins 30 jours.
      </p>

      <h3>4.2 Paiement</h3>
      <p>
        Le paiement est effectué via <strong>Stripe</strong>, prestataire de paiement sécurisé.
        Les informations bancaires ne transitent jamais par nos serveurs. L&apos;abonnement est
        facturé à la fin de la période d&apos;essai, puis renouvelé automatiquement à la même
        fréquence.
      </p>

      <h3>4.3 Résiliation</h3>
      <p>
        Tu peux résilier ton abonnement à tout moment, <strong>en un clic</strong>, depuis tes
        paramètres. La résiliation prend effet à la fin de la période déjà payée — tu gardes
        l&apos;accès jusqu&apos;à cette date et <strong>aucun prélèvement supplémentaire</strong>{" "}
        n&apos;est effectué ensuite. Une confirmation t&apos;est envoyée par e-mail
        immédiatement.
      </p>

      <h3>4.4 Droit de rétractation</h3>
      <p>
        Conformément à l&apos;article L221-18 du Code de la consommation, tu disposes d&apos;un
        droit de rétractation de <strong>14 jours</strong> à compter de la souscription. Pour
        l&apos;exercer, contacte-nous à{" "}
        <a href="mailto:m.nabbachi@icloud.com">m.nabbachi@icloud.com</a> avant l&apos;expiration de ce
        délai.
      </p>

      <h2>5. Obligations de l&apos;utilisateur</h2>
      <p>Tu t&apos;engages à :</p>
      <ul>
        <li>Fournir des informations exactes lors de la création de ton compte.</li>
        <li>N&apos;utiliser le service qu&apos;à des fins personnelles et non commerciales.</li>
        <li>
          Ne pas tenter de contourner les mesures de sécurité, d&apos;accéder à des données
          d&apos;autres utilisateurs ou de perturber le service.
        </li>
        <li>Ne pas utiliser le service à des fins illégales ou contraires aux bonnes mœurs.</li>
      </ul>

      <h2>6. Propriété intellectuelle</h2>
      <p>
        Tous les éléments d&apos;Ancrage (logo, design, algorithmes, textes, interface) sont la
        propriété exclusive de l&apos;éditeur et sont protégés par le droit de la propriété
        intellectuelle. Toute reproduction, distribution ou utilisation sans autorisation écrite
        préalable est interdite.
      </p>
      <p>Le contenu de ton journal t&apos;appartient et reste strictement personnel.</p>

      <h2>7. Limitation de responsabilité</h2>

      <h3>7.1 Caractère non thérapeutique</h3>
      <p>
        <strong>
          Ancrage ne fournit pas de diagnostic, de traitement ou de suivi médical ou
          psychologique. Le coach IA n&apos;est pas un professionnel de santé.
        </strong>{" "}
        Ancrage décline toute responsabilité en cas d&apos;utilisation du service à des fins
        médicales ou en remplacement d&apos;un suivi thérapeutique.
      </p>

      <h3>7.2 Limites de l&apos;IA</h3>
      <p>
        Les réponses du coach et les bilans sont générés par intelligence artificielle et
        peuvent contenir des inexactitudes. L&apos;éditeur ne garantit pas l&apos;exactitude
        absolue de ces contenus.
      </p>

      <h3>7.3 Disponibilité du service</h3>
      <p>
        L&apos;éditeur s&apos;efforce de maintenir le service disponible en permanence mais ne
        peut garantir une disponibilité ininterrompue. Des interruptions pour maintenance ou cas
        de force majeure peuvent survenir sans préavis.
      </p>

      <h2>8. Données personnelles</h2>
      <p>
        Le traitement de tes données personnelles est décrit dans notre{" "}
        <a href="/privacy">Politique de confidentialité</a>, qui fait partie intégrante des
        présentes CGU.
      </p>

      <h2>9. Loi applicable et juridiction</h2>
      <p>
        Les présentes CGU sont régies par le <strong>droit français</strong>. En cas de litige,
        les parties s&apos;efforceront de trouver une solution amiable. À défaut, les tribunaux
        français seront seuls compétents. Pour les consommateurs résidant dans un autre État
        membre de l&apos;UE, les dispositions protectrices du droit local s&apos;appliquent.
      </p>
      <p>
        La Commission européenne propose une plateforme de règlement en ligne des litiges :{" "}
        <em>ec.europa.eu/consumers/odr</em>.
      </p>

      <h2>10. Contact</h2>
      <p>
        Pour toute question relative aux présentes CGU :{" "}
        <a href="mailto:m.nabbachi@icloud.com">m.nabbachi@icloud.com</a>
      </p>
    </LegalPage>
  );
}
