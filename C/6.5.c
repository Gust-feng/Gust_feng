#include<stdio.h>
int main()
{
    #define size_1 2
    #define size_2 2
    int gust[size_1][size_2]={{1,5},{4,9}};
    int* ptr;
    printf("%p\n",gust);
    printf("%d",*gust);

}