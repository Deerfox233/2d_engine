import {MoveState} from "./moveState";
import {Key} from "./key";
import {RenderView} from "../renderView";

let stack: MoveState[] = [MoveState.standing];

export class SpriteController {

    public static keydown(event: KeyboardEvent) {
        let code = event.code;
        // console.log(code);
        switch (code) {
            case Key.left:
                if (stack[stack.length - 1] !== MoveState.leftward) {
                    stack.push(MoveState.leftward);
                }
                break;
            case Key.up:
                if (stack[stack.length - 1] !== MoveState.upward) {
                    stack.push(MoveState.upward);
                }
                break;
            case Key.down:
                if (stack[stack.length - 1] !== MoveState.downward) {
                    stack.push(MoveState.downward);
                }
                break;
            case Key.right:
                if (stack[stack.length - 1] !== MoveState.rightward) {
                    stack.push(MoveState.rightward);
                }
                break;
        }
        RenderView.getMyCreature().sprite.setMoveState(stack[stack.length - 1]);
    }

    public static keyup(event) {
        let code = event.code;
        // console.log(code);
        switch (code) {
            case Key.left:
                stack.splice(stack.indexOf(MoveState.leftward), 1);
                break;
            case Key.up:
                stack.splice(stack.indexOf(MoveState.upward), 1);
                break;
            case Key.down:
                stack.splice(stack.indexOf(MoveState.downward), 1);
                break;
            case Key.right:
                stack.splice(stack.indexOf(MoveState.rightward), 1);
                break;
        }
        RenderView.getMyCreature().sprite.setMoveState(stack[stack.length - 1]);
    }

    public static getCurrentMoveState(): MoveState {
        return stack[stack.length - 1];
    }
}


