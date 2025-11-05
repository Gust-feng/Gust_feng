// vowels.c -- 使用多重标签
#include <stdio.h>
int main(void)
{
     char ch;
     int a_ct, e_ct, i_ct, o_ct, u_ct;

     a_ct = e_ct = i_ct = o_ct = u_ct = 0;

     printf("Enter some text; enter # to quit.\n");
     while ((ch = getchar()) != '#')
     {
          switch (ch)
          {
               case 'a':
               case 'A':  a_ct++;
                          break;//在seitch内，只会终止switch语句，并不会影响while的循环
               case 'e':
               case 'E':  e_ct++;
                          break;
               case 'i':
               case 'I':  i_ct++;
                          break;
               case 'o':
               case 'O':  o_ct++;
                          break;
               case 'u':
               case 'U':  u_ct++;
                          break;
               default:   break;
          }  
          if(a_ct==3)
            break;  //如果检测到a（A）输入 达到三次，则将停止while循环。                
     }                            
     printf("number of vowels:   A    E    I    O    U\n");
     printf("                 %4d %4d %4d %4d %4d\n",
               a_ct, e_ct, i_ct, o_ct, u_ct);

     return 0;
}