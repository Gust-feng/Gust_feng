#在你为完成练习4-1而编写的程序中，创建比萨列表的副本，并将其存储到变量friend_pizzas中，再完成如下任务。·在原来的比萨列表中添加一种比萨。·在列表friend_pizzas中添加另一种比萨。·核实你有两个不同的列表。为此，打印消息“My favorite pizzas are:”​，再使用一个for循环来打印第一个列表；打印消息“My friend's favorite pizzas are:”​，再使用一个for循环来打印第二个列表。核实新增的比萨被添加到了正确的列表中。
#很不幸，我并没有写下披萨的列表。不过这并不影响我自由发挥。
list_name=['通义','kimi','chaygpt',]
list_name_2=list_name[:]
list_name.append('gemini')
list_name_2.append('claude')
print('这是“list_name"列表内容')
for i in list_name:
    print(f"{i}\n")
print('这是“list_name_2d”列表内容')
for o in list_name_2:
    print(f'{o}\n')