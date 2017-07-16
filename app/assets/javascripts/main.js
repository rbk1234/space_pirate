
(function($){

    var FONT_HEIGHT = 14;
    var FONT_WIDTH = FONT_HEIGHT * 3.0 / 5.0; // Having a width that is 3/5 of the height is standard for monospace text

    var CANVAS_ROWS = 25;
    var CANVAS_COLUMNS = 90;

    var Main = function() {
        this._init();
    };
    Main.prototype = {
        _timing: null,
        _canvases: null,

        _screen: null,
        _keyboard: null,

        _init: function() {
            this._setupTiming();
            this._setupIO();
            this._loadCanvases();
            this._loadLog();

            this._screen = new SpacePirate.Screens.Screen1();
            this._createPeriodicFn(SpacePirate.Util.makeCallback(this, this._eachSecond), 1000);
            this._run();
        },

        _setupTiming: function() {
            var self = this;

            /*. Fallback support, window.requestAnimationFrame isn't fully supported by all browsers .*/
            window.requestFrame = (function () {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    function (c) {
                        window.setTimeout(c, 50);
                    };
            })();

            /*. Time based variables, all in milliseconds .*/
            this._timing = {
                now: Date.now() || (new Date).getTime(), // Current tick's time
                then: Date.now() || (new Date).getTime(), // Last tick's time
                delta: 0, // Time since last tick
                total: 0, // Total time elapsed
                periodicFns: [] // functions to call periodically
            };

            /*. Main function .*/
            this._run = function () {
                /*. Calculate time since last tick .*/
                self._timing.now = Date.now() || (new Date).getTime(); // Get current time
                self._timing.delta = self._timing.now - self._timing.then; // Get time since last tick
                self._timing.then = self._timing.now; // Reset last tick time
                self._timing.total += self._timing.delta;

                self._gameLoop();

                /*. Run function again as soon as possible without lagging .*/
                window.requestFrame(self._run);
            };
        },

        _setupIO: function() {
            this._keyboard = new SpacePirate.IO.Keyboard();
        },

        _loadCanvases: function() {
            var self = this;
            this._canvases = {};

            $('.canvas-container').width(this._canvasWidth());

            self._loadCanvas('main');
        },

        _loadLog: function() {
            var logOffset = this._canvasWidth() + 20;
            var logMinWidth = this._minScreenWidth() - logOffset;
            $('.log-container').css('padding-left', logOffset).css('min-width', logMinWidth);
        },

        _loadCanvas: function(id) {
            var $canvas = $('#'+id+'-canvas');
            var canvas = $canvas.get(0);
            var context = canvas.getContext('2d');
            this._convertCanvasToHiDPI(canvas, this._canvasWidth(), this._canvasHeight());

            context.font = FONT_HEIGHT + 'px monospace';
            context.fillStyle = "#3f3f3f";

            this._canvases[id] = {
                $canvas: $canvas,
                context: context
            };
        },

        // TODO Internet Explorer
        // https://stackoverflow.com/questions/22483296/html5-msbackingstorepixelratio-and-window-devicepixelratio-dont-exist-are-the
        _convertCanvasToHiDPI: function(canvas, width, height, ratio) {
            var context = canvas.getContext('2d');

            if (!ratio) {
                var dpr = window.devicePixelRatio || 1;
                var bsr = context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                ratio = dpr / bsr;
            }

            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        },

        _gameLoop: function() {
            this._iteratePeriodicFns();

            var modifier = this._timing.delta / 1000;

            //var keysDown = this._keyboard.keysDown;
            //if (38 in keysDown) { // Player holding up
            //    this._player.y -= this._player.speed * modifier;
            //}
            //if (40 in keysDown) { // Player holding down
            //    this._player.y += this._player.speed * modifier;
            //}
            //if (37 in keysDown) { // Player holding left
            //    this._player.x -= this._player.speed * modifier;
            //}
            //if (39 in keysDown) { // Player holding right
            //    this._player.x += this._player.speed * modifier;
            //}

            this._drawMain();
        },

        _drawMain: function() {
            var context = this._canvases.main.context;
            var $canvas = this._canvases.main.$canvas;

            context.clearRect(0, 0, $canvas.width(), $canvas.height());

            this._drawImage(this._screen.background, context)
        },

        _drawImage: function(charArray, context, x, y) {
            x = SpacePirate.Util.defaultFor(x, 0);
            y = SpacePirate.Util.defaultFor(y, 0);
            y += (FONT_HEIGHT - 2); // Move down one row. Move up a tiny bit.

            for (var row = 0; row < charArray.length; row++) {
                for (var col = 0; col < charArray[row].length; col++) {
                    context.fillText(charArray[row][col], x + col * FONT_WIDTH, y + row * FONT_HEIGHT);
                }
            }
        },

        _eachSecond: function(iterations) {
            this._updateFps();
            // TODO Draw background less often
        },

        _updateFps: function() {
            var fps = (1000 / this._timing.delta).toFixed(1);
            var total = (this._timing.total / 1000).toFixed(1);

            $('#fps').text(fps);
            $('#total-time').text(total);
        },


        // ---------------------------------------------------------------- Dimension helpers

        _minScreenWidth: function() {
            return parseInt($('.main-content').css('min-width'));
        },
        _canvasHeight: function() {
            return CANVAS_ROWS * FONT_HEIGHT;
        },
        _canvasWidth: function() {
            return CANVAS_COLUMNS * FONT_WIDTH;
        },


        // ---------------------------------------------------------------- Periodic function helpers

        _createPeriodicFn: function(fn, period, cache) {
            cache = SpacePirate.Util.defaultFor(cache, false);

            this._timing.periodicFns.push({
                fn: fn,
                period: period,
                current: period,
                cache: cache
            });
        },

        _iteratePeriodicFns: function() {
            var delta = this._timing.delta;

            $.each(this._timing.periodicFns, function(index, periodicFn) {
                periodicFn.current += delta;
                if (periodicFn.current >= periodicFn.period) {
                    if (periodicFn.cache) {
                        periodicFn.current -= periodicFn.period;
                        periodicFn.fn();
                    }
                    else {
                        var iterations = 0;
                        while (periodicFn.current >= periodicFn.period) {
                            iterations += 1;
                            periodicFn.current -= periodicFn.period;
                        }
                        periodicFn.fn(iterations);
                    }
                }
            });
        }

    };

    SpacePirate.Init.register('body.application', function($panel) {
        $panel.data('main', new Main($panel));
    });

})(jQuery);
