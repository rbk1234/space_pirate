
(function ($) {

    var currentId = 1;

    var Base = function(config) {
        this._init(config);
    };
    Base.prototype = {
        id: null,

        _init: function(config) {
            this.id = currentId;
            currentId++;

            this.key = null;
            this.amount = 0;
        },

        name: function() {
            return this._name || 'Unknown';
        },

        description: function() {
            return this._description || 'No description';
        }
    };

    SpacePirate.namespace('Resources').Base = Base;

}(jQuery));