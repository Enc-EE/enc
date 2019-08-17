import { EEventT } from "../eEvent";

export class ObservableArray<T> {
    public items: T[] = [];

    public onAdd = new EEventT<T>();
    public onRemove = new EEventT<T>();

    public add = (item: T) => {
        this.items.push(item);
        this.onAdd.dispatchEvent(item);
    }
    public remove = (item: T) => {
        this.items.removeItem(item);
        this.onRemove.dispatchEvent(item);
    }
}