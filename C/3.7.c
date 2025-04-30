// trouble.c -- 误用=会导致无限循环

#include <stdio.h>
int main(void)
{
     long num;
     long sum = 0L;
     int status;

     printf("Please enter an integer to be summed ");
     printf("(q to quit): ");
     status = scanf("%ld", &num);
     while (status = 1)
     {
          sum = sum + num;
          printf("Please enter next integer (q to quit): ");
          status = scanf("%ld", &num);
     }
     printf("Those integers sum to %ld.\n", sum);

     return 0;
}
/*
这是一个错误代码，
之所以输入数字时正常，因为输入的值都（整数）都符合%d的要求，缓冲区被消耗
而，输入其他字符时会持续打印，这是因为这些字符不符合是%d的预期值，输入的字符将会留在缓冲区供下次读取，然而程序将while设置为TRUE，这导致程序一直读取不被消耗的字符。
*/