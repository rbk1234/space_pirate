
(function ($) {

    var RedCrystal = function(config) {
        SpacePirate.Devices.BaseGenerator.call(this, config);
    };
    RedCrystal.prototype = Object.create(SpacePirate.Devices.BaseGenerator.prototype);
    RedCrystal.prototype.constructor = RedCrystal;

    $.extend(RedCrystal.prototype, {

        _init: function(config) {
            SpacePirate.Devices.BaseGenerator.prototype._init.apply(this, arguments);

            this._name = 'Red Power Crystal';
            this._description = 'A rare energy source. Supplies power for a very very long time.';
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