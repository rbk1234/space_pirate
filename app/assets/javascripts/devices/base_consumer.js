
(function ($) {

    var BaseConsumer = function(config) {
        SpacePirate.Devices.Base.call(this, config);
    };
    BaseConsumer.prototype = Object.create(SpacePirate.Devices.Base.prototype);
    BaseConsumer.prototype.constructor = BaseConsumer;

    $.extend(BaseConsumer.prototype, {

        _init: function(config) {
            SpacePirate.Devices.Base.prototype._init.apply(this, arguments);

            this.type = 'consumer';
        }

    });

    SpacePirate.namespace('Devices').BaseConsumer = BaseConsumer;

}(jQuery));