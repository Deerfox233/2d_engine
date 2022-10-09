import {Client} from "./client/client";

export class Service {
    public static clients: Client[] = [];

    //由index.ts调用
    static start() {

    }

    //由index.ts调用
    static join(client: Client) {
        Service.clients.push(client);
    }

    //由Client调用
    static leave(clientID: string) {
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].clientID === clientID) {
                this.clients.splice(i, 1);
                return;
            }
        }
    }

    static getClientByID(clientID: string): Client {
        this.clients.forEach(client => {
            if (client.clientID === clientID) {
                return client;
            }
        });
        return null;
    }

    static count() {
        for (let i = 0; i < this.clients.length; i++) {
            console.log("      " + this.clients[i].clientID);
        }
        console.log("   " + this.clients.length + "个");
    }
}
