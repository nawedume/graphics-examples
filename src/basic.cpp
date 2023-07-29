#include <iostream>
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include "shader.h"
#include "glm/glm.hpp"
#include "glm/gtc/matrix_transform.hpp"
#include "glm/gtc/type_ptr.hpp"
#include "camera.hpp"

#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"


struct RenderObject {
    GLuint vao;
    int numVertices;
    Shader* program;
    GLuint* textures;
    u_int8_t numTextures;
    glm::mat4 position;
};

float previousTime = 0.0;
float deltaTime = 1.0f / 60.0f;
double oldXPos = 0.0;
double oldYPos = 0.0;
bool firstMovement = true;

extern GLFWwindow* setupWindow(int width, int height);
extern void setupGlad();
extern RenderObject createCubeVao();
extern void handleInputs(GLFWwindow* window);
extern GLuint generate_texture_2d(std::string texture_path, GLenum format);
extern void handleMouseMovement(GLFWwindow* window, double xpos, double ypos);

Camera* camera = new Camera(glm::vec3(0.0, 3.0, 0.0), glm::vec3(0.0, 1.0, 0.0), 45.0f, -45.0f);

int main()
{

    GLFWwindow* window = setupWindow(500, 500);
    setupGlad();

    glm::mat4 perspectiveTransform = glm::perspective(glm::radians(45.0), 500.0 / 500.0, 0.1, 100.0);


    RenderObject cubeObject = createCubeVao();

    while (!glfwWindowShouldClose(window))
    {
        float currentTime = glfwGetTime();
        deltaTime = currentTime - previousTime;
        previousTime = currentTime;

        handleInputs(window);

        glEnable(GL_DEPTH_TEST);
        glClearColor(0.0, 0.0, 0.0, 1.0);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        cubeObject.program->use();

        glm::mat4 cameraTransfrom = camera->GetViewMatrix();
        cubeObject.program->setFloatMat4("uWorldTransform", glm::value_ptr(cubeObject.position));
        cubeObject.program->setFloatMat4("uCameraTransform", glm::value_ptr(cameraTransfrom));
        cubeObject.program->setFloatMat4("uPerspectiveTransform", glm::value_ptr(perspectiveTransform));

        glBindVertexArray(cubeObject.vao);
        
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, cubeObject.textures[0]);

        glActiveTexture(GL_TEXTURE1);
        glBindTexture(GL_TEXTURE_2D, cubeObject.textures[1]);

        cubeObject.program->setInt("backgroundSampler", 0);
        cubeObject.program->setInt("foregroundSampler", 1);

        glDrawElements(GL_TRIANGLES, cubeObject.numVertices, GL_UNSIGNED_INT, 0);

        glfwSwapBuffers(window);
        glfwPollEvents();
    }


    return 0;
}

RenderObject createCubeVao()
{
    Shader* program = new Shader("./shaders/basic.vs", "./shaders/basic.fs");

    float cube_vertices[] = {
        -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
         0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
         0.5f,  0.5f,  0.5f,  1.0f, 1.0f,
        -0.5f,  0.5f,  0.5f,  0.0f, 1.0f,

        -0.5f, -0.5f,  -0.5f,  1.0f, 0.0f,
         0.5f, -0.5f,  -0.5f,  0.0f, 0.0f,
         0.5f,  0.5f,  -0.5f,  0.0f, 1.0f,
        -0.5f,  0.5f,  -0.5f,  1.0f, 1.0f
    };

    unsigned int cube_indices[] = {
        0, 1, 2,
        0, 2, 3,

        1, 5, 6,
        1, 6, 2,

        5, 4, 7,
        5, 7, 6,

        4, 0, 3,
        4, 3, 7,

        3, 2, 6,
        3, 6, 7,

        4, 5, 1,
        4, 1, 0
    };

    program->use();
    GLuint vao;
    glGenVertexArrays(1, &vao);
    glBindVertexArray(vao);

    GLuint vertexBufferObj;
    glGenBuffers(1, &vertexBufferObj);
    glBindBuffer(GL_ARRAY_BUFFER, vertexBufferObj);
    glBufferData(GL_ARRAY_BUFFER, sizeof(cube_vertices), cube_vertices, GL_STATIC_DRAW);
    
    GLuint indexBufferObj;
    glGenBuffers(1, &indexBufferObj);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, indexBufferObj);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(cube_indices), cube_indices, GL_STATIC_DRAW);


    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(float) * 5, (void *) 0);
    glEnableVertexAttribArray(0);

    glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, sizeof(float) * 5, (void*) (3 * sizeof(float)));
    glEnableVertexAttribArray(1);


    // setup texture

    float text[] = { 1.0, 0.0, 1.0};

    GLuint foregroundTexture = generate_texture_2d("./assets/awesomeface.png", GL_RGBA);
    GLuint backgroundTexture = generate_texture_2d("./assets/container.jpeg", GL_RGB);
    GLuint* textures = new GLuint[2];
    textures[0] = foregroundTexture;
    textures[1] = backgroundTexture;

    glm::mat4 position = glm::translate(glm::mat4(1.0), glm::vec3(4.0, 0.0, 3.0));
    return RenderObject { vao, 36, program, textures, 2, position};
}

