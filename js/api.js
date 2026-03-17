var API = {

    getAllData: function(callback) {

        var xhr = new XMLHttpRequest();

        xhr.open("GET", CONFIG.API_URL + "?action=getAllData", true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(JSON.parse(xhr.responseText));
            }
        };

        xhr.send();
    },

    pushChanges: function(data, callback) {

        var xhr = new XMLHttpRequest();

        xhr.open("POST", CONFIG.API_URL + "?action=pushChanges", true);

        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(JSON.parse(xhr.responseText));
            }
        };

        xhr.send(JSON.stringify(data));
    }

};