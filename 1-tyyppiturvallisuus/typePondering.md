Tyyppipohdintaa
===============

## Johdanto

Kirjastomme palauttaa kokoelman työkaluja tyyppien hyödyntämiseen käyttäen hyväksi kurssillakin demottua
moduulityyliä, jolla estetään sisäisten apufunktioiden käyttäminen, sillä niiden toiminta saattaisi muuttua
todennäköisemmin kuin paljastettujen funktioiden.

    var type = (function () { return { ... }; })();

Lisäksi se hyödyntää uusia `"use strict;"` ja `Object.freeze()` välineitä.

## Työkalujen esittely [typeUtils.js](./typeUtils.js)

  * `type.is('Tyyppi', muuttuja)` palauttaa `true`, jos "muuttujan tyyppi" eli sen arvon tyyppi on annettu tyyppi, muutoin `false`.
    * Esimerkki: `type.is('Number', 123)`
    * Huom. lyhenteet `type.isNumber(x)`, `type.isError(y)`, jne. toimivat myös.
  * `type.expect('Tyyppi', muuttuja)` toimii kuin `is`, mutta heittää TypeError-olion tai palauttaa annetun muuttujan.
    * Hyöty tulee esiin funktiokutsuista: `var fib5 = type.expect('Number', fibonacci(5))`
  * `type.isArrayOf('Tyyppi', muuttuja)` palauttaa `true`, jos taulukko sisältää vain oikeita tyyppejä.
    * Esimerkki: `type.isArrayOf('Number', [1, 2, 3])`
  * `type.check(taulukko, 'Tyyppi1', 'Tyyppi2', ..., 'TyyppiN')` palauttaa true, jos taulukon tyypit vastaavat lueteltuja.
    * Hyödyllisin parametrien validointiin: `type.check(arguments, 'String', 'RegExp')`
  * `type.checkOptional` toimii kuten `check`, mutta tarkistaa vain annettujen arvojen tyypit.
  * `type.validation` ja `type.validationOptional` kuten `check`, mutta ei palauta mitään, mutta heittää TypeError-olion.

## Testit [typeUtilsTest.js](./typeUtilsTest.js)

Muutama testi, jotka demonstroivat kirjaston toimintaa. [jsFiddle-demo](http://jsfiddle.net/yJ5W7/embedded/result/)

## Pohdintaa

Kokonaislukujen tarkistaminen on vähän turhaa, sillä JavaScript ei sellaisia kuitenkaan osaa hyödyntää.
Jos tarvitsee kokonaisluvun niin sen saa helposti `Math.floor`-funktiolla tai tietenkin ottamalla likiarvon `~~2.345`. :)

Mihin tyyppitarkistusta sitten tarvitaan? Siitä on hyötyä, virheiden nappaamisessa ja yhtenäinen tyyppien käyttö sallii
paremman optimoinnin, esimerkiksi Chromen V8 muuntaa funktioita natiivikoodiksi, jos niitä kutsutaan usein saman tyyppisillä
arvoilla. <sup>[[lähde]](http://blog.chromium.org/2010/12/new-crankshaft-for-v8.html)</sup>

Hyviin tapoihin kuuluu tarkistaa, että funktioon annetut parametrit on oikean tyyppisiä ja kertoa funktion kutsujalle,
mikäli näin ei ole. Varsinkin, jos parametrien tyypit eivät käy selkeästi ilmi funktion nimestä.

Liiallinen tyyppien tarkistelu voi johtaa koodirivien määrän turhaan kasvuun, jos aina pitää pelata varman päälle.
Ajan voisi käyttää ehkä ennemmin hyvään dokumentaatioon funktioista, siten käyttäjä tietää miten niitä käytetään, eikä
saa vain virheilmoituksia naamalle, kun yrittää jotain.

Asiaan vaikuttaa tietenkin myös koodin kohderyhmä. Jos kyseessä on joku oma säätö tai nettisivu ja projekti on
suhteellisen pieni, niin tuskin on tarvetta kauheasti varmistella koodia. Mutta jos tekee jonkun yleiskäyttöisen
moduulin esimerkiksi Nodelle ja julkaisee sen npm:ssä, niin olisi hyvä julkisiin funktioihin laittaa ehkä
tyyppitarkistukset. Projektin koon kasvaessa ei ehkä enää voi muistaa jokaisen funktion tyyppitarpeita, joten
voi olla parempi kirjoitella tyyppitarkistuksia, mutta parempi on ehkä aloittaa dokumentoinnilla.

## Muuta

Olisi ehkä voinut lisätä myös funktion objektin sisältämien arvojen tyyppien tarkistamiseen.

Linkkejä:
  * https://github.com/jrdavis/match
