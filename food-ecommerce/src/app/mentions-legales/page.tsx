import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mentions legales' };

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-earth">
      <h1 className="section-title">Mentions legales</h1>

      <h2>Editeur du site</h2>
      <p>
        Le site vanilleshop.fr est edite par :<br />
        <strong>Vanille Shop SAS</strong><br />
        Capital social : [montant] EUR<br />
        Siege social : [adresse]<br />
        RCS : [ville] B [numero]<br />
        SIRET : [numero]<br />
        N&deg; TVA intracommunautaire : FR [numero]<br />
        Directeur de la publication : [nom]<br />
        Email : contact@vanilleshop.fr<br />
        Telephone : [numero]
      </p>

      <h2>Hebergement</h2>
      <p>
        Le site est heberge par :<br />
        Vercel Inc.<br />
        440 N Bashaw St, San Francisco, CA 94107, USA
      </p>

      <h2>Propriete intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus (textes, images, logos, marques) presents sur ce site sont proteges
        par le droit de la propriete intellectuelle. Toute reproduction, meme partielle, est interdite
        sans autorisation prealable ecrite.
      </p>

      <h2>Donnees personnelles</h2>
      <p>
        Conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi
        Informatique et Libertes, vous disposez de droits sur vos donnees personnelles.
        Consultez notre <a href="/politique-confidentialite">politique de confidentialite</a> pour
        plus de details.
      </p>

      <h2>Cookies</h2>
      <p>
        Ce site utilise des cookies strictement necessaires au fonctionnement du service
        (session, panier). Aucun cookie de tracage ou publicitaire n&apos;est utilise sans votre
        consentement explicite.
      </p>

      <h2>Responsabilite</h2>
      <p>
        Vanille Shop s&apos;efforce de fournir des informations exactes et mises a jour. Toutefois,
        nous ne pouvons garantir l&apos;exactitude, la completude ou l&apos;actualite des informations
        diffusees sur le site.
      </p>
    </div>
  );
}
