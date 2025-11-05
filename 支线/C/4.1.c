#include<stdio.h>
int main()
{
    int i,o;
    scanf("%d,%d",&i,&o);//明确要求使用【,】，因为输入要求明确的使用scanf中的格式进行匹配
    printf("%d,%d",i,o);//如果不希望强制使用格式匹配，那就使用空格（%d会跳过空格进行读取）。
    return 0;
}