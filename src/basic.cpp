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

const int WIDTH = 1000;
const int HEIGHT = 1000;

Camera* camera = new Camera(glm::vec3(0.0, 3.0, 0.0), glm::vec3(0.0, 1.0, 0.0), 45.0f, -45.0f);

struct FB {
    GLuint fbo;
    GLuint texture;
};

FB createFramebuffer()
{
    GLuint fbo;
    glGenFramebuffers(1, &fbo);
    glBindFramebuffer(GL_FRAMEBUFFER, fbo);

    //GLuint textureColorbuffer;
    //glGenTextures(1, &textureColorbuffer);
    //glBindTexture(GL_TEXTURE_2D, textureColorbuffer);
    //glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, WIDTH, HEIGHT, 0, GL_RGB, GL_UNSIGNED_BYTE, nullptr);
    //glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    //glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    //glBindTexture(GL_TEXTURE_2D, 0);

    GLuint densityTextureBuffer;
    glGenTextures(1, &densityTextureBuffer);
    glBindTexture(GL_TEXTURE_3D, densityTextureBuffer);
    glTexImage3D(GL_TEXTURE_3D, 0, GL_RGB, 33, 33, 33, 0, GL_RGB, GL_UNSIGNED_BYTE, nullptr);
    glTexParameteri(GL_TEXTURE_3D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_3D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glBindTexture(GL_TEXTURE_3D, 0);

    GLuint rbo;
    glGenRenderbuffers(1, &rbo);
    glBindRenderbuffer(GL_RENDERBUFFER, rbo);
    glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH24_STENCIL8, WIDTH, HEIGHT);
    glBindRenderbuffer(GL_RENDERBUFFER, 0);

    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_STENCIL_ATTACHMENT, GL_RENDERBUFFER, rbo);
    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    return { fbo, densityTextureBuffer };
}

int main()
{

    GLFWwindow* window = setupWindow(WIDTH, HEIGHT);
    setupGlad();

    glm::mat4 perspectiveTransform = glm::perspective(glm::radians(45.0), (double) WIDTH / HEIGHT, 0.1, 100.0);

    FB renderImageFramebuffer = createFramebuffer();
    Shader postRenderProgram("./shaders/post.vs", "./shaders/post.fs");
    float quadVertices[24] {
        -1.0, -1.0, 0.0, 0.0,
         1.0, -1.0, 1.0, 0.0,
         1.0,  1.0, 1.0, 1.0,

        -1.0, -1.0, 0.0, 0.0,
         1.0,  1.0, 1.0, 1.0,
        -1.0,  1.0, 0.0, 1.0,
    };

    GLuint quadVao;
    glGenVertexArrays(1, &quadVao);
    glBindVertexArray(quadVao);

    GLuint quadVertexBuffer;
    glGenBuffers(1, &quadVertexBuffer);
    glBindBuffer(GL_ARRAY_BUFFER, quadVertexBuffer);
    glBufferData(GL_ARRAY_BUFFER, sizeof(quadVertices), quadVertices, GL_STATIC_DRAW);

    postRenderProgram.use();
    glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (void*) 0);
    glEnableVertexAttribArray(0);

    glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (void*) (2 * sizeof(float)));
    glEnableVertexAttribArray(1);


    Shader text3DProgram("./shaders/text3D.vs", "./shaders/text3D.fs");
    text3DProgram.use();
    glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (void*) 0);
    glEnableVertexAttribArray(0);

    int layerIndex = 0;
    while (!glfwWindowShouldClose(window))
    {
        float currentTime = glfwGetTime();
        deltaTime = currentTime - previousTime;
        previousTime = currentTime;

        handleInputs(window);
        if (glfwGetKey(window, GLFW_KEY_N) == GLFW_PRESS)
        {
            layerIndex += 1;
            layerIndex %= 33;
        }

        // Render to frame buffer the sphere
        glViewport(0, 0, 33, 33);
        glBindFramebuffer(GL_FRAMEBUFFER, renderImageFramebuffer.fbo);
        glBindTexture(GL_TEXTURE_3D, renderImageFramebuffer.texture);
        
        for (int i = 0; i < 33; i++)
        {
            glFramebufferTextureLayer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, renderImageFramebuffer.texture, 0, i);
            if (glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
            {
                std::cout << glCheckFramebufferStatus(GL_FRAMEBUFFER) << std::endl;
                throw std::runtime_error("Framebuffer not complete");
            }

            glEnable(GL_DEPTH_TEST);
            glClearColor(0.0, 0.0, 0.0, 1.0);
            glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

            text3DProgram.use();
            text3DProgram.setFloat("res", 16.0f);
            text3DProgram.setFloat("wZ", static_cast<float>(i));
            glDrawArrays(GL_TRIANGLES, 0, 6);
        }


        // Render to actual screen
        glViewport(0, 0, WIDTH, HEIGHT);
        glBindFramebuffer(GL_FRAMEBUFFER, 0);
        glClearColor(0.0, 0.0, 0.0, 1.0);
        glClear(GL_COLOR_BUFFER_BIT);
        postRenderProgram.use();
        postRenderProgram.setInt("layerIndex", layerIndex);
        glDisable(GL_DEPTH_TEST);
        glBindVertexArray(quadVao);
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_3D, renderImageFramebuffer.texture);

        
        glDrawArrays(GL_TRIANGLES, 0, 6);

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
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
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
    if (glfwGetKey(window, GLFW_KEY_Q) == GLFW_PRESS)
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
