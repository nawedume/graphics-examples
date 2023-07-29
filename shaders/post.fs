#version 430 core

const float offset = 1.0 / 300.0;

in vec2 vTexCoord;

out vec4 fColor;

uniform sampler3D screenTexture;

void main()
{
    fColor = texture(screenTexture, vec3(vTexCoord, float(gl_Layer)));
    fColor.w = 1.0;
}