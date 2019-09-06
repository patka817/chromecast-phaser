class GameInput {
    left = new Button();
    right = new Button();

    setLeftIsDown = (value) => {
        this.left.isDown = value;
        if (value && this.right.isDown) {
            this.right.isDown = false;
        }
    };

    setRightIsDown = (value) => {
        this.right.isDown = value;
        if (value && this.left.isDown) {
            this.left.isDown = false;
        }
    }
}

class Button {
    isDown = false;
}