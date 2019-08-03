export class ButtonProperties {
    public fontSize = 40;
    public fontPrefix = "";
    public fontFamily = "Georgia"
    public fillStyle = "grey";
    public mouseOverFillStyle = "red";
    public backgroundFillStyle: string = undefined;

    public getFont = () => {
        var font = "";
        if (this.fontPrefix) {
            font += this.fontPrefix + " "
        }
        font += this.fontSize + "px" + " " + this.fontFamily;
        return font;
    }
}