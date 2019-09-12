class LatencyChecker {
    latencyIntervalMS = 500;
    _averageTracker = new AverageTracker();
    _intervalId = null;
    _id = 1;
    _printC = 0;

    // sendPayload is a callback that accepts payload (object) and a callback upon recieving answer
    // U can skip the callback and manually call onRecievedAnswer if that better suits your need.
    startChecking = (sendPayload) => {
        if (this._intervalId) {
            console.error('Trying to start twice is not allowed');
            return;
        }
        this._intervalId = setInterval(() => { this._ping(sendPayload); }, this.latencyIntervalMS)
    };

    stopChecking = () => {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }

    _ping = (sendPayload) => {
        const payload = { t: performance.now() } // if we use id we can track dropped / pending checks
        sendPayload(payload, this.onRecievedAnswer);
    };

    onRecievedAnswer = (payload) => {
        let now = performance.now();
        let start = payload.t;
        if (!start) {
            console.error('missing starttime for latencycheck');
            return;
        }
        let latency = now - start;
        this._averageTracker.addValue(latency);

        if (this._printC >= 10) {
            this._printC = 0;
            console.log(`Latency H: ${this._averageTracker.highest}, L: ${this._averageTracker.lowest}, A: ${this._averageTracker.average}`);
        } else {
            this._printC += 1;
        }
    }

    newId = () => {
        let result = this._id;
        this._id += 1;
        return result;
    };
}

class AverageTracker {
    lowest = null;
    highest = null;
    _total = 0;
    _count = 0;

    get average() {
        return this._count > 0 ? this._total/this._count : 0;
    };

    addValue = (value) => {
        this._count += 1;
        this._total += value;
        if (!this.lowest || value < this.lowest) {
            this.lowest = value;
        }
        if (!this.highest || value > this.highest) {
            this.highest = value;
        }
    };
}