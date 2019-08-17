import { EEventT, EEventTT } from "../eEvent";

export class ObservableProperty<T> {
    constructor(private value: T) { }

    public OnChanged = new EEventTT<T, T>();

    public set = (value: T) => {
        var oldValue = this.value;
        this.value = value;
        this.OnChanged.dispatchEvent(oldValue, this.value);
    }

    public get = (): T => {
        return this.value;
    }
}