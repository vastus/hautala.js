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
Tyyppiturvallisuuteen kannattaa käyttää viimeviikkoisia tarkistusfunktioita, sekä lisäksi muutamaa konversionpakotuskikkaa/funktiota tehokkuuden vuoksi. Konversionpakotus(kuten nopeustestissä) estää funktiota deoptimoitumasta uudentyyppisellä parametrilla muutamassa tapauksessa. Varsinkin usein käytettävät yleis/apufunktiot ovat vaarassa. 
Jos funktionaalisesta koodista loppuu teho, usein kutsutuista osista voi luoda eri tyypeille omat kopionsa, jolloin optimointeja ei heitetä hukkaan. Funktionaalisen ohjelmoinnin perään haikailevat voivat tutustus [underscore.js](http://underscorejs.org/)-kirjastoon.

Täysin javamaiseen koodiin ei kannata pyrkiä, sillä esimerkiksi funktioiden ensiluokkaisuus tarjoaa sen verran käteviä välineitä. Kannattaa hyödyntää, mitä on tarjolla, mutta pitää silmä tarkkana tyypeille siellä, missä sillä on eniten väliä. Raskaassa koodissa tarkkuus tyyppien kanssa on tärkeää tehokkuuden kannalta ja rennommassa koodissa taas yhteensopivuuden kannalta.


### Sulkeumat
Sulkeumia kannattaa pääsääntöisesti käyttää siellä, missä voi, kunhan ei mene hirmuiseksi kikkailuksi. Se lisää turvallisuutta piilottamalla tilan ja apufunktiot näkymättömiin. Vaarana näiden kanssa on sykliset riippuvuudet, joita kaikkien JavaScript-toteutusten roskienkeruu ei saa poistettua, jolloin tulee muistivuoto.

Malliesimerkkinämme olkoon viimeviikkoinen testikirjasto: a) [typeUtils.js](../1-tyyppiturvallisuus/typeUtils.js) b) [typeUtilsTest.js](../test/type/typeUtilsTest.js)


### Poikkeukset

Poikkeusten kanssa yhtenäisyys on myös hyväksi, mutta lähinnä käytännön kannalta.
Kannattaa heittää uusi Error-olio, jotta saa stack tracen.
Myös virheenkäsittelykoodi saattaa riippua Error-olion ominaisuuksista.
Paras tapa ehkä on tehdä omia Error-olioita Errorin prototyypillä.
Tätä metodia kannattaa noudattaa varsinkin kirjastoissa.

Yksi JavaScriptin ongelmista on se, että poikkeusten stack trace on yleensä hyvin lyhyt.
Tämä johtuu siitä, että koodi on eventtipohjaista.
Koodi suoritetaan vain, jos tulee joku tapahtuma, kuten hiiren klikkaus tai AJAX-takaisinkutsu.
V8-moottorista löytyy tähänkin ratkaisu: [long stack traces](https://github.com/tlrobinson/long-stack-traces)

Yksi ongelma stack tracejen kanssa on anonyymit funktiot, niitä ei ole kiva debuggailla.
On hyvä idea antaa anonyymeillekin funktioille nimet: `array.forEach(function each() { ...});`. Näin stack tracessa näkyy funktion nimi.

Tehokkuuden kannalta poikkeukset eivät ole niin hyvä juttu, sillä niiden optimointi on vaikeampaa, joten tämän käytännön rinnalle suositamme defensiivistä strategiaa, joka suojautuu virhetilanteilta aikaisessa vaiheessa esimerkiksi viimeviikon tyyppitarkistustyökaluilla.
