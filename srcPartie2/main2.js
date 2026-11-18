import { obtenirProduits } from "./products.js";
import { afficherProduits } from "./ui2.js";
async function chargerProduits() {
    try{
        const produits = await obtenirProduits();
        afficherProduits(produits);
    }catch(error){
        const erreurProduits = document.getElementById("erreur-produits");
        erreurProduits.textContent = error.message;
        erreurProduits.classList.remove("hidden");
    }
}
chargerProduits();

// Menu mobile
const menuMobile = document.getElementById("menu-mobile");
const sidebarMobile = document.getElementById("sidebar");
const overlaySidebar = document.getElementById("sidebar-overlay");
// Ouvrir le menu
menuMobile.addEventListener("click", function () {
    sidebarMobile.classList.remove("-translate-x-full");
    overlaySidebar.classList.remove("hidden");
    menuMobile.setAttribute("aria-expanded", "true");
});
// Fermer le menu
function fermerMenuMobile() {
    sidebarMobile.classList.add("-translate-x-full");
    overlaySidebar.classList.add("hidden");
    menuMobile.setAttribute("aria-expanded", "false");
}
// Fermer en cliquant sur l'overlay
overlaySidebar.addEventListener("click", fermerMenuMobile);
// Fermer après avoir choisi une rubrique
const liensSidebar = sidebarMobile.querySelectorAll("nav a");
liensSidebar.forEach(function (lien) {
    lien.addEventListener("click", fermerMenuMobile);
});

