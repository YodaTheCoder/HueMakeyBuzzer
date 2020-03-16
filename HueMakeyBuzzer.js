const { Hue } = require('./Hue')

const makeBuzzerMap = players => {
    const buzzerMap = {};
    players.forEach(p => buzzerMap[p.buzzerKey.toUpperCase()] = { colour: p.colour, name: p.name });
    return buzzerMap;
};

class HueMakeyBuzzer {
    constructor(config) {
        this.ready = false;
        this.error = '';

        this.hue = new Hue(config.hue);
        this.hue.init();

        this.ready = this.hue.ready;
        this.error = this.hue.error;

        this.buzzerMap = makeBuzzerMap(config.players);
        this.colourMap = config.colours;

        this.triggered = false;
        this.resetMillis = config.resetSeconds * 1000
    }

    reset = () => {
        this.triggered = false;
        this.hue.setColour(this.colourMap["Neutral"]);
    }

    buzz = (key) => {
        const b = this.buzzerMap[key.toUpperCase()];
        if (b && !this.triggered) {
            this.triggered = true;
            this.hue.setColour(this.colourMap[b.colour]);
            setTimeout(this.reset, this.resetMillis);
        }
    }
}

module.exports = {
    HueMakeyBuzzer
}