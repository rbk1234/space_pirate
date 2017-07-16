
(function($) {
    var Main = function($container) {
        this._$container = $container;
        this._init();
    };
    Main.prototype = {
        _init: function() {
            console.log('init main');
        }
    };
})(jQuery);


(function($) {
    SpacePirate.Init.register('body.main', function($panel) {
        $panel.data('main', new Main($panel));
    });
})(jQuery);