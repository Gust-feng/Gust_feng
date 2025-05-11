#include<stdio.h>
int main()
{
    #define size_1 4
    #define size_2 2
    //书中说*二维数组的类型是（类型）（*）
    //但是ai解释为（类型）（*）[size_2]
    int gust[size_1][size_2]={{1,2},{3,4},{5,6},{7,8}};
    printf("gust的地址为：%p\t*gust的地址为：%p\n",gust,*gust);
    printf("gust[0]的地址为:%p\t*gust+1的地址为；%p\n",gust[0],*gust+1);
    return 0;

}
/*输出:
gust的地址为：0000004aeb3ff720  *gust的地址为：0000004aeb3ff720
gust[0]的地址为:0000004aeb3ff720        *gust+1的地址为；0000004aeb3ff724
*/
//当int*二维数组+1后增加4字节，嗯哼，书中无误。