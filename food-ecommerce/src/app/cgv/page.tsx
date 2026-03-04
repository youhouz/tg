import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Conditions Generales de Vente' };

export default function CGVPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-earth">
      <h1 className="section-title">Conditions Generales de Vente</h1>
      <p className="text-sm text-earth-500">Derniere mise a jour : mars 2026</p>

      <h2>Article 1 - Objet</h2>
      <p>
        Les presentes Conditions Generales de Vente (CGV) regissent les ventes de produits
        a base de vanille effectuees par Vanille Shop SAS via le site vanilleshop.fr,
        a destination des consommateurs particuliers et des professionnels.
      </p>

      <h2>Article 2 - Produits</h2>
      <p>
        Les produits proposes a la vente sont des denrees alimentaires a base de vanille.
        Les photographies et descriptions sont les plus fideles possibles mais ne peuvent
        assurer une similitude parfaite avec le produit offert.
      </p>
      <p>
        Conformement a la reglementation, les informations obligatoires sont affichees sur
        chaque fiche produit : denomination, liste des ingredients, allergenes, quantite nette,
        date de durabilite minimale (DDM) ou date limite de consommation (DLC), conditions de
        conservation, pays d&apos;origine.
      </p>

      <h2>Article 3 - Prix</h2>
      <p>
        Les prix sont indiques en euros TTC (toutes taxes comprises). Vanille Shop se reserve
        le droit de modifier ses prix a tout moment. Les produits sont factures sur la base
        des tarifs en vigueur au moment de la validation de la commande.
      </p>
      <p>
        Les clients professionnels beneficient de tarifs specifiques accessibles depuis leur
        espace PRO.
      </p>

      <h2>Article 4 - Commande</h2>
      <p>
        Le client passe commande en ligne via le site. La validation de la commande implique
        l&apos;acceptation des presentes CGV. Un email de confirmation est envoye apres validation
        du paiement.
      </p>

      <h2>Article 5 - Paiement</h2>
      <p>
        Le paiement s&apos;effectue par carte bancaire via la plateforme securisee Stripe.
        Vanille Shop ne stocke aucune donnee bancaire. Le debit est effectue au moment
        de la validation de la commande.
      </p>

      <h2>Article 6 - Livraison</h2>
      <p>
        Trois modes de livraison sont proposes : livraison a domicile (Colissimo),
        point relais, et retrait en boutique (click and collect). La livraison est
        offerte a partir de 60 EUR d&apos;achat. Les delais indicatifs sont de 2 a 5
        jours ouvrables selon le mode choisi.
      </p>

      <h2>Article 7 - Droit de retractation</h2>
      <p>
        Conformement aux articles L.221-18 et suivants du Code de la consommation,
        le consommateur dispose d&apos;un delai de 14 jours pour exercer son droit de retractation.
      </p>
      <p>
        <strong>Exception alimentaire :</strong> Conformement a l&apos;article L.221-28 du Code de
        la consommation, le droit de retractation ne peut etre exerce pour les denrees
        alimentaires perissables ou dont l&apos;emballage a ete ouvert apres livraison et qui
        ne peuvent etre renvoyees pour des raisons d&apos;hygiene ou de protection de la sante.
      </p>

      <h2>Article 8 - Garanties</h2>
      <p>
        Les produits beneficient de la garantie legale de conformite (articles L.217-4
        et suivants du Code de la consommation) et de la garantie des vices caches
        (articles 1641 et suivants du Code civil).
      </p>

      <h2>Article 9 - Responsabilite</h2>
      <p>
        Vanille Shop s&apos;engage a respecter la reglementation en vigueur relative aux
        denrees alimentaires, notamment en matiere de tracabilite, d&apos;etiquetage et de
        securite alimentaire.
      </p>

      <h2>Article 10 - Litiges</h2>
      <p>
        En cas de litige, le client peut recourir a une mediation conventionnelle ou
        a tout mode alternatif de reglement des differends. A defaut, les tribunaux
        francais seront seuls competents.
      </p>
    </div>
  );
}
