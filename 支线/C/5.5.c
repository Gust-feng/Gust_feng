#include <stdio.h>

int main() {
    int count = 0;
    char ch;

    printf("Enter a number (e.g., 1 or 0): ");
    // 假设用户在这里输入 "1" 并按下 Enter
    // 缓冲区现在是 '1', '\n'

    // 注意：这里只是一个示例，直接用 getchar 读取数字并判断比较麻烦
    // 实际中通常会用 scanf 或其他方法读取数字
    ch = getchar(); // 读取 '1'
    printf("Read for if check: %c\n", ch); // 输出 Read for if check: 1

    // 缓冲区现在是 '\n'

    if (ch == '1') { // 根据读取到的字符进行判断
        count++; // 修改程序变量 count
        printf("Count incremented to: %d\n", count); // 输出 Count incremented to: 1
    } else {
        printf("Condition not met.\n");
    }

    // 此时，if 语句已经执行完毕，count 的值可能已经改变
    // 但缓冲区的内容仍然是 '\n'

    printf("After if/else, buffer content is: ");
    // 再次调用 getchar()
    ch = getchar(); // 读取缓冲区中剩下的 '\n'
    printf("'%c' (ASCII: %d)\n", (ch == '\n' ? ' ' : ch), ch); // 为了显示 '\n' 特殊处理一下

    return 0;
}
