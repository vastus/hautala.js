Tyyppipohdintaa
===============

## Johdanto

Kirjastomme palauttaa kokoelman työkaluja tyyppien hyödyntämiseen käyttäen hyväksi kurssillakin demottua
moduulityyliä, jolla estetään sisäisten apufunktioiden käyttäminen, sillä niiden toiminta saattaisi muuttua
todennäköisemmin kuin paljastettujen funktioiden.

    var type = (function () { return { ... }; })();

Lisäksi hyödynnämme uusia `"use strict;"` ja `Object.freeze()` välineitä.

## Työkalujen esittely

  * `type.is("Tyyppi", muuttuja)` palauttaa `true`, jos "muuttujan tyyppi" eli sen arvon tyyppi on annettu tyyppi, muutoin `false`.
    * Esimerkki: `type.is('Number', 123)`
  * `type.expect("Tyyppi", muuttuja)` toimii kuin `is`, mutta heittää TypeError-olion tai palauttaa annetun muuttujan.
    * Hyöty tulee esiin funktiokutsuista: `var fib5 = type.expect('Number', fibonacci(5))`
  * `type.isArrayOf("Tyyppi", muuttuja)` palauttaa `true`, jos taulukko sisältää vain oikeita tyyppejä.
    * Esimerkki: `type.isArrayOf("Number", [1, 2, 3])`
  * `type.check(taulukko, "Tyyppi1", "Tyyppi2", ..., "TyyppiN")` palauttaa true, jos taulukon tyypit vastaavat lueteltuja.
    * Hyödyllisin parametrien validointiin: `type.check(arguments, "String", "RegExp")`
  * `type.checkOptional` toimii kuten `check`, mutta tarkistaa vain annettujen arvojen tyypit.
  * `type.validation` ja `type.validationOptional` kuten `check`, mutta ei palauta mitään, mutta heittää TypeError-olion.


