import { Http } from "../http";

export class WebRtcClient2 {
    private http: Http;

    constructor(private sigServeUrl: string) {
        this.http = new Http();
    }

    public connect = (serverId: string): Promise<RTCPeerConnection> => {
        return new Promise((resolve, reject) => {
            
        });
    }
}