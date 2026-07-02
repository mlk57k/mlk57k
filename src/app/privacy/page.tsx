import { LegalPage } from "@/components/layout/legal-page";

export const metadata = {
  title: "Politique de confidentialité",
  description: "Comment Ancrage collecte, utilise et protège tes données personnelles.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      subtitle="Comment nous collectons, utilisons et protégeons tes données."
      lastUpdated="30 juin 2026"
    >
      <h2>1. Qui sommes-nous ?</h2>
      <p>
        Ancrage est un compagnon de réflexion quotidienne accessible sur <strong>ancrage.xyz</strong>.
        Pour toute question relative à tes données, contacte-nous à{" "}
        <a href="mailto:hello@ancrage.xyz">hello@ancrage.xyz</a>.
      </p>

      <h2>2. Données collectées</h2>

      <h3>2.1 Entrées de journal</h3>
      <p>
        Le texte de tes entrées, tes notes vocales transcrites, et tes échanges avec le
        coach IA sont <strong>stockés de façon chiffrée</strong> sur nos serveurs pour te
        permettre de les retrouver et de bénéficier d&apos;une mémoire d&apos;une session à
        l&apos;autre. Tes notes vocales elles-mêmes ne sont jamais conservées : elles sont
        transcrites en texte puis immédiatement supprimées.
      </p>

      <h3>2.2 Données de compte</h3>
      <p>
        Si tu crées un compte, nous collectons ton <strong>adresse e-mail</strong> et, via
        Google OAuth le cas échéant, ton nom et ta photo de profil Google.
      </p>

      <h3>2.3 Données de paiement</h3>
      <p>
        Les paiements sont traités par <strong>Stripe</strong>. Nous ne stockons jamais tes
        numéros de carte bancaire.
      </p>

      <h3>2.4 Humeur et objectifs</h3>
      <p>
        Les scores d&apos;humeur que tu indiques (ou que le coach estime à partir de tes
        écrits) et les objectifs personnels que tu renseignes servent uniquement à
        personnaliser tes bilans et les réponses du coach. Ces données ne sont jamais
        transmises à des tiers à des fins commerciales.
      </p>

      <h3>2.5 Données de navigation</h3>
      <p>
        Données techniques standards (IP, navigateur, pages visitées) collectées à des fins de
        sécurité et d&apos;amélioration du service.
      </p>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li><strong>Exécution du contrat</strong> — fournir le service de journaling, gérer ton compte et abonnement.</li>
        <li><strong>Consentement</strong> — transcription de tes notes vocales.</li>
        <li><strong>Intérêt légitime</strong> — amélioration et sécurité du service.</li>
        <li><strong>Obligation légale</strong> — conservation des données de facturation.</li>
      </ul>

      <h2>4. Sous-traitants</h2>
      <ul>
        <li><strong>Anthropic</strong> — génération des réponses du coach IA et des bilans hebdomadaires</li>
        <li><strong>OpenAI</strong> — transcription des notes vocales (Whisper)</li>
        <li><strong>Supabase</strong> — authentification et base de données</li>
        <li><strong>Stripe</strong> — paiement en ligne (certifié PCI DSS)</li>
        <li><strong>Resend</strong> — envoi des e-mails transactionnels (bilans, confirmations)</li>
        <li><strong>Vercel</strong> — hébergement de l&apos;application</li>
      </ul>
      <p>
        Ces prestataires sont conformes au RGPD. Les transferts hors UE sont encadrés par des
        garanties appropriées (clauses contractuelles types).
      </p>
      <p>
        <strong>Tes écrits ne servent jamais à entraîner un modèle d&apos;IA.</strong> Ils sont
        envoyés à nos prestataires IA uniquement pour générer ta réponse ou ton bilan, dans le
        cadre de leurs politiques de non-rétention pour usage produit.
      </p>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li><strong>Notes vocales brutes</strong> — jamais stockées (supprimées après transcription)</li>
        <li><strong>Données de compte</strong> — durée de l&apos;abonnement + 3 ans</li>
        <li><strong>Entrées de journal et bilans</strong> — tant que le compte est actif, ou jusqu&apos;à suppression manuelle</li>
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
        Tu peux exporter ou supprimer toutes tes données toi-même, à tout moment, depuis la
        page <a href="/confidentialite-des-donnees">Mes données</a>. Pour toute autre demande :{" "}
        <a href="mailto:hello@ancrage.xyz">hello@ancrage.xyz</a>. Tu peux également adresser une
        réclamation à la <strong>CNIL</strong> (cnil.fr).
      </p>

      <h2>7. Cookies</h2>
      <p>
        Ancrage utilise uniquement des cookies <strong>strictement nécessaires</strong> (session
        d&apos;authentification). Aucun cookie publicitaire ni de tracking tiers.
      </p>

      <h2>8. Sécurité</h2>
      <p>
        Communications chiffrées (HTTPS/TLS), accès restreint aux données, hébergement sécurisé.
        En cas de violation, tu en seras informé(e) dans les délais légaux.
      </p>

      <h2>9. Mineurs</h2>
      <p>
        Ancrage est destiné aux personnes de 16 ans et plus. Nous ne collectons pas sciemment de
        données concernant des mineurs de moins de 16 ans.
      </p>

      <h2>10. Usage non thérapeutique</h2>
      <p>
        Ancrage est un compagnon de réflexion personnelle, fondé sur des principes issus des
        thérapies cognitivo-comportementales et de l&apos;entretien motivationnel. Il ne
        constitue <strong>en aucun cas un suivi thérapeutique, un diagnostic ou un avis
        médical</strong>, et ne remplace pas l&apos;accompagnement d&apos;un professionnel de
        santé mentale.
      </p>

      <h2>11. Modifications</h2>
      <p>
        Cette politique peut être mise à jour. La date de dernière mise à jour est indiquée en
        haut de cette page. En cas de modification substantielle, tu en seras informé(e) par
        e-mail.
      </p>

      <h2>12. Contact</h2>
      <p>
        <a href="mailto:hello@ancrage.xyz">hello@ancrage.xyz</a>
      </p>
    </LegalPage>
  );
}
