#include <stdio.h>

int main() 
{
    int feng = 12.99;// 这里的12.99会被截断为12，因为int类型只能存储整数部分
    printf("变量为：%d\n", feng);
    return 0;
}
