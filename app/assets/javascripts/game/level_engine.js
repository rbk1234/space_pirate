
(function ($) {

    var LevelEngine = function(config) {
        this._init(config);
    };
    LevelEngine.prototype = {
        _canvases: null,
        _units: null,

        _init: function(config) {
            this._units = [];
            this._projectiles = [];

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
            unit.x = x;
            unit.y = y;
            unit.cooldowns = {};
            unit.animations = {};
            this._units.push(unit);
        },

        update: function(iterations, period) {
            //console.log('period: '+period);
            while (iterations > 0) {
                iterations--;
                this._calculateLevelUpdates(period);
            }
        },

        draw: function(/* iterations, period */) {
            // Doesn't care about # of iterations; just draw once
            this._drawLevel();
        },

        _calculateLevelUpdates: function(period) {
            var self = this;
            //SpacePirate.Global.combatLog.logMessage('tick');

            this._units.forEach(function(unit) {
                self._updateCooldowns(unit, period);
                if (unit.team !== SpacePirate.Game.Constants.playerTeam || !this._enemyInRange(unit)) {
                    self._unitMove(unit, period);
                }
                self._unitAttack(unit, period);
                self._updateAnimations(unit, period);
            }, this);

            this._clearDeadUnits();

            this._projectiles.forEach(function(projectile) {
                self._projectileMove(projectile, period);
            }, this);

            this._clearDeadProjectiles();
        },

        _drawLevel: function() {
            var self = this;

            this._canvases.main.clear();

            if (this._level) {
                this._canvases.main.drawImage(this._level.image());
            }

            this._units.forEach(function(unit) {
                self._canvases.main.drawImage(unit.image(), unit.x, unit.y);
            });

            this._projectiles.forEach(function(projectile) {
                self._canvases.main.drawImage(projectile.image(), projectile.x, projectile.y);
            });
        },

        _clearDeadUnits: function() {
            for (var i = this._units.length - 1; i >= 0; i--) {
                if (this._units[i].isDead) {
                    this._units.splice(i, 1);
                }
            }
        },

        _clearDeadProjectiles: function() {
            for (var i = this._projectiles.length - 1; i >= 0; i--) {
                if (this._projectiles[i].isDead) {
                    this._projectiles.splice(i, 1);
                }
            }
        },

        _updateCooldowns: function(unit, period) {
            // decrement cooldowns
        },

        _unitMove: function(unit, period) {
            // Assume a max of one space moved (may have to update if things move super fast - or update levelUpdatesPerSecond
            var deltaX = unit.moveSpeed() * period;
            var deltaY = SpacePirate.Game.Constants.gravity * period;

            if (deltaX === 0 && deltaY === 0) {
                return; // Not moving
            }

            unit.x += deltaX;
            if (this._levelCollision(unit) || this._unitCollision(unit)) {
                unit.y -= SpacePirate.Game.Constants.maxStepSize;
                if (this._levelCollision(unit) || this._unitCollision(unit)) {
                    unit.y += SpacePirate.Game.Constants.maxStepSize;
                    unit.x -= deltaX;
                }
            }

            unit.y += deltaY;
            if (this._levelCollision(unit) || this._unitCollision(unit)) {
                unit.y -= deltaY;
            }
        },

        _projectileMove: function(projectile, period) {
            // Assume a max of one space moved (may have to update if things move super fast - or update levelUpdatesPerSecond
            var deltaX = projectile.moveSpeed() * period;

            if (deltaX === 0) {
                return; // Not moving
            }

            projectile.x += deltaX;
            projectile.distanceTraveled += deltaX;

            if (SpacePirate.Utilities.round(projectile.distanceTraveled) > projectile.range()) {
                projectile.kill();
                return;
            }

            var unit = this._unitCollision(projectile);
            if (unit) {
                unit.dealDamage(projectile.damage());
                projectile.kill();
            }
            else if (this._levelCollision(projectile)) {
                projectile.kill();
            }
        },
        
        _levelCollision: function(obj) {
            return this._isColliding(obj, this._level);
        },

        _unitCollision: function(obj) {
            for (var i = 0, len = this._units.length; i < len; i++) {
                var unit = this._units[i];

                switch(obj.type) {
                    case 'unit':
                        // Make sure not counting self
                        if (obj.id !== unit.id && this._isColliding(obj, unit)) {
                            return unit;
                        }
                        break;
                    case 'projectile':
                        // Make sure not counting friendly units
                        if (obj.team !== unit.team && this._isColliding(obj, unit)) {
                            return unit;
                        }
                        break;
                }
            }

            return false;
        },

        // x,y are rows/columns, but they can have decimals
        // obj can be a level, user, projectile, etc. Has to respond to x, y, and collision()
        _isColliding: function(obj1, obj2) {
            var obj1_collision = obj1.collision();
            var obj2_collision = obj2.collision();
            //
            //var smallerObj;
            //var largerObj;
            //
            //if (obj1_collision.length * obj1_collision[0].length < obj2_collision.length * obj2_collision[0].length) {
            //    smallerObj = obj1;
            //    largerObj = obj2;
            //}
            //else {
            //    smallerObj = obj2;
            //    largerObj = obj1;
            //}

            var obj1_x = SpacePirate.Utilities.round(obj1.x || 0);
            var obj1_y = SpacePirate.Utilities.round(obj1.y || 0);
            var obj2_x = SpacePirate.Utilities.round(obj2.x || 0);
            var obj2_y = SpacePirate.Utilities.round(obj2.y || 0);

            // first check
            // if 1_image || 2_image || (1_top > 2_bottom && 2_top > 1_bottom && 1_right > 2_left && 2_right > 1_left)
            //   iterate thru smaller obj collision
            // TODO assuming obj1 is smaller
            for (var row = 0; row < obj1_collision.length; row++) {
                for (var col = 0; col < obj1_collision[row].length; col++) {
                    if (obj1_collision[row][col] === 'X' && obj2_collision[row + obj1_y - obj2_y] &&
                        obj2_collision[row + obj1_y - obj2_y][col + obj1_x - obj2_x] === 'X') {
                        return true;
                    }
                }
            }

            return false;
        },

        _unitAttack: function(attacker, period) {
            if (!attacker.hasAttack()) {
                return;
            }

            if (attacker.cooldowns.attack === undefined) {
                attacker.cooldowns.attack = 0;
            }

            // Note: Have to round cooldown due to floating point rounding errors
            if (SpacePirate.Utilities.roundToDecimal(attacker.cooldowns.attack, 5) <= 0) {
                var enemy = this._enemyInRange(attacker);

                if (enemy) {
                    if (attacker.hasAttackProjectile()) {
                        this._unitAttackProjectile(attacker);
                    }
                    else {
                        this._animateUnit(attacker, '_imageAttack', 0.2, 1);
                        enemy.dealDamage(attacker.attackDamage());
                    }
                    attacker.cooldowns.attack = attacker.attackCooldown();
                }
            }
            attacker.cooldowns.attack -= period;
        },

        _unitAttackProjectile: function(attacker, period) {
            var from = attacker.attackXY();

            var projectile = new SpacePirate.Projectiles.Base({
                team: attacker.team,
                _damage: attacker.attackDamage(),
                _moveSpeed: 20,
                _range: attacker.attackRange(),
                _direction: attacker.direction(),
                _image: [['-']],
                _collision: [['X']],
                x: attacker.x + from[0],
                y: attacker.y + from[1]
            });

            this._projectiles.push(projectile);
        },

        // TODO Base off of distances?
        _enemyInRange: function(attacker) {
            var from = attacker.attackXY();
            var range = attacker.attackRange();

            var projectile = {
                x: attacker.x + from[0],
                y: attacker.y + from[1],
                direction: attacker.direction(),
                collision: function(){
                    return [['X']];
                }
            };

            var currentDistance = 0;
            while (currentDistance <= range) {
                for (var i = 0, len = this._units.length; i < len; i++) {
                    var otherUnit = this._units[i];
                    if (attacker.team !== otherUnit.team && this._isColliding(projectile, otherUnit)) {
                        return otherUnit;
                    }
                }

                projectile.x += projectile.direction;
                currentDistance++;
            }

            return false;
        },

        _updateAnimations: function(unit, period) {
            SpacePirate.Utilities.iterateObject(unit.animations, function(animationKey, animationData) {
                animationData.duration -= period;
                if (SpacePirate.Utilities.roundToDecimal(animationData.duration, 5) <= 0) {
                    delete unit.animations[animationKey];
                }
            }, this);
        },

        _animateUnit: function(unit, animation, duration, priority) {
            unit.animations[animation] = {
                duration: duration,
                priority: priority
            };
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