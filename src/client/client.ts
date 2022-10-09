//这是服务器的东西
import {Service} from "../service";

export class Client {
    private _wsConnection;       //浏览器与服务器的WebSocket连接
    private _clientID: string;

    //location
    private x: number;
    private y: number;

    getLocation() {
        return {
            "x": this.x,
            "y": this.y,
        };
    }

    setLocation(x,y) {
        this.x = x;
        this.y = y;
    }

    get wsConnection() {
        return this._wsConnection;
    }

    set wsConnection(value) {
        this._wsConnection = value;
    }

    get clientID(): string {
        return this._clientID;
    }

    set clientID(value: string) {
        this._clientID = value;
    }

    constructor(wsConnection, clientID: string) {
        this._wsConnection = wsConnection;
        this._clientID = clientID;

        //设置初始位置
        this.x = Math.random() - 0.5;
        this.y = Math.random() - 0.5;

        this._wsConnection.on("open", () => {
            console.log("connection " + this._clientID + " opened");
        });

        this._wsConnection.on("close", function () {
            console.log("connection " + clientID + " closed");

            Service.leave(clientID);             //从服务中移除自己
            const payload = {
                "method": "leave",
                "clientID": clientID,
            };
            Service.clients.forEach(client => {         //广播离开信息
                client.wsConnection.send(JSON.stringify(payload));
            });
        });

        this._wsConnection.on("message", message => {
            const result = JSON.parse(message.utf8Data);
            const method = result.method;

            if (method === "location") {
                const location = result.location;
                // console.log(clientID + ": (" + location.x.toFixed(2) + ", " + location.y.toFixed(2) + ")");

                const payload = {
                    "method": "position",
                    "clientID": clientID,
                    "location": location,
                };
                Service.clients.forEach(client => {         //广播位置信息
                    client.wsConnection.send(JSON.stringify(payload));
                });
            }
        });
    }
}
