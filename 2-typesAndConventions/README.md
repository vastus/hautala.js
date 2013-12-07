Käytäntöjä
==========

Tekijät: Juho Hautala, Ville Lahdenvuo, Lalli Nuorteva ja Olavi Lintumäki
## Johdanto

On erilaisia näkökulmia JavaScriptin tyyppiturvallisuuteen ja konventioihin. Näitä ovat muunmuassa tehokkuus ja nopeus, ylläpidettävyys, sujuvuus ja kehitysnopeus, turvallisuus, sekä myös syntyvän koodin määrä. Näiden suhteen on erilaisia suuntauksia, jotka pitävät eri asioita tärkeinä. Yhdessä ideassa pitäytyminen ei tietenkään ole ehdotonta, sillä olosuhteita on monenlaisia, mutta esitämme muutamia suosituksia.

Keskitymme pääasiassa nopeuteen, koska sillä on suuri paino palvelinpuolen ohjelmistossa, peleissä ja pikkasenkin raskaammissa web-sovelluksissa. Kiinnitämme hiukan huomiota myös yhteensopivuuteen ja ylläpidettävyyteen. 

Nopeuden kannalta nykyisten JavaScript-moottorien kehitys ohjaa vahvasti tyyppiturvallisuuden, tai ehkäpä ennemmin tyyppivarovaisuuden suuntaan. Toisaalta esimerkiksi poikkeukset eivät välttämättä optimoidu kovin hyvin, mutta tyyppikäytänteistä kiinni pitäminen niiden kanssa on muuten järkevää, joten pidämme niitä suuressa arvossa.

Myös funktionaalisella tyylillä on paikkansa selkeyden ja ylläpidettävyyden kannalta, mutta kannattaa olla tietoinen siitä, mitä etuja sillä on tai siltä puuttuu javascriptissä. Koska on tyhmää optimoida liian aikaisin, kannattaa tietenkin valita selkeämpi vaihtoehto silloin, kun siitä ei ole ilmeistä haittaa. Kannatamme kuitenkin käytänteitä ja vihjeitä, jotka ohjaavat tehokkaampaan suuntaan.

Sulkeumat myöskin liittyvät tehokkuuteen, ylläpidettävyyteen, sekä turvallisuuteen. Turvallisuuteen ja ylläpidettävyyteen sen puolesta, että niillä voi parantaa molempia ja tehokkuuteen taas sen puolesta, että ne vievät ylimääräistä muistia ja ovat hitaampia luoda. Sulkeumien kanssa olisi hyvä löytää tapauskohtainen kompromissi, jos välittää tehokkuudesta.

## Materiaalia

JavaScript on potentiaalisesti hyvinkin nopea kieli, mutta kaikki huomioonotettava dynaamisuudessa taistelee voimakkaasti tätä ominaisuutta vastaan. Mitä parempi käsitys tulkilla on tyypeistä, sitä paremmin se pystyy pitämään koodin tehokkaana. Pienilläkin poikkeamilla voi olla suuri vaikutus nopeuteen.
* kattava esimerkki kiinnostuneille: http://www.html5rocks.com/en/tutorials/performance/mystery/
* toinen esimerkki: http://n64js.blogspot.fi/2012/08/javascript-optimisation-primer.html
* Nopeustesti tyyppien poikkeamisesta: http://jsperf.com/mixing-boolean-and-int n64js blogista
* Sisäisesti v8 esimerkiksi optimoi tyypeille paljon speksiä tarkemmin, jolloin olion asiaan liittymänkin kentän muuttaminen voi aiheuttaa merkittävää hidastumista http://www.html5rocks.com/en/tutorials/speed/v8/
* http://coding.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/
* http://mrale.ph/blog/2011/12/18/v8-optimization-checklist.html

## Käytännöt

### Tyypit, funktiot ja funktionaalisuus

Tyyppiturvallisuuteen suosittelemme avuksi tyyppivarovaisuutta, tai esimerkiksi edellisen luvun tarkistusfunktioita, jos on kyse kirjaston koodauksesta, tai tyyppejä on muuten vaikea ennustaa. Tyyppivarovaisuudella tarkoitamme sitä, että kiinnitetään huomiota, mitä tyyppejä funktiot ja tieto saa, ettei niissä ilmene turhaa vaihtelua. Eräs tapa tähän on konversionpakotus(kuten nopeustestissä), jolla funktioon päästetään vaan haluttua tyyppiä. Varsinkin usein käytettävät yleis/apufunktiot ovat vaarassa. 

Funktiot ja oliot kannattaa pitää lyhyinä, koska silloin tyypit pysyvät paremmin hallussa ja optimointi on moottorille helpompaa. Myös koodi pysyy ylläpidettävämpänä, eikä ylimääräsistä funktiokutsuista ole välttämättä haittaa, sillä ne voivat optimoitua pois, jos ei käytä sulkeumia. 

