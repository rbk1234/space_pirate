
(function ($) {

    var BaseGenerator = function(config) {
        SpacePirate.Devices.Base.call(this, config);
    };
    BaseGenerator.prototype = Object.create(SpacePirate.Devices.Base.prototype);
    BaseGenerator.prototype.constructor = BaseGenerator;

    $.extend(BaseGenerator.prototype, {

        _init: function(config) {
            SpacePirate.Devices.Base.prototype._init.apply(this, arguments);

            this.type = 'generator';
        }

    });

    SpacePirate.namespace('Devices').BaseGenerator = BaseGenerator;

}(jQuery));