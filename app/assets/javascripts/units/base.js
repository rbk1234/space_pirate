
(function ($) {

    var Base = function(config) {
        this._init(config);
    };
    Base.prototype = {
        _defaultConfig: {
            maxHealth: 100,
            maxShield: 0,
            maxEnergy: 0,
            name: 'Unknown'
        },

        _isDead: null,
        _currentHealth: null,
        _currentShield: null,
        _currentEnergy: null,

        _init: function(config) {
            this._config = $.extend({}, this._defaultConfig, config);

            this._isDead = false;
            this.fullRestore();
        },

        health: function() {
            return this._currentHealth;
        },

        maxHealth: function() {
            return this._config.maxHealth; // TODO Based off stamina, etc.
        },

        shield: function() {
            return this._currentShield;
        },

        maxShield: function() {
            return this._config.maxShield; // TODO Based off stamina, etc.
        },

        energy: function() {
            return this._currentEnergy;
        },

        maxEnergy: function() {
            return this._config.maxEnergy; // TODO Based off intellect, etc.
        },

        dead: function() {
            return this._isDead;
        },

        respawn: function() {
            if (this._isDead) {
                this._isDead = false;
                SpacePirate.Global.log.logMessage(this._config.name + ' Respawned');
                this.fullRestore();
            }
        },

        // Note: Will not heal you if you are dead
        fullRestore: function() {
            if (!this._isDead) {
                this._currentHealth = this.maxHealth();
                this._currentShield = this.maxShield();
                this._currentEnergy = this.maxEnergy();

                this._updateUnitFrame();
            }
        },

        dealDamage: function(amount) {
            if (this._isDead) {
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
            SpacePirate.Global.log.logMessage(this._config.name + damageTakenString);

            if (this._currentHealth <= 0) {
                this._kill();
            }

            this._updateUnitFrame();
        },

        _kill: function() {
            this._isDead = true;
            this._currentHealth = 0;
            SpacePirate.Global.log.logMessage(this._config.name + ' Died');
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