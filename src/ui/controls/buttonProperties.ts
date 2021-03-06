export class ButtonProperties {
    public fontSize = 32;
    public fontPrefix = "";
    public fontFamily = "Georgia"
    public fillStyle = "grey";
    public mouseOverFillStyle = "red";
    public backgroundFillStyle: string | undefined = undefined;

    public getFont = () => {
        var font = "";
        if (this.fontPrefix) {
            font += this.fontPrefix + " "
        }
        font += this.fontSize + "px" + " " + this.fontFamily;
        return font;
    }
}