import { request } from "./api2.js";
export async function obtenirProduits() {
    return await request("/products");
}

export async function obtenirProduitParId(id){
    return await request(`/products/${id}`)
}

export function rechercherProduits(produits, recherche){
    return produits.filter(function(produit){
        return produit.title.toLowerCase().includes(recherche.toLowerCase());
    });
}

export function trierProduits(produits, critere){
    const produitsTries =[...produits];
    if(critere === "price"){
        produitsTries.sort(function(a,b){
            return a.price - b.price;
        });
    }
    
    if(critere === "title"){
        produitsTries.sort(function(a,b){
            return a.title.localeCompare(b.title);
        });
    }
    if(critere === "date"){
        produitsTries.sort(function(a,b){
            return a.date.localeCompare(b.date);
        });
    }
    return produitsTries;
}

export function filtrerProduits(produits, statut){
    if(statut === ""){
        return produits;
    }
    return produits.filter(function(produit){
        return produit.status.toLowerCase()=== statut;
    });
}
// ajouter un nouveau produit
export async function ajouterProduit(nouveauProduit) {
    return await request("/products",{
        method: "POST",
        body : JSON.stringify(nouveauProduit)
    }); 
}
// Modifier un produit complètement avec PUT
export async function modifierProduit(id, produitModifie) {
    return await request(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(produitModifie)
    });
}

