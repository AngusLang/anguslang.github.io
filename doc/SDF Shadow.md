SDF Shadow
==========


### step
1. generate sdf   
generator use [christopherbatty/SDFGen](https://github.com/christopherbatty/SDFGen)


2. convert to array buffer
```c
#include <stdio.h>
#include <stdlib.h>
int main(int argc, char *argv[])
{
  char * input = argv[1];
  char * output = argv[2];

  fprintf(stdout, "convert sdf from [%s] to [%s]\n", input, output);
  size_t size = 100;
  size_t count = 0;

  FILE * fd = fopen(input, "r");
  if (fd == NULL) {
    fprintf(stderr, "file load error\n");
  } else {
    int width, height, depth;
    fscanf(fd, "%d %d %d", &width, &height, &depth);
    fprintf(stdout, "input sdf size <width:%d height:%d depth:%d>\n", width, height, depth);
    size_t size = width * height * depth * 4 + 28;
    float *array = (float *)malloc(size);
    array[0] = (float)width;
    array[1] = (float)height;
    array[2] = (float)depth;
    float minX, minY, minZ;
    fscanf(fd, "%f %f %f", &minX, &minY, &minZ);
    array[3] = minX;
    array[4] = minY;
    array[5] = minZ;
    float volumeSize;
    fscanf(fd, "%f", &volumeSize);
    fprintf(stdout, "input cell size <size:%f>\n", volumeSize);
    array[6] = volumeSize;
    size_t index = 7;
    float value;
    while (!feof(fd)) {
      fscanf(fd, "%f", &value);
      array[index++] = value;
    }
    FILE * outFd = fopen(output, "wb");
    fwrite(array, size, 1, outFd);
    fclose(outFd);
  }
  fclose(fd);
  return 0;
}
```