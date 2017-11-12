
(function ($) {

    var currentId = 1;

    var Base = function(config) {
        this._init(config);
    };
    Base.prototype = {
        id: null,
        _defaultConfig: {
            initialAmount: 0
        },

        _init: function(config) {
            this.id = currentId;
            currentId++;

            this._config = $.extend({}, this._defaultConfig, config);

            this.key = null;
            this.amount = this._config.initialAmount;
        },

        name: function() {
            return this._name || 'Unknown';
        },

        description: function() {
            return this._description || 'No description';
        },

        units: function() {
            return this._units || '';
        }
    };

    SpacePirate.namespace('Resources').Base = Base;

}(jQuery));