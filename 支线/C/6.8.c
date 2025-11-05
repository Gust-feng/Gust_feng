#include<stdio.h>
int main()
{
    #define size_1 3
    #define size_2 2
    int gust[size_1][size_2]={{1,2},{3,4},{5,6}};
    printf("gust[0][1]的值为：%d\n",gust[0][1]);
    //显然这将打印一个int值，但使用解引将指针指向的值打印出来呢？
    printf("gust[3][2]的值为：%d\n",gust[2][1]);
    printf("*(*(gust+2)+1)的值为：%d\n",*(*(gust+2)+1));//具体打印*(*(gust+2)+1)的细节，看看具体细节
    printf("*(gust+2)的地址：%p\n",*(gust+2));
    printf("gust+2的地址：%p",gust+2);
    return 0;
}
