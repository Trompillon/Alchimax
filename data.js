// data.js

export const INGREDIENTS = [
    {
        id: "aconit",
        nom: "Aconit",
        type: "plant", 
        rarity: "Rare", 
        biomes: ["Bois et Forêts", "Lacs et Rivières"],
        description: "Cette fleur blanc-gris ne fleurit qu’à la pleine lune et à des altitudes élevées. On les trouve plutôt dans les régions froides et montagneuses. Les chiens détestent son odeur.",
        effetUnique: null,
    },
    {
        id: "amanite_arc_en_ciel",
        nom: "Amanite arc en ciel",
        type: "plant", 
        rarity: "Rare", 
        biomes: ["Bois et Forêts", "Souterrains"],
        description: "Même si son nom peut faire courir l’imagination, ce champignon ressemble à un champignon ordinaire, avec un chapeau marron, des lames noires et un pied blanc. Du moins, jusqu’à ce qu’il soit coupé. La chair exposée du chapeau est d’abord verte comme de la sauge, puis devient bleue claire avant de devenir un profond Bordeaux. La couleur du pied, quand à elle, va du bleu profond à un orange pâle après avoir été coupé ou déchiré.",
        effetUnique: "Manger ce champignon oblige le consommateur à faire un jet de sauvegarde de Sagesse DD 14. En cas d’échec, le consommateur devient confus pendant 30 minutes. Pendant cette période, le consommateur voit les couleurs bien plus intensément que d’habitude et les voit changer d’une nuance à l'autre.",
    },
    {
        id: "amanite_lave",
        nom: "Amanite de lave",
        type: "plant", 
        rarity: "Rare", 
        biomes: ["Souterrains"],
        description: "L'Amanite de Lave est une espèce rare de champignon qui pousse uniquement dans les régions volcaniques et les terres embrasées par le feu. Sa silhouette imposante se dresse parmi les rochers noircis et la lave refroidie, ses capuchons ressemblant à des éclats de lave solidifiée émettant une lueur rougeoyante.",
        effetUnique: null,
    },
    {
        id: "amanite_rouge",
        nom: "Amanite rouge",
        type: "plant", 
        rarity: "Uncommon", 
        biomes: ["Bois et Forêts"],
        description: "Ce champignon à chapeau rouge peut atteindre lataille d’un petit plat. Il inflige 1d4 dégâts de poison lorsqu’il est ingéré, mais à petites doses, il peut être utilisé pour brasser des potions de guérison par un herboriste soigneux.",
        effetUnique: "Il inflige 1d4 dégâts de poison lorsqu’il est ingéré.",
    },
    {
        id: "anthocerote_carmin",
        nom: "Anthocérote carmin",
        type: "plant", 
        rarity: "Very Rare", 
        biomes: ["Lacs et Rivières"],
        description: "Cette mousse ressemble à une laitue de couleur rouge, mais le quidam qui jeterait un coup d'oeil rapide avant de continuer sa route perdrait l'occasion de récolter une plante des plus rares et aux vertues de guérison des pluis puissantes.",
        effetUnique: null,
    },
    {
        id: "aplectrelle_hiver",
        nom: "Aplectrelle d'hiver",
        type: "plant", 
        rarity: "Very Rare", 
        biomes: ["Bois et Forêts"],
        description: "C'est une plante extrêmement rare et prisée pour être un ingrédient universel, c'est à dire un ingrédient qui peut remplacer n'importe quel autre ingrédient végétal.",
        effetUnique: null,
    },
    {
        id: "asperges_pre",
        nom: "Asperges de pré",
        type: "plant", 
        rarity: "Uncommon", 
        biomes: ["Bois et Forêts", "Lacs et Rivières"],
        description: "Anthoceros punctatus ou asperges de pré est une mousse de la famille des Anthocerotaceae, elle perce la neige pour trouver le soleil et ressemble a des asperges. A ne pas confondre avec le perce-neige. Les herboristes l'utilisent pour ses qualités dans leurs préparations.",
        effetUnique: null,
    },
    {
        id: "baie_buisson_ardent",
        nom: "Baies de buisson ardent",
        type: "plant", 
        rarity: "Common", 
        biomes: ["Bois et Forêts"],
        description: "Le buisson ardent ou Pyracantha est une plante de la famille des Rosacéae. Ses baies colorées rouge vif tranchent dans le paysage froid ou on les trouve.",
        effetUnique: "Manger une baie soigne 1pv.",
    },
    {
        id: "baie_gel_eternel",
        nom: "Baies de gel éternel",
        type: "plant", 
        rarity: "Common", 
        biomes: ["Bois et Forêts", "Lacs et Rivières"],
        description: "Une baie bleu clair en forme de coeur de la taille d’une myrtille de la famille des Ericaceae, connue pour ses propriétés purifiantes. Les plantes sur lesquelles ces baies poussent sont totalement immunisées contre tout dommage causé par le gel, et sont connues pour leur abondance de fruits pendant les hivers rigoureux.",
        effetUnique: null
    },
    {
        id: "belladone",
        nom: "Belladone",
        type: "plant", 
        rarity: "Uncommon", 
        biomes: ["Lacs et Rivières"],
        description: "Une fleur noire et encre avec une tige violette. Elle inflige 1d4 dégâts de poison lorsqu’elle est ingérée et,en cas d’échec au jet de sauvegarde de Constitution DD10, elle inflige l’état empoisonné pendant 2d4 heures.",
        effetUnique: "1d4 dégâts de poison si ingérée, et DD10 Constitution pour éviter l'état empoisonné pendant 2d4 heures.",
    },
    {
        id: "herbe_frisee",
        nom: "Herbe frisée",
        type: "plant", 
        rarity: "Common", 
        biomes: ["Bois et Forêts", "Lacs et Rivières", "Montagnes et collines", "Souterrains", "Zones urbaines"],
        description: "Avec ses feuilles blanches et vertes larges comme le doigt, l'herbe frisée pousse dans tous les climats et toutes les régions. Elle est à la base de nombreux baumes et potions diverses.",
        effetUnique: null,
    },
    {
        id: "rameau_thym_sauvage",
        nom: "Rameau de thym sauvage",
        type: "plant", 
        rarity: "Common", 
        biomes: ["Bois et Forêts", "Lacs et Rivières", "Montagnes et collines", "Souterrains", "Zones urbaines"],
        description: "Plante aromatique de la famille des Lamiacées, elle est utilisé pour l'huile essentielle qu'on peut y récolter, ainsi que pour son parfum souvent utilisé dans l'encens.",
        effetUnique: null,
    },
    {
        id: "fleur_cendres",
        nom: "Fleur des cendres",
        type: "plant",
        rarity: "Uncommon",
        biomes: ["Bois et Forêts", "Lacs et Rivières",  "Zones urbaines"],
        description: "Cette petite fleur est d’un rouge vif avec un centre jaune, et pousse habituellement dans des environnements chauds. Elle inflige 1d4 dégâts de feu lorsqu’elle est ingérée, mais peut être utilisée pour préparer de nombreuses potions liées au feu par un alchimiste compétent.",
        effetUnique: "1d4 dégâts de feu si ingérée.",
    },
    {
        id: "herbe_saint_christophe",
        nom: "Herbe de Saint-Christophe",
        type: "plant",
        rarity: "Common",
        biomes: ["Zones urbaines"],
        description: "Ces arbres forment des grappes de petites baies rouges et blanches densément emballées sans jamais fleurir. Bien qu’elles aient un goût délicieux, elles sont toxiques voire mortelles pour les enfants. En raison de leur croissance dans les zones urbaines, ces arbres tuent des dizaines d’enfants chaque année. On pense qu’ils sont une création de Cyric ou Beshaba.",
        effetUnique: "Ingérer une baie inflige 1d4 dégâts de poison.",
    },
    {
        id: "lys_flamme",
        nom: "Lys de flamme",
        type: "plant",
        rarity: "Uncommon",
        biomes: ["Bois et Forêts", "Lacs et Rivières", "Zones urbaines"],
        description: "Nommée après ses fleurs rouges et oranges à sept feuilles dont les pétales pointent vers le ciel plutôt que vers les tiges vers le bas, ressemblant à une flamme. Lorsqu’elles sont utilisées avec précaution, ces fleurs peuvent être utilisées pour des mélanges curatifs, mais des doses élevées sont dangereuses.", 
        effetUnique: null
    },
    {
        id: "pois_feu",
        nom: "Pois de feu",
        type: "plant",
        rarity: "Common",
        biomes: ["Bois et Forêts", "Lacs et Rivières"],
        description: "Bien que les fleurs bleues pâles de cette plante puissent le suggérer, les gousses de cette petite arbuste sont brûlement épicées et recherchées comme épice dans certaines régions du monde.", 
        effetUnique: null
    },
    {
        id: "glande_punaise_feu",
        nom: "Glande de punaise de feu",
        type: "creature",
        rarity: "Common",
        description: "Poche de liquide hautement inflammable.",
        effetUnique: null
    },
    {
        id: "essence_elementaire_feu",
        nom: "Essence élémentaire de feu",
        type: "creature",
        rarity: "Uncommon",
        description: "Une substance luminescente et chaude, issue d'un élémentaire du feu.",
        effetUnique: null
    },
    {
        id: "coeur_quasit",
        nom: "Cœur de quasit",
        type: "creature",
        rarity: "Uncommon",
        description: "Un organe vital d'un quasit, extrêmement précieux pour les alchimistes expérimentés.",
        effetUnique: null
    },
];

