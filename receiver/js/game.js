const makeBreakoutScene = (gameInput) => {
    var Breakout = new Phaser.Class({

        Extends: Phaser.Scene,
    
        initialize: function () //Breakout ()
        {
            Phaser.Scene.call(this, { key: 'breakout' });
            this.bricks;
            this.paddle;
            this.ball;
        },
    
        preload: function ()
        {
            this.load.atlas('assets', 'assets/breakout.png', 'assets/breakout.json');
        },
    
        create: function ()
        {
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
            const paddleBottomMargin = this.gameHeigth*0.1;
            this.paddle = this.physics.add.image(this.gameWidth/2, this.gameHeigth - paddleBottomMargin, 'assets', 'paddle1').setCollideWorldBounds(true).setImmovable();

            const ballYPos = this.paddle.y - 44; // 44 == ball-size * 2 ...
            this.ball = this.physics.add.image(this.gameWidth/2, ballYPos, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);
            this.ball.setData('onPaddle', true);
    
    
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
        },

        startBall: function() {
            if (this.ball.getData('onPaddle'))
            {
                this.ball.setVelocity(-75, -300);
                this.ball.setData('onPaddle', false);
            }
        },
    
        hitBrick: function(ball, brick)
        {
            brick.disableBody(true, true);
    
            if (this.bricks.countActive() === 0)
            {
                this.resetLevel();
            }
        },
    
        resetBall: function ()
        {
            this.ball.setVelocity(0);
            this.ball.setPosition(this.paddle.x - this.ball.width/2, this.paddle.y - this.ball.height*2);
            this.ball.setData('onPaddle', true);
        },
    
        resetLevel: function ()
        {
            this.resetBall();
    
            this.bricks.children.each(function (brick) {
    
                brick.enableBody(false, 0, 0, true, true);
    
            });
        },
    
        hitPaddle: function (ball, paddle)
        {
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
        },
    
        update: function ()
        {              
            if (this.ball.y > this.gameHeigth)
            {
                this.resetBall();
            }

            if (Breakout.gameInput.left.isDown) {
                this.startBall();
                this.paddle.setVelocityX(-this.paddleVelocity);
            } else if (Breakout.gameInput.right.isDown) {
                this.startBall();
                this.paddle.setVelocityX(this.paddleVelocity);
            } else {
                this.paddle.setVelocityX(0);
            }
        }
    
    });
    Breakout.gameInput = gameInput;
    return Breakout;
};

var config = {
    type: Phaser.AUTO,
    gameTitle: 'Cast Breakout!',
    expandParent: false,
    domCreateContainer: true,
    physics: {
        default: 'arcade'
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
};
// TODO: allow overriden config params
const startGame = (gameInput, parent) => {
    config.scene = makeBreakoutScene(gameInput);
    config.parent = parent;
    var game = new Phaser.Game(config);
    return game;
}