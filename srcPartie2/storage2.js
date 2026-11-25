// Fonctions de sauvegarde des préférences utilisateur dans le localStorage
export function sauvegarderDevise(devise){
    localStorage.setItem("mizan:v1:devise", devise);
}

export function sauvegarderTheme(theme){
    localStorage.setItem("mizan:v1:theme", theme);
}

export function sauvegarderFavoris(favoris){
    localStorage.setItem("mizan:v1:favoris", JSON.stringify(favoris));
}

export function sauvegarderFiltre(filtre){
    localStorage.setItem("mizan:v1:filtre", filtre);
}

export function sauvegarderTri(tri){
    localStorage.setItem("mizan:v1:tri", tri);
}
// Fonctions de récupération des préférences utilisateur depuis le localStorage
export function obtenirDevise(){
    return localStorage.getItem("mizan:v1:devise");
}
export function obtenirTheme(){
    return localStorage.getItem("mizan:v1:theme");
}
export function obtenirFavoris(){
    const favoris=  localStorage.getItem("mizan:v1:favoris");
    if(favoris === null){
        return [];
    }
    return JSON.parse(favoris)
}
export function obtenirFiltre(){
    return localStorage.getItem("mizan:v1:filtre");
}
export function obtenirTri(){
    return localStorage.getItem("mizan:v1:tri");
}