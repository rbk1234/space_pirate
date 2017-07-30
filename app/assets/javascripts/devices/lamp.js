
(function ($) {

    var Lamp = function(config) {
        SpacePirate.Devices.Base.call(this, config);
    };
    Lamp.prototype = Object.create(SpacePirate.Devices.Base.prototype);
    Lamp.prototype.constructor = Lamp;

    $.extend(Lamp.prototype, {

        _init: function(config) {
            SpacePirate.Devices.Base.prototype._init.apply(this, arguments);

            this._name = 'Lamp';
            this._rates = {
                energy: -1.0
            };
            this._image = [
                '/-\\',
                '|*|'
            ];
        },

        turnOn: function() {
            SpacePirate.Devices.Base.prototype.turnOn.apply(this, arguments);
            $('body').removeClass('nightmode');

            if (!this._messageShown) {
                SpacePirate.Global.baseLog.logMessage('Your base is illuminated.');
                this._messageShown = true;
            }
        },
        turnOff: function() {
            SpacePirate.Devices.Base.prototype.turnOff.apply(this, arguments);
            $('body').addClass('nightmode');
        }

    });

    SpacePirate.namespace('Devices').Lamp = Lamp;

}(jQuery));