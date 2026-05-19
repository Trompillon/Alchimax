import { INGREDIENTS, RECETTES } from './data.js';

// ==========================================
// 1. SÉLECTEURS DOM
// ==========================================
const btnModeEncyclo = document.getElementById('btn-mode-encyclo');
const btnModeChaudron = document.getElementById('btn-mode-chaudron');
const viewEncyclopedia = document.getElementById('view-encyclopedia');
const viewCauldron = document.getElementById('view-cauldron');

// Encyclopédie
const searchInput = document.getElementById('search-potion');
const selectRarete = document.getElementById('select-rarete');
const btnFilters = document.querySelectorAll('.btn-filter');
const encycloResultsContainer = document.getElementById('encyclo-results-container');
const encycloPreview = document.getElementById('encyclo-preview');

// Chaudron
const searchIngredientInput = document.getElementById('search-ingredient');
const selectRareteIngredient = document.getElementById('select-rarete-ingredient');
const inventoryInputsContainer = document.getElementById('inventory-inputs-container');
const craftReadyContainer = document.getElementById('craft-ready');
const craftAlmostContainer = document.getElementById('craft-almost');

// ==========================================
// 2. ÉTAT GLOBAL DE L'APPLICATION
// ==========================================
let filtreCategorie = 'all'; 

// L'inventaire du joueur (ID_INGREDIENT: QUANTITÉ)
const sacDuJoueur = {};
INGREDIENTS.forEach(ing => {
    sacDuJoueur[ing.id] = 0;
});

// ==========================================
// 3. GESTION DES MODES (SPA)
// ==========================================
btnModeEncyclo.addEventListener('click', () => {
    btnModeEncyclo.classList.add('active');
    btnModeChaudron.classList.remove('active');
    viewEncyclopedia.classList.remove('hidden');
    viewCauldron.classList.add('hidden');
});

btnModeChaudron.addEventListener('click', () => {
    btnModeChaudron.classList.add('active');
    btnModeEncyclo.classList.remove('active');
    viewCauldron.classList.remove('hidden');
    viewEncyclopedia.classList.add('hidden');
    
    // Rafraîchir l'affichage du chaudron à l'ouverture
    filtrerEtAfficherInventaire();
    calculerCraftsPossibles();
});

// ==========================================
// 4. MOTEUR DE RECHERCHE (ENCYCLOPÉDIE)
// ==========================================
function filtrerEtAfficherPotions() {
    const texteRecherche = searchInput.value.toLowerCase().trim();
    const rareteSelectionnee = selectRarete.value;

    const recettesFiltrees = RECETTES.filter(potion => {
        const correspondTexte = potion.nom.toLowerCase().includes(texteRecherche);
        const correspondCategorie = (filtreCategorie === 'all' || potion.categorie === filtreCategorie);
        
        // Nettoyage de la rareté pour la comparaison avec le HTML
        const raretePotionNettoyee = potion.rarete.toLowerCase().replace(' ', '-').replace('é', 'e');
        const correspondRarete = (rareteSelectionnee === 'all' || raretePotionNettoyee === rareteSelectionnee);
        
        return correspondTexte && correspondCategorie && correspondRarete;
    });

    encycloResultsContainer.innerHTML = '';

    if (recettesFiltrees.length === 0) {
        encycloResultsContainer.innerHTML = `<p class="short-desc" style="padding: 10px;">Aucune potion trouvée...</p>`;
        return;
    }

    recettesFiltrees.forEach(potion => {
        const card = document.createElement('div');
        card.classList.add('card', `item-${potion.categorie}`); 
        const rareteClass = potion.rarete.toLowerCase().replace(' ', '').replace('é', 'e');

        card.innerHTML = `
            <h3>${potion.nom}</h3>
            <span class="badge rarete-${rareteClass}">${potion.rarete}</span>
            <p class="short-desc">${potion.description.substring(0, 60)}...</p>
        `;

        card.addEventListener('click', () => afficherFicheRecette(potion));
        encycloResultsContainer.appendChild(card);
    });
}

