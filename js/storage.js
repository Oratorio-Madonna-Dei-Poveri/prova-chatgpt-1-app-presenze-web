var DB;

function initDB(callback) {

    var request = indexedDB.open("PresenzeDB", 2);

    request.onupgradeneeded = function (e) {
        DB = e.target.result;

        if (!DB.objectStoreNames.contains("ragazzi")) {
            DB.createObjectStore("ragazzi", { keyPath: "id" });
        }

        if (!DB.objectStoreNames.contains("presenze")) {
            DB.createObjectStore("presenze", { keyPath: "id", autoIncrement: true });
        }

        if (!DB.objectStoreNames.contains("queue")) {
            DB.createObjectStore("queue", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = function (e) {
        DB = e.target.result;
        callback();
    };
}

function savePresenza(data) {

    var tx = DB.transaction("presenze", "readwrite");
    var store = tx.objectStore("presenze");

    store.add(data);
}