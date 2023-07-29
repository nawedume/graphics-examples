#version 430 core

in vec2 vPos;

out float voxelValue;

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
    voxelValue = clamp(sphere_val, 0.0, 1.0);
}
