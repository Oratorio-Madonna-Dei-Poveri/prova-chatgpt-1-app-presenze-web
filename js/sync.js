function addToQueue(data) {

    var tx = DB.transaction("queue", "readwrite");
    var store = tx.objectStore("queue");

    store.add(data);
}

function syncQueue() {

    if (!navigator.onLine) {
        setStatus("🔴 Offline");
        return;
    }

    var tx = DB.transaction("queue", "readonly");
    var store = tx.objectStore("queue");

    var request = store.openCursor();

    request.onsuccess = function (e) {
        var cursor = e.target.result;

        if (cursor) {

            setStatus("🟡 Sincronizzazione...");

            API.pushChanges(cursor.value, function () {

                var delTx = DB.transaction("queue", "readwrite");
                delTx.objectStore("queue").delete(cursor.key);

                setStatus("🟢 Sincronizzato");

            });

            cursor.continue();
        }
    };
}