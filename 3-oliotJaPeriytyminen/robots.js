'use strict';

var glass = require('..').glass;

// Bot //
////////

function Bot(name) {
	this.nimi = name;
}

Bot.prototype.puhu = function () {
	console.log(this.nimi + ': beep');
};

// CookBot //
////////////

function CookBot(nimi) {
	// Kutsutaan superin konstruktoria.
	CookBot.super_.call(this, nimi);
}
glass.inherits(CookBot, Bot);

CookBot.prototype.kokkaa = function (ruoka) {
	console.log(this.nimi + ': kokataas annos', ruoka);
};

// TuhisBot //
/////////////

function TuhisBot() {
	TuhisBot.super_.call(this, 'Tuhis');
}
glass.inherits(TuhisBot, CookBot);

TuhisBot.prototype.puhu = function (lause) {
	console.log(this.nimi + ':', lause);
};

TuhisBot.prototype.huuteleLuennolla = function () {
	var jsfaktat = [
		'parseInt ottaa toiseksi parametriksi radixin.',
		'taidat tehdä väärin!',
		'se ehkä toimaakin.'
	];
	console.log(this.nimi + ': Itse asiassa', jsfaktat[~~(Math.random() * jsfaktat.length)]);
};

// Inherits esimerkit:
var botti = new Bot('ES');
botti.puhu();

var kokkaaja = new CookBot('Kokki');
kokkaaja.puhu();
kokkaaja.kokkaa('lihapullia');

var tuhis = new TuhisBot();
tuhis.puhu('Tulkaa #tkt-node kannulle!');
tuhis.kokkaa('billys pizzaa');
tuhis.huuteleLuennolla();

// Performs esimerkit:
console.log('---- performs');
console.log('kokkaaja osaa Bot:', glass.performs(kokkaaja, Bot));
console.log('tuhis osaa CookBot ja Bot:', glass.performs(tuhis, CookBot),
	glass.performs(tuhis, Bot));
console.log('Mutta kokkaaja ei osaa TuhisBot:', !glass.performs(kokkaaja, TuhisBot));
console.log('Eikä botti osaa CookBot:', !glass.performs(botti, CookBot));

console.log('---- Sitten "luokilla"');
console.log('CookBot osaa Bot:', glass.performs(CookBot, Bot));
console.log('TuhisBot osaa CookBot ja Bot:', glass.performs(TuhisBot, CookBot),
	glass.performs(TuhisBot, Bot));
console.log('Mutta CookBot ei osaa TuhisBot:', !glass.performs(CookBot, TuhisBot));
console.log('Eikä Bot osaa CookBot:', !glass.performs(Bot, CookBot));

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
// Kyborgi saa henkilön ominaisuudet ja sen jälkeen botin ominaisuudet.
glass.extend(Kyborgi.prototype, Henkilo.prototype, Bot.prototype);
Kyborgi.prototype.constructor = Kyborgi;

// Syrjätetään normaali elele-metodi.
Kyborgi.prototype.elele = function () {
	this.virta -= 20;
	if (this.virta >= 0) {
		Henkilo.prototype.elele.call(this);
	} else {
		console.log(this.nimi + ': Kuolin.');
	}
};

var hauta = new Henkilo('Juho');
var pro = new Kyborgi('Lalli');
pro.puhu();
for (var i = 0; i < 6; i++) {
	hauta.elele();
	pro.elele();
}
console.log('pro on Henkilo ja Bot:', glass.performs(pro, Henkilo),
	glass.performs(pro, Bot));
console.log('Kyborgi on Henkilo ja Bot:', glass.performs(Kyborgi, Henkilo),
	glass.performs(Kyborgi, Bot));
console.log('hauta on Henkilo, mutta ei Bot:', glass.performs(hauta, Henkilo),
	!glass.performs(hauta, Bot));
