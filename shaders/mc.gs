#version 430 core

vec3 CORNER_VECTORS[8] = vec3[8](
    vec3(0.0, 0.0, 1.0),
    vec3(1.0, 0.0, 1.0),
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, 0.0, 0.0),
    vec3(0.0, 1.0, 1.0),
    vec3(1.0, 1.0, 1.0),
    vec3(1.0, 1.0, 0.0),
    vec3(0.0, 1.0, 0.0)
);

int CONFIG_TO_EDGE_LIST[256][12] = int[256][12]( 
    int[](0,0,0,0,0,0,0,0,0,0,0,0),
    int[](0,4,3,0,0,0,0,0,0,0,0,0),
    int[](5,0,1,0,0,0,0,0,0,0,0,0),
    int[](3,1,4,1,5,4,0,0,0,0,0,0),
    int[](1,2,6,0,0,0,0,0,0,0,0,0),
    int[](1,2,6,0,4,3,0,0,0,0,0,0),
    int[](6,5,2,5,0,2,0,0,0,0,0,0),
    int[](4,5,6,4,6,2,3,4,2,0,0,0),
    int[](2,3,7,0,0,0,0,0,0,0,0,0),
    int[](4,7,0,7,2,0,0,0,0,0,0,0),
    int[](2,3,7,1,5,0,0,0,0,0,0,0),
    int[](7,4,5,7,5,1,2,7,1,0,0,0),
    int[](7,6,3,6,1,3,0,0,0,0,0,0),
    int[](6,7,4,6,4,0,1,6,0,0,0,0),
    int[](5,6,7,5,7,3,0,5,3,0,0,0),
    int[](4,5,7,5,6,7,0,0,0,0,0,0),
    int[](4,8,11,0,0,0,0,0,0,0,0,0),
    int[](11,3,8,3,0,8,0,0,0,0,0,0),
    int[](5,0,1,8,11,4,0,0,0,0,0,0),
    int[](1,3,11,1,11,8,5,1,8,0,0,0),
    int[](4,8,11,2,6,1,0,0,0,0,0,0),
    int[](11,3,8,3,0,8,2,6,1,0,0,0),
    int[](6,5,2,5,0,2,8,11,4,0,0,0),
    int[](2,3,11,2,11,5,5,8,11,2,6,5),
    int[](3,7,2,4,8,11,0,0,0,0,0,0),
    int[](8,0,2,8,2,7,11,8,7,0,0,0),
    int[](5,0,1,8,11,4,7,2,3,0,0,0),
    int[](7,11,8,7,8,5,7,5,2,2,5,1),
    int[](1,3,6,3,7,6,4,8,11,0,0,0),
    int[](7,6,11,11,8,0,11,8,6,6,0,1),
    int[](4,8,11,3,5,0,3,7,5,7,6,5),
    int[](7,6,5,7,5,8,11,7,8,0,0,0),
    int[](8,5,9,0,0,0,0,0,0,0,0,0),
    int[](0,4,3,5,9,8,0,0,0,0,0,0),
    int[](1,9,0,9,8,0,0,0,0,0,0,0),
    int[](9,1,3,9,3,4,8,9,4,0,0,0),
    int[](5,9,8,1,2,6,0,0,0,0,0,0),
    int[](8,5,9,4,3,0,2,6,1,0,0,0),
    int[](2,0,8,2,8,9,6,2,9,0,0,0),
    int[](2,3,4,2,4,8,2,8,6,6,8,9),
    int[](8,5,9,7,2,3,0,0,0,0,0,0),
    int[](2,0,7,0,4,7,5,9,8,0,0,0),
    int[](8,0,9,0,1,9,3,7,2,0,0,0),
    int[](1,9,2,2,7,4,2,7,9,9,4,8),
    int[](7,6,3,6,1,3,9,8,5,0,0,0),
    int[](5,9,8,0,6,1,0,4,6,4,7,6),
    int[](9,6,7,9,7,0,0,3,7,9,8,0),
    int[](4,7,6,4,6,9,8,4,9,0,0,0),
    int[](9,11,5,11,4,5,0,0,0,0,0,0),
    int[](3,11,9,3,9,5,0,3,5,0,0,0),
    int[](11,9,1,11,1,0,4,11,0,0,0,0),
    int[](1,3,9,3,11,9,0,0,0,0,0,0),
    int[](4,5,11,5,9,11,1,2,6,0,0,0),
    int[](1,2,6,5,3,0,5,9,3,9,11,3),
    int[](9,11,6,6,2,0,6,2,11,11,0,4),
    int[](9,11,3,9,3,2,6,9,2,0,0,0),
    int[](9,11,5,11,4,5,7,2,3,0,0,0),
    int[](7,11,9,7,9,0,0,5,9,7,2,0),
    int[](3,7,2,0,11,4,0,1,11,1,9,11),
    int[](1,9,11,1,11,7,2,1,7,0,0,0),
    int[](4,5,11,11,5,9,3,7,1,7,6,1),
    int[](11,9,7,9,6,7,5,0,1,0,0,0),
    int[](6,7,9,7,11,9,3,0,4,0,0,0),
    int[](11,9,7,9,6,7,0,0,0,0,0,0),
    int[](6,10,9,0,0,0,0,0,0,0,0,0),
    int[](0,4,3,6,10,9,0,0,0,0,0,0),
    int[](9,6,10,5,0,1,0,0,0,0,0,0),
    int[](3,1,4,1,5,4,6,10,9,0,0,0),
    int[](9,1,10,1,2,10,0,0,0,0,0,0),
    int[](9,1,10,1,2,10,0,4,3,0,0,0),
    int[](10,2,0,10,0,5,9,10,5,0,0,0),
    int[](5,4,9,9,10,2,9,10,4,4,2,3),
    int[](6,10,9,2,3,7,0,0,0,0,0,0),
    int[](4,7,0,7,2,0,10,9,6,0,0,0),
    int[](0,1,5,3,7,2,10,9,6,0,0,0),
    int[](6,10,9,1,7,2,1,5,7,5,4,7),
    int[](3,1,9,3,9,10,7,3,10,0,0,0),
    int[](0,1,9,0,9,7,7,10,9,0,4,7),
    int[](5,9,10,5,10,7,5,7,0,0,7,3),
    int[](5,4,7,5,7,10,9,5,10,0,0,0),
    int[](8,11,4,9,6,10,0,0,0,0,0,0),
    int[](0,8,3,8,11,3,9,6,10,0,0,0),
    int[](4,8,11,0,1,5,6,10,9,0,0,0),
    int[](9,6,10,8,1,5,8,11,1,11,3,1),
    int[](2,10,1,10,9,1,11,4,8,0,0,0),
    int[](0,8,3,3,8,11,1,2,9,2,10,9),
    int[](8,11,4,5,10,9,5,0,10,0,2,10),
    int[](3,11,2,11,10,2,8,5,9,0,0,0),
    int[](6,10,9,2,3,7,4,8,11,0,0,0),
    int[](10,9,6,7,8,11,7,2,8,2,0,8),
    int[](0,4,3,2,6,1,5,8,9,7,11,10),
    int[](2,6,1,7,11,10,8,5,9,0,0,0),
    int[](11,4,8,10,3,7,10,9,3,9,1,3),
    int[](1,9,0,9,8,0,10,7,11,0,0,0),
    int[](0,4,3,5,9,8,10,7,11,0,0,0),
    int[](9,8,5,10,7,11,0,0,0,0,0,0),
    int[](5,6,8,6,10,8,0,0,0,0,0,0),
    int[](10,8,6,8,5,6,4,3,0,0,0,0),
    int[](0,8,10,0,10,6,1,0,6,0,0,0),
    int[](6,1,3,6,3,8,8,4,3,6,10,8),
    int[](8,10,2,8,2,1,5,8,1,0,0,0),
    int[](0,4,3,1,8,5,1,2,8,2,10,8),
    int[](0,8,2,8,10,2,0,0,0,0,0,0),
    int[](2,10,8,2,8,4,3,2,4,0,0,0),
    int[](5,6,8,6,10,8,2,3,7,0,0,0),
    int[](2,0,7,7,0,4,6,10,5,10,8,5),
    int[](2,3,7,6,0,1,6,10,0,10,8,0),
    int[](8,10,4,10,7,4,6,1,2,0,0,0),
    int[](1,3,5,5,8,10,5,8,3,3,10,7),
    int[](7,4,10,4,8,10,0,1,5,0,0,0),
    int[](10,8,0,10,0,3,7,10,3,0,0,0),
    int[](7,4,10,4,8,10,0,0,0,0,0,0),
    int[](6,5,4,6,4,11,10,6,11,0,0,0),
    int[](3,11,0,0,5,6,0,5,11,11,6,10),
    int[](0,1,6,0,6,10,0,10,4,4,10,11),
    int[](11,3,1,11,1,6,10,11,6,0,0,0),
    int[](1,5,4,1,4,10,10,11,4,1,2,10),
    int[](10,2,11,2,3,11,1,5,0,0,0,0),
    int[](0,2,10,0,10,11,4,0,11,0,0,0),
    int[](3,11,2,11,10,2,0,0,0,0,0,0),
    int[](7,2,3,11,6,10,11,4,6,4,5,6),
    int[](0,2,5,2,6,5,7,11,10,0,0,0),
    int[](1,2,6,0,4,3,11,10,7,0,0,0),
    int[](10,7,11,6,1,2,0,0,0,0,0,0),
    int[](5,4,1,4,3,1,11,10,7,0,0,0),
    int[](5,0,1,10,7,11,0,0,0,0,0,0),
    int[](4,3,0,11,10,7,0,0,0,0,0,0),
    int[](10,7,11,0,0,0,0,0,0,0,0,0),
    int[](10,7,11,0,0,0,0,0,0,0,0,0),
    int[](4,3,0,11,10,7,0,0,0,0,0,0),
    int[](5,0,1,10,7,11,0,0,0,0,0,0),
    int[](5,4,1,4,3,1,11,10,7,0,0,0),
    int[](10,7,11,6,1,2,0,0,0,0,0,0),
    int[](1,2,6,0,4,3,11,10,7,0,0,0),
    int[](0,2,5,2,6,5,7,11,10,0,0,0),
    int[](7,2,3,11,6,10,11,4,6,4,5,6),
    int[](3,11,2,11,10,2,0,0,0,0,0,0),
    int[](0,2,10,0,10,11,4,0,11,0,0,0),
    int[](10,2,11,2,3,11,1,5,0,0,0,0),
    int[](1,5,4,1,4,10,10,11,4,1,2,10),
    int[](11,3,1,11,1,6,10,11,6,0,0,0),
    int[](0,1,6,0,6,10,0,10,4,4,10,11),
    int[](3,11,0,0,5,6,0,5,11,11,6,10),
    int[](6,5,4,6,4,11,10,6,11,0,0,0),
    int[](7,4,10,4,8,10,0,0,0,0,0,0),
    int[](10,8,0,10,0,3,7,10,3,0,0,0),
    int[](7,4,10,4,8,10,0,1,5,0,0,0),
    int[](1,3,5,5,8,10,5,8,3,3,10,7),
    int[](8,10,4,10,7,4,6,1,2,0,0,0),
    int[](2,3,7,6,0,1,6,10,0,10,8,0),
    int[](2,0,7,7,0,4,6,10,5,10,8,5),
    int[](5,6,8,6,10,8,2,3,7,0,0,0),
    int[](2,10,8,2,8,4,3,2,4,0,0,0),
    int[](0,8,2,8,10,2,0,0,0,0,0,0),
    int[](0,4,3,1,8,5,1,2,8,2,10,8),
    int[](8,10,2,8,2,1,5,8,1,0,0,0),
    int[](6,1,3,6,3,8,8,4,3,6,10,8),
    int[](0,8,10,0,10,6,1,0,6,0,0,0),
    int[](10,8,6,8,5,6,4,3,0,0,0,0),
    int[](5,6,8,6,10,8,0,0,0,0,0,0),
    int[](9,8,5,10,7,11,0,0,0,0,0,0),
    int[](0,4,3,5,9,8,10,7,11,0,0,0),
    int[](1,9,0,9,8,0,10,7,11,0,0,0),
    int[](11,4,8,10,3,7,10,9,3,9,1,3),
    int[](2,6,1,7,11,10,8,5,9,0,0,0),
    int[](0,4,3,2,6,1,5,8,9,7,11,10),
    int[](10,9,6,7,8,11,7,2,8,2,0,8),
    int[](6,10,9,2,3,7,4,8,11,0,0,0),
    int[](3,11,2,11,10,2,8,5,9,0,0,0),
    int[](8,11,4,5,10,9,5,0,10,0,2,10),
    int[](0,8,3,3,8,11,1,2,9,2,10,9),
    int[](2,10,1,10,9,1,11,4,8,0,0,0),
    int[](9,6,10,8,1,5,8,11,1,11,3,1),
    int[](4,8,11,0,1,5,6,10,9,0,0,0),
    int[](0,8,3,8,11,3,9,6,10,0,0,0),
    int[](8,11,4,9,6,10,0,0,0,0,0,0),
    int[](5,4,7,5,7,10,9,5,10,0,0,0),
    int[](5,9,10,5,10,7,5,7,0,0,7,3),
    int[](0,1,9,0,9,7,7,10,9,0,4,7),
    int[](3,1,9,3,9,10,7,3,10,0,0,0),
    int[](6,10,9,1,7,2,1,5,7,5,4,7),
    int[](0,1,5,3,7,2,10,9,6,0,0,0),
    int[](4,7,0,7,2,0,10,9,6,0,0,0),
    int[](6,10,9,2,3,7,0,0,0,0,0,0),
    int[](5,4,9,9,10,2,9,10,4,4,2,3),
    int[](10,2,0,10,0,5,9,10,5,0,0,0),
    int[](9,1,10,1,2,10,0,4,3,0,0,0),
    int[](9,1,10,1,2,10,0,0,0,0,0,0),
    int[](3,1,4,1,5,4,6,10,9,0,0,0),
    int[](9,6,10,5,0,1,0,0,0,0,0,0),
    int[](0,4,3,6,10,9,0,0,0,0,0,0),
    int[](6,10,9,0,0,0,0,0,0,0,0,0),
    int[](11,9,7,9,6,7,0,0,0,0,0,0),
    int[](6,7,9,7,11,9,3,0,4,0,0,0),
    int[](11,9,7,9,6,7,5,0,1,0,0,0),
    int[](4,5,11,11,5,9,3,7,1,7,6,1),
    int[](1,9,11,1,11,7,2,1,7,0,0,0),
    int[](3,7,2,0,11,4,0,1,11,1,9,11),
    int[](7,11,9,7,9,0,0,5,9,7,2,0),
    int[](9,11,5,11,4,5,7,2,3,0,0,0),
    int[](9,11,3,9,3,2,6,9,2,0,0,0),
    int[](9,11,6,6,2,0,6,2,11,11,0,4),
    int[](1,2,6,5,3,0,5,9,3,9,11,3),
    int[](4,5,11,5,9,11,1,2,6,0,0,0),
    int[](1,3,9,3,11,9,0,0,0,0,0,0),
    int[](11,9,1,11,1,0,4,11,0,0,0,0),
    int[](3,11,9,3,9,5,0,3,5,0,0,0),
    int[](9,11,5,11,4,5,0,0,0,0,0,0),
    int[](4,7,6,4,6,9,8,4,9,0,0,0),
    int[](9,6,7,9,7,0,0,3,7,9,8,0),
    int[](5,9,8,0,6,1,0,4,6,4,7,6),
    int[](7,6,3,6,1,3,9,8,5,0,0,0),
    int[](1,9,2,2,7,4,2,7,9,9,4,8),
    int[](8,0,9,0,1,9,3,7,2,0,0,0),
    int[](2,0,7,0,4,7,5,9,8,0,0,0),
    int[](8,5,9,7,2,3,0,0,0,0,0,0),
    int[](2,3,4,2,4,8,2,8,6,6,8,9),
    int[](2,0,8,2,8,9,6,2,9,0,0,0),
    int[](8,5,9,4,3,0,2,6,1,0,0,0),
    int[](5,9,8,1,2,6,0,0,0,0,0,0),
    int[](9,1,3,9,3,4,8,9,4,0,0,0),
    int[](1,9,0,9,8,0,0,0,0,0,0,0),
    int[](0,4,3,5,9,8,0,0,0,0,0,0),
    int[](8,5,9,0,0,0,0,0,0,0,0,0),
    int[](7,6,5,7,5,8,11,7,8,0,0,0),
    int[](4,8,11,3,5,0,3,7,5,7,6,5),
    int[](7,6,11,11,8,0,11,8,6,6,0,1),
    int[](1,3,6,3,7,6,4,8,11,0,0,0),
    int[](7,11,8,7,8,5,7,5,2,2,5,1),
    int[](5,0,1,8,11,4,7,2,3,0,0,0),
    int[](8,0,2,8,2,7,11,8,7,0,0,0),
    int[](3,7,2,4,8,11,0,0,0,0,0,0),
    int[](2,3,11,2,11,5,5,8,11,2,6,5),
    int[](6,5,2,5,0,2,8,11,4,0,0,0),
    int[](11,3,8,3,0,8,2,6,1,0,0,0),
    int[](4,8,11,2,6,1,0,0,0,0,0,0),
    int[](1,3,11,1,11,8,5,1,8,0,0,0),
    int[](5,0,1,8,11,4,0,0,0,0,0,0),
    int[](11,3,8,3,0,8,0,0,0,0,0,0),
    int[](4,8,11,0,0,0,0,0,0,0,0,0),
    int[](4,5,7,5,6,7,0,0,0,0,0,0),
    int[](5,6,7,5,7,3,0,5,3,0,0,0),
    int[](6,7,4,6,4,0,1,6,0,0,0,0),
    int[](7,6,3,6,1,3,0,0,0,0,0,0),
    int[](7,4,5,7,5,1,2,7,1,0,0,0),
    int[](2,3,7,1,5,0,0,0,0,0,0,0),
    int[](4,7,0,7,2,0,0,0,0,0,0,0),
    int[](2,3,7,0,0,0,0,0,0,0,0,0),
    int[](4,5,6,4,6,2,3,4,2,0,0,0),
    int[](6,5,2,5,0,2,0,0,0,0,0,0),
    int[](1,2,6,0,4,3,0,0,0,0,0,0),
    int[](1,2,6,0,0,0,0,0,0,0,0,0),
    int[](3,1,4,1,5,4,0,0,0,0,0,0),
    int[](5,0,1,0,0,0,0,0,0,0,0,0),
    int[](0,4,3,0,0,0,0,0,0,0,0,0),
    int[](0,0,0,0,0,0,0,0,0,0,0,0)
);

