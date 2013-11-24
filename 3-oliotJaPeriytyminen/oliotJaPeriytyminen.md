Oliot ja periytyminen
===
Tekijät: Juho Hautala, Ville Lahdenvuo, Lalli Nuorteva ja Olavi Lintumäki

##Periytyminen
###Esimerkki
Esimerkit käyttää [glass.js](glass.js) kirjastoamme joka sisältää myös funktiota [noden](https://github.com/joyent/node/blob/master/lib/util.js#L566-L576) coresta

Luodaan botti "olio" jolla on funktio "puhu".
```javascript
function Bot(name) {
	this.nimi = name;
}

var botti = new Bot("ropotti");

Bot.prototype.puhu = function () {
	console.log(this.nimi + ": beep");
};

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
function TuhisBot(nimi) {
	TuhisBot.super_.call(this, nimi);
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


var tuhis = new TuhisBot("Tuhis");
tuhis.puhu("tulkaa #tkt-node kannulle"); //tulostaa "Ville: tulkaa #tkt-node kannulle"
tuhis.kokkaa("billys pizzaa"); // tulostaa "Ville: kokataas annos billys pizzaa"
tuhis.huuteleLuennolla(); // tulostaa esim: "Ville: Itseasiassa taidat tehdä väärin!"
```