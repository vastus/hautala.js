Oliot ja periytyminen
===
Tekijät: Juho Hautala, Ville Lahdenvuo, Lalli Nuorteva ja Olavi Lintumäki

##Periytyminen
 
Vaikka javascriptissä ei olekkaan perinteisiä luokkia, niin javascriptissä oliot koostuvat avain-arvo pareista.
Prototyyppiolioiden avulla voidaan toteuttaa perintää, joka edesauttaa koodin uudelleenkäyttöä ja täten vähentää myös copypastea. Perintää käyttämällä voidaan selkeyttää ongelman hahmottamista.

###Esimerkki
Esimerkit käyttää [glass.js](glass.js) kirjastoamme (class on varattu sana) joka sisältää myös funktiota [noden](https://github.com/joyent/node/blob/master/lib/util.js#L566-L576) coresta

Luodaan botti "olio" jolla on funktio "puhu".
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

Luodaan CookBot "olio" joka perii Botin ominaisuudet. Niinpä "kokkaajalla" toimii sekä botilta peritty puhu, sekä CookBotin oma kokkaa funktio
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
Luodaan vielä TuhisBot "olio" joka perii CookBotin ominaisuudet ja sitä kautta myös botin ominaisuudet. Botin ominaisuutta "puhu" ei kuitenkaan käytetä TuhisBotilta löytyy oma puhu funktionsa.
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
tuhis.puhu("tulkaa #tkt-node kannulle"); //tulostaa "Ville: tulkaa #tkt-node kannulle"
tuhis.kokkaa("billys pizzaa"); // tulostaa "Ville: kokataas annos billys pizzaa"
tuhis.huuteleLuennolla(); // tulostaa esim: "Ville: Itseasiassa taidat tehdä väärin!"
```

###Esimerkki 2
Apina toteuttaa rajapinnan Bot koska sillä on kaikki tarvittavat funktiot, sen sijaan kivi ei toteuta koska kivellä ei ole funktiota puhu
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
