let INGREDIENTS = []; // Unifié avec la fonction de chargement
let RECIPES = []; 
let CREATURES = [];

// Player's Inventory (INGREDIENT_ID: QUANTITY)
const playerBag = {};

async function loadAllData() {
    try {
        const [plantsResponse, recipesResponse, creaturesResponse] = await Promise.all([
            fetch('./plants.json'),
            fetch('./recipes.json'),
            fetch('./creatures.json')
        ]);
        
        const rawPlants = await plantsResponse.json();
        const rawRecipes = await recipesResponse.json();
        const rawCreatures = await creaturesResponse.json();

        // 1. Nettoyage et fusion globale dans INGREDIENTS (Plantes + Créatures)
        const cleanedPlants = rawPlants.map(plant => ({
            ...plant,
            biomes: plant.biomes ? plant.biomes.split(',').map(b => b.trim()) : []
        }));

        // Sécurisation des créatures : on ajoute biomes ET une rareté par défaut si manquante
        const cleanedCreatures = rawCreatures.map(creature => ({
            ...creature,
            rarity: creature.rarity || 'Common', // Évite le crash si absent
            biomes: [] 
        }));

        // Unification du catalogue
        INGREDIENTS = [...cleanedPlants, ...cleanedCreatures];
        CREATURES = cleanedCreatures; 

        // 2. Nettoyage automatique des Recettes (Harmonisation des clés en CamelCase)
        RECIPES = rawRecipes.map(recipe => ({
            id: recipe.id,
            name: recipe.name,
            category: recipe.category,
            rarity: recipe.rarity || 'Common',
            description: recipe.description,
            requiredIngredients: {
                permittedPlants: recipe.permittedPlants ? recipe.permittedPlants.split(',').map(i => i.trim()) : [],
                permittedCreatures: recipe.permittedCreatures ? recipe.permittedCreatures.split(',').map(i => i.trim()) : [], // Corrigé en CamelCase
                requiredQuantity: Number(recipe.requiredQuantity) || 1
            }
        }));

        console.log("Magie ! Catalogue unifié chargé :", { INGREDIENTS, RECIPES, CREATURES });

        // Initialisation de l'inventaire
        INGREDIENTS.forEach(ing => { playerBag[ing.id] = 0; });
        
        filterAndDisplayPotions();
        filterAndDisplayInventory();

    } catch (error) {
        console.error("Le grimoire a planté au chargement :", error);
    }
}

// Lancement automatique au chargement du DOM
window.addEventListener('DOMContentLoaded', loadAllData);

// ==========================================
// 1. DOM SELECTORS
// ==========================================
const btnModeEncyclo = document.getElementById('btn-mode-encyclo');
const btnModeCauldron = document.getElementById('btn-mode-cauldron');
const viewEncyclopedia = document.getElementById('view-encyclopedia');
const viewCauldron = document.getElementById('view-cauldron');

// Encyclopedia
const searchInput = document.getElementById('search-potion');
const selectRarity = document.getElementById('select-rarity');
const btnFilters = document.querySelectorAll('.btn-filter');
const encycloResultsContainer = document.getElementById('encyclo-results-container');
const encycloPreview = document.getElementById('encyclo-preview');

// Cauldron
const searchIngredientInput = document.getElementById('search-ingredient');
const selectRarityIngredient = document.getElementById('select-rarity-ingredient');
const inventoryInputsContainer = document.getElementById('inventory-inputs-container');
const craftReadyContainer = document.getElementById('craft-ready');
const craftAlmostContainer = document.getElementById('craft-almost');

// ==========================================
// 2. GLOBAL APPLICATION STATE
// ==========================================
let filterCategory = 'all'; 

// ==========================================
// 3. MODE MANAGEMENT (SPA)
// ==========================================
btnModeEncyclo.addEventListener('click', () => {
    btnModeEncyclo.classList.add('active');
    btnModeCauldron.classList.remove('active');
    viewEncyclopedia.classList.remove('hidden');
    viewCauldron.classList.add('hidden');
});

