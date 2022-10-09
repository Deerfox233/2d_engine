"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = void 0;
var Material = /** @class */ (function () {
    function Material(gl, vertexShaderSource, fragmentShaderSource) {
        this.gl = gl;
        this._shaderProgram = this.gl.createProgram();
        var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(vertexShader, vertexShaderSource);
        this.gl.shaderSource(fragmentShader, fragmentShaderSource);
        this.gl.compileShader(vertexShader);
        this.gl.compileShader(fragmentShader);
        this.gl.attachShader(this._shaderProgram, vertexShader);
        this.gl.attachShader(this._shaderProgram, fragmentShader);
        this.gl.linkProgram(this._shaderProgram);
    }
    Object.defineProperty(Material.prototype, "shaderProgram", {
        get: function () {
            return this._shaderProgram;
        },
        enumerable: false,
        configurable: true
    });
    return Material;
}());
exports.Material = Material;
//# sourceMappingURL=material.js.map