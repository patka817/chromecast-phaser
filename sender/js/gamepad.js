// These buttoncodes and actions should be shared through a config file for both the reciever and sender.. 

const BUTTON_ACTION_DOWN = 'D';
const BUTTON_ACTION_UP = 'U';

const LEFT_ARROW_KEY = 37;
const RIGHT_ARROW_KEY = 39;

class GamePad {
	leftButtonCode = 'L';
	rightButtonCode = 'R';

	leftIsPressed = false;
	rightIsPressed = false;

	constructor(leftButtonElement, rightButtonElement, sendButtonMessage) {
		leftButtonElement.addEventListener('touchstart', this.onLeftButtonDown);
		leftButtonElement.addEventListener('mousedown', this.onLeftButtonDown);
		leftButtonElement.addEventListener('touchend', this.onLeftButtonUp);
		leftButtonElement.addEventListener('touchleave', this.onLeftButtonUp);
		leftButtonElement.addEventListener('touchcancel', this.onLeftButtonUp);
		leftButtonElement.addEventListener('mouseout', this.onLeftButtonUp);
		leftButtonElement.addEventListener('mouseup', this.onLeftButtonUp);

		rightButtonElement.addEventListener('touchstart', this.onRightButtonDown);
		rightButtonElement.addEventListener('mousedown', this.onRightButtonDown);
		rightButtonElement.addEventListener('touchend', this.onRightButtonUp);
		rightButtonElement.addEventListener('touchleave', this.onRightButtonUp);
		rightButtonElement.addEventListener('touchcancel', this.onRightButtonUp);
		rightButtonElement.addEventListener('mouseout', this.onRightButtonUp);
		rightButtonElement.addEventListener('mouseup', this.onRightButtonUp);

		document.addEventListener('keyup', this.onKeyUp);
		document.addEventListener('keydown', this.onKeyDown);

		this.leftButtonElement = leftButtonElement;
		this.rightButtonElement = rightButtonElement;
		this.sendButtonMessage= sendButtonMessage;
		this._disabled = false;
	}

	set disabled(value) {
		if (value !== this._disabled) {
			this._disabled = value;
			this.leftIsPressed = false;
			this.rightIsPressed = false;
		}
	}

	get disabled() {
		return this._disabled;
	}

	onButtonAction = (e, action, buttonCode) => {
		e.preventDefault();
		if (this.disabled === false) {
			this.sendButtonMessage(action, buttonCode);
		}
	};

	onLeftButtonDown = (e) => {
		this.leftIsPressed = true;
		this.onButtonAction(e, BUTTON_ACTION_DOWN, this.leftButtonCode);
	};

	onLeftButtonUp = (e) => {
		if (this.leftIsPressed) {
			this.leftIsPressed = false;
			this.onButtonAction(e, BUTTON_ACTION_UP, this.leftButtonCode);
		}
	}

	onRightButtonDown = (e) => {
		this.rightIsPressed = true;
		this.onButtonAction(e, BUTTON_ACTION_DOWN, this.rightButtonCode);
	};

	onRightButtonUp = (e) => {
		if (this.rightIsPressed) {
			this.rightIsPressed = false;
			this.onButtonAction(e, BUTTON_ACTION_UP, this.rightButtonCode);
		}
	}

	isKeyBoardEventLeft = (event) => {
		const key = event.key || event.keyCode;
		return key === 'ArrowLeft' || key === LEFT_ARROW_KEY;
	}

	isKeyBoardEventRight = (event) => {
		const key = event.key || event.keyCode;
		return key === 'ArrowRight' || key === RIGHT_ARROW_KEY;
	}

	onKeyDown = (event) => {
		if (this.isKeyBoardEventLeft(event)) {
			this.onLeftButtonDown(event);
		} else if (this.isKeyBoardEventRight(event)) {
			this.onRightButtonDown(event);
		}
	}

	onKeyUp = (event) => {
		if (this.isKeyBoardEventLeft(event)) {
			this.onLeftButtonUp(event);
		} else if (this.isKeyBoardEventRight(event)) {
			this.onRightButtonUp(event);
		}
	}
}