#include<stdio.h>
int main()
{
int x = 20;
const int y = 23;
int * p1 = &x;
const int * p2 = &y;
const int ** pp2;
p1 = p2;        // 不安全 -- 把const指针赋给非const指针
p2 = p1;        // 有效 -- 把非const指针赋给const指针
pp2 = &p1;      // 不安全 –- 嵌套指针类型赋值
return 0;
}
