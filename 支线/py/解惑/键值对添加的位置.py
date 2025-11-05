#正如文件名所述，本文件旨在探索在字典中添加键值对的位置关系
list_name={'first_name':'怎会这么狼狈','second_name':'候一簇花开'}
print(f"这是我是用的第一个网名:{list_name['first_name']}")#显然，我能在{}内使用字典内键作为输出
#接下来是添加键值对，看看键值对添加的位置关系
#错误添加方式  list_name['third_nmam':'陌上花开']
list_name['third_name']='任水覆舟'
print(list_name)
list_name['fourth_name']='陌上花开'
print(list_name)
#添加的位置关系似乎是“先来后发到”的关系
'''
但在python中,字典并不在意键值对的位置关系，只在意键与值之间的关联关系。
'''