
(function ($) {

    var Player = function(config) {
        SpacePirate.Units.Base.call(this, config);
    };
    Player.prototype = Object.create(SpacePirate.Units.Base.prototype);
    Player.prototype.constructor = Player;

    $.extend(Player.prototype, {

        _init: function(config) {
            SpacePirate.Units.Base.prototype._init.apply(this, arguments);

            this.team = SpacePirate.Game.Constants.playerTeam;

            this._hasAttack = true;
            this._hasAttackProjectile = true;
            this._moveSpeed = 5;
            this._attackSpeed = 2;
            this._attackRange = 20;
            this._attackDamage = 30;
            this._attackXY = [4,1];

            this._maxHealth = 200;
            this._maxShield = 50;
            this._maxPower = 20;
            this._name = 'Player';

            this._direction = 1;

            this._image = [
                ' [>  ',
                '/==;-',
                ' /\\  '
            ];
            this._imageAttack = [
                ' [>  ',
                '/==;-*',
                ' /\\  '
            ];
            this._collision = [
                ' XX  ',
                'XXXXX',
                ' XXXX'
            ];

            this.fullRestore(); // TODO
        },

        kill: function() {
            SpacePirate.Units.Base.prototype.kill.apply(this, arguments);

            SpacePirate.Global.statistics.countPlayerDeath();
        }

    });

    SpacePirate.namespace('Units').Player = Player;

}(jQuery));