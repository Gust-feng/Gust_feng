#include<stdio.h>
int main()
{
    #define size 4
    int* i;
    float* o;
    int gust[size];
    float feng[size];
    int index;
    i=gust;
    o=feng;
    for(index=0;index<size;index++){
    printf("i+%d:%p,o+%d:%p\n",index,i+index,index,o+index);
    }
    return 0;    
}