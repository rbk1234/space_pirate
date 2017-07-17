
(function($) {

    var Canvas = function($container, config) {
        this._$container = $container;
        this._init(config);
    };
    Canvas.prototype = {

        _defaultConfig: {
            canvasId: 'default',
            rows: 25,
            columns: 90
        },

        _init: function(config) {
            var self = this;

            this._config = $.extend({}, this._defaultConfig, config);

            this.$canvas = $('#'+this._config.canvasId+'-canvas');

            if (this.$canvas.length === 0) {
                console.log('Error: invalid canvas id: #' + this._config.canvasId);
                return false;
            }

            if (this._$container.length === 0) {
                console.log('Error: no canvas container');
                return false;
            }
            this._$container.width(this.width());

            this.canvas = this.$canvas.get(0);
            this.context = this.canvas.getContext('2d');
            this._convertCanvasToHiDPI(this.width(), this.height());

            this.context.font = SpacePirate.Global.settings.fontHeight() + 'px monospace';
            this.context.fillStyle = "#3f3f3f";
        },

        clear: function() {
            this.context.clearRect(0, 0, this.width(), this.height());
        },

        // TODO Very inefficient to draw one char at a time... draw one line at a time
        drawImage: function(charArray, x, y) {
            x = SpacePirate.Utilities.defaultFor(x, 0);
            y = SpacePirate.Utilities.defaultFor(y, 0);
            y += (SpacePirate.Global.settings.fontHeight() - 2); // Move down one row. Move up a tiny bit.

            for (var row = 0; row < charArray.length; row++) {
                for (var col = 0; col < charArray[row].length; col++) {
                    this.context.fillText(
                        charArray[row][col],
                        x + col * SpacePirate.Global.settings.fontWidth(),
                        y + row * SpacePirate.Global.settings.fontHeight()
                    );
                }
            }
        },

        width: function() {
            return this._config.columns * SpacePirate.Global.settings.fontWidth();
        },

        height: function() {
            return this._config.rows * SpacePirate.Global.settings.fontHeight();
        },

        _convertCanvasToHiDPI: function(width, height, ratio) {
            if (!ratio) {
                // TODO Internet Explorer
                // https://stackoverflow.com/questions/22483296/html5-msbackingstorepixelratio-and-window-devicepixelratio-dont-exist-are-the
                var dpr = window.devicePixelRatio || 1;
                var bsr = this.context.webkitBackingStorePixelRatio ||
                    this.context.mozBackingStorePixelRatio ||
                    this.context.msBackingStorePixelRatio ||
                    this.context.oBackingStorePixelRatio ||
                    this.context.backingStorePixelRatio || 1;
                ratio = dpr / bsr;
            }

            this.canvas.width = width * ratio;
            this.canvas.height = height * ratio;
            this.canvas.style.width = width + "px";
            this.canvas.style.height = height + "px";
            this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
        }

    };

    SpacePirate.namespace('Display').Canvas = Canvas;

}(jQuery));