function afficherFicheRecette(potion) {
    const rareteClass = potion.rarete.toLowerCase().replace(' ', '').replace('é', 'e');
    
    encycloPreview.innerHTML = `
        <div class="recipe-detail">
            <h2 style="font-size: 2rem; margin-bottom: 5px; color: #270f00;">${potion.nom}</h2>
            <span class="badge rarete-${rareteClass}" style="margin-bottom: 20px;">
                ${potion.categorie.toUpperCase()} - ${potion.rarete}
            </span>
            <p class="potion-effect" style="font-style: italic; margin-bottom: 25px; font-size: 1.1rem;">
                "${potion.description}"
            </p>
            <h3 style="border-bottom: 1px solid var(--border-color); padding-bottom: 5px; margin-bottom: 15px;">Formule de Craft</h3>
            <div id="recipe-slots-container"></div>
        </div>
    `;

    const slotsContainer = document.getElementById('recipe-slots-container');

    if (potion.categorie === 'alchimie') {
        slotsContainer.innerHTML += genererHtmlSlot("Composant Végétal requis (au choix)", potion.ingredientsRequis.vegetauxPermis);
        slotsContainer.innerHTML += genererHtmlSlot("Composant Créature requis (au choix)", potion.ingredientsRequis.animauxPermis);
    } 
    else if (potion.categorie === 'herboristerie') {
        slotsContainer.innerHTML += `<p style="margin-bottom: 10px; font-weight: bold; color: var(--accent-herb);">🧪 Nécessite ${potion.ingredientsRequis.quantiteNecessaire} végétaux DIFFÉRENTS :</p>`;
        slotsContainer.innerHTML += genererHtmlSlot("Plantes valides", potion.ingredientsRequis.vegetauxPermis);
    } 
    else if (potion.categorie === 'poison') {
        slotsContainer.innerHTML += genererHtmlSlot("Composant requis", potion.ingredientsRequis.vegetauxPermis || potion.ingredientsRequis.animauxPermis);
    }
}

function genererHtmlSlot(titreSlot, listeIds) {
    if (!listeIds || listeIds.length === 0) return '';
    let listeHtml = listeIds.map(idIng => {
        const ing = INGREDIENTS.find(i => i.id === idIng);
        if (!ing) return `<li style="color: red;">Inconnu (${idIng})</li>`;
        
        const biome = ing.biomes ? ` <small style="color: var(--text-muted);">(${ing.biomes.join(', ')})</small>` : '';
        
        // Nettoyage strict pour coller à tes variables CSS (ex: "très rare" devient "tresrare")
        const rareteCode = ing.rarete.toLowerCase()
                                      .replace('é', 'e')
                                      .replace('è', 'e')
                                      .replace('-', '')
                                      .replace(' ', '');
        
        // On applique directement ta variable d'encre en couleur de texte (color)
        return `
            <li style="margin-bottom: 6px; list-style-type: square; margin-left: 20px;">
                <strong>${ing.nom}</strong> 
                (<span style="color: var(--rar-${rareteCode}); font-weight: bold;">${ing.rarete}</span>)
                ${biome}
            </li>`;
    }).join('');

    return `<div class="recipe-slot" style="margin-bottom: 15px; background: var(--bg-card); padding: 10px; border-radius: 4px;"><h4 style="color: var(--text-main);">${titreSlot}</h4><ul>${listeHtml}</ul></div>`;
}

