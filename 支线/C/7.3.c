#include<stdio.h>
int main()
{
     const char * pt1 = "Something is pointing at me.";
     printf("%p\n",pt1);
     printf("%p\n",&pt1);
     printf("%s",pt1);
     return 0;
}