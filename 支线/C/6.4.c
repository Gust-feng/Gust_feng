#include<stdio.h>
int main()
{
    #define size 4
    int gust[size]={10,20,30,40};
    int ang=0;
    int i;
    int *ptr = gust;
    printf("%p\n",*gust);
    for(i=1;i<4;i++){
        ang = *ptr++;
        printf("%p\n",ang);
    }

    return 0;
}