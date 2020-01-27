export class AssetManager {
    private imageAssets: { name: string, url: string, image: HTMLImageElement | undefined }[] = [];

    public addImage = (name: string, url: string) => {
        this.imageAssets.push({
            name: name,
            url: url,
            image: undefined
        });
    }

    public getImage = (name: string): HTMLImageElement | undefined => {
        var imageAsset = this.imageAssets.firstOrDefault(x => x.name == name);
        if (imageAsset && imageAsset.image) {
            return imageAsset.image;
        } else {
            return undefined;
        }
    }

    public load = () => {
        return Promise.all(this.imageAssets.map(x => {
            return new Promise((resolve, reject) => {
                if (!x.image) {
                    var image = new Image();
                    image.src = x.url;
                    console.log("Loading '" + x.name + "' from '" + x.url + "'");
                    image.onload = () => {
                        x.image = image;
                        resolve();
                    }
                } else {
                    resolve();
                }
            });
        }));
    }
}