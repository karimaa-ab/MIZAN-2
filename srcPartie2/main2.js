import { obtenirProduits,
        rechercherProduits,
        trierProduits,
        filtrerProduits,
        obtenirProduitParId  
    } from "./products.js";
import { afficherProduits } from "./ui2.js";
const rechercheProduit = document.getElementById("recherche-produit");
const triProduits = document.getElementById("tri-produits");
const filtreStatut = document.getElementById("filtre-statut");
const listeProduits = document.getElementById("liste-produits");


let tousLesProduits = [];
async function chargerProduits() {
    try{
        tousLesProduits = await obtenirProduits();
        afficherProduits(tousLesProduits);
    }catch(error){
        const erreurProduits = document.getElementById("erreur-produits");
        erreurProduits.textContent = error.message;
        erreurProduits.classList.remove("hidden");
    }
}
chargerProduits();
// chercher par nom 
rechercheProduit.addEventListener("input", function(){
    const resultat = rechercherProduits(tousLesProduits,rechercheProduit.value);
    afficherProduits(resultat);
})
// trier par titre , prix et date
triProduits.addEventListener("change", function () {
    const critere = triProduits.value;
    const produitsTries = trierProduits(tousLesProduits, critere);
    afficherProduits(produitsTries); 
});
// filtrer par status
filtreStatut.addEventListener("change", function(){
    const status = filtreStatut.value;
    const filtrage = filtrerProduits(tousLesProduits,status);
    afficherProduits(filtrage);
});
// liaison de chercher et trier et filtrer  
function actualiserProduits(){
    const resultatRecherche = rechercherProduits(tousLesProduits,rechercheProduit.value);
    const resultatFiltrer = filtrerProduits(resultatRecherche, filtreStatut.value);
    const resultatTrier = trierProduits(resultatFiltrer, triProduits.value);
    afficherProduits(resultatTrier);
}
rechercheProduit.addEventListener("input", actualiserProduits);
filtreStatut.addEventListener("change", actualiserProduits);
triProduits.addEventListener("change", actualiserProduits);
// GET du détail d'un article
async function gererClicProduit(event){
    const bouton = event.target;
    if(bouton.classList.contains("btn-details")){
        const id = bouton.dataset.id;
        const product = await obtenirProduitParId(id); 
        document.getElementById("detail-titre").textContent= product.title;
        document.getElementById( "detail-description").textContent= product.description;
        document.getElementById("detail-prix").textContent = product.price + " MAD";
        document.getElementById("detail-statut").textContent = product.status;
        document.getElementById("dialog-produit").showModal();
    }
}
listeProduits.addEventListener("click",gererClicProduit)
const fermerDialog = document.getElementById("fermer-dialog");
const dialogProduit = document.getElementById("dialog-produit");
fermerDialog.addEventListener("click",function(){
    dialogProduit.close();
})
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

