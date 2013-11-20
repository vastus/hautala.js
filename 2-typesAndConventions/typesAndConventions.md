Käytäntöjä
==========

Tekijät: Juho Hautala, Ville Lahdenvuo, Lalli Nuorteva ja Olavi Lintumäki
## Johdanto

JavaScriptissä vaikuttaisi olevan kaksi eri suuntausta tyypityksen suhteen. 
Toinen, tehokkuuteen, turvallisuuteen ja yllätyksettömyyteen pyrkivä, sekä 
tyyppien suhteen vapaampi suuntaus, jonka uhreihin kuuluu muunmuassa 
funktionaalinen tyyli. 
Toisaalta on kivaa saada nopeasti aikaan nätihköä ja toimivaa koodia,
mutta toisaalta pienistä seikoista voi kasaantua 

JavaScript-engineiden(lähinnä V8 tämän ryhmän näkökulmasta) nykyinen 
kehitys tuntuu ohjaamaan tehokkuuden kannalta tyyppiturvallisen 
javascriptin suuntaan, ja tämän voi ottaa huomioon myös funktionaalisessa
tyylissä, joskin hieman vaivalloisesti.

Poikkeukset asettuvat jokseenkin välimaastoon tehokkuuden ja 
tyyppiturvallisuuden välillä. Poikkeukset eivät optimoidu hyvin, mutta
tyyppikäytänteistä kiinni pitäminen tekee kaikesta mukavampaa.

Sulkeumien hyödyntäminen menee hiukan sivuun tehokkuuden ja dynaamisuuden
akselilta, mutta niidenkin käyttöön on syytä perehtyä, sillä niillä 
saadaan aikaan turvallisempaa ja siistimpää koodia.

## Pohdintaa

JavaScript on potentiaalisesti hyvinkin nopea kieli, mutta sen dynaamisuus taistelee voimakkaasti tätä ominaisuutta vastaan. Mitä parempi käsitys tulkilla on tyypeistä, sitä paremmin se pystyy pitämään koodin tehokkaana. Pieniilläkin poikkeamilla voi olla suuri vaikutus.
* kattava esimerkki kiinnostuneille: http://www.html5rocks.com/en/tutorials/performance/mystery/
* toinen esimerkki: http://n64js.blogspot.fi/2012/08/javascript-optimisation-primer.html


## Käytännöt

### Tyypit


### Funktiot ja funktionaalisuus

* Mieluummin useampi kopio samasta funktiosta, kuin kutsuisi samaa funktiota eri tyyppisillä parametreilla
  * Nopeustesti: http://jsperf.com/mixing-boolean-and-int n64js blogista
  * Sisäisesti v8 esimerkiksi optimoi tyypeille paljon speksiä tarkemmin, jolloin olion asiaan liittymänkin kentän muuttaminen voi aiheuttaa merkittävää hidastumista http://www.html5rocks.com/en/tutorials/speed/v8/

### Sulkeumat

### Poikkeukset

Poikkeusten kanssa yhtenäisyys on myös hyväksi, mutta lähinnä käytännön kannalta. Error-luokasta periminen tuo mukanaan stack tracen ja virheenkäsittelykoodi saattaa riippua tästä. Kannattaa noudattaa varsinkin kirjastoissa.

Tehokkuuden kannalta poikkeukset eivät ole niin hyvä juttu, sillä niiden optimointi on vaikeampaa, joten tämän käytännön rinnalle suositamme defensiivistä strategiaa, joka suojautuu virhetilanteilta aikaisessa vaiheessa esimerkiksi viimeviikon tyyppitarkistustyökaluilla.
