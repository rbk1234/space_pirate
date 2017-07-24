
(function ($) {

    SpacePirate.namespace('Game').Constants = {
        continuousDrawing: true,
        levelUpdatesPerSecond: 15, // Note: needs to be higher than max(gravity, attack speed, etc.)
        levelDrawsPerSecond: 15,
        resourceUpdatesPerSecond: 2,

        logTime: true,

        gravity: 9.8, // # of spaces to fall per second
        maxStepSize: 1, // # of spaces units can "step up" while moving

        playerTeam: 0,
        enemyTeam: 1
    };

}(jQuery));