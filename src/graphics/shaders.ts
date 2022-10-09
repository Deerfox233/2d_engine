export const vertexShaderSource: string = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

varying vec2 v_texCoord;

uniform mat4 u_modelMatrix;
uniform mat4 u_projectionMatrix;
uniform vec2 u_frame;

void main() {
    gl_Position = u_projectionMatrix * u_modelMatrix * vec4(a_position, 1, 1);
    v_texCoord = u_frame + a_texCoord;
}
`;
export const fragmentShaderSource: string = `
precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_image;

void main() {
    gl_FragColor = texture2D(u_image, v_texCoord);
}
`;
