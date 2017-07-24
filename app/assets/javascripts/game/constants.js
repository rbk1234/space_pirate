
(function ($) {

    SpacePirate.namespace('Game').Constants = {
        continuousDrawing: true,
        levelUpdatesPerSecond: 15, // Note: needs to be higher than the max of gravity, attack speed, etc. for game to function correctly
        levelDrawsPerSecond: 15,
        resourceUpdatesPerSecond: 2,

        logTime: true,

        gravity: 9.8, // # of spaces to fall per second
        maxStepSize: 1, // # of spaces units can "step up" while moving

        playerTeam: 0,
        enemyTeam: 1
    };

}(jQuery));