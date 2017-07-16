
(function ($) {

    var Resources = function() {
        this._init();
    };
    Resources.prototype = {

        _init: function() {
            this._ore = 100;
        }
    };

    SpacePirate.namespace('Game').Resources = Resources;

}(jQuery));