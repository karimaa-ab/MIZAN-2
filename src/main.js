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
        masquerSucces,
        afficherErreurHistorique,
        masquerErreurHistorique
    } from "./ui.js";

const deviseSelect = document.getElementById("devise-select");
const metalSelect  = document.getElementById("metal-select");
const periodSelect = document.getElementById("period-select");
const calcMetal = document.getElementById("calc-metal");
const calcQty = document.getElementById("calc-qty");
const calcBtn = document.getElementById("calc-btn");
const calcError = document.getElementById("calc-error");
const calcResult = document.getElementById("calc-result");
const retryBtn = document.getElementById("retry-btn");
const retryHistoryBtn = document.getElementById("retry-history-btn");
deviseSelect.value = recupererDevise();
let prixActuels = null;
async function init(){
    afficherChargement();
    retryBtn.disabled = true;
    deviseSelect.disabled = true;
    metalSelect.disabled = true;
    periodSelect.disabled = true;
    masquerErreur();
    masquerSucces();
    try{
        const data= await getCurrentPrices(deviseSelect.value);
        prixActuels = data;
        chargerHistorique();
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
        setTimeout(() => {
           masquerSucces();
        }, 3000);
        masquerChargement();
        retryBtn.disabled = false;
        deviseSelect.disabled = false;
        metalSelect.disabled = false;
        periodSelect.disabled = false;
    }catch(error){
        masquerChargement();
        masquerSucces();
        retryBtn.disabled = false;
        deviseSelect.disabled = false;
        metalSelect.disabled = false;
        periodSelect.disabled = false;
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
        afficherErreur(message);
        console.error(error);
    }
}
init();

retryBtn.addEventListener("click", init);
function changerDevise(){
    sauvegarderDevise(deviseSelect.value);
    init();
}
deviseSelect.addEventListener("change", changerDevise);

async function chargerHistorique(){
    if(!prixActuels){
        return;
    }
    masquerErreurHistorique();
    retryHistoryBtn.disabled = true;
    try{
       const points = await afficherHistorique( metalSelect.value, Number(periodSelect.value),prixActuels.fx_rate);
       afficherGraphique(points);
    }catch(error){
        let message = "Impossible de charger l'historique.";
        if(error.message === "OFFLINE"){
          message = "Vous êtes hors ligne. Vérifiez votre connexion.";
        }else if(error.message === "NETWORK"){
          message = "Erreur de connexion au serveur.";
        }else if(error.message === "HTTP_CLIENT"){
          message = "Erreur dans la requête (HTTP 4xx).";
        }else if(error.message === "HTTP_SERVER"){
          message = "Erreur du serveur (HTTP 5xx).";
        }else if(error.message === "QUOTA"){
          message = "Quota API dépassé. Réessayez plus tard.";
        }else if(error.message === "JSON_INVALID"){
          message = "La réponse du serveur est illisible.";
        }
        afficherErreurHistorique(message);
        console.error(error);
    }finally{
        retryHistoryBtn.disabled = false;
    }
}
metalSelect.addEventListener("change", chargerHistorique);
periodSelect.addEventListener("change", chargerHistorique);
retryHistoryBtn.addEventListener("click", chargerHistorique);
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