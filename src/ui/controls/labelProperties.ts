export class LabelProperties {
    public fontSize = 40;
    public fontPrefix = "";
    public fontFamily = "fontawesome";
    public fillStyle = "blue";
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