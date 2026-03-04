# Prompt Claude — Créer un site e-commerce de produits alimentaires

## Prompt principal

```
Tu es un développeur web fullstack senior spécialisé en e-commerce alimentaire.
Aide-moi à créer un site e-commerce pour vendre des produits alimentaires en ligne.

## Contexte
- Type de produits : produits alimentaires (épicerie, boissons, produits frais, produits du terroir)
- Cible : consommateurs particuliers
- Objectif : permettre la commande en ligne avec livraison ou retrait

## Ce que tu dois concevoir

### 1. Architecture technique
- Stack recommandé (framework frontend, backend, base de données)
- Hébergement et déploiement
- Passerelle de paiement adaptée (Stripe, PayPal, etc.)

### 2. Fonctionnalités essentielles
- Catalogue produits avec catégories (épicerie, boissons, frais, surgelés, etc.)
- Fiches produits avec : nom, description, prix, poids/volume, allergènes, DLC, photos
- Panier d'achat et tunnel de commande
- Gestion des modes de livraison (livraison à domicile, point relais, click & collect)
- Système de paiement sécurisé
- Espace client (historique commandes, adresses, favoris)
- Gestion des stocks et alertes de rupture

### 3. Spécificités alimentaires
- Affichage obligatoire des allergènes
- Gestion des dates de péremption (DLC/DDM)
- Conditions de conservation (frais, ambiant, surgelé)
- Conformité réglementaire (mentions légales, CGV, droit de rétractation alimentaire)
- Traçabilité des lots

### 4. SEO et marketing
- Pages produits optimisées pour le référencement
- Blog recettes / conseils nutrition
- Programme de fidélité
- Codes promotionnels et offres spéciales
- Intégration newsletter

### 5. Administration
- Dashboard vendeur (commandes, CA, statistiques)
- Gestion du catalogue (ajout/modification/suppression produits)
- Gestion des commandes et suivi livraison
- Gestion des clients

## Contraintes
- Le site doit être responsive (mobile-first)
- Temps de chargement < 3 secondes
- Conforme RGPD
- Accessible (WCAG 2.1 niveau AA)

## Livrable attendu
Fournis-moi le code complet, étape par étape, avec des explications claires.
Commence par la structure du projet et les dépendances, puis avance fonctionnalité par fonctionnalité.
```

## Variantes utiles

### Prompt pour le design
```
Tu es un UX/UI designer spécialisé en e-commerce alimentaire.
Propose-moi un design moderne et appétissant pour un site de vente
de produits alimentaires en ligne. Inclus :
- La palette de couleurs (tons naturels, frais)
- La typographie
- Le layout des pages principales (accueil, catalogue, fiche produit, panier)
- Les composants UI clés
Fournis des mockups en description détaillée ou en code HTML/CSS.
```

### Prompt pour le business plan
```
Tu es un consultant en stratégie e-commerce alimentaire.
Aide-moi à élaborer un business plan pour un site de vente
de produits alimentaires en ligne. Couvre :
- L'analyse de marché
- Le modèle économique (marges, frais de livraison, seuil de rentabilité)
- La stratégie d'acquisition client
- La logistique (stockage, chaîne du froid, livraison)
- Les obligations réglementaires en France
- Le budget de lancement estimé
```

### Prompt pour les fiches produits
```
Tu es un rédacteur web spécialisé en produits alimentaires.
Rédige des fiches produits optimisées SEO pour les produits suivants : [LISTE].
Chaque fiche doit contenir :
- Un titre accrocheur avec le mot-clé principal
- Une description courte (2 lignes) pour le catalogue
- Une description longue (150-200 mots) avec les bénéfices
- Les informations nutritionnelles
- Les suggestions d'utilisation / recettes
- Les balises meta (title, description)
```
