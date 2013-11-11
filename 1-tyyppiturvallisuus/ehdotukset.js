/*
 * Muutamia ehdotuksia JS:n tyyppitarkistukseen.
 * Toteutetaan seuraaville tyypeille tarkistusfunktiot.
 */

// Numerot
function isNumber(obj) {
    // esim. jquery käyttää tätä
    return !isNaN(parseFloat(obj)) && isFinite(obj);
}

// Merkkijonot
function isString(obj) {
    // looppi ja tarkastetaan jokainen char?
    return false;
}

// Listat / taulukot
function isArray(obj) {
    return Array.isArray(obj);
}

// Funktioille
function isFunction(obj) {
    // tähän ehdotuksia
    return false;
}

