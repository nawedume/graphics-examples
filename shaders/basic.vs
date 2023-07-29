#version 330 core

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec2 inTexture;

out vec2 vWorldCoord;

uniform mat4 uWorldTransform;
uniform mat4 uCameraTransform;
uniform mat4 uPerspectiveTransform;

void main()
{
    gl_Position = uPerspectiveTransform * uCameraTransform * uWorldTransform * vec4(inPosition, 1.0);
    vTexture = inTexture;    
}