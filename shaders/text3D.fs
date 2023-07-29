#version 430 core

in vec2 vPos;

out vec4 fColor;

uniform float wZ;

float calculate_sphere_val()
{
    float z = wZ - 16.0;
    vec3 coord = vec3(vPos, z);
    return 256.0 - pow(coord.x, 2.0) - pow(coord.y, 2.0) - pow(coord.z, 2.0);
}

void main()
{
    float sphere_val = calculate_sphere_val();
    sphere_val = clamp(sphere_val, 0.0, 1.0);
    fColor = vec4(sphere_val, sphere_val, sphere_val, 1.0);

//    fColor = vec4(wZ/32.0, 0.0, 0.0, 1.0);
}
