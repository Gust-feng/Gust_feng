/* paint.c -- 使用条件运算符 */
#include <stdio.h>
#define COVERAGE 350       // 每罐油漆可刷的面积（单位：平方英尺）
int main(void)
{
     int sq_feet;
     int cans;

     printf("Enter number of square feet to be painted:\n");
     while (scanf("%d", &sq_feet) == 1)
     {
          cans = sq_feet / COVERAGE;
          cans += ((sq_feet % COVERAGE == 0)) ? 0 : 1;//cans+，但是+的数根据余数决定
          printf("You need %d %s of paint.\n", cans,
                   cans == 1 ? "can" : "cans");//判断单复数
          printf("Enter next value (q to quit):\n");
     }

     return 0;
}