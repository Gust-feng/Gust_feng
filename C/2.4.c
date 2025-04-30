#include <stdio.h>

int main() {
    int num;
    char ch,an;

    printf("请输入一个整数：");
    scanf("%d", &num);

    printf("请输入一个字符：");
    scanf(" %c", &ch);

    printf("请输入一个字符：");
    scanf("%c", &an);

    printf("你输入的整数是：%d\n", num);
    printf("你输入的字符是：%c\n", ch);
    printf("你输入的字符是：%c\n", an);
    return 0;
}
