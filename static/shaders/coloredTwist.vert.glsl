precision highp float;

const float pi = 3.14159;

uniform float time;

out vec3 v_normal;
out vec3 v_position;
out vec3 v_model_pos;

vec2 rotate(vec2 vecIn, float angle)
{
    vec2 result;
    result.x = cos(angle) * vecIn.x - sin(angle) * vecIn.y;
    result.y = sin(angle) * vecIn.x + cos(angle) * vecIn.y;
    return result;
}

void main()
{
    vec3 pos  = position;
    vec3 norm = normal;

    float twist = sin(2.0 * time);
    float angle = 0.5 * pi * pos.y * twist;

    pos.xz  = rotate(pos.xz, angle);
    norm.xz = rotate(norm.xz, angle);

    vec4 worldPos = modelViewMatrix * vec4(pos, 1.0);

    v_position = worldPos.xyz;
    v_model_pos = pos;
    v_normal = normalize(normalMatrix * norm);

    gl_Position = projectionMatrix * worldPos;
}
