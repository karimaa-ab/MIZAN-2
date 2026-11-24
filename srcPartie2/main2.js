import { obtenirProduits,
        rechercherProduits,
        trierProduits,
        filtrerProduits,
        obtenirProduitParId,
        ajouterProduit,
        modifierProduit,
        modifierPartiellementProduit,
        supprimerProduit
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
const btnAjouterProduit = document.getElementById("btn-ajouter-produit");
const indicateurChargement = document.getElementById("indicateur-chargement");
const chargementProduits = document.getElementById("chargement-produits");
const erreurProduits = document.getElementById("erreur-produits");
const succesProduit = document.getElementById("succes-produit");
// Éléments du formulaire de modification
const dialogModifierProduit = document.getElementById("dialog-modifier-produit");
const formModifierProduit = document.getElementById("form-modifier-produit");
const modifierTitre = document.getElementById("modifier-titre");
const modifierDescription = document.getElementById("modifier-description");
const modifierPrix = document.getElementById("modifier-prix");
const modifierImage = document.getElementById("modifier-image");
const modifierStatus = document.getElementById("modifier-status");
const btnModifierProduit = document.getElementById("btn-modifier-produit");
const fermerModification = document.getElementById("fermer-modification");
const erreurModification = document.getElementById("erreur-modification");
const indicateurModification = document.getElementById("indicateur-modification");
// Éléments du formulaire de suppression
const dialogSuppression = document.getElementById("dialog-suppression");
const confirmerSuppression = document.getElementById("confirmer-suppression");
const annulerSuppression = document.getElementById("annuler-suppression");
const erreurSuppression = document.getElementById("erreur-suppression");
const etatVide = document.getElementById("etat-vide");
const aucunResultat = document.getElementById("aucun-resultat");
const reinitialiserFiltres = document.getElementById("reinitialiser-filtres");
const erreurChargement = document.getElementById("erreur-chargement");
const messageErreurChargement = document.getElementById("message-erreur-chargement");
const reessayer = document.getElementById("reessayer");
const succesModification = document.getElementById("succes-modification");
const succesStatut = document.getElementById("succes-statut");
const succesSuppression = document.getElementById("succes-suppression");

// chargement des produits dans la page 
let tousLesProduits = [];
let produitIdAModifier = null;
let produitIdASupprimer;
async function chargerProduits() {
    chargementProduits.classList.remove("hidden");
    try{
        tousLesProduits = await obtenirProduits();
        afficherProduits(tousLesProduits);
        erreurChargement.classList.add("hidden");
        messageErreurChargement.textContent = "";
    }catch(error){
        erreurChargement.classList.remove("hidden");
        if(error.status === 404){
           messageErreurChargement.textContent = "Ressource introuvable."; 
        }else if(error.status === 500){
            messageErreurChargement.textContent = "Erreur interne du serveur. Veuillez réessayer.";
        }else if(error.type === "offline"){
            messageErreurChargement.textContent  = error.message;
        }else{
            messageErreurChargement.textContent = error.message;
        }
    }finally{
        chargementProduits.classList.add("hidden");
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
    if(tousLesProduits.length > 0 && resultatTrier.length === 0){
        etatVide.classList.add("hidden");
        aucunResultat.classList.remove("hidden");
        reinitialiserFiltres.classList.remove("hidden");
    }else{
        aucunResultat.classList.add("hidden");
        reinitialiserFiltres.classList.add("hidden")
    }
}
rechercheProduit.addEventListener("input", actualiserProduits);
filtreStatut.addEventListener("change", actualiserProduits);
triProduits.addEventListener("change", actualiserProduits);
reinitialiserFiltres.addEventListener("click", function(){
    rechercheProduit.value = "";
    filtreStatut.value = "";
    triProduits.value = "";
    actualiserProduits();
})
// GET du détail d'un article
async function gererClicProduit(event){
    const bouton = event.target;
    if(bouton.classList.contains("btn-details")){
        const id = bouton.dataset.id;
        produitIdAModifier = id;
        const product = await obtenirProduitParId(id); 
        document.getElementById("detail-titre").textContent= product.title;
        document.getElementById( "detail-description").textContent= product.description;
        document.getElementById("detail-prix").textContent = product.price + " MAD";
        document.getElementById("detail-statut").textContent = product.status;
        document.getElementById("dialog-produit").showModal();
    }
    if(bouton.classList.contains("btn-modifier")){
        const id = bouton.dataset.id;
        produitIdAModifier = id;
        const product = await obtenirProduitParId(id);
        modifierTitre.value = product.title;
        modifierDescription.value = product.description;
        modifierPrix.value = product.price;
        modifierStatus.value = product.status;
        dialogModifierProduit.showModal();
    }
    if(bouton.classList.contains("btn-statut")){
        const id = bouton.dataset.id;
        produitIdAModifier = id;
        const product = await obtenirProduitParId(id);
        console.log(product);
        let nouveauStatut;
        if(product.status === "Disponible"){
            nouveauStatut = "Réservé";
        }else{
            nouveauStatut = "Disponible";
        }
        const resultat = await modifierPartiellementProduit(id, {status: nouveauStatut});
        const index = tousLesProduits.findIndex(function(produit){
            return produit.id == id;
        });
        tousLesProduits[index]= resultat ;
        afficherProduits(tousLesProduits);
        succesStatut.textContent = "Statut modifié avec succès !";
        succesStatut.classList.remove("hidden");
        setTimeout(function(){
           succesStatut.classList.add("hidden");
        }, 5000);
    }
    if(bouton.classList.contains("btn-supprimer")){
        const id = bouton.dataset.id;
        produitIdASupprimer = id;
        dialogSuppression.showModal();
    }
}
listeProduits.addEventListener("click",gererClicProduit)
const fermerDialog = document.getElementById("fermer-dialog");
const dialogProduit = document.getElementById("dialog-produit");
fermerDialog.addEventListener("click",function(){
    dialogProduit.close();
})
annulerSuppression.addEventListener("click", function(){
    dialogSuppression.close();
});

// liaison de botton ajouter un produit avec dialogAjoutProduit 
ouvrirFormulaire.addEventListener("click", function(){
    dialogAjoutProduit.showModal();
})
fermerAjout.addEventListener("click", function(){
    dialogAjoutProduit.close();
})
// Gestion de la soumission du formulaire d'ajout d'un produit
formAjoutProduit.addEventListener("submit",async function(event){
    event.preventDefault();
    const titre = inputTitre.value;
    const description = inputDescription.value;
    const prix = Number(inputPrix.value);
    const status = inputStatus.value;
    if(!validerTitre(titre) || !validerDescription(description) || !validerPrix(prix)){
        erreurProduits.textContent= "Veuillez vérifier le titre, la description et le prix.";
        erreurProduits.classList.remove("hidden");
        return;
    }
    btnAjouterProduit.disabled = true;
    indicateurChargement.classList.remove("hidden");
    try{
       const image = inputImage.files[0];
       let imageUrl = "";
       if (image) {
          imageUrl = await new Promise(function(resolve, reject) {
            const lecteur = new FileReader();
            lecteur.onload = function() {
              resolve(lecteur.result);
            };
            lecteur.onerror = function() {
              reject(lecteur.error);
            };
            lecteur.readAsDataURL(image);
          });
        }
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
        erreurProduits.classList.add("hidden");
        succesProduit.textContent= "Produit ajouté avec succès !";
        succesProduit.classList.remove("hidden");
        dialogAjoutProduit.close();
        setTimeout(function(){
            succesProduit.classList.add("hidden");
        }, 5000);
    }catch(error){
        succesProduit.classList.add("hidden");
        erreurProduits.textContent= error.message;
        erreurProduits.classList.remove("hidden");
    }finally{
        btnAjouterProduit.disabled = false;
        indicateurChargement.classList.add("hidden");
    }
});
// modifier produit dialog

formModifierProduit.addEventListener("submit",async function(event){
    event.preventDefault();
    const titre = modifierTitre.value;
    const description = modifierDescription.value;
    const prix = Number(modifierPrix.value);
    const status = modifierStatus.value ;
    if(!validerTitre(titre) || !validerDescription(description) || !validerPrix(prix)){
        erreurModification.textContent = "Veuillez vérifier le titre, la description et le prix.";
        erreurModification.classList.remove("hidden");
        return;
    }
    try{
       btnModifierProduit.disabled = true;
       indicateurModification.classList.remove("hidden");
       const produitActuel = await obtenirProduitParId(produitIdAModifier);
       let imageUrl = produitActuel.image;
       const image = modifierImage.files[0];
       if(image){
        imageUrl = await new Promise(function(resolve, reject){
            const lecteur = new FileReader();
            lecteur.onload = function(){
                resolve(lecteur.result);
            };
            lecteur.onerror = function(){
                reject(lecteur.error);
            };
            lecteur.readAsDataURL(image);
        });
       }
       const produitModifie = {
         title: titre,
         description: description,
         price: prix,
         image: imageUrl,
         status: status,
         date: produitActuel.date
        };
        const resultat = await modifierProduit(produitIdAModifier, produitModifie);
        const index = tousLesProduits.findIndex(function(produit){
           return produit.id == produitIdAModifier;
        });
        tousLesProduits[index] = resultat;
        afficherProduits(tousLesProduits);
        dialogModifierProduit.close();
        erreurModification.classList.add("hidden");
        succesModification.textContent = "Produit modifié avec succès !";
        succesModification.classList.remove("hidden");
        setTimeout(function(){
           succesModification.classList.add("hidden");
        }, 5000);
    }catch(erreur){
            console.log(erreur);

        erreurModification.textContent= "Une erreur est survenue. Veuillez réessayer.";
        erreurModification.classList.remove("hidden");
    }finally{
        btnModifierProduit.disabled = false;
        indicateurModification.classList.add("hidden");
    }
});
fermerModification.addEventListener("click", function(){
    dialogModifierProduit.close();
});
// confirmer supprission 
confirmerSuppression.addEventListener("click", async function() {
    const index = tousLesProduits.findIndex(function(produit){
        return produit.id == produitIdASupprimer;
    });
    const produitSupprime = tousLesProduits[index];
    tousLesProduits.splice(index,1);
    afficherProduits(tousLesProduits);
    dialogSuppression.close();
    try{
        await supprimerProduit(produitIdASupprimer);
        succesSuppression.textContent = "Produit supprimé avec succès !";
        succesSuppression.classList.remove("hidden");
        setTimeout(function(){
            succesSuppression.classList.add("hidden");
        }, 5000);
    }catch(error){
        tousLesProduits.splice(index,0,produitSupprime);
        afficherProduits(tousLesProduits);
        erreurSuppression.textContent = "Erreur lors de la suppression du produit.";
        erreurSuppression.classList.remove("hidden");
    }
});
// botton ressayer 
reessayer.addEventListener("click", function(){
    chargerProduits();
});
 












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

