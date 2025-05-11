#include<stdio.h>
int main()
{
    #define size_1 3
    #define size_2 2
    int gust[size_1][size_2]={{1,2},{3,4},{5,6}};
    printf("gust的地址为：%p\ngust[0]的地址为：%p\n",gust,gust[0]);
    printf("gust+1的地址为：%p\ngust[0]+1的地址为：%p\n",gust+1,gust[0]+1);
    printf("gust[0][2]的值为：%d\n",gust[0][2]);//很显然，当二维数组有了[][]后变指向指针指向的值了
    //话说回来，以上打印的是指针的值，但指针（变量）的地址呢？
    printf("gust指针的值为：%p\ngust[0]地址的值为：%p\n",&gust,&gust[0]);
    //这里有个错误，代码中并没有定义指针，上述变量为数组变量，只不过使用数组名打印数组地址，所以此行代码不见得和前述代码有什么不同
    int *ptr=&gust[0][0];
    printf("将gust[0][0]赋值为ptr\nptr的地址为：%p，而gust和gust[0]的地址分别为：%p,%p;",&ptr,gust,gust[0]);//这样，将打印指针本身的地址
    return 0;
}