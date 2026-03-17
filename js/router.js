var ROUTER = {

    go: function (page) {

        if (page === "dashboard") UI.dashboard();
        if (page === "ragazzi") UI.presenzeRagazzi();
        if (page === "staff") UI.presenzeStaff();
        if (page === "note") UI.note();
        if (page === "resoconto") UI.resoconto();

    }

};