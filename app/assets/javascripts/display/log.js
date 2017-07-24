
(function($) {

    var Log = function($container, config) {
        this._$container = $container;
        this._init(config);
    };
    Log.prototype = {
        _dynamicScrolling: null, // If true, keeps the div scrolled to top

        _defaultConfig: {},

        _init: function(config) {
            var self = this;

            this._config = $.extend({}, this._defaultConfig, config);

            if (this._$container.length === 0) {
                console.log('Error: no log container');
                return false;
            }

            this._dynamicScrolling = true;

            this._$container.off('scroll').on('scroll', function() {
                self._dynamicScrolling = false;
                var container = self._$container.get(0);

                if (container.scrollTop + self._$container.height() >= container.scrollHeight) {
                    self._dynamicScrolling = true;
                }
            });
        },

        positionToRightOfFrame: function(frame) {
            // Note: Frame must respond to width() and height()

            var leftOffset = frame.width() + 20;

            this._$container.css('padding-left', leftOffset)
                .css('min-width', SpacePirate.Utilities.minScreenWidth() - leftOffset)
                .css('max-height', frame.height())
                .css('min-height', frame.height());
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

            if (SpacePirate.Game.Constants.logTime) {
                message = (SpacePirate.Global.time / 1000).toFixed(3) + ': ' + message;
            }

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

    SpacePirate.namespace('Display').Log = Log;

}(jQuery));
