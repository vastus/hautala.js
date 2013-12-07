# JavaScript &mdash; Hyvät ohjelmointikäytännöt

Tekijät: Ville Lahdenvuo, Juho Hautala, Olavi Lintumäki ja Lalli Nuorteva.

## Sisältö

- [Tyyppiturvallisuus](#tyyppiturvallisuus)
	- [Johdanto](#johdanto)
	- [Työkalujen esittely typeUtils.js](#ty%C3%B6kalujen-esittely-typeutilsjs)
		- [Testit typeUtilsTest.js](#testit-typeutilstestjs)
	- [Pohdintaa](#pohdintaa)
	- [Muuta](#muuta)
- [Algoritmit, funktiot ja sulkeumat & poikkeusten käsittely](#algoritmit-funktiot-ja-sulkeumat--poikkeusten-käsittely)
	- [Johdanto](#johdanto-1)
	- [Materiaalia](#materiaalia)
	- [Käytännöt](#käytännöt)
		- [Tyypit, funktiot ja funktionaalisuus](#tyypit-funktiot-ja-funktionaalisuus)
		- [Sulkeumat](#sulkeumat)
		- [Poikkeukset](#poikkeukset)
- [Oliot ja periytyminen](#oliot-ja-periytyminen)
	- [Periytyminen](#periytyminen)
	- [Työkalujen esittely glass.js](#ty%C3%B6kalujen-esittely-glassjs)
		- [Prototyypin ja new konstruktorin toimintaa](#prototyypin-ja-new-konstruktorin-toimintaa)
		- [Periytyminen](#periytyminen-1)
		- [Rajapinnan toteutus](#rajapinnan-toteutus)
		- [Moniperintä](#moniperintä)

# Tyyppiturvallisuus

## Johdanto

Kirjastomme palauttaa kokoelman työkaluja tyyppien hyödyntämiseen käyttäen hyväksi kurssillakin demottua
moduulityyliä, jolla estetään sisäisten apufunktioiden käyttäminen, sillä niiden toiminta saattaisi muuttua
todennäköisemmin kuin paljastettujen funktioiden.

    var type = (function () { return { ... }; })(errorHandler);

`errorHandler` on vapaaehtoinen virheenkäsittelijä, jos jokin funktio heittää poikkeuksen, se kutsuu errorHandleria virheoliolla, jonka voi sitten lokittaa tai heittää. Esimerkiksi kehitysympäristössä kannattaa heittää ja tuotantoympäristössä lokittaa. Jos errorHandleria ei anna, se oletuksena vain heittää poikkeuksen. Lisäksi kirjasto hyödyntää uusia `"use strict;"` ja `Object.freeze()` välineitä.

Kannatamme kirjastojen käyttöä ennemmin kuin suoraan `typeof muuttuja`, koska se ei tunnista tyyppiä oikein esimerkiksi, jos se on luotu konstruktorifunktiolla: `typeof new String("lol") === "object"`. Toki tuo on hyvien ohjelmointikäytäntöjen vastaista ja siitä pääsee eroon esimerkiksi [jshint](http://www.jshint.com/)-työkalulla.

## Työkalujen esittely [typeUtils.js](https://github.com/vastus/hautala.js/blob/master/1-tyyppiturvallisuus/typeUtils.js)

  * `type.is('tyyppi', muuttuja)` palauttaa `true`, jos "muuttujan tyyppi" eli sen arvon tyyppi on annettu tyyppi, muutoin `false`.
    * Esimerkki: `type.is('Number', 123)`
    * Huom. lyhenteet `type.isNumber(x)`, `type.isError(y)`, jne. toimivat myös.
  * `type.of(muuttuja)` kuten normaali typeof, mutta järjellisempi.
  * `type.expect('tyyppi', muuttuja)` toimii kuin `is`, mutta aiheuttaa poikkeuksen tai palauttaa annetun muuttujan.
    * Hyöty tulee esiin funktiokutsuista: `var fib5 = type.expect('Number', fibonacci(5))`
    * Huom. lyhenteet `type.expectNumber(x)`, `type.expectError(y)`, jne. toimivat myös.
  * `type.isArrayOf('tyyppi', muuttuja)` palauttaa `true`, jos taulukko sisältää vain oikeita tyyppejä.
    * Esimerkki: `type.isArrayOf('Number', [1, 2, 3])`
  * `type.check(taulukko, 'Tyyppi1', 'Tyyppi2', ..., 'TyyppiN')` palauttaa annetun taulukon, jos taulukon tyypit vastaavat lueteltuja, muutoin aiheuttaa poikkeuksen.
    * Hyödyllisin parametrien validointiin: `type.check(arguments, 'String', 'RegExp')`
  * `type.checkOptional` toimii kuten `check`, mutta tarkistaa vain annettujen arvojen tyypit.

### Testit [typeUtilsTest.js](https://github.com/vastus/hautala.js/blob/master/test/type/typeUtilsTest.js)

Muutama testi, jotka demonstroivat kirjaston toimintaa. Suoritus: `npm install && npm test`.

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
  * https://developers.google.com/closure/compiler/docs/js-for-compiler
  * http://www.typescriptlang.org/Tutorial/


# Algoritmit, funktiot ja sulkeumat & poikkeusten käsittely

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

Sulkeuma on hyvä varsinkin moduuleissa, sillä niitä ei tarvi luoda paljoa ja niiden kanssa turvallisuudella on merkitystäkin. Kertakäyttöiset sulkeumat kannattaa kuitenkin yleensä optimoida pois korvaamalla ne parametrinvälityksellä. Pääsyy sulkeumien hitauteen on se, että niissä tarvittavalle kontekstille joudutaan varaamaan oma olionsa.

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


# Oliot ja periytyminen

## Periytyminen

Periytyminen edesauttaa koodin uudelleenkäyttöä, sekä vähentää copypastea. Perintää käyttämällä voidaan helpottaa ongelmien hahmottamista. Javascriptissä ei ole perinteisiä luokkia, vaan ns. luokat ovat funktio-objekteja. Kun objektista luodaan uusi ilmentymä käyttämällä new etuliitettä, uuteen ilmentymään liitetään prototype-kenttä josta löytyy kaikki prototyypin kentät. Prototyyppiketjuja käyttämällä voidaan käyttää perintää. Luokkien toteutuksen yksityiskohdilla on merkitystä nopeuteen, joten siihen kannattaa myös kiinnittää huomiota.

Alla olevissa esimerkeissä käydään lisää läpi sitä miten periytyminen toimii erilaisissa tilanteissa. Esimerkit käyttää [glass.js](https://github.com/vastus/hautala.js/blob/master/3-oliotJaPeriytyminen/glass.js) kirjastoamme (class on varattu sana), joka sisältää myös funktioita [noden](https://github.com/joyent/node/blob/master/lib/util.js#L566-L576) coresta.

## Työkalujen esittely [glass.js](https://github.com/vastus/hautala.js/blob/master/3-oliotJaPeriytyminen/glass.js)

* `inherits(konstruktori, super)` toimii siten, että se lisää konstruktorille `super_`-kentän, joka viittaa super-parametriin. Konstruktorin prototyypiksi luodaan uusi objekti `Object.create`-funktiolla, jolle annetaan prototyypiksi superin prototyyppi ja sinne lisätään `constructor`-kenttä, jonka arvoksi laitetaan konstruktori
  * Näin superin konstruktorille voi välittää parametrejä näin: `Konstruktori.super_.call(this, param1, param2);`
* `extends(lähde, o1, o2, ...)` toimii siten, että sille annetaan kaksi tai useampi objekti, ja lähteeseen lisätään myöhempien objektien kentät siinä järjestyksessä kuin ne on annetti, esimerkiksi `o2`:n kentät ylikirjoittavat `o1`:n ja lähteen kentät.
  * Tätä voi hyödyntää mixin-tyyppisessä moniperinnässä, jossa prototyyppejä laajennetaan muiden olioiden prototyypeillä.
* `performs(objekti, rajapinta)` tarkistaa toteuttaako objekti kaikki funktiot, mitä rajapinnassa on. Tällä voi simuloida Javan rajapintoja. Esim. `performs(console, { log: function(){} }) === true`, sillä console.log on funktio.

### Prototyypin ja new konstruktorin toimintaa

Olion ominaisuuksien tallettaminen prototyyppiin on huomattavasti nopeampaa kun konstruktoriin itseensä, koska sillon funktiota ei jouduta luomaan uudestaan joka ilmentymän kohdalla [lähde+esim](http://blog.trevnorris.com/2013/08/long-live-callbacks.html). Jos prototyyppiä muuttaa myöhemmin, se silti vaikuttaa myös jo aiemmin luotuihin ilmentymiin. Toisaalta prototyypin arvon voi myös ylikirjoittaa antamalla ilmentymälle oma arvonsa. Ilmentymään tehty ylikirjoitus ei vaikuta uusiin ilmentymiin. Alla esimerkki selkeyttämiseksi.
```javascript
function Auto(){};
Auto.prototype.pyorienMaara = 4;
var volvo = new Auto();
console.log(volvo.pyorienMaara); // 4
Auto.prototype.pyorienMaara = 6;
console.log(volvo.pyorienmaara); // 6
volvo.pyorienMaara = 12;
console.log(volvo.pyorienMaara) // 12
console.log(new Auto().pyorienMaara); //6
```

### Periytyminen

Luodaan ensin konstruktorifunktio Bot, jonka jälkeen luodaan sen ilmentymä botti"olio" joka saa konstruktoriltaan funktion "puhu".
```javascript
function Bot(name) {
	this.nimi = name;
}

Bot.prototype.puhu = function () {
	console.log(this.nimi + ": beep");
};

var botti = new Bot("ropotti");
botti.puhu(); // tulostaa "ropotti: beep
```

Luodaan CookBot konstruktorin avulla "olio" joka perii Botin ominaisuudet. Niinpä "kokkaajalla", joka on CookBotin ilmentymä, toimii sekä botilta peritty puhu, sekä CookBotin oma kokkaa funktio.
```javascript
function CookBot(nimi) {
	// Kutsutaan superin konstruktoria.
	CookBot.super_.call(this, nimi); 
}

glass.inherits(CookBot, Bot);

CookBot.prototype.kokkaa = function(ruoka) {
	console.log(this.nimi + ": kokataas annos " + ruoka);
};

var kokkaaja = new CookBot("kokkaaja");
kokkaaja.puhu(); // tulostaa "kokkaaja: beep"
kokkaaja.kokkaa("lihapullia"); // tulostaa "kokkaaja: kokataas annos lihapullia"
```

Luodaan vielä TuhisBot konstruktorin avulla "olio", joka perii CookBotin ominaisuudet ja sitä kautta myös botin ominaisuudet. Botin ominaisuutta "puhu" ei kuitenkaan käytetä, koska TuhisBotilta löytyy oma puhu funktionsa. Mikäli TuhisBotilla ei olisi omaa puhu funktiota, etsittäisiin sitä seuraavaksi CookBotilta ja lopuksi Botilta. Mikäli Botillakaan ei olisi puhu funktiota, kyseltäisiin sitä aina ylemmältä tasolta kunnes päästäisiin Objectiin asti ja palautettaisiin undefined.

```javascript
function TuhisBot() {
	TuhisBot.super_.call(this, 'Tuhis');
}
glass.inherits(TuhisBot, CookBot);

TuhisBot.prototype.puhu = function (lause) {
    console.log(this.nimi + ": " + lause);
}
TuhisBot.prototype.huuteleLuennolla = function () {
	var jsfaktat = [
		'parseInt ottaa toiseksi parametriksi radixin.',
		'taidat tehdä väärin!',
		'se ehkä toimaakin.'
	]
	console.log(this.nimi + ": Itse asiassa " + jsfaktat[~~(Math.random() * jsfaktat.length)]);
}

var tuhis = new TuhisBot();
tuhis.puhu("tulkaa #tkt-node kannulle"); //tulostaa "Tuhis: tulkaa #tkt-node kannulle"
tuhis.kokkaa("billys pizzaa"); // tulostaa "Tuhis: kokataas annos billys pizzaa"
tuhis.huuteleLuennolla(); // tulostaa esim: "Tuhis: Itseasiassa taidat tehdä väärin!"
```

### Rajapinnan toteutus

Apina toteuttaa rajapinnan Bot koska sillä on kaikki tarvittavat funktiot. Sen sijaan kivi ei toteuta, koska kivellä ei ole funktiota puhu.

```javascript
var kivi = {
	paino : 9000
};

var apina = {
    puhu: function () {
        console.log('apinan puhetta');
    }
};
glass.performs(kivi, Bot); // false
glass.performs(apina, Bot); //true
```

### Moniperintä

"Luokat" henkilö ja kyborgi toutettaa funktion "elele". Lisäksi kyborgi perii myös botin ominaisuudet. Jos Botilla ja Henkilöllä olisi molemmilla funktio puhu(), kyborgille jäisi voimaan se puhu(), kumpi on myöhemmin peritty(=asetettu). 

```javascript
function Henkilo(name) {
        this.nimi = name;
}

Henkilo.prototype.elele = function () {
        console.log(this.nimi + ': Oispa kaliaa.');
};

function Kyborgi(name) {
        Henkilo.call(this, name);
        this.virta = 100;
}
glass.extend(Kyborgi.prototype, Henkilo.prototype, Bot.prototype);
// Kyborgi saa henkilön ominaisuudet ja sen jälkeen botin ominaisuudet
Kyborgi.prototype.constructor = Kyborgi;
```

Nyt "olio" pro osaa puhua ja elellä, koska se perii sekä henkilön, että botin. Sen sijaan hauta-olio joka on Henkilöluokan ilmentymä, osaa vain "elellä".

```javascript
var hauta = new Henkilo('Juho');
var pro = new Kyborgi('Lalli');
pro.puhu(); // Lalli: beep
pro.elele(); // Lalli: Oispa kaljaa

hauta.elele() // Juho: Oispa kaljaa
hauta.puhu() //undefined

console.log('pro on Henkilo ja Bot:', glass.performs(pro, Henkilo),
        glass.performs(pro, Bot));
console.log('Kyborgi on Henkilo ja Bot:', glass.performs(Kyborgi, Henkilo),
        glass.performs(Kyborgi, Bot));
console.log('hauta on Henkilo, mutta ei Bot:', glass.performs(hauta, Henkilo),
        !glass.performs(hauta, Bot));
```

