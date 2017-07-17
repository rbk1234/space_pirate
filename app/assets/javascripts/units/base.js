
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
        shield: function() {
            return this._currentShield;
        },
        energy: function() {
            return this._currentEnergy;
        },
        dead: function() {
            return this._isDead;
        },

        respawn: function() {
            if (this._isDead) {
                this._isDead = false;
                this.fullRestore();
            }
        },

        fullRestore: function() {
            this._currentHealth = this._config.maxHealth;
            this._currentShield = this._config.maxShield;
            this._currentEnergy = this._config.maxEnergy;

            SpacePirate.Global.log.logMessage(this._config.name + ' Full restore! Health: '+this.health());
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
                this._isDead = true;
                SpacePirate.Global.log.logMessage(this._config.name + ' Died');
            }
        }

    };

    SpacePirate.namespace('Units').Base = Base;

}(jQuery));