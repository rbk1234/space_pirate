/**
 * Created by robert on 4/16/16.
 */

(function ($) {

    SpacePirate.namespace('Levels').Level1 = {
        //image: function() {
        //    return [
        //        '                                                                                   (90x25)',
        //        '                                                                                         X',
        //        '                                                                                         X',
        //        '                                                                                         X',
        //        '                                                                                         X',
        //        '                                                                                         X',
        //        '                                                                                         X',
        //        '                                                                                         X',
        //        '                                                                                         X',
        //        '         XXXXX                                                                           X',
        //        '         X    XXXXXXXXXXXXX                                                              X',
        //        '         X                 XXXXXXXXXXXX                                                  X',
        //        '                                 _                                                       X',
        //        '                            (  _()_--                                                    X',
        //        '                           __()---                                                       X',
        //        '                     /\\      --                                                          X',
        //        '                    /^ \\    -                                                            X',
        //        '                   /    \\  /\\                                                            X',
        //        '                  /  :   \\/  \\            /\\                                             X',
        //        '                 /        \\ ^ \\   /\\     /  \\                                            X',
        //        '                /  /\\  ^   \\   \\ /  \\   / ^  \\                                           X',
        //        '               /  /  \\      \\   /    \\ /      \\                                          X',
        //        '              /  /  ^ \\   ;  \\ /  ^   /      ^ \\                                         X',
        //        '             /  /      \\      \\      /          \\                                        X',
        //        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
        //    ];
        //},

        image: function() {
            return [
                '                                                                                   (90x25)',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '         XXXXX                                                                            ',
                '         X    XXXXXXXXXXXXX                                                               ',
                '         X                 XXXXXXXXXXXX                                                   ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                '                                                                                          ',
                'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
            ];
        },

        collision: function() {
            return this.image();
        }

    };

}(jQuery));