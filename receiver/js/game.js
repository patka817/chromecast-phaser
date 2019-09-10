class Breakout extends SyncableScene {
    initialize = function () {
            Phaser.Scene.call(this, { key: 'breakout' });
        }
    
        preload = function () {
            this.load.atlas('assets', 'assets/breakout.png', 'assets/breakout.json');
            this.load.image('paddle1', 'assets/paddle1.png');
            this.load.image('ball1', 'assets/ball1.png');
            this.load.image('blue1', 'assets/blue1.png');
            this.load.image('red1', 'assets/red1.png');
            this.load.image('green1', 'assets/green1.png');
            this.load.image('yellow1', 'assets/yellow1.png');
            this.load.image('silver1', 'assets/silver1.png');
            this.load.image('purple1', 'assets/purple1.png');
        }
}

var config = {
    type: Phaser.AUTO,
    gameTitle: 'Cast Breakout!',
    expandParent: false,
    domCreateContainer: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
};
// TODO: allow overriden config params
const startGame = (gameInput, parent) => {
    config.scene = new Breakout();
    config.parent = parent;
    var game = new Phaser.Game(config);
    return game;
}