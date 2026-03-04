import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Politique de confidentialite' };

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-earth">
      <h1 className="section-title">Politique de confidentialite</h1>
      <p className="text-sm text-earth-500">Conforme au RGPD - Derniere mise a jour : mars 2026</p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Vanille Shop SAS, [adresse], est responsable du traitement de vos donnees personnelles
        collectees via le site vanilleshop.fr.
      </p>

      <h2>2. Donnees collectees</h2>
      <p>Nous collectons les donnees suivantes :</p>
      <ul>
        <li><strong>Identification :</strong> nom, prenom, email, telephone</li>
        <li><strong>Livraison :</strong> adresse postale</li>
        <li><strong>Professionnels :</strong> raison sociale, SIRET, numero de TVA</li>
        <li><strong>Commandes :</strong> historique d&apos;achats, preferences</li>
        <li><strong>Navigation :</strong> cookies techniques necessaires au fonctionnement</li>
      </ul>

      <h2>3. Finalites du traitement</h2>
      <ul>
        <li>Gestion des commandes et livraisons</li>
        <li>Gestion du compte client</li>
        <li>Envoi de la newsletter (avec consentement)</li>
        <li>Programme de fidelite</li>
        <li>Service client</li>
        <li>Obligations legales et comptables</li>
      </ul>

      <h2>4. Base legale</h2>
      <p>
        Les traitements sont fondes sur l&apos;execution du contrat (commandes),
        le consentement (newsletter, cookies non essentiels), l&apos;interet legitime
        (amelioration du service) et les obligations legales (comptabilite, fiscalite).
      </p>

      <h2>5. Duree de conservation</h2>
      <ul>
        <li>Donnees client : 3 ans apres le dernier achat</li>
        <li>Donnees de commande : 10 ans (obligations comptables)</li>
        <li>Cookies : 13 mois maximum</li>
        <li>Newsletter : jusqu&apos;au desabonnement</li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>
        Conformement au RGPD, vous disposez des droits suivants :
      </p>
      <ul>
        <li><strong>Droit d&apos;acces :</strong> obtenir une copie de vos donnees</li>
        <li><strong>Droit de rectification :</strong> corriger des donnees inexactes</li>
        <li><strong>Droit a l&apos;effacement :</strong> demander la suppression de vos donnees</li>
        <li><strong>Droit a la portabilite :</strong> recevoir vos donnees dans un format structure</li>
        <li><strong>Droit d&apos;opposition :</strong> vous opposer a certains traitements</li>
        <li><strong>Droit a la limitation :</strong> limiter le traitement de vos donnees</li>
      </ul>
      <p>
        Pour exercer ces droits : <strong>rgpd@vanilleshop.fr</strong><br />
        Vous pouvez egalement introduire une reclamation aupres de la CNIL.
      </p>

      <h2>7. Securite</h2>
      <p>
        Nous mettons en oeuvre des mesures techniques et organisationnelles appropriees
        pour proteger vos donnees : chiffrement SSL/TLS, acces restreint, hebergement
        securise, paiement via Stripe (certifie PCI DSS).
      </p>

      <h2>8. Transferts de donnees</h2>
      <p>
        Vos donnees de paiement sont traitees par Stripe Inc. (USA) dans le cadre de
        garanties appropriees (clauses contractuelles types de la Commission europeenne).
      </p>
    </div>
  );
}
