class Breakout extends Phaser.Scene {
    paddle;
    ball;
    bricks;
    gameInput;
    stateManager;

    constructor(config, gameInput, phaserRenderStateManager) {
        super(config);
        this.gameInput = gameInput;
        this.stateManager = phaserRenderStateManager;
    }

    spritesToSerialize = () => {
        if (this.paddle && this.ball && this.bricks) {
            return [this.paddle, this.ball, ...this.bricks.children.entries];
        }
        return [];
    }

    initialize() {
        this.bricks;
        this.paddle;
        this.ball;
    }

    preload() {
        this.load.atlas('assets', 'assets/breakout.png', 'assets/breakout.json');
    }

    create() {
        //let { width, height } = this.sys.game.canvas;
        this.gameWidth = this.cameras.main.width;
        this.gameHeigth = this.cameras.main.height;
        this.paddleVelocity = this.gameWidth/1.5; // make sure it takes approx. 1.5sec to move from side to side
        
        //  Enable world bounds, but disable the floor
        this.physics.world.setBoundsCollision(true, true, true, false);

        //  Create the bricks in a 10x6 grid
        let startX = (this.gameWidth - 10*64)/2 + 32; // center the grid by getting full width of the grid, get the 'rest'-space(by subtracting from gameWidth) and take the cellWidth/2 into account
        this.bricks = this.physics.add.staticGroup({
            key: 'assets', frame: [ 'blue1', 'red1', 'green1', 'yellow1', 'silver1', 'purple1' ],
            frameQuantity: 10,
            gridAlign: { width: 10, height: 6, cellWidth: 64, cellHeight: 32, x: startX, y: 100 }
        });
        let brickId = 1;
        this.bricks.children.entries.forEach(el => {
            el.id = brickId;
            brickId += 1;
        });
        const paddleBottomMargin = this.gameHeigth*0.1;
        this.paddle = this.physics.add.image(this.gameWidth/2, this.gameHeigth - paddleBottomMargin, 'assets', 'paddle1').setCollideWorldBounds(true).setImmovable();
        this.paddle.id = 'paddle';

        const ballYPos = this.paddle.y - 44; // 44 == ball-size * 2 ...
        this.ball = this.physics.add.image(this.gameWidth/2, ballYPos, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onPaddle', true);
        this.ball.id = 'ball';

        //  Our colliders
        this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

        this.paddleXUpperLimit = this.gameWidth - this.paddle.width/2;
        this.paddleXLowerLimit = this.paddle.width/2;

        //  Input events
        this.input.on('pointermove', function (pointer) {

            //  Keep the paddle within the game
            this.paddle.x = Phaser.Math.Clamp(pointer.x, this.paddleXLowerLimit, this.paddleXUpperLimit);

            if (this.ball.getData('onPaddle'))
            {
                this.ball.x = this.paddle.x;
            }

        }, this);

        this.input.on('pointerup', this.startBall, this);

        // Set initial state
        if (this.stateManager) {
            this.stateManager.updateSpritesState(this.spritesToSerialize());
        }
    }

    startBall() {
        if (this.ball.getData('onPaddle'))
        {
            this.ball.setVelocity(-75, -300);
            this.ball.setData('onPaddle', false);
        }
    }

    hitBrick(ball, brick)
    {
        brick.disableBody(true, true);

        if (this.bricks.countActive() === 0)
        {
            this.resetLevel();
        }
    }

    resetBall() {
        this.ball.setVelocity(0);
        this.ball.setPosition(this.paddle.x - this.ball.width/2, this.paddle.y - this.ball.height*2);
        this.ball.setData('onPaddle', true);
    }

    resetLevel() {
        this.resetBall();

        this.bricks.children.each(function (brick) {

            brick.enableBody(false, 0, 0, true, true);

        });
    }

    hitPaddle(ball, paddle) {
        var diff = 0;

        if (ball.x < paddle.x)
        {
            //  Ball is on the left-hand side of the paddle
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        }
        else if (ball.x > paddle.x)
        {
            //  Ball is on the right-hand side of the paddle
            diff = ball.x -paddle.x;
            ball.setVelocityX(10 * diff);
        }
        else
        {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ball.setVelocityX(2 + Math.random() * 8);
        }
    }

    update() {              
        if (this.ball.y > this.gameHeigth)
        {
            this.resetBall();
        }

        if (this.gameInput && this.gameInput.left.isDown) {
            this.startBall();
            this.paddle.setVelocityX(-this.paddleVelocity);
        } else if (this.gameInput && this.gameInput.right.isDown) {
            this.startBall();
            this.paddle.setVelocityX(this.paddleVelocity);
        } else {
            this.paddle.setVelocityX(0);
        }

        if (this.stateManager) {
            this.stateManager.updateSpritesState(this.spritesToSerialize());
        }
    }
}

var config = {
    type: Phaser.HEADLESS,
    gameTitle: 'Cast Breakout!',
    parent: 'whoop-whoop',
    autoFocus: false,
    physics: {
        default: 'arcade'
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
};
// TODO: allow overriden config params
const startGame = (gameInput, phaserRenderStateManager) => {
    config.scene = new Breakout({key: 'breakout'}, gameInput, phaserRenderStateManager);
    var game = new Phaser.Game(config);
    return game;
}