int CONFIG_TO_VERTEX_COUNT[256] = int[256](
    0,
    3,
    3,
    6,
    3,
    6,
    6,
    9,
    3,
    6,
    6,
    9,
    6,
    9,
    9,
    6,
    3,
    6,
    6,
    9,
    6,
    9,
    9,
    12,
    6,
    9,
    9,
    12,
    9,
    12,
    12,
    9,
    3,
    6,
    6,
    9,
    6,
    9,
    9,
    12,
    6,
    9,
    9,
    12,
    9,
    12,
    12,
    9,
    6,
    9,
    9,
    6,
    9,
    12,
    12,
    9,
    9,
    12,
    12,
    9,
    12,
    9,
    9,
    6,
    3,
    6,
    6,
    9,
    6,
    9,
    9,
    12,
    6,
    9,
    9,
    12,
    9,
    12,
    12,
    9,
    6,
    9,
    9,
    12,
    9,
    12,
    12,
    9,
    9,
    12,
    12,
    9,
    12,
    9,
    9,
    6,
    6,
    9,
    9,
    12,
    9,
    12,
    6,
    9,
    9,
    12,
    12,
    9,
    12,
    9,
    9,
    6,
    9,
    12,
    12,
    9,
    12,
    9,
    9,
    6,
    12,
    9,
    9,
    6,
    9,
    6,
    6,
    3,
    3,
    6,
    6,
    9,
    6,
    9,
    9,
    12,
    6,
    9,
    9,
    12,
    9,
    12,
    12,
    9,
    6,
    9,
    9,
    12,
    9,
    12,
    12,
    9,
    9,
    6,
    12,
    9,
    12,
    9,
    9,
    6,
    6,
    9,
    9,
    12,
    9,
    12,
    12,
    9,
    9,
    12,
    12,
    9,
    12,
    9,
    9,
    6,
    9,
    12,
    12,
    9,
    12,
    9,
    9,
    6,
    12,
    9,
    9,
    6,
    9,
    6,
    6,
    3,
    6,
    9,
    9,
    12,
    9,
    12,
    12,
    9,
    9,
    12,
    12,
    9,
    6,
    9,
    9,
    6,
    9,
    12,
    12,
    9,
    12,
    9,
    9,
    6,
    12,
    9,
    9,
    6,
    9,
    6,
    6,
    3,
    9,
    12,
    12,
    9,
    12,
    9,
    9,
    6,
    12,
    9,
    9,
    6,
    9,
    6,
    6,
    3,
    6,
    9,
    9,
    6,
    9,
    6,
    6,
    3,
    9,
    6,
    6,
    3,
    6,
    3,
    3,
    0
);

