
(function ($) {

    var Lamp = function(config) {
        SpacePirate.Devices.BaseConsumer.call(this, config);
    };
    Lamp.prototype = Object.create(SpacePirate.Devices.BaseConsumer.prototype);
    Lamp.prototype.constructor = Lamp;

    $.extend(Lamp.prototype, {

        _init: function(config) {
            SpacePirate.Devices.BaseConsumer.prototype._init.apply(this, arguments);

            this._name = 'Lamp';
            this._description = 'Can be turned on to light up the room.';
            this._unique = true;
            this._rates = {
                energy: -1.0
            };
            this._image = [
                '/-\\',
                '|*|'
            ];
            this._materials = {
                energy: 100,
                scrap_metal: 10
            }
        },

        turnOn: function() {
            SpacePirate.Devices.BaseConsumer.prototype.turnOn.apply(this, arguments);
            this._applySlowTransitions();
            $('body').removeClass('nightmode');

            if (!this._messageShown) {
                SpacePirate.Global.baseLog.logMessage('Your base is illuminated.');
                this._messageShown = true;
            }
        },
        turnOff: function() {
            SpacePirate.Devices.BaseConsumer.prototype.turnOff.apply(this, arguments);
            this._applySlowTransitions();
            $('body').addClass('nightmode');
        },

        _applySlowTransitions: function() {
            var $body = $('body');

            $body.addClass('slow-transitions');
            if (this._timeout) {
                window.clearTimeout(this._timeout);
            }
            this._timeout = window.setTimeout(function() {
                $body.removeClass('slow-transitions');
            }, 5000); // TODO Has to match transition speed
        }

    });

    SpacePirate.namespace('Devices').Lamp = Lamp;

}(jQuery));