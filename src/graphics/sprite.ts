import {mat4} from "./gl-matrix";
import {Material} from "./material";
import {MoveState} from "../control/moveState";

//包含在Creature
export class Sprite {
    //gl
    private gl: WebGL2RenderingContext;
    private textureBuffer: WebGLBuffer;
    private positionBuffer: WebGLBuffer;
    //glsl
    private position: GLint;
    private texCoord: GLint;
    private image: WebGLUniformLocation;
    private frame: WebGLUniformLocation;
    private modelMatrix: WebGLUniformLocation;
    private projectionMatrix: WebGLUniformLocation;
    //texture
    private material: Material;
    private texture: WebGLTexture;
    private texImage: HTMLImageElement;
    private width: number;
    private height: number;
    private ok: boolean;
    //location
    private x: number;
    private y: number;
    //animation
    private animationPhase: number;
    private moveState: number;

    constructor(gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string, imageUrl: string, x: number = 0, y: number = 0) {
        this.gl = gl;
        this.ok = false;
        //初始位置
        this.x = x;
        this.y = y;
        //初始动画相位
        this.animationPhase = 0;
        //初始运动状态
        this.moveState = MoveState.standing;

        this.material = new Material(this.gl, vertexShaderSource, fragmentShaderSource);
        this.texture = this.gl.createTexture();
        this.texImage = new Image();
        this.texImage.onload = () => {
            this.ok = true;
            this.width = this.texImage.width;
            this.height = this.texImage.height;

            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.texImage);
            this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
            this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
            this.gl.bindTexture(gl.TEXTURE_2D, null);

            this.textureBuffer = this.gl.createBuffer();
            this.positionBuffer = this.gl.createBuffer();
        };
        this.texImage.src = imageUrl;
        //glsl
        this.position = this.gl.getAttribLocation(this.material.shaderProgram, "a_position");
        this.texCoord = this.gl.getAttribLocation(this.material.shaderProgram, "a_texCoord");
        this.image = this.gl.getUniformLocation(this.material.shaderProgram, "u_image");
        this.frame = this.gl.getUniformLocation(this.material.shaderProgram, "u_frame");
        this.modelMatrix = this.gl.getUniformLocation(this.material.shaderProgram, "u_modelMatrix");
        this.projectionMatrix = this.gl.getUniformLocation(this.material.shaderProgram, "u_projectionMatrix");
    }

    getLocation(): object {
        return {x: this.x, y: this.y};
    }

    //由Creature调用
    setLocation(x,y) {
        this.x = x;
        this.y = y;
    }

    //由SpriteController调用
    setMoveState(moveState: number) {
        this.moveState = moveState;
    }

    //由render()调用
    updateMoving(step: number) {
        //只有moveState不为standing才会移动
        if (this.moveState !== MoveState.standing) {
            switch (this.moveState) {
                case MoveState.leftward:
                    this.x -= step;
                    break;
                case MoveState.upward:
                    this.y += step;
                    break;
                case MoveState.downward:
                    this.y -= step;
                    break;
                case MoveState.rightward:
                    this.x += step;
                    break;
            }
        }
    }

    render(time, sequence) {
        if (this.ok) {
            this.animationPhase = time % sequence;
            this.updateMoving(0.01);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
                this.animationPhase / sequence, 1,
                (1 + this.animationPhase) / sequence, 1,
                this.animationPhase / sequence, 0,
                (1 + this.animationPhase) / sequence, 0
            ]), this.gl.STATIC_DRAW);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
                this.x, this.y,
                this.x + .8, this.y,
                this.x, this.y + .9,
                this.x + .8, this.y + .9
            ]), this.gl.STATIC_DRAW);

            {
                let size = 2;
                let type = this.gl.FLOAT;
                let normalized = false;
                let stride = 0;
                let offset = 0;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
                this.gl.vertexAttribPointer(this.texCoord, size, type, normalized, stride, offset);
                this.gl.enableVertexAttribArray(this.texCoord);
            }
            {
                let size = 2;
                let type = this.gl.FLOAT;
                let normalized = false;
                let stride = 0;
                let offset = 0;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
                this.gl.vertexAttribPointer(this.position, size, type, normalized, stride, offset);
                this.gl.enableVertexAttribArray(this.position);
            }
            this.gl.useProgram(this.material.shaderProgram);
            this.gl.uniform1i(this.image, 0);
            this.gl.uniform2f(this.frame, 0, 0);

            let Mm = mat4.create();
            mat4.translate(Mm, Mm, [0, 0, -5]);

            let Mp = mat4.create();
            let fov = Math.PI / 4;
            let aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
            let near = 0.1;
            let far = 100;
            mat4.perspective(Mp, fov, aspect, near, far);

            let transpose = false;
            this.gl.uniformMatrix4fv(this.modelMatrix, transpose, Mm);
            this.gl.uniformMatrix4fv(this.projectionMatrix, transpose, Mp);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

            let mode = this.gl.TRIANGLE_STRIP;
            let first = 0;
            let count = 4;
            this.gl.drawArrays(mode, first, count);
        }else {
            // console.log("sprite is not ok");
        }
    }
}
