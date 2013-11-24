'use strict';

var glass = require('..').glass;

function Bot(name) {
	this.nimi = name;
}

Bot.prototype.puhu = function() {
	console.log(this.nimi + ": beep");
};

function CookBot(nimi) {
	// Kutsutaan superin konstruktoria.
	CookBot.super_.call(this, nimi);
}
glass.inherits(CookBot, Bot);

CookBot.prototype.kokkaa = function(ruoka) {
	console.log(this.nimi + ": kokataas annos " + ruoka);
};

var botti = new Bot("es");
botti.puhu();
var kokkaaja = new CookBot("kokkaaja");
kokkaaja.puhu();
kokkaaja.kokkaa("lihapullia");