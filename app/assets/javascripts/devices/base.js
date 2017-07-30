
(function ($) {

    var currentId = 1;

    var Base = function(config) {
        this._init(config);
    };
    Base.prototype = {
        id: null,
        isDead: null,
        running: null,

        _init: function(config) {
            this.id = currentId;
            currentId++;

            this.isDead = false;
            this.running = false;


            this._rates = { // per second
                energy: 0
            };
        },

        name: function() {
            return this._name || 'Unknown';
        },

        resourceRate: function(resourceKey) {
            if (this.running) {
                return this._rates[resourceKey] || 0;
            }
            else {
                return 0;
            }
        },

        image: function() {
            return this._image || [[]];
        },

        kill: function() {
            this.isDead = true;
        },

        turnOff: function() {
            this.running = false;
        },
        turnOn: function() {
            this.running = true;
        },
        run: function(seconds) {
            // default: do nothing
        }

    };

    SpacePirate.namespace('Devices').Base = Base;

}(jQuery));