export function validerPoids(poids){
    if(poids.trim() === ""){
        return "Veuillez saisir un poids.";
    }
    if(isNaN(Number(poids))){
        return "Veuillez saisir un nombre valide.";
    }
    if(Number(poids) < 0){
        return "Le poids ne peut pas être négatif.";
    }
    return null ;
}