btnModeCauldron.addEventListener('click', () => {
    btnModeCauldron.classList.add('active');
    btnModeEncyclo.classList.remove('active');
    viewCauldron.classList.remove('hidden');
    viewEncyclopedia.classList.add('hidden');
    
    filterAndDisplayInventory();
    calculatePossibleCrafts();
});

// ==========================================
// 4. SEARCH ENGINE (ENCYCLOPEDIA)
// ==========================================
function filterAndDisplayPotions() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedRarity = selectRarity.value;

    const filteredRecipes = RECIPES.filter(potion => {
        const matchesText = potion.name ? potion.name.toLowerCase().includes(searchText) : false;
        const matchesCategory = (filterCategory === 'all' || potion.category === filterCategory);
        
        const cleanPotionRarity = potion.rarity ? potion.rarity.toLowerCase().replace(' ', '-') : 'common';
        const matchesRarity = (selectedRarity === 'all' || cleanPotionRarity === selectedRarity);
        
        return matchesText && matchesCategory && matchesRarity;
    });

    encycloResultsContainer.innerHTML = '';

    if (filteredRecipes.length === 0) {
        encycloResultsContainer.innerHTML = `<p class="short-desc" style="padding: 10px;">Aucune potion trouvée...</p>`;
        return;
    }

    filteredRecipes.forEach(potion => {
        const card = document.createElement('div');
        card.classList.add('card', `item-${potion.category}`); 
        const rarityClass = potion.rarity ? potion.rarity.toLowerCase().replace(' ', '') : 'common';

        card.innerHTML = `
            <h3>${potion.name}</h3>
            <span class="badge rarity-${rarityClass}">${potion.rarity}</span>
            <p class="short-desc">${potion.description ? potion.description.substring(0, 60) : ''}...</p>
        `;

        card.addEventListener('click', () => displayRecipeSheet(potion));
        encycloResultsContainer.appendChild(card);
    });
}

function displayRecipeSheet(potion) {
    const rarityClass = potion.rarity ? potion.rarity.toLowerCase().replace(' ', '') : 'common';
    
    encycloPreview.innerHTML = `
        <div class="recipe-detail">
            <h2 style="font-size: 2rem; margin-bottom: 5px; color: #270f00;">${potion.name}</h2>
            <span class="badge rarity-${rarityClass}" style="margin-bottom: 20px;">
                ${potion.category.toUpperCase()} - ${potion.rarity}
            </span>
            <p class="potion-effect" style="font-style: italic; margin-bottom: 25px; font-size: 1.1rem;">
                "${potion.description || ''}"
            </p>
            <h3 style="border-bottom: 1px solid var(--border-color); padding-bottom: 5px; margin-bottom: 15px;">Formule de Craft</h3>
            <div id="recipe-slots-container"></div>
        </div>
    `;

    const slotsContainer = document.getElementById('recipe-slots-container');
    const reqIng = potion.requiredIngredients;

    if (potion.category === 'alchemy') {
        slotsContainer.innerHTML += generateSlotHtml("Composant Végétal requis (au choix)", reqIng.permittedPlants);
        slotsContainer.innerHTML += generateSlotHtml("Composant Créature requis (au choix)", reqIng.permittedCreatures);
    } 
    else if (potion.category === 'herbalism') {
        slotsContainer.innerHTML += `<p style="margin-bottom: 10px; font-weight: bold; color: var(--accent-herb);">🧪 Nécessite 2 végétaux DIFFÉRENTS :</p>`;
        slotsContainer.innerHTML += generateSlotHtml("Plantes valides", reqIng.permittedPlants);
    } 
    else if (potion.category === 'poison') {
        const validIds = reqIng.permittedPlants.length > 0 ? reqIng.permittedPlants : reqIng.permittedCreatures;
        slotsContainer.innerHTML += generateSlotHtml("Composant requis", validIds);
    }
}

