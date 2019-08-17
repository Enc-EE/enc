import { Http } from "../http";

export class WebRtcClient2Workflow {
    private http: Http;

    constructor(private sigServeUrl: string, private serverId: string, private connectId: string) {
        this.http = new Http();
    }

    public connect = (): Promise<RTCPeerConnection> => {
        // todo: needed?
        // const configuration = { iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }] };
        // this.rtcPeerConnection = new RTCPeerConnection(configuration);
        var rtcPeerConnection = new RTCPeerConnection();
        rtcPeerConnection.addEventListener("icecandidate", this.addIceCandidate);

        // todo: needed?
        // this.rtcPeerConnection.ondatachannel = (event) => {
        //     console.log("hi data channel");

        //     // this.dataChannel = event.channel;
        //     // this.dataChannel.onmessage = (e) => {
        //     //     console.log(e);
        //     //     this.gotDataChannel.dispatchEvent(this.dataChannel);
        //     // }
        //     // setTimeout(() => {
        //     //     this.sendData("Hi there");
        //     // }, 3000);
        // };
        return new Promise(async (resolve, reject) => {
            var client1Description = <RTCSessionDescriptionInit>JSON.parse(await this.retry(this.retries, this.retryDelaySeconds, () => this.http.get(this.sigServeUrl + "/api/v1/connectoffer/" + this.serverId + "/" + this.connectId)));
            await rtcPeerConnection.setRemoteDescription(client1Description);
            var client2Description = await rtcPeerConnection.createAnswer();
            await rtcPeerConnection.setLocalDescription(client2Description);
            await this.http.put(this.sigServeUrl + "/api/v1/connectanswer/" + this.serverId + "/" + this.connectId, JSON.stringify(client2Description));
            this.checkIceCandidates(this.retries, this.retryDelaySeconds, rtcPeerConnection);
            await this.validateRtcConnectionState(this.retries * this.retryDelaySeconds, rtcPeerConnection);
        });
    }

    private checkIceCandidates = (retries: number, retryDelaySeconds: number, rtcPeerConnection: RTCPeerConnection) => {
        this.http.get(this.sigServeUrl + "/api/v1/client2icecandidates/" + this.serverId + "/" + this.connectId)
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

    public addIceCandidate = (e: RTCPeerConnectionIceEvent) => {
        console.log('ICE candidate:');
        if (e.candidate) {
            console.log(e.candidate);
            this.http.put(this.sigServeUrl + "/client1icecandidate/" + this.serverId + "/" + this.connectId, JSON.stringify(e.candidate));
        }
    }
}