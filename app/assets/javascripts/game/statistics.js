
(function ($) {

    var Statistics = function() {
        this._init();
    };
    Statistics.prototype = {

        _init: function() {
            this.playerDeaths = 0;
        },

        countPlayerDeath: function() {
            this.playerDeaths += 1;
        }

    };

    SpacePirate.namespace('Game').Statistics = Statistics;

}(jQuery));