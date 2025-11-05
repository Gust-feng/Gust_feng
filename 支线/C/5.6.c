/* showchar1.c -- 有较大 I/O 问题的程序 */
#include <stdio.h>
void display(char cr, int lines, int width);
int main(void)
{
     int ch;                /* 待打印字符    */
     int rows, cols;        /* 行数和列数 */
     printf("Enter a character and two integers:\n");
     while ((ch = getchar()) != '\n')
     {
          scanf("%d %d", &rows, &cols);//在运行时使用两个字符作为打印对象（期望依次对两个字符打印），但是这样导致后面代码无法正确匹配需要打印的行列（因为scanf期望接受一个%d)
          display(ch, rows, cols);
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
          putchar('\n');    /* 结束一行并开始新的一行 */
     }
}