const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");

module.exports = NodeHelper.create({
    socketNotificationReceived(notification, payload) {
        if (notification === "LOAD_JSON") {
            const filePath = path.join(__dirname, payload);

            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    console.log("Error al leer JSON:", err);
                    return;
                }

                const json = JSON.parse(data);
                this.sendSocketNotification("JSON_LOADED", json);
            });
        }
    }
});
