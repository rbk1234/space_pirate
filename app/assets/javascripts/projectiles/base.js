
(function ($) {

    var currentId = 1;

    var Base = function(config) {
        this._init(config);
    };
    Base.prototype = {
        id: null,
        isDead: null,

        _init: function(config) {
            this.id = currentId;
            currentId++;
            this.type = 'projectile';
            this.team = SpacePirate.Game.Constants.enemyTeam;

            this.distanceTraveled = 0;

            $.extend(this, config); // TODO Does this work well?

            this.isDead = false;
        },

        damage: function() {
            return this._damage || 0;
        },

        moveSpeed: function() { // spaces to move per second
            return (this._moveSpeed || 0) * this.direction();
        },
        range: function() {
            return this._range || 0;
        },
        direction: function() {
            return this._direction;
        },

        kill: function() {
            this.isDead = true;
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
        }

    };

    SpacePirate.namespace('Projectiles').Base = Base;

}(jQuery));