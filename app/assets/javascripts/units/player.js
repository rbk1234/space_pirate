
(function ($) {

    var Player = function() {
        this._init();
    };
    Player.prototype = {

        _init: function() {
            this._maxHealth = 100;
            this._maxShield = 50;
            this._maxEnergy = 20;
            this._currentHealth = 0;
            this._currentShield = 0;
            this._currentEnergy = 0;
            this.fullRestore();
        },

        fullRestore: function() {
            this.restoreHealth('full');
            this.restoreShield('full');
            this.restoreEnergy('full');
        },

        restoreHealth: function(amount) {
            if (amount == 'full') {
                this._currentHealth = this._maxHealth;
            }
            else {
                this._currentHealth += amount;
            }
        },

        restoreShield: function(amount) {
            if (amount == 'full') {
                this._currentShield = this._maxShield;
            }
            else {
                this._currentShield += amount;
            }
        },

        restoreEnergy: function(amount) {
            if (amount == 'full') {
                this._currentEnergy = this._maxEnergy;
            }
            else {
                this._currentEnergy += amount;
            }
        }
    };

    SpacePirate.namespace('Units').Player = Player;

}(jQuery));