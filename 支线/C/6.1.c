//一个阶乘
#include<stdio.h>
#define l "请输入阶乘数："
int main()
{
    int i,o,p=1;
    printf(l);
    scanf("%d",&o);
    for(i=1;i<=o;i++){//初始并没有使用[<=]，导致阶乘为【o-1】
    p *= i;
    }
    printf("%d",p);
    return 0;
}//使用int，阶乘最大底数为12