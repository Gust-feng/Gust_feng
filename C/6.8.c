#include<stdio.h>
int main()
{
    #define size_1 3
    #define size_2 2
    int gust[size_1][size_2]={{1,2},{3,4},{5,6}};
    printf("gust[0][1]的值为：%d",gust[0][1]);
    //显然这将打印一个int值，但使用解引将指针指向的值打印出来呢？
    printf("")
}
