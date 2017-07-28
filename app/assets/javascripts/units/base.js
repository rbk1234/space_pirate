
(function ($) {

    var currentId = 1;

    var Base = function(config) {
        this._init(config);
    };
    Base.prototype = {
        id: null,
        isDead: null,
        _currentHealth: null,
        _currentShield: null,
        _currentPower: null,

        _init: function(config) {
            this.id = currentId;
            this.type = 'unit';
            currentId++;
            this.team = SpacePirate.Game.Constants.enemyTeam;
            this._direction = -1;

            this.isDead = false;
        },

        name: function() {
            return this._name || 'Unknown';
        },

        health: function() {
            return this._currentHealth;
        },

        maxHealth: function() {
            return this._maxHealth || 1; // TODO Based off stamina, etc.
        },

        shield: function() {
            return this._currentShield;
        },

        maxShield: function() {
            return this._maxShield; // TODO Based off stamina, etc.
        },

        power: function() {
            return this._currentPower;
        },

        maxPower: function() {
            return this._maxPower; // TODO Based off intellect, etc.
        },

        hasAttack: function() {
            return this._hasAttack || false;
        },
        hasAttackProjectile: function() {
            return this._hasAttackProjectile || false;
        },
        attackXY: function() {
            return this._attackXY || [0,0];
        },
        moveSpeed: function() { // spaces to move per second
            return (this._moveSpeed || 0) * this.direction();
        },
        attackSpeed: function() { // attacks per second
            return this._attackSpeed || 0;
        },
        attackCooldown: function() {
            var attackSpeed = this.attackSpeed();
            return (attackSpeed === 0) ? 99999 : 1 / this.attackSpeed();
        },
        attackRange: function() {
            return this._attackRange || 0;
        },
        attackDamage: function() {
            return this._attackDamage || 0;
        },

        direction: function() {
            return this._direction;
        },

        image: function() {
            var image = this._image || [[]];

            if (this.animations) {
                var highestPriority = 0;

                SpacePirate.Utilities.iterateObject(this.animations, function(imageKey, animationData) {
                    if (animationData.priority > highestPriority && this[imageKey] !== undefined) {
                        highestPriority = animationData.priority;
                        image = this[imageKey];
                    }
                }, this);
            }

            return image;
        },

        collision: function() {
            return this._collision || [[]];
        },

        respawn: function() {
            if (this.isDead()) {
                this.isDead = false;
                SpacePirate.Global.log.logMessage(this.name() + ' Respawned');
                this.fullRestore();
            }
        },

        // Note: Will not heal you if you are dead
        fullRestore: function() {
            if (!this.isDead) {
                this._currentHealth = this.maxHealth();
                this._currentShield = this.maxShield();
                this._currentPower = this.maxPower();

                this._updateUnitFrame();
            }
        },

        dealDamage: function(amount) {
            if (this.isDead) {
                return;
            }

            var amountShielded = 0;
            var healthTaken = 0;

            if (this.shield() > 0) {
                amountShielded = Math.min(this.shield(), amount);
                this._currentShield -= amountShielded;
                amount -= amountShielded;
            }

            if (this.health() > 0) {
                healthTaken = Math.min(this.health(), amount);
                this._currentHealth -= healthTaken;
                amount -= healthTaken;
            }

            var damageTakenString = ' Took ' + healthTaken + ' damage';
            if (amountShielded > 0) {
                damageTakenString += ' (' + amountShielded + ' shielded)';
            }
            if (amount > 0) {
                damageTakenString += ' (' + amount + ' overkill)';
            }
            SpacePirate.Global.log.logMessage(this.name() + damageTakenString);

            if (this._currentHealth <= 0) {
                this.kill();
            }

            // TODO HACK Switching enemy frame on dmg taken
            if (this.team !== SpacePirate.Game.Constants.playerTeam) {
                this.attachUnitFrame(SpacePirate.Global.enemyFrame);
            }
            else {
                this._updateUnitFrame();
            }
        },

        kill: function() {
            this.isDead = true;
            this._currentHealth = 0;
            SpacePirate.Global.log.logMessage(this.name() + ' Died');
        },


        // TODO Is this backwards (should unit attach to unitframe?)
        attachUnitFrame: function(frame) {
            this._unitFrame = frame;
            this._updateUnitFrame();
        },

        removeUnitFrame: function() {
            this._unitFrame = null;
        },

        _updateUnitFrame: function() {
            if (this._unitFrame) {
                this._unitFrame.update(this);
            }
        }

    };

    SpacePirate.namespace('Units').Base = Base;

}(jQuery));