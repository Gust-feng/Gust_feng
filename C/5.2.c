/* echo_eof.c -- 重复输入，直到文件结尾 */
#include <stdio.h>
int main(void)
{
     int ch;

     while ((ch = getchar()) != EOF)
          putchar(ch);

     return 0;
}//这个程序通过正常的输入永远无法结束while，因为getchar（）只会单字符依次读取缓存区内容，然而EOF（确切的说是-1）结构为连字符和整数两部分构成。