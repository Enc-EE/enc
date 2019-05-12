import { EEventT } from "../eEvent";
import { Http } from "../http";
import { CreateResponse } from "./models/createResponse";
import { ConnectStartResponse } from "./models/connectStartResponse";

export class WebRtcClient1 {
    public receivedNegotiatedConnection = new EEventT<RTCPeerConnection>();
    public retryIntervalSeconds = 2;
    public isStarted = false;

    private http: Http;

    constructor(private sigServeUrl: string) {
        this.http = new Http();
    }

    public create = (): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            var response = <CreateResponse>JSON.parse(await this.http.post(this.sigServeUrl + "/api/v1/create"));
            resolve(response.id);
        });
    }

    public stop = () => {
        console.log("stopping...");
        this.isStarted = false;
    }

    public start = () => {
        console.log("started");
        this.isStarted = true;
        this.checkConnectStart();
    }

    private checkConnectStart = () => {
        if (this.isStarted) {
            this.http.get(this.sigServeUrl + "/api/v1/create")
                .then((response) => {
                    var connections = <ConnectStartResponse[]>JSON.parse(response);
                    for (const connection of connections) {
                        
                    }
                });
        } else {
            console.log("stopped");
        }
    }

    
}