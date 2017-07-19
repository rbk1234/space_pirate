
(function ($) {

    var LevelEngine = function(config) {
        this._init(config);
    };
    LevelEngine.prototype = {
        _canvases: null,
        _units: null,

        _init: function(config) {
            this._units = [];

            this._setupCanvases();
        },

        _setupCanvases: function() {
            var $canvasContainer = $('.canvas-container');

            var mainCanvas = new SpacePirate.Display.Canvas($canvasContainer, {
                canvasId: 'main'
            });

            this._canvases = {
                main: mainCanvas
            };
        },

        loadLevel: function(level) {
            this._level = level;
        },

        addUnit: function(unit, x, y) {
            this._units.push({
                unit: unit,
                x: x,
                y: y
            });
        },

        run: function(iterations) {
            while (iterations > 0) {
                iterations--;
                this._calculateLevelUpdates();
            }

            // Only draw level once regardless of # of iterations
            this._drawLevel();
        },

        _isColliding: function(unitCollision, unitX, unitY) {
            unitX = Math.round(unitX);
            unitY = Math.round(unitY);

            for (var row = 0; row < unitCollision.length; row++) {
                for (var col = 0; col < unitCollision[row].length; col++) {
                    // TODO just basing off of level image
                    if (unitCollision[row][col] === 'X' && this._level.image[row + unitY][col + unitX] === 'X') {
                        return true;
                    }
                }
            }
            return false;
        },

        _calculateLevelUpdates: function() {
            var self = this;

            this._units.forEach(function(unit) {
                // 1. Cache initial x and y
                var initialX = unit.x;
                var initialY = unit.y;

                // 2. Apply x and y changes
                unit.y += SpacePirate.Game.Constants.gravity;
                unit.x += SpacePirate.Game.Constants.gravity;

                // 3. Calculate direction / potential rebound
                var movingRight = unit.x - initialX > 0; // x delta > 0
                var movingDown = unit.y - initialY > 0; // y delta > 0

                // 4. Check for collisions
                //console.log('moving down? '+movingDown);

                var unitCollision = unit.unit.collision();
                if (self._isColliding(unitCollision, unit.x, unit.y)) {
                    //console.log('collision');

                    // try move up
                    unit.y += (movingDown ? -1 : 1);
                    if (self._isColliding(unitCollision, unit.x, unit.y)) {
                        // move back down, then try move left
                        unit.y -= (movingDown ? -1 : 1);
                        unit.x += (movingRight ? -1 : 1);
                        if (self._isColliding(unitCollision, unit.x, unit.y)) {
                            // if still colliding, then move up and left
                            unit.y += (movingDown ? -1 : 1);
                        }
                    }
                }
            });
        },

        _drawLevel: function() {
            var self = this;

            this._canvases.main.clear();

            if (this._level) {
                this._canvases.main.drawImage(this._level.image);
            }

            this._units.forEach(function(unit) { // TODO unit.unit is bad
                self._canvases.main.drawImage(unit.unit.image(), unit.x, unit.y);
            });
        },








        height: function() {
            if (this._canvases && this._canvases.main) {
                return this._canvases.main.height();
            }
            else {
                return 0;
            }
        },
        width: function() {
            if (this._canvases && this._canvases.main) {
                return this._canvases.main.width();
            }
            else {
                return 0;
            }
        }

    };

    SpacePirate.namespace('Game').LevelEngine = LevelEngine;

}(jQuery));