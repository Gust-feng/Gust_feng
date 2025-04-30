#在为完成练习5-8编写的程序中，添加一条if语句，检查用户名列表是否为空。·如果为空，就打印消息“We need to find some users!”​。·删除列表中的所有用户名，确定将打印正确的消息
list_name=['候一簇花开','陌上花开','候一簇花开','晚来怀海棠','admin']
for i in list_name:
    if i=='admin':
        print(f'欢迎回来,admin')
    elif i=='':
        print('请输入正确值')
    else:
        print(f'欢迎回来。{i}')