// ==========================================
// 5. GESTION DE L'INVENTAIRE (CHAUDRON)
// ==========================================
function filtrerEtAfficherInventaire() {
    const texte = searchIngredientInput.value.toLowerCase().trim();
    const rarete = selectRareteIngredient.value;

    // Déduction des ingrédients utiles selon la catégorie active
    let idsIngredientsUtiles = [];
    
    if (filtreCategorie !== 'all') {
        const recettesDeLaCategorie = RECETTES.filter(p => p.categorie === filtreCategorie);
        
        recettesDeLaCategorie.forEach(potion => {
            if (potion.ingredientsRequis.vegetauxPermis) {
                idsIngredientsUtiles.push(...potion.ingredientsRequis.vegetauxPermis);
            }
            if (potion.ingredientsRequis.animauxPermis) {
                idsIngredientsUtiles.push(...potion.ingredientsRequis.animauxPermis);
            }
        });
        
        idsIngredientsUtiles = [...new Set(idsIngredientsUtiles)];
    }

    const ingredientsFiltrés = INGREDIENTS.filter(ing => {
        const correspondTexte = ing.nom.toLowerCase().includes(texte);
        
        const rareteIngredientNettoyee = ing.rarete.toLowerCase().replace(' ', '-').replace('é', 'e');
        const correspondRarete = (rarete === 'all' || rareteIngredientNettoyee === rarete);
        
        const correspondFiltrePrincipal = (filtreCategorie === 'all' || idsIngredientsUtiles.includes(ing.id));

        return correspondTexte && correspondRarete && correspondFiltrePrincipal;
    });

    inventoryInputsContainer.innerHTML = '';

    if (ingredientsFiltrés.length === 0) {
        inventoryInputsContainer.innerHTML = `<p class="short-desc" style="padding: 10px;">Aucun composant requis pour cette catégorie...</p>`;
        return;
    }

    ingredientsFiltrés.forEach(ing => {
        const row = document.createElement('div');
        row.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 8px; background: var(--bg-card); border-radius: 4px; border-left: 3px solid #8d6e63;";
        
        const typeIcon = ing.type === 'vegetal' ? '🌿' : '⚔️';
        
        row.innerHTML = `
            <div>
                <span style="font-size: 1.1rem; margin-right: 5px;">${typeIcon}</span>
                <strong>${ing.nom}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">${ing.rarete}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <button class="btn-qty-minus" style="padding: 2px 10px;">-</button>
                <span class="qty-display" style="font-weight: bold; font-size: 1.1rem; min-width: 20px; text-align: center;">${sacDuJoueur[ing.id]}</span>
                <button class="btn-qty-plus" style="padding: 2px 10px;">+</button>
            </div>
        `;

        row.querySelector('.btn-qty-minus').addEventListener('click', () => {
            if (sacDuJoueur[ing.id] > 0) {
                sacDuJoueur[ing.id]--;
                row.querySelector('.qty-display').textContent = sacDuJoueur[ing.id];
                calculerCraftsPossibles();
            }
        });

        row.querySelector('.btn-qty-plus').addEventListener('click', () => {
            sacDuJoueur[ing.id]++;
            row.querySelector('.qty-display').textContent = sacDuJoueur[ing.id];
            calculerCraftsPossibles();
        });

        inventoryInputsContainer.appendChild(row);
    });
}

