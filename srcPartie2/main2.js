import { obtenirProduits,
        rechercherProduits,
        trierProduits,
        filtrerProduits,
        obtenirProduitParId,
        ajouterProduit 
    } from "./products.js";
import { afficherProduits } from "./ui2.js";
import { validerTitre,
        validerDescription,
        validerPrix
} from "./validation2.js";

const rechercheProduit = document.getElementById("recherche-produit");
const triProduits = document.getElementById("tri-produits");
const filtreStatut = document.getElementById("filtre-statut");
const listeProduits = document.getElementById("liste-produits");
const ouvrirFormulaire = document.getElementById("ouvrir-formulaire");
const dialogAjoutProduit =document.getElementById("dialog-ajout-produit");
const fermerAjout = document.getElementById("fermer-ajout");
const formAjoutProduit = document.getElementById("form-ajout-produit");
const inputTitre = document.getElementById("nouveau-titre");
const inputDescription = document.getElementById("nouvelle-description");
const inputPrix = document.getElementById("nouveau-prix");
const inputImage = document.getElementById("nouveau-image");
const inputStatus = document.getElementById("nouveau-status");
// chargement des produits dans la page 
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
// liaison de botton ajouter un produit avec dialogAjoutProduit 
ouvrirFormulaire.addEventListener("click", function(){
    dialogAjoutProduit.showModal();
})
fermerAjout.addEventListener("click", function(){
    dialogAjoutProduit.close();
})
// Gestion de la soumission du formulaire d'ajout d'un produit
formAjoutProduit.addEventListener("submit", function(event){
    event.preventDefault();
    const titre = inputTitre.value;
    const description = inputDescription.value;
    const prix = Number(inputPrix.value);
    const status = inputStatus.value;
    if(!validerTitre(titre) || !validerDescription(description) || !validerPrix(prix)){
        return;
    }
    const image = inputImage.files[0];
    const lecteur = new FileReader();
    lecteur.readAsDataURL(image); 
    lecteur.onload = async function(){
      const imageUrl = lecteur.result;
      const date = new Date().toISOString().split("T")[0];
      const nouveauProduit = {
        title : titre,
        description : description,
        price : prix,
        image : imageUrl,
        status : status,
        date : date
      };
      const produitAjoute = await ajouterProduit(nouveauProduit)
      tousLesProduits.unshift(produitAjoute);
      afficherProduits(tousLesProduits);
      formAjoutProduit.reset();
    };  
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

