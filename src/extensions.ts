interface Array<T> {
    removeItemIfExists(item: T): void;
    contains(item: T): boolean;
    removeItem(item: T): void;
    remove(selector: (item: T) => boolean): void;
    addItemIfNotExists(item: T): void;
    toList(): T[];
    getNext(current: T, selector: (item: T) => number): T;
    first(selector: (item: T) => boolean): T;
    firstOrDefault(selector: (item: T) => boolean): T;
}

Array.prototype.firstOrDefault = function (func) {
    for (const arrayItem of this) {
        if (func(arrayItem)) {
            return arrayItem;
        }
    }
    return null;
}

Array.prototype.first = function (func) {
    for (const arrayItem of this) {
        if (func(arrayItem)) {
            return arrayItem;
        }
    }
    console.log("item not found");
    console.log(this);
    throw "item not found";
}

Array.prototype.getNext = function <T>(current: T, selector: (item: T) => number): T {
    var nextPosition = selector(current) + 1;
    var next = (this as T[]).firstOrDefault((x) => selector(x) == nextPosition);
    if (!next) {
        next = (this as T[]).first(x => selector(x) == 1);
    }

    return next;
}

Array.prototype.removeItem = function (item) {
    var index = this.indexOf(item);
    if (index != -1) {
        this.splice(index, 1);
    } else {
        throw "item not found";
    }
}

Array.prototype.contains = function <T>(item: T) {
    return this.indexOf(item) !== -1;
}

Array.prototype.removeItemIfExists = function <T>(item: T) {
    var index = this.indexOf(item);
    if (index != -1) {
        this.splice(index, 1);
    }
}

Array.prototype.addItemIfNotExists = function <T>(item: T) {
    var index = this.indexOf(item);
    if (index == -1) {
        (this as T[]).push(item);
    }
}

Array.prototype.remove = function <T>(selector: (item: T) => boolean) {
    (this as T[]).removeItem((this as T[]).first(selector));
}

Array.prototype.toList = function <T>(): T[] {
    return (this as T[]).filter(x => true);
}
