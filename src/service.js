"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
var Service = /** @class */ (function () {
    function Service() {
    }
    //由index.ts调用
    Service.start = function () {
    };
    //由index.ts调用
    Service.join = function (client) {
        Service.clients.push(client);
    };
    //由Client调用
    Service.leave = function (clientID) {
        for (var i = 0; i < this.clients.length; i++) {
            if (this.clients[i].clientID === clientID) {
                this.clients.splice(i, 1);
                return;
            }
        }
    };
    Service.getClientByID = function (clientID) {
        this.clients.forEach(function (client) {
            if (client.clientID === clientID) {
                return client;
            }
        });
        return null;
    };
    Service.count = function () {
        for (var i = 0; i < this.clients.length; i++) {
            console.log("      " + this.clients[i].clientID);
        }
        console.log("   " + this.clients.length + "个");
    };
    Service.clients = [];
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=service.js.map