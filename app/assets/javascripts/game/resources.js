
(function ($) {

    var Resources = function() {
        this._init();
    };
    Resources.prototype = {

        _init: function() {
            this.ore = 100;
            this._orePerSecond = 1;
        },

        eachSecond: function(iterations) {
            this.addOre(this._orePerSecond * iterations);
        },

        addOre: function(amount) {
            this.ore += amount;
        }
    };

    SpacePirate.namespace('Game').Resources = Resources;

}(jQuery));