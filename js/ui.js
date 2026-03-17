var UI = {

    // HOME
    home: function () {

        document.getElementById("app").innerHTML =
            "<h1>App Presenze</h1>" +
            "<button onclick='ROUTER.go(\"dashboard\")'>Entra</button>";
    },

    // DASHBOARD
    dashboard: function () {

        document.getElementById("app").innerHTML =
            "<h2>Dashboard</h2>" +
            "<div class='grid'>" +

            btn("Presenze Ragazzi", "ragazzi") +
            btn("Presenze Staff", "staff") +
            btn("Entrata/Uscita", "entrate") +
            btn("Dati Ragazzi", "dati") +
            btn("Note", "note") +
            btn("Resoconto", "resoconto") +

            "</div>" +
            "<div id='status'></div>";
    },

    // RAGAZZI
    presenzeRagazzi: function () {

        var html =
            "<button onclick='ROUTER.go(\"dashboard\")'>←</button>" +
            "<h2>Presenze Ragazzi</h2>" +
            "<input id='search' placeholder='Cerca...'>" +
            "<div id='lista'></div>";

        document.getElementById("app").innerHTML = html;

        document.getElementById("search").onkeyup = function () {
            UI.filtra(this.value);
        };

        UI.renderLista(APP.ragazzi);
    },

    renderLista: function (lista) {

        var html = "";

        for (var i = 0; i < lista.length; i++) {

            var stato = APP.presenzeCache[r.id];

            html +=
            "<div class='card'>" +
            "<b>" + r.cognome + " " + r.nome + "</b><br>" +
            "Squadra: " + r.squadra + "<br>" +

            "<button class='" + (stato===1?"on":"") + "' onclick='UI.setPresenza(\"" + r.id + "\",1)'>✔</button>" +
            "<button class='" + (stato===0?"on":"") + "' onclick='UI.setPresenza(\"" + r.id + "\",0)'>✖</button>" +
            "</div>";
        }

        document.getElementById("lista").innerHTML = html;
    },

    filtra: function (q) {

        q = q.toLowerCase();

        var filtered = [];

        for (var i = 0; i < APP.ragazzi.length; i++) {

            var r = APP.ragazzi[i];

            if (
                r.nome.toLowerCase().indexOf(q) > -1 ||
                r.cognome.toLowerCase().indexOf(q) > -1 ||
                r.squadra.toLowerCase().indexOf(q) > -1
            ) {
                filtered.push(r);
            }
        }

        UI.renderLista(filtered);
    },

    setPresenza: function (id, val) {
        APP.presenzeCache[id] = val;

        var entry = {
            idPersona: id,
            tipo: "ragazzo",
            presente: val,
            data: new Date().toISOString()
        };

        savePresenza(entry);
        addToQueue(entry);

        UI.presenzeRagazzi();
    },  

    // STAFF
    presenzeStaff: function () {

            var html =
                "<button onclick='ROUTER.go(\"dashboard\")'>←</button>" +
                "<h2>Staff</h2>";

            for (var i = 0; i < APP.staff.length; i++) {
            
                var s = APP.staff[i];
            
                html +=
                    "<div class='card'>" +
                    s.cognome + " " + s.nome + "<br>" +
            
                    "Presenza: " +
                    "<button onclick='UI.setStaff(\"" + s.id + "\",1)'>✔</button>" +
                    "<button onclick='UI.setStaff(\"" + s.id + "\",0)'>✖</button><br>" +
            
                    "Mensa: " +
                    "<button onclick='UI.setMensa(\"" + s.id + "\",1)'>🍝</button>" +
                    "<button onclick='UI.setMensa(\"" + s.id + "\",0)'>❌</button>" +
                    "</div>";
            }
        
            document.getElementById("app").innerHTML = html;
        },

        setStaff: function(id, val){
        
            addToQueue({
                tipo:"staff",
                idPersona:id,
                presente:val,
                data:new Date().toISOString()
            });
        
        },

        setMensa: function(id, val){
        
            addToQueue({
                tipo:"mensa",
                idPersona:id,
                mensa:val,
                data:new Date().toISOString()
            });
        
        },

    // NOTE
    note: function () {

        document.getElementById("app").innerHTML =
            "<button onclick='ROUTER.go(\"dashboard\")'>←</button>" +
            "<h2>Note</h2>" +
            "<textarea id='noteText'></textarea><br>" +
            "<button onclick='UI.salvaNote()'>Salva</button>";
    },

    salvaNote: function () {

        var text = document.getElementById("noteText").value;

        addToQueue({
            tipo: "note",
            testo: text,
            data: new Date().toISOString()
        });

        setStatus("🟡 Note salvate");
    },

    // RESOCONTO
    resoconto: function () {

        var presenti = 0;

        var tx = DB.transaction("presenze", "readonly");
        var store = tx.objectStore("presenze");

        store.openCursor().onsuccess = function (e) {

            var cursor = e.target.result;

            if (cursor) {

                if (cursor.value.presente === 1) presenti++;

                cursor.continue();

            } else {

                document.getElementById("app").innerHTML =
                    "<button onclick='ROUTER.go(\"dashboard\")'>←</button>" +
                    "<h2>Resoconto</h2>" +
                    "Presenti: " + presenti;
            }
        };
    },

    entrate: function () {

        var html =
            "<button onclick='ROUTER.go(\"dashboard\")'>←</button>" +
            "<h2>Entrata/Uscita</h2>" +
            "<input id='searchEU'>" +
            "<div id='listaEU'></div>";

        document.getElementById("app").innerHTML = html;

        UI.renderEntrate(APP.ragazzi);
    },

    renderEntrate: function (list) {

        var html = "";

        for (var i = 0; i < list.length; i++) {

            var r = list[i];

            html +=
                "<div class='card'>" +
                r.cognome + " " + r.nome + "<br>" +

                "<button onclick='UI.setEU(\"" + r.id + "\",\"entrata\")'>Entrata</button>" +
                "<button onclick='UI.setEU(\"" + r.id + "\",\"uscita\")'>Uscita</button>" +
                "</div>";
        }

        document.getElementById("listaEU").innerHTML = html;
    },

    setEU: function(id, tipo){

        var ora = new Date().toTimeString().substr(0,5);

        addToQueue({
            tipo: tipo,
            idPersona: id,
            ora: ora,
            data: new Date().toISOString()
        });

    },

    dati: function () {

        var html =
            "<button onclick='ROUTER.go(\"dashboard\")'>←</button>" +
            "<h2>Dati Ragazzi</h2>";

        for (var i = 0; i < APP.ragazzi.length; i++) {

            var r = APP.ragazzi[i];

            html +=
                "<div class='card'>" +
                "<b>" + r.cognome + " " + r.nome + "</b><br>" +
                "Telefono: " + r.telefono + "<br>" +
                "Intolleranze: " + r.intolleranze +
                "</div>";
        }

        document.getElementById("app").innerHTML = html;
    },

    resoconto: function () {

        var presenti = 0;

        var tx = DB.transaction("presenze", "readonly");
        var store = tx.objectStore("presenze");

        store.openCursor().onsuccess = function (e) {

            var cursor = e.target.result;

            if (cursor) {

                if (cursor.value.presente === 1) presenti++;

                cursor.continue();

            } else {

                document.getElementById("app").innerHTML =
                    "<button onclick='ROUTER.go(\"dashboard\")'>←</button>" +
                    "<h2>Resoconto</h2>" +
                    "Presenti: " + presenti;
            }
        };
    }
};

function btn(label, page) {
    return "<button class='big' onclick='ROUTER.go(\"" + page + "\")'>" + label + "</button>";
}

function setStatus(txt) {
    document.getElementById("syncStatus").innerHTML = txt;
}