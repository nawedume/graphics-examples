#version 430 core

layout (location = 0) in vec3 inPos;
uniform sampler3D screenTexture;

void main()
{
    gl_Position = vec4(inPos, 1.0); //vec4(texture(screenTexture, vec3(0.5, 0.5, 0.5)).xyz, 1.0);
}