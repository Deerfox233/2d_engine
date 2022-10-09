import {Creature} from "./character/creature";
import {SpriteController} from "./control/controller";

//由index.html调用
export class RenderView {
    private static view: HTMLCanvasElement;
    private static gl: WebGL2RenderingContext;

    private static myClientID: string = null;
    private static myCreature: Creature = null;

    private static creatures: Creature[] = [];

    constructor(width: number, height: number) {
        RenderView.view = document.getElementById("view") as HTMLCanvasElement;
        RenderView.view.width = width;
        RenderView.view.height = height;

        RenderView.gl = RenderView.view.getContext("webgl2");
        RenderView.gl.clearColor(.4, 1, .2, .7);

        window.addEventListener("keydown", SpriteController.keydown);
        window.addEventListener("keyup", SpriteController.keyup);
    }

    private static setMyClientID(myClientID: string) {
        console.log("setMyClientID");
        RenderView.myClientID = myClientID;
    }

    private static addCreature(creature: Creature) {
        console.log("addCreature");
        RenderView.creatures.push(creature);
    }

    public static newCreature(clientID: string, x: number, y: number) {
        console.log("newCreature");
        if (clientID !== this.myClientID) {
            this.addCreature(new Creature(clientID, this.gl, x, y));
        }
    }

    public static setMyCreature(myClientID: string) {
        console.log("setMyCreature");
        //先判断creatures是否含有当前客户端的Creature
        RenderView.myCreature = this.getCreatureByID(myClientID);
        this.setMyClientID(myClientID);
        this.removeCreature(myClientID);
    }

    public static getMyCreature(): Creature {
        console.log("getMyCreature");
        return RenderView.myCreature;
    }

    public static removeCreature(clientID: string) {
        console.log("removeCreature");
        for (let i = 0; i < RenderView.creatures.length; i++) {
            if (RenderView.creatures[i].clientID === clientID) {
                RenderView.creatures.splice(i, 1);
                return;
            }
        }
    }

    public static getCreatureByID(clientID: string): Creature {
        console.log("getCreatureByID");
        if (clientID === RenderView.myClientID) {
            return RenderView.myCreature;
        } else {
            for (let i = 0; i < RenderView.creatures.length; i++) {
                if (RenderView.creatures[i].clientID === clientID) {
                    return RenderView.creatures[i];
                }
            }
        }
        return null;
    }

    public static update(time) {
        RenderView.gl.viewport(0, 0, RenderView.view.width, RenderView.view.height);
        RenderView.gl.clear(RenderView.gl.COLOR_BUFFER_BIT);

        RenderView.gl.enable(RenderView.gl.BLEND);
        RenderView.gl.blendFunc(RenderView.gl.SRC_ALPHA, RenderView.gl.ONE_MINUS_SRC_ALPHA);

        if (RenderView.myCreature !== null) {
            RenderView.myCreature.render(time, 16);
        }
        RenderView.creatures.forEach(creature => {
            creature.render(time, 16);
        });
    }
}
