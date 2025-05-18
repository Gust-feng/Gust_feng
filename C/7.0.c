#include <stdio.h>

int main() {
    int arr[3][4];
    int (*ptr)[4];
    ptr = arr;

    printf("ptr 的地址: %p\n", ptr);//ptr=arr,ptr存储的是arr[0]的地址
    printf("ptr[0]的地址是：%p\n",ptr[0]);//ptr[0]代表的是arr[0]这个包含4个intl=类型的数组
    printf("&ptr[0] 的地址: %p\n", &ptr[0]);//&ptr[0]代表的是arr[0]这个数组的地址
    printf("arr 的地址: %p\n", arr);
    printf("&arr[0] 的地址: %p\n", &arr[0]);

    return 0;
}