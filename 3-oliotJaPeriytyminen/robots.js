'use strict';
var glass = require('..').glass;

function Bot(name) {
	this.nimi = name;
}

var botti = new Bot("es");

Bot.prototype.puhu = function() {
	console.log(this.nimi + ": beep");
};

botti.puhu();

function CookBot(nimi) {
	// Kutsutaan superin konstruktoria.
	CookBot.super_.call(this, nimi);
}
glass.inherits(CookBot, Bot);

CookBot.prototype.kokkaa = function(ruoka) {
	console.log(this.nimi + ": kokataas annos " + ruoka);
};

function TuhisBot(nimi){
	TuhisBot.super_.call(this,nimi);
	this.puhu = function(lause){
		console.log(this.nimi +": "+lause);
	}
}
glass.inherits(TuhisBot,CookBot);
TuhisBot.prototype.huuteleLuennolla = function(){
	var jsfaktat = [
	"fakta1",
	"fakta2",
	"fakta3"
	]
	console.log(this.nimi + ": Itseasiassa "+ jsfaktat[Math.floor(Math.random()*jsfaktat.length)]);
}



var kokkaaja = new CookBot("kokkaaja");
kokkaaja.puhu();
kokkaaja.kokkaa("lihapullia");

var tuhis = new TuhisBot("Ville");
tuhis.puhu("tulkaa #tkt-node kannulle");
tuhis.kokkaa("billys pizzaa");
tuhis.huuteleLuennolla();
