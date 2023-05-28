precision mediump float;

in vec3 v_normal;
out vec4 outColor;

void main()
{
    outColor = vec4(((v_normal + 1.0) * 0.5), 1.0);
}
