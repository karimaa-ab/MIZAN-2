export function afficherProduits(produits){
    const listeProduits = document.getElementById("liste-produits");
    listeProduits.replaceChildren();
    produits.forEach(function(produit) {
        const carte = document.createElement("article");
        carte.className= "border border-gray-100 rounded-xl p-3 hover:shadow-md transition";
        const contImg = document.createElement("div");
        contImg.className = "bg-[#F7F3FC] rounded-lg h-40 flex items-center justify-center";
        if(produit.image){
           const image = document.createElement("img");
           image.setAttribute("src", produit.image);
           image.setAttribute("alt", produit.title);
           image.className= "h-32 w-full object-contain";
           contImg.appendChild(image);
           carte.appendChild(contImg);
        }
        const titre = document.createElement("h3");
        titre.textContent= produit.title;
        titre.className= "font-bold mt-4";
        const prix = document.createElement("p");
        prix.textContent= produit.price + " MAD";
        prix.className= "text-[#35158C] font-bold mt-2";
        const state = document.createElement("span");
        state.textContent=produit.status;
        if(produit.status === "Disponible"){
            state.className ="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mt-2";
        }else{
            state.className ="inline-block bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full mt-2";
        }
        carte.appendChild(titre);
        carte.appendChild(prix);
        carte.appendChild(state);
        const btnStatut = document.createElement("button");
        btnStatut.textContent = "Changer le statut";
        btnStatut.type = "button";
        btnStatut.className = "btn-statut text-sm pl-2";
        btnStatut.dataset.id = produit.id;
        carte.appendChild(btnStatut);
        const date = document.createElement("p");
        date.textContent = produit.date;
        date.className= "text-gray-500 text-sm mt-2";
        carte.appendChild(date);
        const btns = document.createElement("div");
        btns.className ="flex flex-col gap-2 mt-4";
        const modify = document.createElement("button");
        modify.className = "btn-modifier flex-1 bg-[#713BD1] text-white rounded-lg py-2 text-sm";
        modify.textContent = "Modifier";
        modify.type = "button";
        modify.dataset.id= produit.id;
        const supprimer = document.createElement("button");
        supprimer.className = "border border-red-300 text-red-600 rounded-lg px-3 py-2 text-sm";
        supprimer.textContent = "Supprimer";  
        supprimer.type = "button";
        btns.appendChild(modify);
        btns.appendChild(supprimer);  
        const details = document.createElement("button");
        details.textContent="Voir détails";
        details.type = "button";
        details.className = "btn-details flex-1 border border-[#713BD1] text-[#713BD1] rounded-lg py-2 text-sm";
        details.dataset.id = produit.id;
        btns.appendChild(details);
        carte.appendChild(btns);
        listeProduits.appendChild(carte);   
    });
}