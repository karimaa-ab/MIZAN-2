// valider titre 
export function validerTitre(titre){
    if(titre.length < 3 || titre.length > 80){
        return false;
    }
    return true ;
}
// valider description 
export function validerDescription(description){
    if(description.length < 10){
        return false ;
    }
    return true;
}
// validation de prix
export function validerPrix(prix){
    if(prix <= 0){
        return false;
    }
    return true;
}