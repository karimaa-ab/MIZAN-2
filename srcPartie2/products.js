import { request } from "./api2.js";
export async function obtenirProduits() {
    return await request("/products");
}

export function rechercherProduits(produits, recherche){
    return produits.filter(function(produit){
        return produit.title.toLowerCase().includes(recherche.toLowerCase());
    });
}