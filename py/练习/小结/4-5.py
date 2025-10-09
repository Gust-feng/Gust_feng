#创建一个列表，其中包含数字1～1000000，再使用min()和max()核实该列表确实是从1开始，到1000000结束的。另外，对这个列表调用函数sum()，看看Python将一百万个数字相加需要多长时间。
list_numble=list(range(1,100001))
print(min(list_numble))
print(max(list_numble))
print(sum(list_numble))