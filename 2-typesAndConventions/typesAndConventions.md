Käytäntöjä
==========

Tekijät: Juho Hautala, Ville Lahdenvuo, Lalli Nuorteva ja Olavi Lintumäki
## Johdanto


JavaScriptissä näyttäisi vaikuttavan ainakin kaksi eri suuntausta tyypityksen ja algoritmien muodostuksen suhteen. 
Toinen on tehokkuuteen, turvallisuuteen ja yllätyksettömyyteen pyrkivä, ja toinen
tyyppien suhteen vapaampi suuntaus, jonka uhreihin kuuluu muunmuassa 
funktionaalinen tyyli, joka kuitenkin vaikuttaa pärjäävän ihan hyvin.
Toisaalta on kivaa saada nopeasti aikaan nätihköä ja toimivaa koodia,
mutta toisaalta tämmöinen koodi voi olla järjenvastaisen hidasta joissain tapauksissa.

JavaScript-engineiden(lähinnä V8 tämän ryhmän näkökulmasta) nykyinen 
kehitys tuntuu ohjaavan tehokkuuden kannalta tyyppiturvallisen 
javascriptin suuntaan, ja tämän voi ottaa huomioon myös funktionaalisessa
tyylissä, joskin hieman vaivalloisesti. Tällä kertaa keskitymme siis melko läheisesti tehokkuuteen.

Poikkeukset asettuvat jokseenkin välimaastoon tehokkuuden ja 
tyyppiturvallisuuden välillä. Poikkeukset eivät optimoidu hyvin, mutta
tyyppikäytänteistä kiinni pitäminen tekee kaikesta mukavampaa.

Sulkeumien hyödyntäminen menee hiukan sivuun tehokkuuden ja dynaamisuuden
akselilta, mutta niidenkin käyttöön on syytä perehtyä, sillä niillä 
saadaan aikaan turvallisempaa ja siistimpää koodia.

## Pohdintaa ja materiaalia

JavaScript on potentiaalisesti hyvinkin nopea kieli, mutta sen dynaamisuus taistelee voimakkaasti tätä ominaisuutta vastaan. Mitä parempi käsitys tulkilla on tyypeistä, sitä paremmin se pystyy pitämään koodin tehokkaana. Pienilläkin poikkeamilla voi olla suuri vaikutus nopeuteen.
* kattava esimerkki kiinnostuneille: http://www.html5rocks.com/en/tutorials/performance/mystery/
* toinen esimerkki: http://n64js.blogspot.fi/2012/08/javascript-optimisation-primer.html

Funktiosta kannattaa mieluummin olla useampi kopio eri tapauksille, kuin kutsuisi samaa funktiota eri tyyppisillä parametreilla. Tämä voi olla kova pala funktionaalisessa ohjelmoinnissa, mutta ei nopeus aina ole tärkein.
  * Nopeustesti: http://jsperf.com/mixing-boolean-and-int n64js blogista
  * Sisäisesti v8 esimerkiksi optimoi tyypeille paljon speksiä tarkemmin, jolloin olion asiaan liittymänkin kentän muuttaminen voi aiheuttaa merkittävää hidastumista http://www.html5rocks.com/en/tutorials/speed/v8/

Funktionaalinen ohjelmointi on paikallaan silloin, kun se ajaa asiansa siististi ilman, että siitä aiheutuu nopeushaittaa. Rinnakkaistamisessa siitä ei varsinaisesti ole etua, sillä useimmat javascript-toteutukset ovat yksisäikeisiä. Muutamat sisäänrakennetut funktionaalisen ohjelmoinnin apufunktiot saattavat hieman kiertää optimoituvuus-ongelmaa funktionaalisen ohjelmoinnin hyväksi.

## Käytännöt

### Tyypit, funktiot ja funktionaalisuus
Tyyppiturvallisuuteen kannattaa käyttää viimeviikkoisia tarkistusfunktioita, sekä lisäksi muutamaa konversionpakotuskikkaa/funktiota tehokkuuden vuoksi. Konversionpakotus estää funktiota deoptimoitumasta uudentyyppisellä parametrilla muutamassa tapauksessa. Varsinkin usein käytettävät yleis/apufunktiot ovat vaarassa. 
Jos funktionaalisesta koodista loppuu teho, usein kutsutuista osista voi luoda eri tyypeille omat kopionsa, jolloin optimointeja ei heitetä hukkaan. Funktionaalisen ohjelmoinnin perään haikailevat voivat tutustus [underscore.js](http://underscorejs.org/)-kirjastoon.

Täysin javamaiseen koodiin ei kannata pyrkiä, sillä esimerkiksi funktioiden ensiluokkaisuus tarjoaa sen verran käteviä välineitä. Kannattaa hyödyntää, mitä on tarjolla, mutta pitää silmä tarkkana tyypeille siellä, missä sillä on eniten väliä. Raskaassa koodissa tarkkuus tyyppien kanssa on tärkeää tehokkuuden kannalta ja rennommassa koodissa taas yhteensopivuuden kannalta.


### Sulkeumat



### Poikkeukset

Poikkeusten kanssa yhtenäisyys on myös hyväksi, mutta lähinnä käytännön kannalta. Error-luokasta periminen tuo mukanaan stack tracen ja virheenkäsittelykoodi saattaa riippua tästä. Kannattaa noudattaa varsinkin kirjastoissa.

Tehokkuuden kannalta poikkeukset eivät ole niin hyvä juttu, sillä niiden optimointi on vaikeampaa, joten tämän käytännön rinnalle suositamme defensiivistä strategiaa, joka suojautuu virhetilanteilta aikaisessa vaiheessa esimerkiksi viimeviikon tyyppitarkistustyökaluilla.
