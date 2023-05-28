precision highp float;

uniform float time;

in vec3 v_normal;
in vec3 v_position;
in vec3 v_model_pos;

out vec4 outColor;

vec2 blinnPhongDir(vec3 lightDir, float lightInt,
                   float Ka, float Kd, float Ks, float shininess)
{
    vec3 s = normalize(lightDir);
    vec3 v = normalize(-v_position);
    vec3 n = normalize(v_normal);
    vec3 h = normalize(v + s);

    float diffuse = Ka + Kd * lightInt * max(0.0, dot(n, s));
    float spec = Ks * pow(max(0.0, dot(n, h)), shininess);
    return vec2(diffuse, spec);
}

void main()
{
    if (sin(50.0 * v_model_pos.y) > 0.5) discard;

    vec3 lightV1  = vec3(0.0, 1.0, 0.0);
    vec3 lightCol = vec3(1.0, 1.0, 1.0);

    float red = abs(sin(time));
    float green = abs(cos(time));
    float blue = abs(sin(time * 0.5));
    vec3 modelCol = vec3(red, green, blue);

    vec3 colL = blinnPhongDir(lightV1, 0.0, 0.0, 0.0, 1.0, 64.0).y * lightCol;
    vec3 colD = blinnPhongDir(lightV1, 1.0, 0.15, 0.7, 0.0, 1.0).x * modelCol;
    outColor = vec4(colL + colD, 1.0);
}
