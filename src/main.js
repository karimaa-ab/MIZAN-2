import { getCurrentPrices, getGoldHistory, getSilverHistory } from "./api.js";
import { recupererDevise, sauvegarderDevise } from "./storage.js";
import { afficherHistorique } from "./history.js";
import { calculerValeur } from "./calculator.js";
import { validerPoids } from "./validation.js";
import { afficherPrix,
        afficherChargement,
        masquerChargement,
        afficherErreur,
        masquerErreur,
        afficherGraphique,
        afficherSucces,
        masquerSucces
    } from "./ui.js";

const deviseSelect = document.getElementById("devise-select");
const metalSelect  = document.getElementById("metal-select");
const periodSelect = document.getElementById("period-select");
const calcMetal = document.getElementById("calc-metal");
const calcQty = document.getElementById("calc-qty");
const calcBtn = document.getElementById("calc-btn");
const calcError = document.getElementById("calc-error");
const calcResult = document.getElementById("calc-result");
deviseSelect.value = recupererDevise();
let prixActuels = null;
async function init(){
    afficherChargement();
    masquerErreur();
    masquerSucces();
    try{
        const data= await getCurrentPrices(deviseSelect.value);
        prixActuels = data;
        let history = null;
        try{
            history = await getGoldHistory();
        }catch(error){
            console.error("Erreur historique:",error);
        }
        let silverHistory = null ;
        try{
            silverHistory= await getSilverHistory();
        }catch(error){
            console.error("Erreur historique Silver:", error);
        }
        afficherPrix(data,history,silverHistory);
        afficherSucces();
        masquerChargement();
    }catch(error){
        masquerChargement();
        let message = "Une erreur inattendue est survenue.";
        if(error.message === "OFFLINE"){
            message = "Vous êtes hors ligne. Vérifiez votre connexion.";
        }else if (error.message === "NETWORK"){
            message ="Erreur de connexion au serveur."; 
        }else if (error.message === "HTTP_CLIENT"){
            message = "Erreur dans la requête (HTTP 4xx).";
        }else if (error.message === "HTTP_SERVER"){
            message = "Erreur du serveur (HTTP 5xx).";
        }else if (error.message === "QUOTA"){
            message = "Quota API dépassé. Réessayez plus tard.";
        }else if (error.message === "JSON_INVALID"){
            message = "La réponse du serveur est illisible.";
        }
        afficherErreur();
        console.error(error);
    }
}
init();
const retryBtn = document.getElementById("retry-btn");

retryBtn.addEventListener("click", init);
function changerDevise(){
    sauvegarderDevise(deviseSelect.value);
    init();
    chargerHistorique();
}
deviseSelect.addEventListener("change", changerDevise);

async function chargerHistorique(){
    const data = await getCurrentPrices(deviseSelect.value)
    const points = await afficherHistorique( metalSelect.value, Number(periodSelect.value),data.fx_rate);
    afficherGraphique(points);
}
chargerHistorique();
metalSelect.addEventListener("change", chargerHistorique);
periodSelect.addEventListener("change", chargerHistorique);

function gererCalcul(){
    const poids = calcQty.value;
    const erreur = validerPoids(poids);
    if(erreur!== null){
        calcError.textContent = erreur;
        calcResult.textContent = "";
        return;
    }
    calcError.textContent = ""; 
    if(!prixActuels){
        calcResult.textContent ="Les prix ne sont pas disponibles.";
        return;
    } 

    const poidsNombre = Number(poids);
    let prixParGramme;
    if(calcMetal.value === "or"){
        prixParGramme = prixActuels.xau.price;
    }else{
        prixParGramme = prixActuels.silver.price;
    }
    const valeur = calculerValeur(prixParGramme, poidsNombre);
    calcResult.textContent = `${valeur.toFixed(2)} ${deviseSelect.value}`;
}
calcBtn.addEventListener("click", gererCalcul);