/* showchar2.c -- 按指定的行列打印字符 */
#include <stdio.h>
void display(char cr, int lines, int width);
int main(void)
{
     int ch;                /* 待打印字符*/
     int rows, cols;        /* 行数和列数 */

     printf("Enter a character and two integers:\n");
     while ((ch = getchar()) != '\n')
     {
          if (scanf("%d %d", &rows, &cols) != 2)
               break;
          display(ch, rows, cols);
          while (getchar() != '\n')//忽略程序所需以外的数并清空缓存区
               continue;
          printf("Enter another character and two integers;\n");
          printf("Enter a newline to quit.\n");
     }
     printf("Bye.\n");

     return 0;
}

void display(char cr, int lines, int width)
{
     int row, col;

     for (row = 1; row <= lines; row++)
     {
          for (col = 1; col <= width; col++)
               putchar(cr);
          putchar('\n');        /* 结束一行并开始新的一行 */
     }
}