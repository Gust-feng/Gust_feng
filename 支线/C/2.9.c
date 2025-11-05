#include<stdio.h>
int main()
{
    int sum = 10;
    int count = 3;
    double average;

// average = sum / count; // 错误！int / int 结果还是 int (10 / 3 = 3)，再赋给 double 变成 3.0。小数部分丢失了。
    average = (double)sum / count; // 正确！先将 sum (int) 强制转换为 double (10.0)。
                               // 然后应用常用算术转换：double / int -> double / double。
                               // 计算 10.0 / 3 = 3.333... (double 类型)。
                               // average 得到正确的小数结果。
    printf("%d\n",average);
    int x = 1000; // 1000 超过了 signed char 的通常范围 (-128 到 127)
    signed char sc = (signed char)x; // 强制将 int 转换为 signed char。发生截断。
                                 // 1000 的二进制表示是 00000011 11101000 (假设 int 占 4字节)
                                 // 强制转换为 signed char (1字节) 会只取最低 8 位： 11101000
                                 // 如果是补码表示，11101000 表示的是负数，计算后是 -24。
                                 // 所以 sc 的值是 -24。数据丢失了！
    printf("%d",sc);
    return 0;
}