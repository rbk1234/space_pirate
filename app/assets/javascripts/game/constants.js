
(function ($) {

    SpacePirate.namespace('Game').Constants = {
        gameTicksPerSecond: 5,

        levelUpdatesPerSecond: 10, // Should be 10 or higher, otherwise high movement / atk speed won't work correctly
        levelDrawsPerSecond: 10,
        resourceUpdatesPerSecond: 2,

        gravity: 9.8, // spaces to fall per second

        playerTeam: 0,
        enemyTeam: 1
    };

}(jQuery));