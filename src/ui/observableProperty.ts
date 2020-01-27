import { EEventTT, CallDelay } from "../eEvent";

export class ObservableProperty<T> {
    constructor(private value: T) { }

    public onChangedDelay = new CallDelay();
    public onChanged = new EEventTT<T, T>();

    public set = (value: T) => {
        this.onChangedDelay.delayCall(() =>{
            var oldValue = this.value;
            this.value = value;
            this.onChanged.dispatchEvent(oldValue, this.value);
        })
    }

    public get = (): T => {
        return this.value;
    }
}