import { vec2 } from 'gl-matrix';

export declare type ProgramLocations = { attributes: any, uniforms: any };
export declare type AnimationLoopStats = { deltaTime?: number, time?: number, fps?: number };
export declare type AnimationLoopCallback = (stats?: AnimationLoopStats) => void;

export declare type WebGLContext = {
    ctx: WebGL2RenderingContext,
    pgm: WebGLProgram,
    loc: ProgramLocations,
    vao: WebGLVertexArrayObject,
};

const compileShader = (
    gl: WebGL2RenderingContext,
    shaderType: number,
    shaderSource: string
): WebGLShader => {
    const shader: WebGLShader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw `CreateShader: failed to compile shader: ${gl.getShaderInfoLog(shader)}`;
    }

    return shader;
};

const createProgram = (
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
): WebGLProgram => {
    const vs: WebGLShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs: WebGLShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program: WebGLProgram = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw `CreateProgram: failed to link program: ${gl.getProgramInfoLog(program)}`;
    }

    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        throw `CreateProgram: failed to validate program: ${gl.getProgramInfoLog(program)}`;
    }

    return program;
};

const getProgramLocations = (
    gl: WebGL2RenderingContext,
    program: WebGLProgram
): ProgramLocations => {
    const attributes = {};
    const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < attributeCount; i++) {
        const info: WebGLActiveInfo = gl.getActiveAttrib(program, i);
        attributes[info.name] = gl.getAttribLocation(program, info.name);
    }

    const uniforms = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < uniformCount; i++) {
        const info: WebGLActiveInfo = gl.getActiveUniform(program, i);
        uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }

    return { attributes, uniforms };
};

export let _GL: WebGLContext = undefined;

(() => {
    if (!_GL) {
        const canvas = document.createElement('canvas');
        canvas.style.display = 'block';

        const ctx = canvas.getContext('webgl2', {
            alpha: false,
            antialias: true,
        });

        if (!ctx) throw 'failed to get a webgl2 context';

        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);

        const V_SHADER = `#version 300 es
            in vec2 a_position;
            in vec2 a_texCoord;
            
            uniform vec2 u_resolution;
            uniform mat3 u_cameraMatrix;

            uniform mat3 u_positionMatrix;

            uniform vec2 u_textureSize;
            uniform mat3 u_textureMatrix;
            
            out vec2 v_texCoord;
            
            void main() {
                mat3 viewMatrix = u_positionMatrix * u_cameraMatrix;
                vec2 projected = (viewMatrix * vec3(a_position * u_textureSize, 1.0)).xy;
                vec2 clipspace = (projected / u_resolution) * 2.0;
                gl_Position = vec4(clipspace * vec2(1.0, -1.0), 0.0, 1.0);
                
                v_texCoord = (u_textureMatrix * vec3(a_texCoord, 1)).xy;
            }`;

        const F_SHADER = `#version 300 es
            precision highp float;
            
            uniform sampler2D u_image;
            
            in vec2 v_texCoord;
            
            out vec4 outColor;
            
            void main() {
                outColor = texture(u_image, v_texCoord);
            }`;

        const pgm = createProgram(ctx, V_SHADER, F_SHADER);
        const loc = getProgramLocations(ctx, pgm);
        const vao = ctx.createVertexArray();
        ctx.bindVertexArray(vao);

        const positionBuffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5]), ctx.STATIC_DRAW);
        ctx.enableVertexAttribArray(loc.attributes.a_position);
        ctx.vertexAttribPointer(loc.attributes.a_position, 2, ctx.FLOAT, false, 0, 0);

        const texCoordBuffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, texCoordBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0]), ctx.STATIC_DRAW);
        ctx.enableVertexAttribArray(loc.attributes.a_texCoord);
        ctx.vertexAttribPointer(loc.attributes.a_texCoord, 2, ctx.FLOAT, false, 0, 0);

        _GL = { ctx, pgm, loc, vao };
    }
})();

export function SetWebGLContextSize(displayWidth?: number, displayHeight?: number): vec2 {
    const dpr = 1;//window.devicePixelRatio || 1;

    const { width, height } = (
        (_GL.ctx.canvas as HTMLCanvasElement).parentElement?.getBoundingClientRect() ??
        (_GL.ctx.canvas as HTMLCanvasElement).getBoundingClientRect()
    );

    displayWidth = ((displayWidth || width) * dpr) | 0;
    displayHeight = ((displayHeight || height) * dpr) | 0;

    if (_GL.ctx.canvas.width !== displayWidth || _GL.ctx.canvas.height !== displayHeight) {
        // (_GL.ctx.canvas as HTMLCanvasElement).style.width = `${displayWidth}px`;
        // (_GL.ctx.canvas as HTMLCanvasElement).style.height = `${displayHeight}px`;
        _GL.ctx.canvas.width = displayWidth;
        _GL.ctx.canvas.height = displayHeight;
        _GL.ctx.viewport(0, 0, displayWidth, displayHeight);
    }

    return vec2.fromValues(displayWidth, displayHeight);
}
