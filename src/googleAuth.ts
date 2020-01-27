import { EEvent, EEventT } from "./eEvent";

// todo gapi dependency
namespace gapi {
    export function load(x: any, y: any) { }
}
namespace gapi.auth2 {
    export class GoogleAuth {
        public signIn(x: any): any { }
        public signOut(): any { }
    }
    export class GoogleUser { }
    export function init(x: any): any { }
}

export class GoogleAuth {
    private auth2: gapi.auth2.GoogleAuth | undefined;
    private loginDiv: HTMLDivElement | undefined;
    private logoutDiv: HTMLDivElement | undefined;

    private isInitialized: boolean = false;

    public loggedOut: EEvent = new EEvent();
    public loggedIn: EEventT<gapi.auth2.GoogleUser> = new EEventT<gapi.auth2.GoogleUser>();

    constructor(clientId: string) {
        var gapiScript = document.createElement('script');
        gapiScript.onload = () => {
            gapi.load('auth2', () => {
                this.auth2 = gapi.auth2.init({
                    client_id: clientId,
                    scope: 'email'
                });
                // use div to simulate a click which sould suppress the browser to block the popup
                this.loginDiv = document.createElement("div");
                this.loginDiv.addEventListener("click", this.loginDivClick);
                this.logoutDiv = document.createElement("div");
                this.logoutDiv.addEventListener("click", this.logoutDivClick);
                this.isInitialized = true;
            });
        }
        gapiScript.setAttribute('src', 'https://apis.google.com/js/platform.js');
        document.head.appendChild(gapiScript);
    }

    private loginDivClick = () => {
        if (this.auth2) {
            this.auth2.signIn({ redirect_uri: window.location.href, scope: "profile" }).then((googleUser: gapi.auth2.GoogleUser) => {
                console.log('login successful');
                this.loggedIn.dispatchEvent(googleUser);
            });
        }
    }

    private logoutDivClick = () => {
        if (this.auth2) {
            this.auth2.signOut().then(() => {
                console.log('logout successful');
                this.loggedOut.dispatchEvent();
            });
        }
    }

    public login = () => {
        if (this.isInitialized) {
            if (this.loginDiv) {
                this.loginDiv.click();
            }
        } else {
            console.log("oauth2 was not initialized yet");
        }
    }

    public logout = () => {
        if (this.isInitialized) {
            if (this.logoutDiv) {
                this.logoutDiv.click();
            }
        } else {
            console.log("oauth2 was not initialized yet");
        }
    }
}