#include<stdio.h>
int main()
{
    int gust();
    int ch;
    ch=gust();
    putchar(ch);
}
int gust()
{
    int i;
    i=getchar();
    while(getchar()!='\n'){//抛弃缓冲区第一个后面的值
        continue;
    }
    return i;
}