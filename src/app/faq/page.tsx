import { LegalPage } from "@/components/layout/legal-page";

export const metadata = {
  title: "Foire aux questions — Ancrage",
  description: "Toutes les réponses sur le fonctionnement d'Ancrage, l'abonnement, la confidentialité et le coach IA.",
};

function Q({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-cream-200 last:border-0">
      <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 font-semibold text-stone-800 marker:hidden list-none [&::-webkit-details-marker]:hidden">
        {q}
        <span className="flex-none text-stone-400 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
      </summary>
      <div className="pb-4 text-stone-600 leading-relaxed text-sm">
        {children}
      </div>
    </details>
  );
}

export default function FaqPage() {
  return (
    <LegalPage
      title="Questions fréquentes"
      subtitle="Tout ce que tu veux savoir sur Ancrage, sans avoir à nous écrire."
      lastUpdated="1 juillet 2026"
    >
      <h2>Le service</h2>

      <Q q="C'est quoi Ancrage ?">
        <p>
          Ancrage est un compagnon de réflexion quotidienne. Tu écris (ou enregistres) une note
          le soir, et un coach IA te répond — pour t'aider à mettre des mots sur ta journée, à
          repérer des schémas dans ton humeur, et à prendre du recul sur ce que tu vis.
        </p>
        <p className="mt-2">
          C'est basé sur des principes issus des thérapies cognitivo-comportementales (TCC) et
          de l'entretien motivationnel, mais ça ne remplace pas un suivi psy. Si tu traverses
          une période difficile, le <strong>3114</strong> (numéro national de prévention du
          suicide) est disponible 24h/24.
        </p>
      </Q>

      <Q q="Faut-il créer un compte ?">
        <p>
          Oui, un compte est nécessaire pour que tes entrées soient sauvegardées et que le
          coach puisse se souvenir de tes conversations passées. Tu peux t'inscrire avec ton
          adresse e-mail ou via Google, en quelques secondes.
        </p>
      </Q>

      <Q q="Ancrage fonctionne-t-il sur mobile ?">
        <p>
          Oui. Ancrage est une application web progressive — elle fonctionne dans ton navigateur
          sur iPhone, Android, Mac ou PC. Sur mobile, tu peux l'ajouter à ton écran d'accueil
          depuis les options de ton navigateur (Safari → "Sur l'écran d'accueil", Chrome →
          "Ajouter à l'écran d'accueil") pour une expérience proche d'une app native.
        </p>
      </Q>

      <Q q="Les notes vocales sont-elles conservées ?">
        <p>
          Non. Tes enregistrements audio ne sont jamais stockés. Ils sont transcris en texte
          (via Whisper d'OpenAI) et supprimés immédiatement après. Seul le texte transcrit
          est conservé.
        </p>
      </Q>

      <h2>Abonnement et tarifs</h2>

      <Q q="C'est gratuit ?">
        <p>
          Tu peux écrire <strong>3 entrées par semaine</strong> gratuitement, sans carte
          bancaire. Pour un accès illimité, tu peux souscrire un abonnement.
        </p>
      </Q>

      <Q q="Quels sont les tarifs ?">
        <p>Deux formules d'accès illimité :</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Hebdomadaire</strong> — 4,99 € / semaine, avec 3 jours d'essai gratuit</li>
          <li><strong>Mensuel</strong> — 14,99 € / mois, avec 3 jours d'essai gratuit</li>
        </ul>
        <p className="mt-2">Les prix sont TTC. Aucun paiement pendant l'essai.</p>
      </Q>

      <Q q="Comment résilier ?">
        <p>
          En un clic depuis tes <a href="/parametres">Paramètres</a>. La résiliation est
          immédiate : tu gardes l'accès jusqu'à la fin de la période déjà payée, et aucun
          prélèvement supplémentaire n'est effectué. Une confirmation par e-mail t'est envoyée
          automatiquement.
        </p>
      </Q>

      <Q q="Est-ce que je peux me rétracter ?">
        <p>
          Oui. Tu as <strong>14 jours</strong> à compter de la souscription pour exercer ton
          droit de rétractation, conformément à la loi. Contacte-nous à{" "}
          <a href="mailto:hello@ancrage.app">hello@ancrage.app</a> avant l'expiration de ce
          délai.
        </p>
      </Q>

      <Q q="Les paiements sont-ils sécurisés ?">
        <p>
          Oui. Les paiements sont traités par <strong>Stripe</strong>, certifié PCI DSS niveau
          1. Tes informations bancaires ne transitent jamais par nos serveurs.
        </p>
      </Q>

      <h2>Le coach IA</h2>

      <Q q="Comment fonctionne le coach ?">
        <p>
          Quand tu envoies un message, il est transmis à Claude (Anthropic) avec le contexte
          de tes échanges récents. Le coach répond en s'appuyant sur des techniques de TCC et
          d'entretien motivationnel — reformulation, questionnement ouvert, validation
          émotionnelle — pour t'aider à explorer ce que tu ressens.
        </p>
      </Q>

      <Q q="Le coach peut-il se souvenir de mes entrées précédentes ?">
        <p>
          Le coach accède à tes messages de la session en cours (l'entrée du jour). Pour les
          bilans hebdomadaires, il synthétise tes entrées de la semaine.
        </p>
      </Q>

      <Q q="Les réponses sont-elles toujours exactes ?">
        <p>
          Non. Comme tout modèle d'IA, le coach peut se tromper, manquer de nuance ou ne pas
          saisir une situation complexe. Il est conçu pour le bien-être quotidien, pas pour
          remplacer un thérapeute. En cas de doute sur ce que tu ressens, parle à un
          professionnel de santé mentale.
        </p>
      </Q>

      <Q q="Mes écrits servent-ils à entraîner l'IA ?">
        <p>
          <strong>Non.</strong> Tes entrées ne sont jamais utilisées pour entraîner un modèle
          d'IA, ni par nous, ni par nos prestataires (Anthropic et OpenAI appliquent une
          politique de non-rétention pour les usages produits). Tes écrits t'appartiennent.
        </p>
      </Q>

      <h2>Confidentialité et données</h2>

      <Q q="Qui peut lire mon journal ?">
        <p>
          Personne. Tes entrées sont chiffrées et accessibles uniquement à toi. Les équipes
          d'Ancrage n'ont pas accès au contenu de ton journal. Nos prestataires IA reçoivent
          tes messages pour générer les réponses, mais sans les stocker ni les lire à des fins
          autres que la génération de ta réponse.
        </p>
      </Q>

      <Q q="Comment exporter mes données ?">
        <p>
          Depuis la page <a href="/confidentialite-des-donnees">Mes données</a>, tu peux
          télécharger l'intégralité de tes entrées en PDF ou en .txt, à tout moment et
          gratuitement.
        </p>
      </Q>

      <Q q="Comment supprimer mon compte ?">
        <p>
          Depuis la page <a href="/confidentialite-des-donnees">Mes données</a> → "Supprimer
          mon compte". La suppression est immédiate et définitive : toutes tes entrées, bilans
          et données sont effacés sans délai. Exporte ton journal avant si tu veux le conserver.
        </p>
      </Q>

      <Q q="Où sont stockées mes données ?">
        <p>
          Tes données sont hébergées sur <strong>Supabase</strong> (base de données) et{" "}
          <strong>Vercel</strong> (application), principalement en Europe. Pour les détails
          complets, consulte notre{" "}
          <a href="/privacy">Politique de confidentialité</a>.
        </p>
      </Q>

      <h2>Support</h2>

      <Q q="J'ai un problème, comment vous contacter ?">
        <p>
          Écris-nous à <a href="mailto:hello@ancrage.app">hello@ancrage.app</a>. On répond
          généralement sous 24–48h en jours ouvrés.
        </p>
      </Q>

      <Q q="Je ne retrouve pas mes anciennes entrées.">
        <p>
          Rends-toi dans <a href="/journal/historique">Historique</a> — tes 60 dernières
          entrées y sont listées. Si une entrée n'apparaît pas, c'est qu'elle a peut-être été
          créée depuis un autre compte. Contacte-nous à{" "}
          <a href="mailto:hello@ancrage.app">hello@ancrage.app</a> avec l'adresse e-mail
          concernée.
        </p>
      </Q>
    </LegalPage>
  );
}
