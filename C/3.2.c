#include<stdio.h>
int main()
{
    int i,an;
    scanf("%d",&i);//在终端中会打印出因为终端默认会回显的原因
    //an=scanf("%d",&i);
    printf("你输入的数字是：%d\n", i);
    return 0;
}