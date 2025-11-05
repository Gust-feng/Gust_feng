#include<stdio.h>
int main()
{
    #define size_1 3
    #define size_2 2
    int gust[size_1][size_2]={{1,2},{3,4},{5,6}};
    int(*ptr)[2];
    ptr=gust;
    printf("gust的地址为：%p\n",gust);
    printf("ptr的值为：%p\n*ptr的值为：%d\n",ptr,*ptr[1]);
    printf("ptr[1][1]的值为：%d",ptr[1][1]);
    return 0;
}