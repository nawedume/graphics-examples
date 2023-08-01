#version 430 core

uniform sampler3D screenTexture;

layout (points) in;
layout (triangle_strip, max_vertices = 12) out;
out vec3 outVec;

void main()
{
    //outVec = texture(screenTexture, vec3(0.5, 0.5, 0.5)).xyz * 10.0;
    //EmitVertex();
    //outVec = texture(screenTexture, gl_in[0].gl_Position.xyz / 32.0).xyz * 10.0;
    //EmitVertex();
    //outVec = vec3(-10.0);
    //EmitVertex();
    //EndPrimitive();

    outVec = vec3(0.0, 0.0, 3.0);
    EmitVertex();
    outVec = vec3(1.0, 1.0, 3.0);
    EmitVertex();
    outVec = vec3(-1.0, 0.0, 3.0);
    EmitVertex();
    EndPrimitive();

}