ivec2 EDGE_TO_VERTICES_LIST[12] = ivec2[12](
    ivec2(0, 1),
    ivec2(1, 2),
    ivec2(2, 3),
    ivec2(3, 0),

    ivec2(0, 4),
    ivec2(1, 5),
    ivec2(2, 6),
    ivec2(3, 7),

    ivec2(4, 5),
    ivec2(5, 6),
    ivec2(6, 7),
    ivec2(7, 4)
);


uniform sampler3D screenTexture;
uniform vec3 uChunkPosition;
uniform float uChunkWidth;

layout (points) in;
layout (triangle_strip, max_vertices = 12) out;

out vec3 outVec;
out vec3 outNormal;

float mSample(vec3 coord)
{
    return texture(screenTexture, coord).x;// min(texture(screenTexture, coord).x, 0.0);
}

void emitVertex(int edge, float corner_vals[8], float samplerOffset)
{
    ivec2 edge_vertices = EDGE_TO_VERTICES_LIST[edge];
    vec3 v1 = CORNER_VECTORS[edge_vertices.x];
    vec3 v2 = CORNER_VECTORS[edge_vertices.y];
    float vertex_val1 = abs(corner_vals[edge_vertices.x]);
    float vertex_val2 = abs(corner_vals[edge_vertices.y]);
    float alpha = vertex_val1 / (vertex_val1 + vertex_val2);
    vec3 interpolated_vertex = ((1 - alpha) * v1)  + (alpha * v2);

    // Move the interpolated poitn into worls space
    vec3 vertex_chunk_space = interpolated_vertex + gl_in[0].gl_Position.xyz;
    outVec.xyz = vertex_chunk_space + uChunkPosition;
    
    // calculate normal;
    vec3 samplerCoord = vertex_chunk_space / uChunkWidth;
    outNormal.x = mSample(samplerCoord + vec3(samplerOffset, 0.0, 0.0)) - mSample(samplerCoord - vec3(samplerOffset, 0.0, 0.0));
    outNormal.y = mSample(samplerCoord + vec3(0.0, samplerOffset, 0.0)) - mSample(samplerCoord - vec3(0.0, samplerOffset, 0.0));
    outNormal.z = mSample(samplerCoord + vec3(0.0, 0.0, samplerOffset)) - mSample(samplerCoord - vec3(0.0, 0.0, samplerOffset));
    // have to negate it because the gradient points to the direction of highest density.
    //outNormal = outNormal / (2 * samplerOffset);
    outNormal = -normalize(outNormal);

    EmitVertex();
}

