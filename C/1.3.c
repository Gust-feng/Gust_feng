#include<stdio.h>

int num(int a,int b)//返回最大值
{
    int jubu;
    if (a>b){
    jubu=a;
    }
    else{   
    jubu=b;
    }
    return jubu;
}
int main()
{
   printf("%d",num(3,4)); 
} 