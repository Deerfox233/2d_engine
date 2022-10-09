export class Material {
    private gl: WebGL2RenderingContext;
    private readonly _shaderProgram: WebGLProgram;

    constructor(gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
        this.gl = gl;
        this._shaderProgram = this.gl.createProgram();

        let vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        let fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

        this.gl.shaderSource(vertexShader, vertexShaderSource);
        this.gl.shaderSource(fragmentShader, fragmentShaderSource);
        this.gl.compileShader(vertexShader);
        this.gl.compileShader(fragmentShader);

        this.gl.attachShader(this._shaderProgram, vertexShader);
        this.gl.attachShader(this._shaderProgram, fragmentShader);
        this.gl.linkProgram(this._shaderProgram);
    }

    get shaderProgram() {
        return this._shaderProgram;
    }
}

