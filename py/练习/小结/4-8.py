#将同一个数字乘三次称为立方。例如，在Python中，2的立方用2**3表示。请创建一个列表，其中包含前10个整数（即1～10）的立方，再使用一个for循环将这些立方数都打印出来。
list_numble=[i**3 for i in range(1,11)]
print(list_numble)