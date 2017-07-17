
(function ($) {

    var Player = function(config) {
        SpacePirate.Units.Base.call(this, config);
    };
    Player.prototype = Object.create(SpacePirate.Units.Base.prototype);
    Player.prototype.constructor = Player;

    $.extend(Player.prototype, {

        _init: function(config) {
            SpacePirate.Units.Base.prototype._init.apply(this, arguments);

        }

    });

    SpacePirate.namespace('Units').Player = Player;

}(jQuery));