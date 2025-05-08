/* 使用指针算法 */
int sump(int * start, int * end)
{
     int total = 0;

     while (start < end)
     {
          total += *start;    // 把数组元素的值加起来
          start++;            // 让指针指向下一个元素
     }

     return total;
}