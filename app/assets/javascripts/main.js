
(function($){

    var Main = function() {
        this._init();
    };

    Main.prototype = {
        _timing: null,
        _canvases: null,

        _screen: null,
        _keyboard: null,

        _init: function() {
            // Store Game Settings globally
            SpacePirate.namespace('Global').settings = new SpacePirate.Game.Settings({
                fontSize: 14
            });
            SpacePirate.namespace('Global').resources = new SpacePirate.Game.Resources();

            this._setupTiming();
            this._setupIO();

            this._createPeriodicFn(SpacePirate.Utilities.makeCallback(this, this._eachSecond), 1000);
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
            // ---- keyboard:
            this._keyboard = new SpacePirate.IO.Keyboard();

            // ---- canvas:
            var $canvasContainer = $('.canvas-container');

            var mainCanvas = new SpacePirate.IO.Canvas($canvasContainer, {
                canvasId: 'main'
            });

            this._canvases = {
                main: mainCanvas
            };

            // ---- log:
            var $logContainer = $('.log-container');
            var logOffset = mainCanvas.width() + 20;

            this._log = new SpacePirate.IO.Log($logContainer, {
                leftOffset: logOffset,
                minWidth: SpacePirate.Utilities.minScreenWidth() - logOffset
            });

            // ---- screen:
            this._screen = new SpacePirate.IO.Screen1();
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

            //this._canvases.main.clear();
            //this._canvases.main.drawImage(this._screen.background);
        },

        _eachSecond: function(iterations) {
            var fps = (1000 / this._timing.delta).toFixed(1);
            var total = (this._timing.total / 1000).toFixed(1);

            $('#fps').text(fps);
            $('#total-time').text(total);

            SpacePirate.Global.resources.eachSecond(iterations);
            $('#ore').text(SpacePirate.Global.resources.ore);

            $('#memory').text(SpacePirate.Utilities.roundToDecimal(this._getMemoryUsage(), 2));

            // TODO Draw background less often
        },

        _getMemoryUsage: function() {
            return performance.memory.usedJSHeapSize / 1048576.0; // in MB
        },

        // ---------------------------------------------------------------- Periodic function helpers
        // A periodic function does not run every game loop, it runs every X milliseconds (to improve performance)

        _createPeriodicFn: function(fn, period, cache) {
            cache = SpacePirate.Utilities.defaultFor(cache, false);

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
