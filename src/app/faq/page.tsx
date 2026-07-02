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

      <Q q="C&apos;est quoi Ancrage ?">
        <p>
          Ancrage est un compagnon de réflexion quotidienne. Tu écris (ou enregistres) une note
          le soir, et un coach IA te répond — pour t&apos;aider à mettre des mots sur ta journée, à
          repérer des schémas dans ton humeur, et à prendre du recul sur ce que tu vis.
        </p>
        <p className="mt-2">
          C&apos;est basé sur des principes issus des thérapies cognitivo-comportementales (TCC) et
          de l&apos;entretien motivationnel, mais ça ne remplace pas un suivi psy. Si tu traverses
          une période difficile, le <strong>3114</strong> (numéro national de prévention du
          suicide) est disponible 24h/24.
        </p>
      </Q>

      <Q q="Faut-il créer un compte ?">
        <p>
          Oui, un compte est nécessaire pour que tes entrées soient sauvegardées et que le
          coach puisse se souvenir de tes conversations passées. Tu peux t&apos;inscrire avec ton
          adresse e-mail ou via Google, en quelques secondes.
        </p>
      </Q>

      <Q q="Ancrage fonctionne-t-il sur mobile ?">
        <p>
          Oui. Ancrage est une application web progressive — elle fonctionne dans ton navigateur
          sur iPhone, Android, Mac ou PC. Sur mobile, tu peux l&apos;ajouter à ton écran d&apos;accueil
          depuis les options de ton navigateur (Safari → &quot;Sur l&apos;écran d&apos;accueil&quot;, Chrome →
          &quot;Ajouter à l&apos;écran d&apos;accueil&quot;) pour une expérience proche d&apos;une app native.
        </p>
      </Q>

      <Q q="Les notes vocales sont-elles conservées ?">
        <p>
          Non. Tes enregistrements audio ne sont jamais stockés. Ils sont transcrits en texte
          (via Whisper d&apos;OpenAI) et supprimés immédiatement après. Seul le texte transcrit
          est conservé.
        </p>
      </Q>

      <h2>Abonnement et tarifs</h2>

      <Q q="C&apos;est gratuit ?">
        <p>
          Tu peux écrire <strong>3 entrées par semaine</strong> gratuitement, sans carte
          bancaire. Pour un accès illimité, tu peux souscrire un abonnement.
        </p>
      </Q>

      <Q q="Quels sont les tarifs ?">
        <p>Trois formules d&apos;accès illimité :</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Hebdomadaire</strong> — 4,99 € / semaine, avec 3 jours d&apos;essai gratuit</li>
          <li><strong>Mensuel</strong> — 9,99 € / mois, avec 3 jours d&apos;essai gratuit</li>
          <li><strong>Annuel</strong> — 49,99 € / an, avec 3 jours d&apos;essai gratuit</li>
        </ul>
        <p className="mt-2">Les prix sont TTC. Aucun paiement pendant l&apos;essai.</p>
      </Q>

      <Q q="Comment résilier ?">
        <p>
          En un clic depuis tes <a href="/parametres">Paramètres</a>. La résiliation est
          immédiate : tu gardes l&apos;accès jusqu&apos;à la fin de la période déjà payée, et aucun
          prélèvement supplémentaire n&apos;est effectué. Une confirmation par e-mail t&apos;est envoyée
          automatiquement.
        </p>
      </Q>

      <Q q="Est-ce que je peux me rétracter ?">
        <p>
          Oui. Tu as <strong>14 jours</strong> à compter de la souscription pour exercer ton
          droit de rétractation, conformément à la loi. Contacte-nous à{" "}
          <a href="mailto:contact@ancrage.xyz">contact@ancrage.xyz</a> avant l&apos;expiration de ce
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
          de tes échanges récents. Le coach répond en s&apos;appuyant sur des techniques de TCC et
          d&apos;entretien motivationnel — reformulation, questionnement ouvert, validation
          émotionnelle — pour t&apos;aider à explorer ce que tu ressens.
        </p>
      </Q>

      <Q q="Le coach peut-il se souvenir de mes entrées précédentes ?">
        <p>
          Oui. Le coach garde une mémoire de tes échanges : tes objectifs, les personnes dont
          tu parles, les thèmes qui reviennent, et l&apos;évolution de tes derniers jours. Plus tu
          écris, mieux il te connaît — et tu peux supprimer une entrée à tout moment.
        </p>
      </Q>

      <Q q="Les réponses sont-elles toujours exactes ?">
        <p>
          Non. Comme tout modèle d&apos;IA, le coach peut se tromper, manquer de nuance ou ne pas
          saisir une situation complexe. Il est conçu pour le bien-être quotidien, pas pour
          remplacer un thérapeute. En cas de doute sur ce que tu ressens, parle à un
          professionnel de santé mentale.
        </p>
      </Q>

      <Q q="Mes écrits servent-ils à entraîner l&apos;IA ?">
        <p>
          <strong>Non.</strong> Tes entrées ne sont jamais utilisées pour entraîner un modèle
          d&apos;IA, ni par nous, ni par nos prestataires (Anthropic et OpenAI appliquent une
          politique de non-rétention pour les usages produits). Tes écrits t&apos;appartiennent.
        </p>
      </Q>

      <h2>Confidentialité et données</h2>

      <Q q="Qui peut lire mon journal ?">
        <p>
          Personne. Tes entrées sont chiffrées et accessibles uniquement à toi. Les équipes
          d&apos;Ancrage n&apos;ont pas accès au contenu de ton journal. Nos prestataires IA reçoivent
          tes messages pour générer les réponses, mais sans les stocker ni les lire à des fins
          autres que la génération de ta réponse.
        </p>
      </Q>

      <Q q="Comment exporter mes données ?">
        <p>
          Depuis la page <a href="/confidentialite-des-donnees">Mes données</a>, tu peux
          télécharger l&apos;intégralité de tes entrées en PDF ou en .txt, à tout moment et
          gratuitement.
        </p>
      </Q>

      <Q q="Comment supprimer mon compte ?">
        <p>
          Depuis la page <a href="/confidentialite-des-donnees">Mes données</a> → &quot;Supprimer
          mon compte&quot;. La suppression est immédiate et définitive : toutes tes entrées, bilans
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

      <Q q="J&apos;ai un problème, comment vous contacter ?">
        <p>
          Écris-nous à <a href="mailto:contact@ancrage.xyz">contact@ancrage.xyz</a>. On répond
          généralement sous 24–48h en jours ouvrés.
        </p>
      </Q>

      <Q q="Je ne retrouve pas mes anciennes entrées.">
        <p>
          Rends-toi dans <a href="/journal/historique">Historique</a> — tes 60 dernières
          entrées y sont listées. Si une entrée n&apos;apparaît pas, c&apos;est qu&apos;elle a peut-être été
          créée depuis un autre compte. Contacte-nous à{" "}
          <a href="mailto:contact@ancrage.xyz">contact@ancrage.xyz</a> avec l&apos;adresse e-mail
          concernée.
        </p>
      </Q>
    </LegalPage>
  );
}
