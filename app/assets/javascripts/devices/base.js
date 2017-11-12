
(function ($) {

    var currentId = 1;

    var Base = function(config) {
        this._init(config);
    };
    Base.prototype = {
        id: null,
        isDead: null,
        _defaultConfig: {
            initialQuantity: 0
        },

        _init: function(config) {
            this._config = $.extend({}, this._defaultConfig, config);

            this.id = currentId;
            currentId++;

            this.isDead = false;
            this._quantity = this._config.initialQuantity;

            this._rates = { // per second
                energy: 0
            };
        },

        name: function() {
            return this._name || 'Unknown';
        },

        description: function() {
            return this._description || 'No description.';
        },

        materials: function() {
            return this._materials || {};
        },

        unique: function() {
            return this._unique || false;
        },

        quantity: function() {
            return this._quantity || 0;
        },

        build: function(quantity) {
            if (!this._quantity) {
                this._quantity = quantity;
            }
            else {
                this._quantity += quantity;
            }
        },

        numOn: function() {
            return this._numOn || 0;
        },
        anyOn: function() {
            return this.numOn() > 0;
        },

        resourceRate: function(resourceKey) {
            return (this._rates[resourceKey] || 0) * this.numOn();
        },

        resourceRateDescription: function(resourceKey) {
            return this._rates[resourceKey] || 0;
        },

        image: function() {
            return this._image || [[]];
        },

        kill: function() {
            this.isDead = true;
        },

        turnOff: function(quantity) {
            quantity = SpacePirate.Utilities.defaultFor(quantity, 'all');
            if (quantity === 'all') {
                this._numOn = 0;
            }
            else {
                this._numOn -= quantity;
                if (this._numOn < 0) {
                    this._numOn = 0;
                }
            }
        },
        turnOn: function(quantity) {
            quantity = SpacePirate.Utilities.defaultFor(quantity, 'all');
            if (quantity === 'all') {
                this._numOn = this.quantity();
            }
            else {
                this._numOn += quantity;
                if (this._numOn < this.quantity()) {
                    this._numOn = this.quantity();
                }
            }
        },
        run: function(seconds) {
            // default: do nothing
        }

    };

    SpacePirate.namespace('Devices').Base = Base;

}(jQuery));