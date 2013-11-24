Oliot ja periytyminen
===
Tekijät: Juho Hautala, Ville Lahdenvuo, Lalli Nuorteva ja Olavi Lintumäki

##Periytyminen
```javascript
function Bot(name) {
	this.nimi = name;
}

var botti = new Bot("es");

Bot.prototype.puhu = function() {
	console.log(this.nimi + ": beep");
};

botti.puhu();
```
