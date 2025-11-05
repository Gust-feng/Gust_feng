#include<stdio.h>
int main()
{
    char ch;
    int num;

    printf("Enter a character: ");
    scanf("%c", &ch); // 用户输入 'A' 并回车

    printf("Enter a number: ");
    scanf("%d",&num); // 期望用户输入一个数字
    return 0;
}