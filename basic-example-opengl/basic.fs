#version 330 core

in vec2 vTexture;

out vec4 outColor;

uniform sampler2D foregroundSampler;
uniform sampler2D backgroundSampler;

void main()
{
    outColor = mix(texture(foregroundSampler, vTexture), texture(backgroundSampler, vTexture), 0.5);
}