Hankalempien funktioiden optimointiyrityksestä saatetaan jopa luopua, mikäli tyypit vaihtelevat liikaa, jolloin (ainakin v8:ssa, Googlen Javascript-moottorissa) tilalle jää kaiken varmistava hidas versio, joka vieläpä varaa muistia erikseen jokaiselle välitulokselle. Funktionaalisen koodin funktioiden uudelleenkäyttö voi tuottaa optimoijalle tällaisia pettymyksiä ja voi saada sen lopulta kokonaan luovuttamaan optimoinnin, mutta tästä pitäisi selvitä tyyppivarovaisuudella. Jos koodista loppuu teho, usein kutsutuista osista voi hätätapauksessa luoda eri tyypeille omat kopionsa, jolloin optimointeja ei tarvi heittää hukkaan tyyppien vaihtumisen vuoksi. 

Jos kapseloinnista ei ole turvallisuuden kannalta merkitystä, voi olla syytä jättää se väliin, sillä kyse voi olla monikymmenkertaisesta nopeuserosta(lähde katosi, mutta vektorien käsittely nopeutui nodella kymmenistä sekunneista alle kahteen sekuntiin vaihtamalla sulkeumasta olion paikalliseen muuttujaan tai jotain sinneppäin)

Funktionaalisen ohjelmoinnin perään olevat voivat tutustua [lazy.js](http://danieltao.com/lazy.js/comparisons.html)-kirjastoon, joka ainakin omien, mutta reilulta vaikuttavien testiensä mukaan vaikuttaa nopeudeltaan ylivoimaiselta.
Myös:
* http://adamnengland.wordpress.com/2013/10/10/benchmarks-underscore-js-vs-lodash-js-vs-lazy-js/
* http://net.tutsplus.com/tutorials/javascript-ajax/getting-cozy-with-underscore-js/

Täysin javamaiseen koodiin ei kannata pyrkiä, vaikka pystyisi, sillä esimerkiksi funktioiden ensiluokkaisuus tarjoaa sen verran käteviä välineitä. Kannattaa hyödyntää, mitä on tarjolla, mutta pitää silmä tarkkana tyypeille siellä, missä sillä on eniten väliä. Raskaassa koodissa tarkkuus tyyppien kanssa on tärkeää tehokkuuden kannalta ja rennommassa koodissa taas yhteensopivuuden kannalta.

Funktionaalinen ohjelmointi on paikallaan silloin, kun se ajaa asiansa siististi ilman, että siitä aiheutuu nopeushaittaa. Rinnakkaistamisessa siitä ei varsinaisesti ole etua, sillä useimmat javascript-toteutukset ovat yksisäikeisiä, mutta laiskuus on varsin tervetullut apu. Lisäksi nykytoteutusten muutamat sisäänrakennetut funktionaalisen ohjelmoinnin funktiot saattavat hieman kiertää optimoituvuus-ongelmaa funktionaalisen ohjelmoinnin hyväksi.


[esimerkkejä](./functionalExamples.js)


### Sulkeumat
Sulkeumia kannattaa käyttää siellä, missä niistä ei ole nopeuden kannalta haittaa, mutta niistä on muuta hyötyä. Ne lisäävät turvallisuutta piilottamalla tilan ja apufunktiot muiden saavuttamattomiin. 
Usein luotavilla olioilla sulkeumista voi olla paljonkin haittaa nopeudelle. Vaarana näiden kanssa on myös sykliset riippuvuudet DOMin kanssa, joita kaikkien JavaScript-toteutusten roskienkeruu ei saa poistettua, jolloin tulee muistivuoto.

Sulkeuma on hyvä varsinkin moduuleissa, sillä niitä ei tarvi luoda paljoa ja niiden kanssa turvallisuudella on merkitystäkin. Kertakäyttöiset sulkeumat kannattaa kuitenkin yleensä optimoida pois korvaamalla ne parametrinvälityksellä.

Malliesimerkkinämme olkoon viimeviikkoinen testikirjasto, joka on moduuli: a) [typeUtils.js](../1-tyyppiturvallisuus/typeUtils.js) b) [typeUtilsTest.js](../test/type/typeUtilsTest.js)

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

Tehokkuuden kannalta poikkeukset eivät ole niin hyvä juttu, sillä niiden optimointi on vaikeampaa, eikä niin kehittynyttä, joten tämän käytännön rinnalle suositamme defensiivistä strategiaa, joka suojautuu virhetilanteilta aikaisessa vaiheessa, esimerkiksi viimeviikon tyyppitarkistustyökaluilla.

