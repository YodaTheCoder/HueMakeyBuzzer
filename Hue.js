const http = require("http");

const makeBaseURI = (ip, user) => `http://${ip}/api/${user}`;

const checkBridgeConnectivity = async (ip, user) => {
    const healthcheckURI = `${makeBaseURI(ip, user)}/lights`;

    return new Promise((resolve, reject) => {
        http.get(healthcheckURI, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                resolve(JSON.parse(body));
            });
            res.on("error", (e) => {
                reject(null);
            });
        });
    });
};

const setLightColour = async (ip, user, lightId, colour) => {
    const data = JSON.stringify({ "hue": colour })

    const options = {
        hostname: ip,
        port: 80,
        path: `/api/${user}/lights/${lightId}/state`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                resolve(JSON.parse(body));
            });
        })

        req.on('error', (error) => {
            reject(null);
        })

        req.write(data)
        req.end()
    });
};

class Hue {
    constructor({ bridgeIP, user, lightId }) {
        this.bridgeIP = bridgeIP;
        this.user = user;
        this.lightId = lightId;
        this.ready = false;
        this.error = '';
    }

    async init() {
        const bridgeData = await checkBridgeConnectivity(this.bridgeIP, this.user);
        if (!bridgeData) {
            this.error = 'Failed to make connection with bridge. Check IP address and user ID.';
            return;
        }

        if (!bridgeData[`${this.lightId}`]) {
            this.error = `Failed to find light with id '${this.lightId}' attached to bridge`;
            return;
        }

        this.ready = true;
        this.error = '';
    }

    async setColour(colour) {
        const res = await setLightColour(this.bridgeIP, this.user, this.lightId, colour);
        if (!res) {
            this.error = 'error sending instruction to bridge';
        }
    }
}

module.exports = {
    Hue
}