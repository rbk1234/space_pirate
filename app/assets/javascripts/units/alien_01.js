
(function ($) {

    var Alien_01 = function(config) {
        SpacePirate.Units.Base.call(this, config);
    };
    Alien_01.prototype = Object.create(SpacePirate.Units.Base.prototype);
    Alien_01.prototype.constructor = Alien_01;

    $.extend(Alien_01.prototype, {

        _init: function(config) {
            SpacePirate.Units.Base.prototype._init.apply(this, arguments);

            this._image = [
                ' <> ',
                's{}s',
                ' ^^ '
            ];
            this._collision = [
                ' XX ',
                'XXXX',
                'XXXX'
            ];

            this._hasAttack = true;
            this._attackSpeed = 2;
            this._attackRange = 1;
            this._attackDamage = 20;
            this._attackXY = [0,1];

            this._moveSpeed = 4;
            this._maxHealth = 350;

            this._name = 'Alien';

            this.fullRestore();
        }

    });

    SpacePirate.namespace('Units').Alien_01 = Alien_01;

}(jQuery));