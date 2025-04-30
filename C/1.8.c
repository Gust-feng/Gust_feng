#include<stdio.h>
#include<math.h>
int main(void)
{
    int gu(int);
    //int num(int);
    int one,two;
    one=gu(55);
    //(gu(55),num(55))=(one,two);
    printf("55格小麦数为%d\n棋盘总数小麦总数为",one);
    return 0;
}
int gu(int x)
{
    x=pow(2,x-1);
    return x;
}
