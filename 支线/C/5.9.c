#include<stdio.h>
int imin(int,int);
int main()
{
    int i,o,p;
    scanf("%d%d",&o,&p);
    i=imin(o,p);
    printf("%d",i);
    return 0;
}
int imin(int i,int o)
{   
    int n;
    //scanf("%d%d",&i,&o);
    n=(i>o?o:i);
    return n;
}