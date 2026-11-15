export function calculerValeur(prixParGramme, poids){
    return Number(( prixParGramme * poids).toFixed(2));
}