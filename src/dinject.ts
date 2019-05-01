export class Dinject {
    private static instances: { [key: string]: any } = {}

    public static addInstance = (name: string, instance: any) => {
        Dinject.instances[name] = instance;
    }

    public static getInstance = <T>(name: string): T => {
        return <T>Dinject.instances[name];
    }
}