// ==========================================
// 6. ALGORITHME : LE CHAUDRON DE CRAFT
// ==========================================
function calculerCraftsPossibles() {
    craftReadyContainer.innerHTML = '';
    craftAlmostContainer.innerHTML = '';

    let totalDispo = 0;
    Object.values(sacDuJoueur).forEach(v => totalDispo += v);

    if (totalDispo === 0) {
        craftReadyContainer.innerHTML = '<p class="short-desc">Votre sac est vide. Ajoutez des ingrédients pour lancer les simulations.</p>';
        craftAlmostContainer.innerHTML = '<p class="short-desc">Votre sac est vide.</p>';
        return;
    }

    RECETTES.forEach(potion => {
        const correspondCategorie = (filtreCategorie === 'all' || potion.categorie === filtreCategorie);
        if (!correspondCategorie) return; // Si la potion n'est pas de la bonne catégorie, on l'ignore !
        let peutCraft = false;
        let manqueUnSeul = false;
        let detailManquant = "";

        // ----- CAS 1 : ALCHIMIE -----
        if (potion.categorie === 'alchimie') {
            const plantesPossedees = potion.ingredientsRequis.vegetauxPermis.filter(id => sacDuJoueur[id] > 0);
            const creaturesPossedees = potion.ingredientsRequis.animauxPermis.filter(id => sacDuJoueur[id] > 0);

            const aPlante = plantesPossedees.length > 0;
            const aCreature = creaturesPossedees.length > 0;

            if (aPlante && aCreature) peutCraft = true;
            else if (aPlante && !aCreature) { manqueUnSeul = true; detailManquant = "1 Composant Créature"; }
            else if (!aPlante && aCreature) { manqueUnSeul = true; detailManquant = "1 Composant Végétal"; }
        }

        // ----- CAS 2 : HERBORISTERIE -----
        else if (potion.categorie === 'herboristerie') {
            const plantesValidesPossedees = potion.ingredientsRequis.vegetauxPermis.filter(id => sacDuJoueur[id] > 0);
            const nbrPlantesPossedees = plantesValidesPossedees.length;
            const requis = potion.ingredientsRequis.quantiteNecessaire;

            if (nbrPlantesPossedees >= requis) peutCraft = true;
            else if (nbrPlantesPossedees === requis - 1) { manqueUnSeul = true; detailManquant = "1 Plante différente valide"; }
        }

        // ----- CAS 3 : POISON -----
        else if (potion.categorie === 'poison') {
            const listeIds = potion.ingredientsRequis.vegetauxPermis || potion.ingredientsRequis.animauxPermis;
            const possedes = listeIds.filter(id => sacDuJoueur[id] > 0);

            if (possedes.length > 0) peutCraft = true;
            else { manqueUnSeul = true; detailManquant = "L'ingrédient de base"; }
        }

        // ----- AFFICHAGE DES RÉSULTATS -----
        if (peutCraft) {
            craftReadyContainer.innerHTML += `
                <div class="card item-${potion.categorie}" style="margin-bottom: 8px;">
                    <h3 style="color: #270f00;">✨ ${potion.nom}</h3>
                    <p class="short-desc" style="color: green; font-weight: bold;">Prêt à être distillé !</p>
                </div>
            `;
        } else if (manqueUnSeul) {
            craftAlmostContainer.innerHTML += `
                <div class="card" style="margin-bottom: 8px; border-left: 5px solid #ff9100; opacity: 0.85;">
                    <h3 style="color: #5d4037;">${potion.nom}</h3>
                    <p class="short-desc" style="color: #d84315;">❌ Manque : ${detailManquant}</p>
                </div>
            `;
        }
    });

    if (craftReadyContainer.innerHTML === '') craftReadyContainer.innerHTML = '<p class="short-desc">Aucune potion craftable avec ces ingrédients.</p>';
    if (craftAlmostContainer.innerHTML === '') craftAlmostContainer.innerHTML = '<p class="short-desc">Aucune potion proche.</p>';
}

// ==========================================
// 7. ÉCOUTEURS D'ÉVÉNEMENTS (LISTENERS)
// ==========================================
searchInput.addEventListener('input', filtrerEtAfficherPotions);
selectRarete.addEventListener('change', filtrerEtAfficherPotions);

searchIngredientInput.addEventListener('input', filtrerEtAfficherInventaire);
selectRareteIngredient.addEventListener('change', filtrerEtAfficherInventaire);

btnFilters.forEach(btn => {
    btn.addEventListener('click', (e) => {
        btnFilters.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        filtreCategorie = e.target.getAttribute('data-filter');
        
        filtrerEtAfficherPotions();
        filtrerEtAfficherInventaire(); 
    });
});

// Initialisation au chargement
filtrerEtAfficherPotions();