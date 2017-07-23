
(function ($) {

    var Alien_01 = function(config) {
        SpacePirate.Units.Base.call(this, config);
    };
    Alien_01.prototype = Object.create(SpacePirate.Units.Base.prototype);
    Alien_01.prototype.constructor = Alien_01;

    $.extend(Alien_01.prototype, {

        _init: function(config) {
            //console.log(arguments);
            SpacePirate.Units.Base.prototype._init.apply(this, arguments);
        },

        image: function() {
            return [
                ' <> ',
                's{}s',
                ' ^^ '
            ]
        },
        collision: function() {
            return [
                ' XX ',
                'XXXX',
                ' XX '
            ];
        },

        moveSpeed: function() {
            return -1.0;
        }

    });

    SpacePirate.namespace('Units').Alien_01 = Alien_01;

}(jQuery));