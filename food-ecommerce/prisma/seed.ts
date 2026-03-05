import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin12345', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vanilleshop.fr' },
    update: {},
    create: {
      email: 'admin@vanilleshop.fr',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'VanilleShop',
      role: 'ADMIN',
      accountType: 'PARTICULIER',
      rgpdConsent: true,
      rgpdConsentDate: new Date(),
    },
  });

  // Test client
  const clientPassword = await bcrypt.hash('client12345', 12);
  await prisma.user.upsert({
    where: { email: 'client@test.fr' },
    update: {},
    create: {
      email: 'client@test.fr',
      passwordHash: clientPassword,
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'CLIENT',
      accountType: 'PARTICULIER',
      rgpdConsent: true,
      rgpdConsentDate: new Date(),
      newsletter: true,
    },
  });

  // Test pro client
  const proPassword = await bcrypt.hash('pro12345678', 12);
  await prisma.user.upsert({
    where: { email: 'pro@patisserie.fr' },
    update: {},
    create: {
      email: 'pro@patisserie.fr',
      passwordHash: proPassword,
      firstName: 'Jean',
      lastName: 'Boulanger',
      role: 'PRO',
      accountType: 'PROFESSIONNEL',
      companyName: 'Patisserie Boulanger',
      siret: '12345678901234',
      tvaNumber: 'FR12345678901',
      rgpdConsent: true,
      rgpdConsentDate: new Date(),
    },
  });

  // Products
  const products = [
    {
      slug: 'gousses-vanille-bourbon-madagascar',
      name: 'Gousses de Vanille Bourbon - Madagascar',
      description: `Nos gousses de vanille Bourbon de Madagascar sont selectionnees parmi les meilleures plantations de la region SAVA. Chaque gousse mesure entre 16 et 18 cm, charnue et souple, avec un taux de vanilline exceptionnel.

La vanille Bourbon de Madagascar est la reference mondiale en patisserie. Ses notes chaudes, rondes et cacaotees en font l'ingredient ideal pour vos cremes, glaces, gateaux et desserts.

Recoltee a maturite, preparee selon le procede traditionnel de fermentation et sechage pendant 8 mois, notre vanille developpe des aromes d'une richesse incomparable.`,
      shortDescription: 'Gousses premium 16-18cm, qualite Gourmet, aromes intenses de cacao et caramel',
      category: 'GOUSSES',
      origin: 'MADAGASCAR',
      quality: 'GOURMET',
      priceParticulier: 12.90,
      pricePro: 9.50,
      weight: 4,
      unitLabel: '1 gousse',
      allergens: '[]',
      ingredients: 'Vanille Bourbon (Vanilla planifolia) de Madagascar',
      conservation: 'AMBIANT',
      stock: 150,
      stockAlert: 20,
      isActive: true,
      isFeatured: true,
      metaTitle: 'Gousse de Vanille Bourbon Madagascar - Premium Gourmet | VanilleShop',
      metaDescription: 'Achetez des gousses de vanille Bourbon de Madagascar qualite Gourmet. 16-18cm, charnues, aromes intenses. Livraison rapide. Tarifs pro disponibles.',
      minOrderPro: 10,
    },
    {
      slug: 'gousses-vanille-tahiti',
      name: 'Gousses de Vanille de Tahiti',
      description: `La vanille de Tahiti (Vanilla tahitensis) est unique au monde. Cultivee en Polynesie francaise, elle se distingue par ses notes florales, anisees et fruitees qui la rendent incomparable.

Plus courte et plus epaisse que la vanille Bourbon, la gousse tahitienne est tres genereuse en caviar. Son profil aromatique delicat est particulierement apprecie des grands chefs.

Ideale pour les preparations crues, les fruits, les salades, le chocolat blanc et les desserts ou l'on souhaite une vanille subtile et elegante.`,
      shortDescription: 'Vanille rare aux notes florales et anisees, la favorite des grands chefs',
      category: 'GOUSSES',
      origin: 'TAHITI',
      quality: 'GOURMET',
      priceParticulier: 18.90,
      pricePro: 14.50,
      weight: 5,
      unitLabel: '1 gousse',
      allergens: '[]',
      ingredients: 'Vanille de Tahiti (Vanilla tahitensis)',
      conservation: 'AMBIANT',
      stock: 80,
      stockAlert: 10,
      isActive: true,
      isFeatured: true,
      metaTitle: 'Gousse de Vanille de Tahiti Premium | VanilleShop',
      metaDescription: 'Vanille de Tahiti d\'exception. Notes florales et anisees uniques. La vanille preferee des grands chefs patissiers.',
      minOrderPro: 5,
    },
    {
      slug: 'lot-10-gousses-madagascar-gourmet',
      name: 'Lot de 10 Gousses Madagascar Gourmet',
      description: `Un lot de 10 gousses de vanille Bourbon de Madagascar, qualite Gourmet, selectionnees pour leur homogeneite. Ideales pour les patissiers amateurs exigeants et les petits artisans.

Chaque gousse est souple, charnue, mesurant entre 16 et 18 cm. Le lot est conditionne sous vide pour preserver la fraicheur et les aromes.

Economisez en achetant en lot tout en beneficiant de la meme qualite premium.`,
      shortDescription: 'Pack economique de 10 gousses premium - Meilleur rapport qualite-prix',
      category: 'GOUSSES',
      origin: 'MADAGASCAR',
      quality: 'GOURMET',
      priceParticulier: 99.90,
      pricePro: 75.00,
      weight: 40,
      unitLabel: '10 gousses',
      allergens: '[]',
      ingredients: 'Vanille Bourbon (Vanilla planifolia) de Madagascar',
      conservation: 'AMBIANT',
      stock: 50,
      stockAlert: 10,
      isActive: true,
      isFeatured: true,
      metaTitle: 'Lot 10 Gousses Vanille Madagascar Gourmet | VanilleShop',
      metaDescription: 'Lot de 10 gousses de vanille Bourbon Madagascar qualite Gourmet au meilleur prix. Conditionnement sous vide.',
      minOrderPro: 5,
    },
    {
      slug: 'poudre-vanille-bourbon-pure-50g',
      name: 'Poudre de Vanille Bourbon Pure - 50g',
      description: `Notre poudre de vanille Bourbon est obtenue par broyage fin de gousses entieres de Madagascar. 100% pure, sans ajout de sucre ni d'additif.

Extremement concentree en aromes, une pointe de couteau suffit pour parfumer vos preparations. Ideale pour les patisseries, les smoothies, le cafe, le chocolat chaud.

Se conserve plusieurs mois dans un endroit sec et a l'abri de la lumiere.`,
      shortDescription: 'Vanille moulue 100% pure, ultra concentree, sans additifs',
      category: 'POUDRE',
      origin: 'MADAGASCAR',
      quality: 'GOURMET',
      priceParticulier: 24.90,
      pricePro: 18.50,
      weight: 50,
      unitLabel: '50g',
      allergens: '[]',
      ingredients: 'Poudre de vanille Bourbon (Vanilla planifolia) 100%',
      conservation: 'SEC',
      stock: 100,
      stockAlert: 15,
      isActive: true,
      isFeatured: false,
      metaTitle: 'Poudre de Vanille Bourbon Pure 50g | VanilleShop',
      metaDescription: 'Poudre de vanille Bourbon 100% pure de Madagascar. Sans sucre ni additifs. Ultra concentree pour vos recettes.',
    },
    {
      slug: 'extrait-vanille-naturel-100ml',
      name: 'Extrait de Vanille Naturel - 100ml',
      description: `Notre extrait de vanille est prepare de maniere artisanale par maceration de gousses de vanille Bourbon dans un melange hydroalcoolique. Minimum 200g de vanille par litre.

Un extrait de qualite professionnelle, concentre et polyvalent. Quelques gouttes suffisent pour parfumer toutes vos preparations : patisseries, boissons, sauces, marinades.

Flacon en verre ambrer pour une conservation optimale.`,
      shortDescription: 'Extrait artisanal, 200g/L de vanille, flacon verre 100ml',
      category: 'EXTRAIT',
      origin: 'MADAGASCAR',
      quality: 'GOURMET',
      priceParticulier: 19.90,
      pricePro: 15.00,
      weight: 130,
      unitLabel: '100ml',
      allergens: '["alcool"]',
      ingredients: 'Eau, alcool (35% vol.), gousses de vanille Bourbon (200g/L)',
      conservation: 'AMBIANT',
      stock: 120,
      stockAlert: 20,
      isActive: true,
      isFeatured: false,
      metaTitle: 'Extrait de Vanille Naturel Artisanal 100ml | VanilleShop',
      metaDescription: 'Extrait de vanille naturel artisanal. 200g de vanille par litre. Qualite professionnelle pour particuliers et pros.',
    },
    {
      slug: 'caviar-vanille-bourbon-50g',
      name: 'Caviar de Vanille Bourbon - 50g',
      description: `Le caviar de vanille, ce sont les graines extraites de gousses de vanille Bourbon de Madagascar. Pret a l'emploi, il vous evite le travail d'ouverture et de grattage des gousses.

Produit 100% pur, sans additif. Chaque pot contient l'equivalent de 15 a 20 gousses de vanille.

Ideal pour les professionnels qui recherchent la praticite sans compromis sur la qualite. Les grains de vanille sont visibles dans vos preparations et apportent une touche d'elegance.`,
      shortDescription: 'Graines de vanille pures, pretes a l\'emploi, equivalent 15-20 gousses',
      category: 'CAVIAR',
      origin: 'MADAGASCAR',
      quality: 'GOURMET',
      priceParticulier: 34.90,
      pricePro: 26.00,
      weight: 50,
      unitLabel: '50g',
      allergens: '[]',
      ingredients: 'Caviar de vanille Bourbon (Vanilla planifolia) 100%',
      conservation: 'FRAIS',
      stock: 60,
      stockAlert: 10,
      isActive: true,
      isFeatured: true,
      metaTitle: 'Caviar de Vanille Bourbon 50g - Pret a l\'emploi | VanilleShop',
      metaDescription: 'Caviar de vanille Bourbon pur de Madagascar. Graines pretes a l\'emploi. Equivalent 15-20 gousses. Livraison rapide.',
      minOrderPro: 3,
    },
    {
      slug: 'sucre-vanille-artisanal-200g',
      name: 'Sucre Vanille Artisanal - 200g',
      description: `Notre sucre vanille est prepare artisanalement en laissant infuser des gousses de vanille Bourbon dans du sucre de canne blond pendant plusieurs semaines.

Bien plus parfume qu'un sucre vanille industriel, il contient de veritables grains de vanille visibles. Utilisez-le pour vos yaourts, crepes, gateaux, compotes et boissons chaudes.

Un pot qui dure longtemps et qui fait la difference dans chaque recette.`,
      shortDescription: 'Sucre de canne infuse a la vanille avec grains visibles',
      category: 'PREPARE',
      origin: 'MADAGASCAR',
      quality: 'GOURMET',
      priceParticulier: 9.90,
      pricePro: 7.50,
      weight: 200,
      unitLabel: '200g',
      allergens: '[]',
      ingredients: 'Sucre de canne blond, gousses de vanille Bourbon (3%)',
      conservation: 'SEC',
      stock: 200,
      stockAlert: 30,
      isActive: true,
      isFeatured: false,
      metaTitle: 'Sucre Vanille Artisanal 200g | VanilleShop',
      metaDescription: 'Sucre vanille artisanal avec vrais grains de vanille. Sucre de canne infuse aux gousses de Madagascar.',
    },
    {
      slug: 'coffret-decouverte-vanilles-monde',
      name: 'Coffret Decouverte - Vanilles du Monde',
      description: `Un coffret d'exception pour decouvrir ou offrir 4 vanilles d'origines differentes :
- 1 gousse de vanille Bourbon de Madagascar (Gourmet)
- 1 gousse de vanille de Tahiti
- 1 gousse de vanille des Comores
- 1 gousse de vanille du Mexique

Chaque gousse est accompagnee d'une fiche descriptive avec son profil aromatique et des suggestions de recettes. Presente dans un elegant ecrin en bois.

Le cadeau ideal pour les amoureux de gastronomie et les curieux de saveurs.`,
      shortDescription: '4 vanilles d\'origines differentes dans un ecrin bois avec fiches recettes',
      category: 'COFFRET',
      origin: null,
      quality: 'GOURMET',
      priceParticulier: 49.90,
      pricePro: null,
      weight: 25,
      unitLabel: '4 gousses',
      allergens: '[]',
      ingredients: 'Vanille de Madagascar, Tahiti, Comores et Mexique',
      conservation: 'AMBIANT',
      stock: 40,
      stockAlert: 8,
      isActive: true,
      isFeatured: true,
      metaTitle: 'Coffret Decouverte Vanilles du Monde | VanilleShop',
      metaDescription: 'Coffret cadeau avec 4 vanilles d\'origines differentes. Ecrin bois avec fiches recettes. Le cadeau parfait pour les gourmets.',
    },
    {
      slug: 'gousses-vanille-comores-qualite-tk',
      name: 'Gousses de Vanille des Comores - Qualite TK',
      description: `La vanille des Comores, cultivee sur l'ile d'Anjouan, est une vanille Bourbon (Vanilla planifolia) a la richesse aromatique exceptionnelle.

Nos gousses de qualite TK (noires, souples, non fendues) sont parfaites pour les preparations culinaires courantes. Elles offrent un excellent rapport qualite-prix.

Notes aromatiques : chocolat, bois, legeres notes fumees.`,
      shortDescription: 'Vanille Bourbon des Comores, bon rapport qualite-prix',
      category: 'GOUSSES',
      origin: 'COMORES',
      quality: 'TK',
      priceParticulier: 8.90,
      pricePro: 6.00,
      weight: 3,
      unitLabel: '1 gousse',
      allergens: '[]',
      ingredients: 'Vanille Bourbon (Vanilla planifolia) des Comores',
      conservation: 'AMBIANT',
      stock: 200,
      stockAlert: 30,
      isActive: true,
      isFeatured: false,
      metaTitle: 'Gousse de Vanille des Comores TK | VanilleShop',
      metaDescription: 'Vanille Bourbon des Comores qualite TK. Bon rapport qualite-prix. Notes chocolat et bois.',
      minOrderPro: 20,
    },
    {
      slug: 'lot-100-gousses-madagascar-pro',
      name: 'Lot PRO 100 Gousses Madagascar',
      description: `Conditionnement professionnel de 100 gousses de vanille Bourbon de Madagascar, qualite Gourmet.

Gousses de 14 a 18 cm, souples et charnues, conditionnees sous vide par lots de 25 pour preserver la fraicheur.

Tarif exclusivement reserve aux professionnels. Ideal pour les patisseries, restaurants, glaciers et artisans.`,
      shortDescription: 'Conditionnement PRO - 100 gousses sous vide par lots de 25',
      category: 'GOUSSES',
      origin: 'MADAGASCAR',
      quality: 'GOURMET',
      priceParticulier: 890.00,
      pricePro: 650.00,
      weight: 400,
      unitLabel: '100 gousses',
      allergens: '[]',
      ingredients: 'Vanille Bourbon (Vanilla planifolia) de Madagascar',
      conservation: 'AMBIANT',
      stock: 20,
      stockAlert: 5,
      isActive: true,
      isFeatured: false,
      metaTitle: 'Lot PRO 100 Gousses Vanille Madagascar | VanilleShop',
      metaDescription: 'Lot professionnel de 100 gousses de vanille Bourbon Madagascar. Tarifs pros exclusifs. Livraison rapide.',
      minOrderPro: 1,
    },
  ];

  for (const productData of products) {
    const { ...data } = productData;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    });
  }

  // Blog posts
  await prisma.blogPost.upsert({
    where: { slug: 'comment-conserver-vanille' },
    update: {},
    create: {
      slug: 'comment-conserver-vanille',
      title: 'Comment bien conserver ses gousses de vanille ?',
      excerpt: 'Decouvrez les meilleures techniques pour conserver vos gousses de vanille et preserver tous leurs aromes pendant des mois.',
      content: `La conservation de la vanille est essentielle pour preserver ses aromes. Voici nos conseils :

1. A l'abri de la lumiere
Conservez vos gousses dans un endroit sombre. La lumiere degrade les aromes et peut assecher les gousses.

2. Temperature ambiante
La vanille se conserve idealement entre 15 et 20 degres. Ne la mettez JAMAIS au refrigerateur : l'humidite favorise les moisissures.

3. Dans un contenant hermetique
Utilisez un tube en verre, un bocal hermetique ou du film alimentaire. L'objectif est d'eviter le contact avec l'air qui desseche les gousses.

4. Verifier regulierement
Sortez vos gousses de temps en temps pour les aerer quelques minutes. Cela previent l'apparition de moisissures.

5. Duree de conservation
Bien conservees, les gousses de vanille peuvent garder leurs aromes pendant 2 ans et plus.

Astuce : si vos gousses ont un peu seche, placez-les dans du lait chaud pendant quelques minutes pour les rehydrater avant utilisation.`,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'recette-creme-brulee-vanille' },
    update: {},
    create: {
      slug: 'recette-creme-brulee-vanille',
      title: 'Recette : Creme brulee a la vanille de Madagascar',
      excerpt: 'La recette classique de la creme brulee, sublimee par notre vanille Bourbon de Madagascar.',
      content: `La creme brulee a la vanille est un grand classique de la patisserie francaise. Voici notre recette avec de la vraie vanille.

Ingredients (pour 6 ramequins) :
- 50 cl de creme liquide entiere
- 5 jaunes d'oeufs
- 80g de sucre + sucre pour carameliser
- 1 gousse de vanille Bourbon de Madagascar

Preparation :

1. Prechauffez le four a 100 degres (thermostat 3).

2. Fendez la gousse de vanille en deux et grattez les graines avec la pointe d'un couteau.

3. Dans une casserole, versez la creme avec les graines et la gousse. Portez a fremissement puis coupez le feu. Laissez infuser 15 minutes.

4. Fouettez les jaunes d'oeufs avec le sucre jusqu'a ce que le melange blanchisse.

5. Retirez la gousse de la creme et versez la creme sur le melange oeufs-sucre en fouettant.

6. Repartissez dans les ramequins et enfournez pour 1h a 1h15 au bain-marie.

7. Laissez refroidir puis placez au refrigerateur minimum 4h.

8. Au moment de servir, saupoudrez de sucre et caramelisez au chalumeau.

Astuce : ne jetez pas la gousse utilisee ! Rincez-la, sechez-la et plongez-la dans un bocal de sucre pour faire du sucre vanille maison.`,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // Promo code
  await prisma.promoCode.upsert({
    where: { code: 'BIENVENUE10' },
    update: {},
    create: {
      code: 'BIENVENUE10',
      type: 'POURCENTAGE',
      value: 10,
      minOrderAmount: 30,
      isActive: true,
      validUntil: new Date('2027-12-31'),
    },
  });

  await prisma.promoCode.upsert({
    where: { code: 'LIVRAISON' },
    update: {},
    create: {
      code: 'LIVRAISON',
      type: 'LIVRAISON_GRATUITE',
      value: 0,
      isActive: true,
      validUntil: new Date('2027-12-31'),
    },
  });

  console.log('Seed completed successfully!');
  console.log('Admin: admin@vanilleshop.fr / admin12345');
  console.log('Client: client@test.fr / client12345');
  console.log('Pro: pro@patisserie.fr / pro12345678');
  console.log('Promo codes: BIENVENUE10, LIVRAISON');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
