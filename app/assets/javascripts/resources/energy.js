
(function ($) {

    var Energy = function(config) {
        SpacePirate.Resources.Base.call(this, config);
    };
    Energy.prototype = Object.create(SpacePirate.Resources.Base.prototype);
    Energy.prototype.constructor = Energy;

    $.extend(Energy.prototype, {

        _init: function(config) {
            SpacePirate.Resources.Base.prototype._init.apply(this, arguments);

            this.key = 'energy';
            this._name = 'Energy';
            this._description = 'Idk';
        }

    });

    SpacePirate.namespace('Resources').Energy = Energy;

}(jQuery));