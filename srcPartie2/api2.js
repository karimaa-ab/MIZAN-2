const API_URL = "http://localhost:3000";
// Fonction centralisée pour gérer toutes les requêtes HTTP vers l'API.
// Elle construit l'URL, envoie la requête, traite la réponse
// et gère les erreurs de manière uniforme.
export async function request(path , options = {}) {
    let timeout;
    let status = null;
    try{
       const url =`${API_URL}${path}`;
       const controller = new AbortController();
       timeout = setTimeout(function(){
            controller.abort();
       },8000);
       const response = await fetch(url, {
           ...options,
           headers:{
            "Content-Type": "application/json",
            ...options.headers
           },
           signal:controller.signal
       });
       status = response.status;
       if(!response.ok){
        throw new Error("Erreur HTTP")
       }
       const data = await response.json();
       return data;
    }catch(error){
        if(error.name === "AbortError"){
           throw{
            type: "timeout",
            status:null,
            message:"la requête a dépassé le délai de 8 secondes. "
           };
        }
        if(error instanceof TypeError){
            if(!navigator.onLine){
                throw{
                    type: "offline",
                    status: null,
                    message:"Aucune connexion Internet."
                };
            }
            throw{
                type: "network",
                status:null,
                message:"Erreur de connexion au serveur."
            };
        }
        if(error instanceof SyntaxError){
            throw{
                type:"parse",
                status: status,
                message:"Impossible de lire les données reçues du serveur."
            };
        }
        if(status !== null){
            throw{
                type:"http",
                status:status,
                message:"Erreur HTTP lors de la communication avec le serveur."
            }
        }
        throw error;
    }finally{
        clearTimeout(timeout);
    }; 
}