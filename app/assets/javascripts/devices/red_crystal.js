
(function ($) {

    var RedCrystal = function(config) {
        SpacePirate.Devices.Base.call(this, config);
    };
    RedCrystal.prototype = Object.create(SpacePirate.Devices.Base.prototype);
    RedCrystal.prototype.constructor = RedCrystal;

    $.extend(RedCrystal.prototype, {

        _init: function(config) {
            SpacePirate.Devices.Base.prototype._init.apply(this, arguments);

            this._name = 'Red Power Crystal';
            this._rates = {
                energy: 10.0
            };
            this._image = [
                '<>'
            ];
        }

    });

    SpacePirate.namespace('Devices').RedCrystal = RedCrystal;

}(jQuery));