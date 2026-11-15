import { getGoldHistory, getSilverHistory } from "./api.js";

// afficher historique 
export async function afficherHistorique(metal, periode,tauxChange){
    let historique = null;
    if(metal==="gold"){
        historique = await getGoldHistory();
    }else if(metal === "silver"){
        historique= await getSilverHistory();
    }
    const points = historique.points.slice(-periode)
    const donnees =[];
    for(const point of points){
        let date;
        if(metal ==="gold"){
            date = point.d;
        }else{
            date = new Date(point.t*1000).toISOString().split("T")[0];
        }
        const prixConverti = (point.c * tauxChange) / 31.1034768;
        donnees.push({date:date, prix:prixConverti});
    }
    return donnees;
}