function generateSlotHtml(slotTitle, idList) {
    if (!idList || idList.length === 0) return '';
    let listHtml = idList.map(idIng => {
        const ing = INGREDIENTS.find(i => i.id === idIng);
        if (!ing) return `<li style="color: red;">Inconnu (${idIng})</li>`;
        
        const biome = ing.biomes && ing.biomes.length > 0 ? ` <small style="color: var(--text-muted);">(${ing.biomes.join(', ')})</small>` : '';
        
        // Sécurisation de la rareté de l'ingrédient
        const rarityText = ing.rarity || 'Common';
        const rarityCode = rarityText.toLowerCase().replace('-', '').replace(' ', '');
        
        return `
            <li style="margin-bottom: 6px; list-style-type: square; margin-left: 20px;">
                <strong>${ing.name}</strong> 
                (<span style="color: var(--rar-${rarityCode}); font-weight: bold;">${rarityText}</span>)
                ${biome}
            </li>`;
    }).join('');

    return `<div class="recipe-slot" style="margin-bottom: 15px; background: var(--bg-card); padding: 10px; border-radius: 4px;"><h4 style="color: var(--text-main);">${slotTitle}</h4><ul>${listHtml}</ul></div>`;
}

// ==========================================
// 5. INVENTORY MANAGEMENT (CAULDRON)
// ==========================================
function filterAndDisplayInventory() {
    const text = searchIngredientInput.value.toLowerCase().trim();
    const rarity = selectRarityIngredient.value;

    let usefulIngredientIds = [];
    
    if (filterCategory !== 'all') {
        const categoryRecipes = RECIPES.filter(p => p.category === filterCategory);
        
        categoryRecipes.forEach(potion => {
            if (potion.requiredIngredients.permittedPlants) {
                usefulIngredientIds.push(...potion.requiredIngredients.permittedPlants);
            }
            if (potion.requiredIngredients.permittedCreatures) {
                usefulIngredientIds.push(...potion.requiredIngredients.permittedCreatures);
            }
        });
        
        usefulIngredientIds = [...new Set(usefulIngredientIds)];
    }

    const filteredIngredients = INGREDIENTS.filter(ing => {
        const matchesText = ing.name ? ing.name.toLowerCase().includes(text) : false;
        const cleanIngredientRarity = ing.rarity ? ing.rarity.toLowerCase().replace(' ', '-') : 'common';
        const matchesRarity = (rarity === 'all' || cleanIngredientRarity === rarity);
        const matchesMainFilter = (filterCategory === 'all' || usefulIngredientIds.includes(ing.id));

        return matchesText && matchesRarity && matchesMainFilter;
    });

    inventoryInputsContainer.innerHTML = '';

    if (filteredIngredients.length === 0) {
        inventoryInputsContainer.innerHTML = `<p class="short-desc" style="padding: 10px;">Aucun composant requis pour cette catégorie...</p>`;
        return;
    }

    filteredIngredients.forEach(ing => {
        const row = document.createElement('div');
        row.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 8px; background: var(--bg-card); border-radius: 4px; border-left: 3px solid #8d6e63;";
        
        const typeIcon = ing.type === 'vegetal' ? '🌿' : '⚔️';
        const displayRarity = ing.rarity || 'Common';
        
        row.innerHTML = `
            <div>
                <span style="font-size: 1.1rem; margin-right: 5px;">${typeIcon}</span>
                <strong>${ing.name}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">${displayRarity}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <button class="btn-qty-minus" style="padding: 2px 10px;">-</button>
                <span class="qty-display" style="font-weight: bold; font-size: 1.1rem; min-width: 20px; text-align: center;">${playerBag[ing.id] || 0}</span>
                <button class="btn-qty-plus" style="padding: 2px 10px;">+</button>
            </div>
        `;

        row.querySelector('.btn-qty-minus').addEventListener('click', () => {
            if (playerBag[ing.id] > 0) {
                playerBag[ing.id]--;
                row.querySelector('.qty-display').textContent = playerBag[ing.id];
                calculatePossibleCrafts();
            }
        });

        row.querySelector('.btn-qty-plus').addEventListener('click', () => {
            playerBag[ing.id] = (playerBag[ing.id] || 0) + 1;
            row.querySelector('.qty-display').textContent = playerBag[ing.id];
            calculatePossibleCrafts();
        });

        inventoryInputsContainer.appendChild(row);
    });
}

