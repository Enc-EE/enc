export class CanvasHelper {
    public loadFontawesomeFree = () => {
        return this.loadFont("\uf244", "\uf240", "900 20px 'Font Awesome 5 Free'");
    }

    public loadFontawesomeBrands = () => {
        return this.loadFont("\uf3d3", "\uf3b8", "400 20px 'Font Awesome 5 Brands'");
    }

    private countPixels = (imageData: ImageData) => {
        var pixelCount = 0;
        for (let i = 0; i < imageData.data.length; i = i + 4) {
            var r = imageData.data[i];
            var g = imageData.data[i + 1];
            var b = imageData.data[i + 2];
            var a = imageData.data[i + 3];

            if (r < 50 && g < 50 && b < 50 && a > 0.9) {
                pixelCount++;
            }
        }
        return pixelCount
    }

    private getIconPixels = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, icon: string) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(icon, 0, 0);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var icon1PixelCount = this.countPixels(imageData);
        // console.log("icon 1 pixel count: " + icon1PixelCount);
        return icon1PixelCount;
    }

    private loadFont = (icon1: string, icon2: string, font: string) => {
        var retryDelayMs = 500;
        var retries = 10

        return new Promise((resolve, reject) => {
            console.log("loading font \"" + font + "\"");

            var tempCanvas = document.createElement('canvas');
            tempCanvas.width = 20;
            tempCanvas.height = 20;
            var tempCtx = tempCanvas.getContext('2d');
            tempCtx.font = font;
            tempCtx.fillStyle = "black";
            tempCtx.textAlign = "left";
            tempCtx.textBaseline = "top";

            var checkLoaded = () => {
                var icon1PixelCount = this.getIconPixels(tempCtx, tempCanvas, icon1);
                var icon2PixelCount = this.getIconPixels(tempCtx, tempCanvas, icon2);

                var diffPixels = Math.abs(icon2PixelCount - icon1PixelCount);

                if (diffPixels > 5) {
                    console.log("loaded font \"" + font + "\"");
                    resolve();
                } else {
                    retries--;
                    if (retries == 0) {
                        console.log("stop loading font after " + retries + " retries with " + retryDelayMs + "ms delay");
                    } else {
                        // console.log("waiting a while (" + retryDelayMs + "ms)");
                        setTimeout(() => {
                            checkLoaded();
                        }, retryDelayMs);
                    }
                }
            }
            checkLoaded();
        });
    }
}