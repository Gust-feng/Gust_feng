#include<stdio.h>
//<main.h>中的pow()函数
int main()
{
    int poe(int,int);
    int a,i,o;
    scanf("%d",&i);
    scanf("%d",&o);
    a=poe(i,o);
    printf("值为：%d",a);
    return 0;
}
int poe(int first,int two)
{
    int cu;
    int p=1;
    for(cu=1;cu <= two;cu++){
        p *= first;
    }
    return p;
    
}