// ==========================================
// 6. ALGORITHM: THE CRAFTING CAULDRON
// ==========================================
function calculatePossibleCrafts() {
    craftReadyContainer.innerHTML = '';
    craftAlmostContainer.innerHTML = '';

    let totalAvailable = 0;
    Object.values(playerBag).forEach(v => totalAvailable += v);

    if (totalAvailable === 0) {
        craftReadyContainer.innerHTML = '<p class="short-desc">Votre sac est vide. Ajoutez des ingrédients pour lancer les simulations.</p>';
        craftAlmostContainer.innerHTML = '<p class="short-desc">Votre sac est vide.</p>';
        return;
    }

    RECIPES.forEach(potion => {
        const matchesCategory = (filterCategory === 'all' || potion.category === filterCategory);
        if (!matchesCategory) return; 

        let canCraft = false;
        let missingOnlyOne = false;
        let missingDetail = "";
        const reqIng = potion.requiredIngredients;

        // ----- CASE 1: ALCHEMY -----
        if (potion.category === 'alchemy') {
            const ownedPlants = reqIng.permittedPlants.filter(id => playerBag[id] > 0);
            const ownedCreatures = reqIng.permittedCreatures.filter(id => playerBag[id] > 0);

            const hasPlant = ownedPlants.length > 0;
            const hasCreature = ownedCreatures.length > 0;

            if (hasPlant && hasCreature) canCraft = true;
            else if (hasPlant && !hasCreature) { missingOnlyOne = true; missingDetail = "1 Composant Créature"; }
            else if (!hasPlant && hasCreature) { missingOnlyOne = true; missingDetail = "1 Composant Végétal"; }
        }

        // ----- CASE 2: HERBALISM -----
        else if (potion.category === 'herbalism') {
            const ownedValidPlants = reqIng.permittedPlants.filter(id => playerBag[id] > 0);
            const ownedPlantsCount = ownedValidPlants.length;
            const requiredCount = 2; 

            if (ownedPlantsCount >= requiredCount) {
                canCraft = true;
            } else if (ownedPlantsCount === 1) {
                missingOnlyOne = true; 
                missingDetail = "1 autre Plante différente valide"; 
            }
        }

        // ----- CASE 3: POISON -----
        else if (potion.category === 'poison') {
            const idList = reqIng.permittedPlants.length > 0 ? reqIng.permittedPlants : reqIng.permittedCreatures;
            const owned = idList.filter(id => playerBag[id] > 0);

            if (owned.length > 0) canCraft = true;
            else { missingOnlyOne = true; missingDetail = "L'ingrédient de base"; }
        }

        // ----- RESULTS DISPLAY -----
        if (canCraft) {
            craftReadyContainer.innerHTML += `
                <div class="card item-${potion.category}" style="margin-bottom: 8px;">
                    <h3 style="color: #270f00;">✨ ${potion.name}</h3>
                    <p class="short-desc" style="color: green; font-weight: bold;">Prêt à être distillé !</p>
                </div>
            `;
        } else if (missingOnlyOne) {
            craftAlmostContainer.innerHTML += `
                <div class="card" style="margin-bottom: 8px; border-left: 5px solid #ff9100; opacity: 0.85;">
                    <h3 style="color: #5d4037;">${potion.name}</h3>
                    <p class="short-desc" style="color: #d84315;">❌ Manque : ${missingDetail}</p>
                </div>
            `;
        }
    });

    if (craftReadyContainer.innerHTML === '') craftReadyContainer.innerHTML = '<p class="short-desc">Aucune potion craftable avec ces ingrédients.</p>';
    if (craftAlmostContainer.innerHTML === '') craftAlmostContainer.innerHTML = '<p class="short-desc">Aucune potion proche.</p>';
}

// ==========================================
// 7. EVENT LISTENERS
// ==========================================
searchInput.addEventListener('input', filterAndDisplayPotions);
selectRarity.addEventListener('change', filterAndDisplayPotions);

searchIngredientInput.addEventListener('input', filterAndDisplayInventory);
selectRarityIngredient.addEventListener('change', filterAndDisplayInventory);

btnFilters.forEach(btn => {
    btn.addEventListener('click', (e) => {
        btnFilters.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        filterCategory = e.target.getAttribute('data-filter');
        
        filterAndDisplayPotions();
        filterAndDisplayInventory(); 
    });
});