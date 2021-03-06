import { Point } from "./geometry/point";
import { ImagePixels } from "./imagePixels";

export class Helper {
    public static colorImage = (image: HTMLImageElement, h: number) => {
        image.onload = () => {
            var tempCanvas = document.createElement("canvas");
            tempCanvas.width = image.naturalWidth;
            tempCanvas.height = image.naturalHeight;

            var tempCtx = tempCanvas.getContext("2d");
            if (!tempCtx) {
                return
            }
            tempCtx.drawImage(image, 0, 0);
            var imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

            for (let i = 0; i < imageData.data.length; i = i + 4) {
                var r = imageData.data[i];
                var g = imageData.data[i + 1];
                var b = imageData.data[i + 2];
                var a = imageData.data[i + 3];

                if (a > 0.5) {
                    if (r - g > 50 && r - b > 50) {
                        h = h;
                        var u = 1;
                        var e = 0.5;

                        var c = e * u;
                        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
                        var m = e - c;

                        var rx;
                        var gx;
                        var bx;
                        if (h < 60) {
                            rx = c;
                            gx = x;
                            bx = 0;
                        } else if (h < 120) {
                            rx = x;
                            gx = c;
                            bx = 0;
                        } else if (h < 180) {
                            rx = 0;
                            gx = c;
                            bx = x;
                        } else if (h < 240) {
                            rx = 0;
                            gx = x;
                            bx = c;
                        } else if (h < 300) {
                            rx = x;
                            gx = 0;
                            bx = c;
                        } else {
                            rx = c;
                            gx = 0;
                            bx = x;
                        }
                        rx = (rx + m) * 255;
                        gx = (gx + m) * 255;
                        bx = (bx + m) * 255;

                        imageData.data[i] = rx;
                        imageData.data[i + 1] = gx;
                        imageData.data[i + 2] = bx;
                    }
                }
            }
            tempCtx.putImageData(imageData, 0, 0);

            image.src = tempCanvas.toDataURL();
            image.onload = () => { };
        }
    }

    public static colorImageAny = (image: HTMLImageElement, h: number) => {
        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = image.naturalWidth;
        tempCanvas.height = image.naturalHeight;

        var tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) {
            return
        }

        tempCtx.drawImage(image, 0, 0);
        var imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

        for (let i = 0; i < imageData.data.length; i = i + 4) {
            var r = imageData.data[i];
            var g = imageData.data[i + 1];
            var b = imageData.data[i + 2];
            var a = imageData.data[i + 3];

            if (a > 0.5) {
                h = h;
                var u = 1;
                var e = 0.5;

                var c = e * u;
                var x = c * (1 - Math.abs((h / 60) % 2 - 1));
                var m = e - c;

                var rx;
                var gx;
                var bx;
                if (h < 60) {
                    rx = c;
                    gx = x;
                    bx = 0;
                } else if (h < 120) {
                    rx = x;
                    gx = c;
                    bx = 0;
                } else if (h < 180) {
                    rx = 0;
                    gx = c;
                    bx = x;
                } else if (h < 240) {
                    rx = 0;
                    gx = x;
                    bx = c;
                } else if (h < 300) {
                    rx = x;
                    gx = 0;
                    bx = c;
                } else {
                    rx = c;
                    gx = 0;
                    bx = x;
                }
                rx = (rx + m) * 255;
                gx = (gx + m) * 255;
                bx = (bx + m) * 255;

                imageData.data[i] = rx;
                imageData.data[i + 1] = gx;
                imageData.data[i + 2] = bx;
            }
        }
        tempCtx.putImageData(imageData, 0, 0);

