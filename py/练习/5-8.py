#创建一个至少包含5个用户名的列表，且其中一个用户名为'admin'。想象你要编写代码，在每位用户登录网站后都打印一条问候消息。遍历用户名列表，并向每位用户打印一条问候消息。·如果用户名为'admin'，就打印一条特殊的问候消息，如“Hello admin,would you like to see a status report?”​。·否则，打印一条普通的问候消息，如“Hello Eric,thank you for logging in again”​。
list_name=['候一簇花开','陌上花开','候一簇花开','晚来怀海棠','admin']
for i in list_name:
    if i=='admin':
        print(f'欢迎回来,admin')
    else:
        print(f'欢迎回来。{i}')