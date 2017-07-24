
(function ($) {

    var Resources = function() {
        this._init();
    };
    Resources.prototype = {

        _init: function() {
            this.ore = 100;
            this._orePerSecond = 1;
        },

        update: function(iterations, period) {
            var seconds = iterations * period;

            this.addOre(this._orePerSecond * seconds);
        },

        addOre: function(amount) {
            this.ore += amount;
        }
    };

    SpacePirate.namespace('Game').Resources = Resources;

}(jQuery));