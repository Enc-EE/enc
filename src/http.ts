export class Http {
    public headers: { name: string, value: string }[] = [];

    public get = (url: string): Promise<string> => {
        return this.request("GET", url, null);
    }
    public put = (url: string, data: string): Promise<string> => {
        return this.request("PUT", url, data);
    }
    public post = (url: string, data: string): Promise<string> => {
        return this.request("POST", url, data)
    }
    public delete = (url: string): Promise<string> => {
        return this.request("DELETE", url, null)
    }

    private request = (method: string, url: string, data?: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            console.log(method + " " + url);

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    console.log("response: " + xhr.status);
                    if (xhr.status == 200) {
                        resolve(xhr.responseText);
                    } else {
                        console.log(xhr.status);
                        reject();
                    }
                }
            };
            xhr.open(method, url, true);
            if (this.headers) {
                for (const header of this.headers) {
                    xhr.setRequestHeader(header.name, header.value);
                    // if (header.name == "Authorization") {
                    //     xhr.withCredentials = true;
                    // }
                }
            }
            if (data) {
                xhr.send(data);
            }
            else {
                xhr.send();
            }
        });
    }
}