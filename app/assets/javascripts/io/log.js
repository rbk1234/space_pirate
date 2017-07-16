
(function($) {

    var Log = function($container, config) {
        this._$container = $container;
        this._init(config);
    };
    Log.prototype = {

        _defaultConfig: {
            leftOffset: 0,
            minWidth: 0
        },

        _init: function(config) {
            var self = this;

            this._config = $.extend({}, this._defaultConfig, config);

            if (this._$container.length === 0) {
                console.log('Error: no log container');
                return false;
            }

            this._$container.css('padding-left', this._config.leftOffset)
                .css('min-width', this._config.minWidth);
        },

        clear: function() {
            // TODO
        }


    };

    SpacePirate.namespace('IO').Log = Log;

}(jQuery));
