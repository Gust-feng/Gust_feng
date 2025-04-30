#创建一个列表，其中包含3～30内能被3整除的数字；再使用一个for循环将这个列表中的数字都打印出来。
list_numble=list(range(3,31))
for i in list_numble:
    if i%3 ==0:
      print(i)
#我觉得还有几种实现方式，所以我想再试试
numble=[i for i in range(3,31) if i%3==0]
print(numble)