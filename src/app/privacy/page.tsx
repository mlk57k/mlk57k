import { LegalPage } from "@/components/layout/legal-page";

export const metadata = {
  title: "Politique de confidentialité",
  description: "Comment Glowy collecte, utilise et protège tes données personnelles.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      subtitle="Comment nous collectons, utilisons et protégeons tes données."
      lastUpdated="21 juin 2025"
    >
      <h2>1. Qui sommes-nous ?</h2>
      <p>
        Glowy est une application d&apos;analyse cutanée par intelligence artificielle accessible sur{" "}
        <strong>glowy.beauty</strong>. Le responsable du traitement des données personnelles est
        l&apos;éditeur de ce service, joignable à l&apos;adresse{" "}
        <a href="mailto:hello@glowy.app">hello@glowy.app</a>.
      </p>

      <h2>2. Données collectées</h2>

      <h3>2.1 Données d&apos;identification et de compte</h3>
      <p>
        Lorsque tu crées un compte, nous collectons ton <strong>adresse e-mail</strong> et,
        si tu utilises la connexion Google, ton nom et ta photo de profil Google. Ces données
        sont nécessaires pour gérer ton compte et t&apos;identifier lors de tes connexions.
      </p>

      <h3>2.2 Photos et images</h3>
      <p>
        Les photos prises lors du scan sont <strong>traitées en temps réel</strong> et
        transmises à notre prestataire d&apos;intelligence artificielle (Anthropic) pour l&apos;analyse.{" "}
        <strong>Elles ne sont jamais stockées sur nos serveurs</strong> ni conservées après la
        fin de l&apos;analyse. Seuls les résultats de l&apos;analyse (score, âge cutané estimé,
        recommandations) sont sauvegardés.
      </p>

      <h3>2.3 Données de paiement</h3>
      <p>
        Les paiements sont traités par <strong>Stripe</strong>. Nous ne collectons ni ne
        stockons jamais tes numéros de carte bancaire. Stripe nous communique uniquement
        un identifiant client et le statut de ton abonnement.
      </p>

      <h3>2.4 Données d&apos;utilisation</h3>
      <p>
        Nous pouvons collecter des données techniques anonymes (type d&apos;appareil, navigateur,
        pages visitées) dans le but d&apos;améliorer le service. Ces données ne permettent pas
        de t&apos;identifier personnellement.
      </p>

      <h3>2.5 Profil cutané</h3>
      <p>
        Si tu renseignes le questionnaire peau (type de peau, préoccupations, âge, routine),
        ces informations sont utilisées uniquement pour personnaliser l&apos;analyse IA et ne
        sont pas transmises à des tiers à des fins commerciales.
      </p>

      <h2>3. Finalités et bases légales du traitement</h2>
      <p>Nous traitons tes données pour les finalités suivantes :</p>
      <ul>
        <li>
          <strong>Exécution du contrat</strong> — fournir le service d&apos;analyse cutanée,
          gérer ton compte et ton abonnement.
        </li>
        <li>
          <strong>Intérêt légitime</strong> — améliorer et sécuriser le service, prévenir
          les abus.
        </li>
        <li>
          <strong>Consentement</strong> — envoi de communications marketing (uniquement si
          tu y as consenti explicitement).
        </li>
        <li>
          <strong>Obligation légale</strong> — conservation des données de facturation
          conformément aux obligations comptables et fiscales.
        </li>
      </ul>

      <h2>4. Partage des données avec des tiers</h2>
      <p>Nous partageons tes données uniquement avec les prestataires suivants :</p>
      <ul>
        <li>
          <strong>Anthropic (États-Unis)</strong> — traitement IA de tes photos pour l&apos;analyse
          cutanée. Les photos sont transmises via API et ne sont pas conservées par Anthropic
          au-delà du traitement immédiat.
        </li>
        <li>
          <strong>Supabase (États-Unis / UE)</strong> — hébergement de la base de données
          et gestion de l&apos;authentification.
        </li>
        <li>
          <strong>Stripe (États-Unis)</strong> — traitement des paiements et gestion des
          abonnements. Stripe est certifié PCI DSS.
        </li>
        <li>
          <strong>Vercel (États-Unis)</strong> — hébergement de l&apos;application.
        </li>
      </ul>
      <p>
        Ces transferts vers des pays tiers sont encadrés par des garanties appropriées
        (clauses contractuelles types de la Commission européenne, Privacy Shield ou
        décisions d&apos;adéquation).
      </p>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li>
          <strong>Données de compte</strong> — conservées pendant toute la durée de ton compte,
          puis supprimées dans les 30 jours suivant la clôture.
        </li>
        <li>
          <strong>Résultats d&apos;analyse</strong> — conservés pendant toute la durée de ton
          abonnement actif + 12 mois.
        </li>
        <li>
          <strong>Données de facturation</strong> — conservées 10 ans conformément aux
          obligations légales.
        </li>
        <li>
          <strong>Photos</strong> — jamais stockées.
        </li>
      </ul>

      <h2>6. Tes droits (RGPD)</h2>
      <p>
        Conformément au Règlement Général sur la Protection des Données (RGPD), tu disposes
        des droits suivants :
      </p>
      <ul>
        <li><strong>Droit d&apos;accès</strong> — obtenir une copie de tes données.</li>
        <li><strong>Droit de rectification</strong> — corriger des données inexactes.</li>
        <li>
          <strong>Droit à l&apos;effacement</strong> — demander la suppression de tes données
          (sous réserve des obligations légales).
        </li>
        <li>
          <strong>Droit à la portabilité</strong> — recevoir tes données dans un format
          structuré et lisible.
        </li>
        <li>
          <strong>Droit d&apos;opposition</strong> — t&apos;opposer au traitement fondé sur
          l&apos;intérêt légitime.
        </li>
        <li>
          <strong>Droit de retrait du consentement</strong> — à tout moment pour les
          traitements basés sur le consentement.
        </li>
      </ul>
      <p>
        Pour exercer ces droits, contacte-nous à{" "}
        <a href="mailto:hello@glowy.app">hello@glowy.app</a>. Tu peux également introduire
        une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de
        l&apos;Informatique et des Libertés) via <em>cnil.fr</em>.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Glowy utilise uniquement des cookies <strong>strictement nécessaires</strong> au
        fonctionnement du service (session d&apos;authentification, préférences). Aucun cookie
        publicitaire ni de suivi tiers n&apos;est déposé sans ton consentement.
      </p>

      <h2>8. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
        protéger tes données : chiffrement des communications (HTTPS/TLS), accès restreint
        aux données, hébergement sécurisé. Malgré ces mesures, aucun système n&apos;est
        infaillible ; en cas de violation de données, nous t&apos;en informerons dans les
        délais légaux.
      </p>

      <h2>9. Usage non médical</h2>
      <p>
        Les analyses fournies par Glowy sont <strong>purement cosmétiques et informatives</strong>.
        Elles ne constituent en aucun cas un diagnostic médical, dermatologique ou de santé.
        Consulte un professionnel de santé pour tout avis médical.
      </p>

      <h2>10. Modifications</h2>
      <p>
        Cette politique peut être mise à jour. En cas de modification substantielle, nous
        t&apos;en informerons par e-mail ou via une notification dans l&apos;application. La
        version en vigueur est toujours accessible sur cette page.
      </p>

      <h2>11. Contact</h2>
      <p>
        Pour toute question relative à cette politique :{" "}
        <a href="mailto:hello@glowy.app">hello@glowy.app</a>
      </p>
    </LegalPage>
  );
}
