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
        afficherGraphique
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
        masquerChargement();
    }catch(error){
        masquerChargement();
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