GLFWwindow* setupWindow(int width, int height)
{
    glfwInit();

    glfwWindowHint(GLFW_OPENGL_CORE_PROFILE, GL_TRUE);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_VERSION_MINOR, 3);

    GLFWwindow* window = glfwCreateWindow(width, height, "Model loading tutorial", NULL, NULL);
    if (window == NULL)
    {
        std::cerr << "Window cannot be created." << std::endl;
        exit(1);
    }

    glfwMakeContextCurrent(window);
    glfwSetCursorPosCallback(window, handleMouseMovement);
    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
    return window;
}

void setupGlad()
{
    if (!gladLoadGLLoader((GLADloadproc) glfwGetProcAddress))
    {
        std::cerr << "Error setting up GLAD" << std::endl;
        exit(1);
    }
}

void handleInputs(GLFWwindow* window)
{
    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, true);
    }
    if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
    {
        camera->ProcessKeyboard(Camera_Movement::FORWARD, deltaTime);
    }
    if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
    {
        camera->ProcessKeyboard(Camera_Movement::BACKWARD, deltaTime);
    }
    if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
    {
        camera->ProcessKeyboard(Camera_Movement::LEFT, deltaTime);
    }
    if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
    {
        camera->ProcessKeyboard(Camera_Movement::RIGHT, deltaTime);
    }
    if (glfwGetKey(window, GLFW_KEY_SPACE) == GLFW_PRESS)
    {
        camera->ProcessKeyboard(Camera_Movement::UP, deltaTime);
    }
    if (glfwGetKey(window, GLFW_KEY_LEFT_SHIFT) == GLFW_PRESS)
    {
        camera->ProcessKeyboard(Camera_Movement::DOWN, deltaTime);
    }
}

void handleMouseMovement(GLFWwindow* window, double xpos, double ypos)
{
    if (firstMovement)
    {
        oldXPos = xpos;
        oldYPos = ypos;
        firstMovement = false;
    }

    double xOffset = xpos - oldXPos;
    double yOffset = ypos - oldYPos;

    camera->ProcessMouseMovement(xOffset, yOffset);

    oldXPos = xpos;
    oldYPos = ypos;
}

GLuint generate_texture_2d(std::string texture_path, GLenum format)
{
    stbi_set_flip_vertically_on_load(true);
    int width, height, nrChannels;
    unsigned char* textureData = stbi_load(texture_path.c_str(), &width, &height, &nrChannels, 0);
    if (!textureData)
    { 
        std::cerr << "Failed to load image data for container.jpeg" << std::endl;
        exit(1);
    }

    GLuint texture;
    glGenTextures(1, &texture);
    glBindTexture(GL_TEXTURE_2D, texture);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, format, GL_UNSIGNED_BYTE, textureData);
    glGenerateMipmap(GL_TEXTURE_2D);
    stbi_image_free(textureData);

    return texture;
}
