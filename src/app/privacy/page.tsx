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
        Glowy est un service d&apos;analyse cutanée par intelligence artificielle accessible sur{" "}
        <strong>glowy.beauty</strong>. Pour toute question relative à tes données, contacte-nous
        à <a href="mailto:hello@glowy.app">hello@glowy.app</a>.
      </p>

      <h2>2. Données collectées</h2>

      <h3>2.1 Photos de visage</h3>
      <p>
        Les photos prises lors du scan sont <strong>traitées en temps réel</strong> par notre IA
        et <strong>jamais stockées sur nos serveurs</strong>. Seuls les résultats de l&apos;analyse
        (score, âge estimé, recommandations) sont sauvegardés.
      </p>

      <h3>2.2 Données de compte</h3>
      <p>
        Si tu crées un compte, nous collectons ton <strong>adresse e-mail</strong> et, via
        Google OAuth, ton nom et photo de profil Google.
      </p>

      <h3>2.3 Données de paiement</h3>
      <p>
        Les paiements sont traités par <strong>Stripe</strong>. Nous ne stockons jamais tes
        numéros de carte bancaire.
      </p>

      <h3>2.4 Profil cutané</h3>
      <p>
        Le questionnaire peau (type, préoccupations, âge, routine) est utilisé uniquement pour
        personnaliser l&apos;analyse IA. Ces données ne sont pas transmises à des tiers à des fins
        commerciales.
      </p>

      <h3>2.5 Données de navigation</h3>
      <p>
        Données techniques standards (IP, navigateur, pages visitées) collectées à des fins de
        sécurité et d&apos;amélioration du service.
      </p>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li><strong>Exécution du contrat</strong> — fournir le service d&apos;analyse, gérer ton compte et abonnement.</li>
        <li><strong>Consentement</strong> — traitement des photos de visage.</li>
        <li><strong>Intérêt légitime</strong> — amélioration et sécurité du service.</li>
        <li><strong>Obligation légale</strong> — conservation des données de facturation.</li>
      </ul>

      <h2>4. Sous-traitants</h2>
      <ul>
        <li><strong>Anthropic</strong> — analyse IA des photos (supprimées immédiatement après traitement)</li>
        <li><strong>Supabase</strong> — authentification et base de données</li>
        <li><strong>Stripe</strong> — paiement en ligne (certifié PCI DSS)</li>
        <li><strong>Vercel</strong> — hébergement de l&apos;application</li>
      </ul>
      <p>
        Ces prestataires sont conformes au RGPD. Les transferts hors UE sont encadrés par des
        garanties appropriées (clauses contractuelles types).
      </p>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li><strong>Photos</strong> — jamais stockées (quelques secondes de traitement)</li>
        <li><strong>Données de compte</strong> — durée de l&apos;abonnement + 3 ans</li>
        <li><strong>Résultats d&apos;analyse</strong> — tant que le compte est actif</li>
        <li><strong>Données de facturation</strong> — 10 ans (obligation légale)</li>
      </ul>

      <h2>6. Tes droits (RGPD)</h2>
      <p>Tu disposes des droits suivants :</p>
      <ul>
        <li><strong>Accès</strong> — obtenir une copie de tes données</li>
        <li><strong>Rectification</strong> — corriger des données inexactes</li>
        <li><strong>Effacement</strong> — demander la suppression de tes données</li>
        <li><strong>Portabilité</strong> — recevoir tes données dans un format structuré</li>
        <li><strong>Opposition</strong> — t&apos;opposer à certains traitements</li>
        <li><strong>Limitation</strong> — restreindre le traitement</li>
      </ul>
      <p>
        Pour exercer ces droits : <a href="mailto:hello@glowy.app">hello@glowy.app</a>. Tu peux
        également adresser une réclamation à la <strong>CNIL</strong> (cnil.fr).
      </p>

      <h2>7. Cookies</h2>
      <p>
        Glowy utilise uniquement des cookies <strong>strictement nécessaires</strong> (session
        d&apos;authentification). Aucun cookie publicitaire ni de tracking tiers.
      </p>

      <h2>8. Sécurité</h2>
      <p>
        Communications chiffrées (HTTPS/TLS), accès restreint aux données, hébergement sécurisé.
        En cas de violation, tu en seras informé(e) dans les délais légaux.
      </p>

      <h2>9. Mineurs</h2>
      <p>
        Glowy est destiné aux personnes de 16 ans et plus. Nous ne collectons pas sciemment de
        données concernant des mineurs de moins de 16 ans.
      </p>

      <h2>10. Usage non médical</h2>
      <p>
        Les analyses Glowy sont <strong>exclusivement cosmétiques et informatives</strong>. Elles
        ne constituent pas un diagnostic médical et ne remplacent pas l&apos;avis d&apos;un professionnel
        de santé.
      </p>

      <h2>11. Modifications</h2>
      <p>
        Cette politique peut être mise à jour. La date de dernière mise à jour est indiquée en
        haut de cette page. En cas de modification substantielle, tu en seras informé(e) par
        e-mail.
      </p>

      <h2>12. Contact</h2>
      <p>
        <a href="mailto:hello@glowy.app">hello@glowy.app</a>
      </p>
    </LegalPage>
  );
}
