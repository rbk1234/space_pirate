
/*
    Notes:
        Be careful any time you use < or <= or > or >=. Need to round any floating point numbers


 */


(function($){

    var Main = function() {
        this._init();
    };

    Main.prototype = {

        _init: function() {
            // Store Game Settings globally
            SpacePirate.namespace('Global'); // Init Global namespace
            SpacePirate.Global.resources = new SpacePirate.Game.Resources();
            SpacePirate.Global.settings = new SpacePirate.Game.Settings({
                fontSize: 14
            });
            SpacePirate.Global.statistics = new SpacePirate.Game.Statistics();
            SpacePirate.Global.time = 0;

            this._setupTiming();
            this._setupIO();
            this._setupPlayer();
            this._setupFrames();
            this._setupLevel();
            this._setupLog();

            this._createPeriodicFn(SpacePirate.Utilities.makeCallback(this, this._updateLevel), 
                1000 / SpacePirate.Game.Constants.levelUpdatesPerSecond);
            this._createPeriodicFn(SpacePirate.Utilities.makeCallback(this, this._drawLevel),
                1000 / SpacePirate.Game.Constants.levelDrawsPerSecond);
            this._createPeriodicFn(SpacePirate.Utilities.makeCallback(this, this._updateResources),
                1000 / SpacePirate.Game.Constants.resourceUpdatesPerSecond);

            this._runGame();
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
            this._runGame = function () {
                /*. Calculate time since last tick .*/
                self._timing.now = Date.now() || (new Date).getTime(); // Get current time
                self._timing.delta = self._timing.now - self._timing.then; // Get time since last tick
                self._timing.then = self._timing.now; // Reset last tick time
                self._timing.total += self._timing.delta;

                SpacePirate.Global.time = self._timing.total;
                self._iteratePeriodicFns();

                /*. Run function again as soon as possible without lagging .*/
                window.requestFrame(self._runGame);
            };
        },

        _setupIO: function() {
            this._keyboard = new SpacePirate.IO.Keyboard();
        },

        _setupPlayer: function() {
            this._player = new SpacePirate.Units.Player();

            SpacePirate.Global.player = this._player;
        },

        _setupFrames: function() {
            var playerFrame = new SpacePirate.Display.UnitFrame($('.player-unit-frame'), {});
            this._player.attachUnitFrame(playerFrame);

            SpacePirate.Global.enemyFrame = new SpacePirate.Display.UnitFrame($('.enemy-unit-frame'), {});
        },

        _setupLevel: function() {
            this._levelEngine = new SpacePirate.Game.LevelEngine({});
            this._levelEngine.loadLevel(SpacePirate.Levels.Level1);

            this._levelEngine.addUnit(this._player, 0, 21);

            var alien = new SpacePirate.Units.Alien_01();
            this._levelEngine.addUnit(alien, 40, 21);
            this._levelEngine.addUnit(new SpacePirate.Units.Alien_01(), 60, 21);
            alien.attachUnitFrame(SpacePirate.Global.enemyFrame);
        },

        _setupLog: function() {
            // Note: Depends on the level being instantiated so it can offset correctly

            SpacePirate.Global.log = new SpacePirate.Display.Log($('.log-container'));
            SpacePirate.Global.log.positionToRightOfFrame(this._levelEngine);
            SpacePirate.Global.log.logMessage('Log initialized.');

            // TODO HACK So that bottom stuff goes below canvas (canvas has absolute position so doesn't affect stuff)
            $('.canvas-and-log').css('min-height', this._levelEngine.height() + 200);
        },



        // ---------------------------------------------------------------- Periodic functions
        // Note: period is in seconds

        _updateLevel: function(iterations, period) {
            this._levelEngine.update(iterations, period);
        },

        _drawLevel: function(iterations, period) {
            this._levelEngine.draw(iterations, period);
        },

        _updateResources: function(iterations, period) {
            var fps = (1000 / this._timing.delta).toFixed(1);
            var total = (this._timing.total / 1000).toFixed(1);

            $('#fps').text(fps);
            $('#total-time').text(total);

            SpacePirate.Global.resources.update(iterations, period);
            $('#ore').text(SpacePirate.Global.resources.ore);

            $('#memory').text(SpacePirate.Utilities.roundToDecimal(SpacePirate.Utilities.getMemoryUsage(), 2));
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
                        periodicFn.fn(iterations, periodicFn.period / 1000.0); // period is converted to seconds for fns
                    }
                }
            });
        }

    };

    SpacePirate.Init.register('body.application', function($panel) {
        $panel.data('main', new Main($panel));
    });

})(jQuery);
