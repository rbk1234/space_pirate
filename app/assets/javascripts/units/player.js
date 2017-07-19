
(function ($) {

    var Player = function(config) {
        SpacePirate.Units.Base.call(this, config);
    };
    Player.prototype = Object.create(SpacePirate.Units.Base.prototype);
    Player.prototype.constructor = Player;

    $.extend(Player.prototype, {

        _init: function(config) {
            SpacePirate.Units.Base.prototype._init.apply(this, arguments);

        },

        _kill: function() {
            SpacePirate.Units.Base.prototype._kill.apply(this, arguments);

            SpacePirate.Global.statistics.countPlayerDeath();
        },

        image: function() {
            return [
                ' [>  ',
                '/==;-',
                ' /\\  '
            ];
        },
        collision: function() {
            return [
                ' XX  ',
                ' XX  ',
                ' XX  '
            ];
        }

    });

    SpacePirate.namespace('Units').Player = Player;

}(jQuery));