export const RECETTES = [
  {
    id: "feu_gregeois",
    nom: "Feu grégeois",
    category: "alchemy", 
    rarity: "Common",
    description: "S'enflamme au contact de l'air. Inflige 1d4 dégâts de feu par tour.",
    requiredIngredients: {
      permittedPlants: ["fleur_cendres", "pois_feu", "lys_flamme"],
      permittedAnimals: ["glande_punaise_feu", "essence_elementaire_feu", "coeur_quasit"],
      others: ["flacon_huile"] 
    }
  },
  {
    id: "potion_soin",
    nom: "Potion de soin",
    category: "herbalism",
    rarity: "Common",
    description: "Un personnage qui boit cette potion récupère 1d8 points de vie.",
    requiredIngredients: {
      permittedPlants: ["baie_buisson_ardent", "baie_gel_eternel", "herbe_frisee", "rameau_thym_sauvage", "amanite_rouge", "chèvrefeuille_hiver", "rameau_orme", "sarcococca","amanite_lave","feuilles_nolina_rouge","pied_bleu","sarriette-pin","anthocerote_carmin","etoile_glacier","hygrophore_neige","lumiere_hiver"], 
      requiredQuantity: 2 
    }
  },
  {
    id: "poison_basique",
    nom: "Poison basique",
    category: "poison",
    rarity: "Common",
    description: "Une créature touchée par l’arme ou les munitions empoisonnées doit faire un jet de sauvegarde de Constitution DD 10 ou subir 1d4 dégâts de poison.",
    requiredIngredients: {
      permittedPlants: ["herbe_saint_christophe","belladone"],  
    }
  }
];