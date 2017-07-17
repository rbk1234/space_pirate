
(function($) {

    var Log = function($container, config) {
        this._$container = $container;
        this._init(config);
    };
    Log.prototype = {
        _dynamicScrolling: null, // If true, keeps the div scrolled to top

        _defaultConfig: {
            leftOffset: 0,
            minWidth: 0,
            maxHeight: 0,
            minHeight: 0
        },

        _init: function(config) {
            var self = this;

            this._config = $.extend({}, this._defaultConfig, config);

            if (this._$container.length === 0) {
                console.log('Error: no log container');
                return false;
            }

            this._$container.css('padding-left', this._config.leftOffset)
                .css('min-width', this._config.minWidth)
                .css('max-height', this._config.maxHeight)
                .css('min-height', this._config.minHeight);

            this._dynamicScrolling = true;

            this._$container.off('scroll').on('scroll', function() {
                self._dynamicScrolling = false;
                var container = self._$container.get(0);

                if (container.scrollTop + self._$container.height() >= container.scrollHeight) {
                    self._dynamicScrolling = true;
                }
            });
        },

        clear: function() {
            this._$container.empty();
        },

        logMessage: function(message) {
            //var $p = $("<p>", {
            //    id: "foo",
            //    class: "a"
            //});
            ////$p.click(function(){ /* ... */ });
            //this._$container.append($p);

            this._$container.append(
                $('<p>')
                    //.attr("id", "newDiv1")
                    .addClass("log-paragraph")
                    .text(message)
            );

            if (this._dynamicScrolling) {
                var container = this._$container.get(0);
                container.scrollTop = container.scrollHeight;
            }
        }


    };

    SpacePirate.namespace('IO').Log = Log;

}(jQuery));
