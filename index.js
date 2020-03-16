const config = require('./config.json');
const { HueMakeyBuzzer } = require('./HueMakeyBuzzer')

const hmb = new HueMakeyBuzzer(config);

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    }
    hmb.buzz(key.name);
});
console.log('Press any key (Ctrl+C to quit)...');