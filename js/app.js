var APP = {
    ragazzi: [],
    settimana: null,
    data: new Date()
};

APP.presenzeCache = {};
APP.staff = [];

window.onload = function () {

    initDB(function () {

        APP.settimana = getSettimana(new Date());

        UI.home();

        loadInitialData();

        setInterval(syncQueue, 5000);

    });

};

function getSettimana(date) {

    var d = new Date(date);

    var settimane = [
        new Date("2026-06-15"),
        new Date("2026-06-22"),
        new Date("2026-06-29"),
        new Date("2026-07-06"),
        new Date("2026-07-13")
    ];

    for (var i = 0; i < settimane.length; i++) {

        var start = settimane[i];
        var end = new Date(start);
        end.setDate(end.getDate() + 6);

        if (d >= start && d <= end) {
            return i;
        }
    }

    return 0;
}

function loadInitialData() {

    API.getAllData(function (data) {

        APP.ragazzi = parseRagazzi(data.generale);
        APP.staff = parseStaff(data.staff);

        saveRagazzi(APP.ragazzi, function () {
            UI.dashboard();
        });

    });

}

function parseRagazzi(rows) {

    var result = [];

    for (var i = 1; i < rows.length; i++) {

        var r = rows[i];

        var obj = {
            id: r[0] + "_" + r[1],
            cognome: r[0],
            nome: r[1],
            classe: r[2],
            telefono: r[5],
            intolleranze: r[6],
            squadra: r[14],
            settimane: [
                r[9] == "X",
                r[10] == "X",
                r[11] == "X",
                r[12] == "X",
                r[13] == "X"
            ]
        };

        if (obj.settimane[APP.settimana]) {
            result.push(obj);
        }
    }

    return result;
}

function saveRagazzi(list, callback) {

    var tx = DB.transaction("ragazzi", "readwrite");
    var store = tx.objectStore("ragazzi");

    for (var i = 0; i < list.length; i++) {
        store.put(list[i]);
    }

    tx.oncomplete = callback;
}

function parseStaff(rows) {

    var result = [];

    for (var i = 1; i < rows.length; i++) {

        var r = rows[i];

        result.push({
            id: r[0] + "_" + r[1],
            cognome: r[0],
            nome: r[1]
        });
    }

    return result;
}