export class UImation {
    private startTime: number;

    constructor(private durationSeconds: number) {
        this.startTime = Date.now();
    }

    public getValue = () => {
        var current = Date.now();
        var diff = (current - this.startTime) / 1000;
        return diff / this.durationSeconds;
    }

    public ended = () => {
        var current = Date.now();
        var diff = (current - this.startTime) / 1000;
        return diff > this.durationSeconds;
    }
}