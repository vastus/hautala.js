var glass = require('../lib/index').glass;
function bot(nimi){
    this.nimi = nimi;
    this.puhu = function(){
        console.log(nimi+": beep");
    }
}

function cookbot(nimi){
    this.nimi = nimi;
    this.kokkaa = function(ruoka){
        console.log(nimi+": kokataas annos "+ ruoka);
    }
}

glass.inherits(bot,cookbot);
var botti = new bot("es");
botti.puhu();
var kokkaaja = new cookbot("kokkaaja");
kokkaaja.kokkaa("lihapullia");

