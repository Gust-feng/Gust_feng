// chcount.c  -- 使用逻辑与运算符
#include <stdio.h>
#define PERIOD '.'
int main(void)
{
     char ch;
     int charcount = 0;

     while ((ch = getchar()) != PERIOD)
     {
          if (ch != '"' && ch != '\'')//不统计这两个字符的影响
               charcount++;
     }
     printf("There are %d non-quote characters.\n", charcount);

     return 0;
}