void main()
{
    vec3 samplerCoord = gl_in[0].gl_Position.xyz / uChunkWidth;
    float samplerOffset = 1.0 / uChunkWidth;
    float corner_vals[8];
    corner_vals[0] = texture(screenTexture, samplerCoord).x;
    corner_vals[1] = texture(screenTexture, samplerCoord + vec3(samplerOffset, 0.0, 0.0)).x;
    corner_vals[2] = texture(screenTexture, samplerCoord + vec3(samplerOffset, 0.0, -samplerOffset)).x;
    corner_vals[3] = texture(screenTexture, samplerCoord + vec3(0.0, 0.0, -samplerOffset)).x;

    corner_vals[4] = texture(screenTexture, samplerCoord + vec3(0.0, samplerOffset, 0.0)).x;
    corner_vals[5] = texture(screenTexture, samplerCoord + vec3(samplerOffset, samplerOffset, 0.0)).x;
    corner_vals[6] = texture(screenTexture, samplerCoord + vec3(samplerOffset, samplerOffset, -samplerOffset)).x;
    corner_vals[7] = texture(screenTexture, samplerCoord + vec3(0.0, samplerOffset, -samplerOffset)).x;


    int config = 0;
    for (int i = 0; i < 8; i++)
    {
        config |= (int((corner_vals[i] < 0.0)) << i);
    }
    
    int edges[12] = CONFIG_TO_EDGE_LIST[config];
    int edge_count = CONFIG_TO_VERTEX_COUNT[config];
    for (int i = 0; i < edge_count; i += 3)
    {
        emitVertex(edges[i], corner_vals, samplerOffset);
        emitVertex(edges[i+1], corner_vals, samplerOffset);
        emitVertex(edges[i+2], corner_vals, samplerOffset);
        EndPrimitive();
    }   
}