        image.src = tempCanvas.toDataURL();
    }

    public static getImageData = (image: HTMLImageElement, callback: (imageData: ImageData) => void) => {
        image.onload = () => {
            var tempCanvas = document.createElement("canvas");
            tempCanvas.width = image.naturalWidth;
            tempCanvas.height = image.naturalHeight;

            var tempCtx = tempCanvas.getContext("2d");
            if (!tempCtx) {
                return
            }

            tempCtx.drawImage(image, 0, 0);
            callback(tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height));
        }
    }

    public static changeFavicon(src: string) {
        var link = document.createElement('link'),
            oldLink = document.getElementById('dynamic-favicon');
        link.id = 'dynamic-favicon';
        link.rel = 'shortcut icon';
        link.href = src;
        if (oldLink) {
            document.head.removeChild(oldLink);
        }
        document.head.appendChild(link);
    }

    public static getPixels(text: string) {
        var pixels: Point[] = [];
        var canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 200;
        var ctx = canvas.getContext('2d');
        if (!ctx) {
            return
        }
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        var height = 50;
        ctx.font = height + "px Georgia";
        ctx.fillText(text, 0, 0);
        var width = ctx.measureText(text).width;
        var imageData = ctx.getImageData(0, 0, width, height);
        for (let i = 0; i < imageData.data.length; i = i + 4) {
            var r = imageData.data[i];
            var g = imageData.data[i + 1];
            var b = imageData.data[i + 2];
            var a = imageData.data[i + 3];
            if (r + g + b > 300) {
                pixels.push({
                    x: i / 4 - Math.floor(i / 4 / imageData.width) * imageData.width,
                    y: Math.floor(i / 4 / imageData.width)
                });
            }
        }
        var result = new ImagePixels();
        result.pixels = pixels;
        result.width = width;
        result.height = height;
        return result;
    }

    public static getImage(text: string, size: number, font: string, fillStyle: string): ImageData[] {
        var canvas = document.createElement('canvas');
        canvas.height = size;
        var ctx = canvas.getContext('2d');

        if (!ctx) {
            return []
        }
        ctx.fillStyle = fillStyle;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.font = size + "px Georgia";
        var textSize = ctx.measureText(text);
        var width = textSize.width;
        canvas.width = width;
        ctx.fillText(text, 0, 0);
        canvas.toDataURL()
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var imagePieces: ImageData[] = [];
        for (let i = 0; i < imageData.data.length; i = i + 4) {
            var r = imageData.data[i];
            var g = imageData.data[i + 1];
            var b = imageData.data[i + 2];
            var a = imageData.data[i + 3];
            if (a > 0) {
                imageData.data[i + 3] = 0;
            }
        }
        return imagePieces;
    }

    public static blur(imageData: ImageData, quadraticRadius: number) {
        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = imageData.width;
        tempCanvas.height = imageData.height;
        var tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) {
            return
        }

        var newImageData = tempCtx.createImageData(tempCanvas.width, tempCanvas.height);
        for (let i = 0; i < imageData.data.length; i = i + 4) {
            // var r = imageData.data[i];
            // var g = imageData.data[i + 1];
            // var b = imageData.data[i + 2];
            // var a = imageData.data[i + 3];
            var y = Math.floor(i / 4 / imageData.width);
            var x = i / 4 - y * imageData.width;
            var newR = 0;
            var newG = 0;
            var newB = 0;
            var newA = 0;
            var pixels = 0;
            for (let blurY = y + -quadraticRadius; blurY < y + quadraticRadius + 1; blurY++) {
                for (let blurX = x + -quadraticRadius; blurX < x + quadraticRadius + 1; blurX++) {
                    if (blurY >= 0 && blurY < imageData.height && blurX >= 0 && blurX < imageData.width) {
                        newR += imageData.data[(blurY * imageData.width + blurX) * 4];
                        newG += imageData.data[(blurY * imageData.width + blurX) * 4 + 1];
                        newB += imageData.data[(blurY * imageData.width + blurX) * 4 + 2];
                        newA += imageData.data[(blurY * imageData.width + blurX) * 4 + 3];
                        pixels++;
                    }
                }
            }
            newImageData.data[i] = newR / pixels;
            newImageData.data[i + 1] = newG / pixels;
            newImageData.data[i + 2] = newB / pixels;
            newImageData.data[i + 3] = newA / pixels;
        }
        return newImageData;
    }
}