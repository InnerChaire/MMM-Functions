Module.register("MMM-FunctionsFeed", {
    defaults: {
        jsonFile: "functions.json",
        rotateInterval: 4000,
        animationSpeed: 1000
    },

    start() {
        this.functions = [];
        this.currentIndex = 0;
        this.loaded = false;

        // Cargar el JSON desde node_helper
        this.sendSocketNotification("LOAD_JSON", this.config.jsonFile);
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "JSON_LOADED") {
            this.functions = payload.functions;
            this.loaded = true;

            this.scheduleRotation();
            this.updateDom();
        }
    },

    scheduleRotation() {
        setInterval(() => {
            if (this.loaded && this.functions.length > 0) {
                this.currentIndex = (this.currentIndex + 1) % this.functions.length;
                this.updateDom(this.config.animationSpeed);
            }
        }, this.config.rotateInterval);
    },

    getDom() {
        const wrapper = document.createElement("div");
        wrapper.className = "functionsFeed";

        if (!this.loaded) {
            wrapper.innerHTML = "Cargando funciones...";
            return wrapper;
        }

        const func = this.functions[this.currentIndex];

        const title = document.createElement("div");
        title.className = "func-title";
        title.innerHTML = func.title;

        const desc = document.createElement("div");
        desc.className = "func-desc";
        desc.innerHTML = func.description;

        wrapper.appendChild(title);
        wrapper.appendChild(desc);

        return wrapper;
    },

    // Escuchar evento que viene del STT
    notificationReceived(notification, payload) {
        if (notification === "WEB_SPEECH_TEXT") {
            this.processVoiceCommand(payload);
        }
    },

    activateNextModule() {
        // Enviar notificación para activar otro módulo
        this.sendNotification("FUNCTION_SELECTED", {
            id: "next_module",
            title: "Siguiente módulo"
        });

        // Ocultarse
        this.hide(1000);
    },


    processVoiceCommand(text) {
        const normalized = text.toLowerCase();

        const match = this.functions.find(f =>
            normalized.includes(f.title.toLowerCase()) ||
            normalized.includes(f.id.toLowerCase())
        );

        if (match) {
            console.log("[MMM-FunctionsFeed] Activando:", match.id);

            // Lanza el módulo deseado
            this.sendNotification("FUNCTION_SELECTED", match);

            // Oculta este módulo
            this.hide(1000);
        }
    }
});
