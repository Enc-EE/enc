import { Http } from "../http";

export class WebRtcClient1Workflow {
    private http: Http;
    isConnecting = false;
    
    constructor(private sigServeUrl: string, private serverId: string, private connectId: string) {
        this.http = new Http();
    }
    
    public connect = (): Promise<RTCPeerConnection> => {
        var rtcPeerConnection = this.createRTCPeerConnection();
        return new Promise(async (resolve, reject) => {
            var description = await rtcPeerConnection.createOffer();
            await rtcPeerConnection.setLocalDescription(description);
            await this.http.put(this.sigServeUrl + "/api/v1/connectoffer/" + this.serverId + "/" + this.connectId, JSON.stringify(description));
            var client2Description = <RTCSessionDescriptionInit>JSON.parse(await this.retry(this.retries, this.retryDelaySeconds, () => this.http.get(this.sigServeUrl + "/api/v1/connectanswer/" + this.serverId + "/" + this.connectId)));
            await rtcPeerConnection.setRemoteDescription(client2Description);
            this.checkIceCandidates(this.retries, this.retryDelaySeconds, rtcPeerConnection);
            await this.validateRtcConnectionState(this.retries * this.retryDelaySeconds, rtcPeerConnection);
        });
    }
    
    private checkIceCandidates = (retries: number, retryDelaySeconds: number, rtcPeerConnection: RTCPeerConnection) => {
        this.http.get(this.sigServeUrl + "/api/v1/client1icecandidates/" + this.serverId + "/" + this.connectId)
        .then((response) => {
            var candidates = <RTCIceCandidate[]>JSON.parse(response);
            for (const candidate of candidates) {
                rtcPeerConnection.addIceCandidate(candidate);
            }
            if (rtcPeerConnection.connectionState != "connected") {
                setTimeout(() => {
                    this.checkIceCandidates(retries--, retryDelaySeconds, rtcPeerConnection);
                }, retryDelaySeconds * 1000);
            }
            });
        }
        
        private validateRtcConnectionState = (timeoutDelaySeconds: number, rtcPeerConnection: RTCPeerConnection): Promise<void> => {
            return new Promise((resolve, reject) => {
                var timeout = setTimeout(() => {
                    reject();
                }, timeoutDelaySeconds * 1000);
                rtcPeerConnection.addEventListener("connectionstatechange", (e) => {
                    if (rtcPeerConnection.connectionState == "connected") {
                        resolve();
                    clearTimeout(timeout);
                }
            });
            if (rtcPeerConnection.connectionState == "connected") {
                clearTimeout(timeout);
                resolve();
            }
        });
    }
    
    public addIceCandidate = (e: RTCPeerConnectionIceEvent) => {
        console.log('ICE candidate:');
        if (e.candidate) {
            console.log(e.candidate);
            this.http.put(this.sigServeUrl + "/client1icecandidate/" + this.serverId + "/" + this.connectId, JSON.stringify(JSON.stringify(e.candidate)));
        }
    }
    
    // todo
    // dataChannel: RTCDataChannel;
    private createRTCPeerConnection() {
        // todo: needed?
        // const configuration = { iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }] };
        // this.rtcPeerConnection = new RTCPeerConnection(configuration);
        var rtcPeerConnection = new RTCPeerConnection();
        rtcPeerConnection.addEventListener("icecandidate", this.addIceCandidate);
        // todo: needed?
        // this.dataChannel = this.rtcPeerConnection.createDataChannel('chat');
        // this.dataChannel.onmessage = (e) => {
        //     console.log(e);    
        //     // this.sendData("answer");
        //     // this.gotDataChannel.dispatchEvent(this.dataChannel);
        // }
        // todo: needed?
        rtcPeerConnection.onnegotiationneeded = (e) => {
            console.log("rtcPeerConnection.onnegotiationneeded");
            if (this.isConnecting) {
                console.log("rtcPeerConnection.onnegotiationneeded is connecting");
                try {
                    rtcPeerConnection.createOffer().then((desc) => {
                    }, function (err) {
                        console.log("error: " + err);
                    });
                }
                catch (err) {
                    console.error(err);
                }
            }
        };
        return rtcPeerConnection;
    }

    private retries = 5;
    private retryDelaySeconds = 2;
    private retry = async (retries: number, retryDelaySeconds: number, func: () => Promise<string>): Promise<string> => {
        try {
            return await func();
        }
        catch (error) {
            retries--;
            if (retries > 0) {
                setTimeout(() => {
                    this.retry(retries, retryDelaySeconds, func);
                }, retryDelaySeconds * 1000);
            }
        }
    }
}