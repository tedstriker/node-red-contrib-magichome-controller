const MagicHomeControl = require('magic-home').Control;
const events = require('events');

module.exports = function (RED) {
    function MagicHomeControlNode(config) {
        RED.nodes.createNode(this, config);

        class LampState extends events.EventEmitter {
            constructor() {
                super();

                this.C_ON = 'on';
                this.C_OFF = 'off';

                this._power = this.C_OFF;
                this._red = 0;
                this._green = 0;
                this._blue = 0;
                this._white = 0;
                this._brightness = 0;
            }

            static normalizeRange(min, max, value, previousValue) {
                let normalizedValue;

                if (!(Number.isInteger(min) && Number.isInteger(max) && isFinite(value))) {
                    return previousValue;
                }

                normalizedValue = parseInt(Math.min(max, Math.max(min, value)), 10);

                return normalizedValue;
            }

            set power(state) {
                if (state === true || state === this.C_ON) {
                    this._power = this.C_ON;
                } else if (state === false || state === this.C_OFF) {
                    this._power = this.C_OFF;
                }
                this.emit('change', 'power');
            }
            get power() {
                return this._power;
            }

            set red(value) {
                this._red = this.constructor.normalizeRange(0, 255, value, this._red);
                this.emit('change', 'red');
            }
            get red() {
                return this._red;
            }

            set green(value) {
                this._green = this.constructor.normalizeRange(0, 255, value, this._green);
                this.emit('change', 'green');
            }
            get green() {
                return this._green;
            }

            set blue(value) {
                this._blue = this.constructor.normalizeRange(0, 255, value, this._blue);
                this.emit('change', 'blue');
            }
            get blue() {
                return this._blue;
            }

            set white(value) {
                this._white = this.constructor.normalizeRange(0, 255, value, this.white);
                this.emit('change', 'white');
            }
            get white() {
                return this._white;
            }

            set color(objColor) {
                
            }

            get color() {
                let objColor = {
                    red: this.red,
                    green: this.green,
                    blue: this.blue
                };
                return objColor;
            }

            setColorAsArray(r, g, b) {
                this.red = r;
                this.green = g;
                this.blue = b;
            }

            getColorAsArray() {
                return [
                    this.red,
                    this.green,
                    this.blue
                ];
            }

            set brightness(value) {
                this.constructor.normalizeRange(0, 255, value, this._brightness);
                this.emit('change', 'brightness');
            }

            get brightness() {
                return Math.max(this.red, this.green, this.blue, this.white);
            }

            set status(objLampState) {
                if (objLampState.power === true || objLampState.power == this.C_ON) {
                    this._power = this.C_ON;
                } else if (objLampState.power === false || objLampState.power == this.C_OFF) {
                    this._power = this.C_OFF;
                }

                this._red = this.constructor.normalizeRange(0, 255, objLampState.color.red, this._red);
                this._green = this.constructor.normalizeRange(0, 255, objLampState.color.green, this._green);
                this._blue = this.constructor.normalizeRange(0, 255, objLampState.color.blue, this._blue);
                this._white = this.constructor.normalizeRange(0, 255, objLampState.white, this._white);

                this.emit('change', 'status');
            }
            get status() {
                let objStatus = {
                    power: this.power,
                    brightness: this.brightness,
                    color: {
                        red: this.red,
                        green: this.green,
                        blue: this.blue
                    },
                    white: this.white
                };
                return objStatus;
            }

            compare(objLampState) {
                let compareFields = ['power', 'red', 'green', 'blue', 'white'];

                if (!(objLampState instanceof LampState)) {
                    return false;
                }

                for (let args of compareFields) {
                    if (this[args] !== objLampState[args]) {
                        return false;
                    }
                }

                return true;
            }
        }

        let host;
        let lampName;

        this.server = RED.nodes.getNode(config.server);

        if (this.server) {
            host = this.server.host;
            lampName = this.server.name;
        }

        let internalState = new LampState();
        let node = this;
        let light = new MagicHomeControl(host);

        function setState(value) {

            if (value === internalState.C_ON || value === true) {
                light.turnOn(function () {
                    queryLampState();
                });
            } else if (value === internalState.C_OFF || value === false) {
                light.turnOff(function () {
                    queryLampState();
                });
            }
        }

        function refreshStateIndicator(lampState) {
            if (lampState.power === lampState.C_ON) {
                node.status({
                    fill: 'yellow',
                    shape: 'dot',
                    text: 'on'
                });
            } else if (lampState.power === lampState.C_OFF) {
                node.status({
                    fill: 'gray',
                    shape: 'dot',
                    text: 'off'
                });
            } else {
                node.status({
                    fill: 'gray',
                    shape: 'ring',
                    text: 'unknown'
                });
            }
        }

        // eslint-disable-next-line no-unused-vars
        function setColor(r, g, b) {
            let targetColors = [];
            for (let color in arguments) {
                targetColors.push(LampState.normalizeRange(0, 255, arguments[color], internalState.getColorAsArray()[color]));
            }

            light.setColorAndWarmWhite(targetColors[0], targetColors[1], targetColors[2], internalState.white, queryLampState);
        }

        function setWhite(w) {
            let color = LampState.normalizeRange(0, 255, w, internalState.white);
            light.setColorAndWarmWhite(internalState.red, internalState.green, internalState.blue, color, queryLampState);
        }

        function setBrightness() {
            // TBD 
        }

        function queryLampState() {
            light.queryState(evaluateQueryResult);
        }

        function evaluateQueryResult(err, data) {
            // on/off state
            if (err !== null) {
                node.error('lamp \'' + lampName + '\' not reachable.');
                return;
            }

            let queryData = {
                power: data.on,
                color: data.color,
                white: data.warm_white
            };
            internalState.status = queryData;
        }

        function sendStateMsg() {
            const msg = { payload: internalState.status };

            node.send(msg);
        }

        node.on('input', function name(msg) {
            // state on/off
            if (msg.payload.query !== undefined) {
                queryLampState();
            }

            if (msg.payload.power !== undefined) {
                setState(msg.payload.power);
            }

            // color
            if (msg.payload.color !== undefined) {
                setColor(msg.payload.color.red, msg.payload.color.green, msg.payload.color.blue);
            }

            // brightness of white
            if (msg.payload.white !== undefined) {
                setWhite(msg.payload.white);
            }

            if (msg.payload.brightness !== undefined) {
                setBrightness(msg.payload.brightness);
            }

        });

        internalState.on('change', function () {
            refreshStateIndicator(internalState);
            sendStateMsg();
        });

        queryLampState();
    }


    RED.nodes.registerType('MagicHome', MagicHomeControlNode);

    function MagicHomeControlConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.host = n.host;
    }
    RED.nodes.registerType('MagicHome-config', MagicHomeControlConfigNode);
};
