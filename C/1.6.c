/* width.c -- 字段宽度 */
#include <stdio.h>
#define PAGES 959
int main(void)
{
     printf("*%d*\n", PAGES);
     printf("*%4d*\n", PAGES);
     printf("*%10d*\n", PAGES);
     printf("*%-10d*\n", PAGES);

     return 0;
}