
(function($) {

    var BAR_HEIGHT = 12;

    var UnitFrame = function($container, config) {
        this._$container = $container;
        this._init(config);
    };
    UnitFrame.prototype = {
        _defaultConfig: {

        },

        _rows: null,

        _init: function(config) {
            var self = this;

            this._config = $.extend({}, this._defaultConfig, config);

            this._rows = {};
            this._rows.health = this._setupRow(this._$container.find('.health-row'));
            this._rows.shield = this._setupRow(this._$container.find('.shield-row'));
        },

        _setupRow: function($row) {
            var $bar = $row.find('.status-bar');

            $bar.progressbar({
                //value: 0,
                //max: 0
            });

            $bar.height(BAR_HEIGHT);

            // TODO HACK - for some the inner bar height is a little off, fix it here:
            $bar.find('.ui-progressbar-value').height($bar.height());

            return {
                $bar: $bar,
                $text: $row.find('.status-text')
            }
        },

        update: function(unit) {
            this._updateRow(this._rows.health, unit.health(), unit.maxHealth());
            this._updateRow(this._rows.shield, unit.shield(), unit.maxShield());
        },

        _updateRow: function(row, newValue, newMax) {
            if (row) {
                row.$bar.progressbar('option', 'max', newMax);
                row.$bar.progressbar('option', 'value', newValue);
                row.$text.text(newValue + ' / ' + newMax);
            }
        }

    };

    SpacePirate.namespace('Display').UnitFrame = UnitFrame;

}(jQuery));
