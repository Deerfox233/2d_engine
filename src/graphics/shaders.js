"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fragmentShaderSource = exports.vertexShaderSource = void 0;
exports.vertexShaderSource = "\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nvarying vec2 v_texCoord;\n\nuniform mat4 u_modelMatrix;\nuniform mat4 u_projectionMatrix;\nuniform vec2 u_frame;\n\nvoid main() {\n    gl_Position = u_projectionMatrix * u_modelMatrix * vec4(a_position, 1, 1);\n    v_texCoord = u_frame + a_texCoord;\n}\n";
exports.fragmentShaderSource = "\nprecision mediump float;\n\nvarying vec2 v_texCoord;\n\nuniform sampler2D u_image;\n\nvoid main() {\n    gl_FragColor = texture2D(u_image, v_texCoord);\n}\n";
//# sourceMappingURL=shaders.js.map