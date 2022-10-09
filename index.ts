import Koa = require("koa");
import route = require("koa-route");
import serve = require("koa-static");
import fs = require("fs");
import path = require("path");
import WS = require("websocket");
import {Service} from "./src/service";
import * as http from "http";
import {Client} from "./src/client/client";

const app = new Koa();

const main = context => {
    context.response.type = "html";
    context.response.body = fs.createReadStream("./public/index.html");
};

const matrix = context => {
    context.response.type = "javascript";
    context.response.body = fs.createReadStream("./src/graphics/gl-matrix.js");
};

const renderView = context => {
    context.response.type = "javascript";
    context.response.body = fs.createReadStream("./dist/renderView.bundle.js");
};

const controller = context => {
    context.response.type = "javascript";
    context.response.body = fs.createReadStream("./dist/controller.bundle.js");
};

const assets = serve(path.join(__dirname));

app.use(route.get("/main", main));
app.use(route.get("/matrix", matrix));
app.use(route.get("/renderView", renderView));
app.use(route.get("/controller", controller));
app.use(assets);

app.listen(5000, () => {
    console.log("it's on (HTTP)");
});





Service.start();


const httpServer = http.createServer();

httpServer.listen(5001, () => {
    console.log("it's on (WS)");
});

const WSServer = WS.server;

const wsServer = new WSServer({
    "httpServer": httpServer
});

wsServer.on("request", request => {
    const wsConnection = request.accept(null, request.origin);
    const clientID: string = generateID();
    const client = new Client(wsConnection, clientID);
    const initialLocation = client.getLocation();

    Service.join(client);

    console.log("new connection " + clientID);

    //获取当前在线玩家列表
    const currentPlayers = [];
    Service.clients.map(client => {
        if (client !== null) {
            currentPlayers.push({
                "clientID": client.clientID,
                "location": client.getLocation(),
            });
        }
    });

    //向浏览器发送连接成功信息并返回生成的ID
    const payload = {
        "method": "connect",
        "clientID": clientID,
        "currentPlayers": currentPlayers       //当前在线玩家列表
    };
    wsConnection.send(JSON.stringify(payload));

    //广播新连接（加入游戏）消息
    Service.clients.forEach(client => {
        const payload = {
            "method": "join",
            "clientID": clientID,
            "initialLocation": initialLocation,
        };
        client.wsConnection.send(JSON.stringify(payload));
    });

    wsConnection.on("message", message => {
        if ("utf8Data" in message) {
            const result = JSON.parse(message.utf8Data);
            const method = result.method;


        }
    });
});


function generateID(): string {
    return "" + (Number(Math.random().toFixed(5)) * 100000).toFixed(0);
}
