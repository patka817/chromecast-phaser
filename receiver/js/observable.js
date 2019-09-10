class Observable {
    _value;
    _observers = [];

    constructor(value) {
        this._value = value;
    }

    set value(newVal) {
        if (newVal !== this._value) {
            this._value = newVal;
            this._observers.forEach(callback => callback(this._value));
        }
    }

    get value() {
        return this._value;
    }

    onValueChanged(callback) {
        this._observers.push(callback);
    }
}