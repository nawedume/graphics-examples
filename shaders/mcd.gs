#version 430 core

uniform sampler3D screenTexture;

layout (points) in;
layout (triangle_strip, max_vertices = 12) out;
out vec3 outVec;

void main()
{
    outVec = texture(screenTexture, gl_in[0].gl_Position.xyz).xyz;
    outVec.z = 3.0;
    EmitVertex();
    outVec = vec3(1.0, 1.0, 3.0);
    EmitVertex();
    outVec = vec3(-1.0, 0.0, 3.0);
    EmitVertex();
    EndPrimitive();

}