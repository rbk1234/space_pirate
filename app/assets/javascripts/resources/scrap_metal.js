
(function ($) {

    var ScrapMetal = function(config) {
        SpacePirate.Resources.Base.call(this, config);
    };
    ScrapMetal.prototype = Object.create(SpacePirate.Resources.Base.prototype);
    ScrapMetal.prototype.constructor = ScrapMetal;

    $.extend(ScrapMetal.prototype, {

        _init: function(config) {
            SpacePirate.Resources.Base.prototype._init.apply(this, arguments);

            this.key = 'scrap_metal';
            this._name = 'Scrap Metal';
            this._description = 'Idk';
            this._units = 'pc';
        }

    });

    SpacePirate.namespace('Resources').ScrapMetal = ScrapMetal;

}(jQuery));