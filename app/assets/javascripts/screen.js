/**
 * Created by robert on 4/16/16.
 */

(function ($) {
    var Screen = function() {

    };
    Screen.prototype = {
        background: [],
        collision: [],
        x: 0,
        y: 0
    };

    SpacePirate.namespace('Screens').Screen = Screen;

    // ---------------------------------------------------------------------------- Screen 1

    var Screen1 = function() {
        Screen.call(this);
    };
    Screen1.prototype = Object.create(Screen.prototype);
    Screen1.prototype.constructor = Screen1;

    $.extend(Screen1.prototype, {

        background: [
            '1ere is example text                              ',
            '2ere is example text                              ',
            '3ere is example text                              ',
            ' 234567890                                                                      ',
            '5         1234567890                                                  ',
            '6                   1234567890                              ',
            '7                             1234567890          ',
            '8                                       1234567890',
            '9                                                 1234567890',
            '0                                                           1234567890      (80)',
            ' 1                                                                    1234567890      (90)',
            ' 2                                                                              1234567890',
            ' 3                                                                                        1234567890',
            ' 4                                                ',
            ' 5                                      ',
            ' 6                                                ',
            ' 7     [>                       o               ',
            ' 8    /==;-                    oO0                    ',
            ' 9     /\\                     0oOo.                    ',
            ' 0                             ^^^^^^^^         ',
            '  1                                               ',
            '  2                                               ',
            '  3                                               ',
            '  4                                               ',
            '  5                                               ',
            '  6                                               ',
            '  7                                               ',
            '  8                                            ',
            '  9                                               ',
            '  0 (30)                                              '
        ],
        collision: []
    });

    SpacePirate.namespace('Screens').Screen1 = Screen1;

}(jQuery));