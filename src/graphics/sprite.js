"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprite = void 0;
var gl_matrix_1 = require("./gl-matrix");
var material_1 = require("./material");
var moveState_1 = require("../control/moveState");
//包含在Creature
var Sprite = /** @class */ (function () {
    function Sprite(gl, vertexShaderSource, fragmentShaderSource, imageUrl, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = this;
        this.gl = gl;
        this.ok = false;
        //初始位置
        this.x = x;
        this.y = y;
        //初始动画相位
        this.animationPhase = 0;
        //初始运动状态
        this.moveState = moveState_1.MoveState.standing;
        this.material = new material_1.Material(this.gl, vertexShaderSource, fragmentShaderSource);
        this.texture = this.gl.createTexture();
        this.texImage = new Image();
        this.texImage.onload = function () {
            _this.ok = true;
            _this.width = _this.texImage.width;
            _this.height = _this.texImage.height;
            _this.gl.bindTexture(_this.gl.TEXTURE_2D, _this.texture);
            _this.gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _this.texImage);
            _this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            _this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            _this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
            _this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
            _this.gl.bindTexture(gl.TEXTURE_2D, null);
            _this.textureBuffer = _this.gl.createBuffer();
            _this.positionBuffer = _this.gl.createBuffer();
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
    Sprite.prototype.getLocation = function () {
        return { x: this.x, y: this.y };
    };
    //由Creature调用
    Sprite.prototype.setLocation = function (x, y) {
        this.x = x;
        this.y = y;
    };
    //由SpriteController调用
    Sprite.prototype.setMoveState = function (moveState) {
        this.moveState = moveState;
    };
    //由render()调用
    Sprite.prototype.updateMoving = function (step) {
        //只有moveState不为standing才会移动
        if (this.moveState !== moveState_1.MoveState.standing) {
            switch (this.moveState) {
                case moveState_1.MoveState.leftward:
                    this.x -= step;
                    break;
                case moveState_1.MoveState.upward:
                    this.y += step;
                    break;
                case moveState_1.MoveState.downward:
                    this.y -= step;
                    break;
                case moveState_1.MoveState.rightward:
                    this.x += step;
                    break;
            }
        }
    };
    Sprite.prototype.render = function (time, sequence) {
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
                var size = 2;
                var type = this.gl.FLOAT;
                var normalized = false;
                var stride = 0;
                var offset = 0;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
                this.gl.vertexAttribPointer(this.texCoord, size, type, normalized, stride, offset);
                this.gl.enableVertexAttribArray(this.texCoord);
            }
            {
                var size = 2;
                var type = this.gl.FLOAT;
                var normalized = false;
                var stride = 0;
                var offset = 0;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
                this.gl.vertexAttribPointer(this.position, size, type, normalized, stride, offset);
                this.gl.enableVertexAttribArray(this.position);
            }
            this.gl.useProgram(this.material.shaderProgram);
            this.gl.uniform1i(this.image, 0);
            this.gl.uniform2f(this.frame, 0, 0);
            var Mm = gl_matrix_1.mat4.create();
            gl_matrix_1.mat4.translate(Mm, Mm, [0, 0, -5]);
            var Mp = gl_matrix_1.mat4.create();
            var fov = Math.PI / 4;
            var aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
            var near = 0.1;
            var far = 100;
            gl_matrix_1.mat4.perspective(Mp, fov, aspect, near, far);
            var transpose = false;
            this.gl.uniformMatrix4fv(this.modelMatrix, transpose, Mm);
            this.gl.uniformMatrix4fv(this.projectionMatrix, transpose, Mp);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            var mode = this.gl.TRIANGLE_STRIP;
            var first = 0;
            var count = 4;
            this.gl.drawArrays(mode, first, count);
        }
        else {
            // console.log("sprite is not ok");
        }
    };
    return Sprite;
}());
exports.Sprite = Sprite;
//# sourceMappingURL=sprite.js.map