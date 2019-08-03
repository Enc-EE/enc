export class MethodManipulation<T extends (...args: any[]) => any> {
    private methods: T[] = [];

    constructor(private executer: any, initialMethod: T, private setMethod: (method: T) => void) {
        initialMethod.bind(this.executer);
        this.methods.push(initialMethod);
    }

    public add = (buildMethod: (currentMethod: T) => T) => {
        var old = this.methods[this.methods.length - 1];
        var newMethod = buildMethod(old);
        this.methods.push(newMethod);
        this.setMethod(newMethod);
    }

    public remove = () => {
        this.methods.pop();
        this.setMethod(this.methods[this.methods.length - 1]);
    }

    public reset = () => {
        this.setMethod(this.methods[this.methods.length - 1]);
    }

    public clear = () => {
        this.setMethod(<T>(() => { }));
    }
}