export class Logger {
    public static log = (message: string) => {
        console.log(new Date().toISOString() + ": " + message);
    }
    public static verbose = (message: string) => {
        console.log(new Date().toISOString() + ": " + message);
    }
    public static verboseObject = (message: string, obj: any) => {
        console.log(new Date().toISOString() + ": " + message + ":");
        console.log(obj);
    }
}