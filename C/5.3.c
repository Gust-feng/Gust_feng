#include<stdio.h>
int main()
{
    char i,o;
    while((i=getchar())!='\n')
    printf("%c",i);
    return 0;
}//如果接收到‘\n’（或者enter）则退出while，但是如果是使用CTRL+Z则并不会影响代码循环，这是因为CTRL+Z表示输入完成。这样跳过因为enter导致的\n