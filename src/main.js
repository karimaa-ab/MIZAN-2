import { getCurrentPrices, getGoldHistory, getSilverHistory } from "./api.js";
import { recupererDevise, sauvegarderDevise } from "./storage.js";
import { afficherHistorique } from "./history.js";
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
deviseSelect.value = recupererDevise();

async function init(){
    afficherChargement();
    masquerErreur();
    try{
        const data= await getCurrentPrices(deviseSelect.value);
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