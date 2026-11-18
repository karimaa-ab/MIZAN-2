import { request } from "./api2.js";
export async function obtenirProduits() {
    return await request("/products");
}