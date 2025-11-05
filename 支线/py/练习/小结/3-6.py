# 你刚找到了一个更大的餐桌，可容纳更多的嘉宾。请想想你还想邀请哪三位嘉宾。
list_name=['候一簇花开','超越','晚来怀海棠']
print(f'我想和{",".join(list_name)}一起共进晚餐')
list_name_del=list_name.pop(1)
list2_name="怎会这么狼狈"
list_name.insert(1,list2_name)
print(f'但{list_name_del}无法赴约，所以我重兴邀请了{list2_name}')
print(f'我又重新邀请了{",".join(list_name)}参加晚餐')    
#这里我想使用列表添加元素，而不是一一添加的方式
#但至于元素名称的选择着实令我头疼，故采用一以贯之的取名方法
list_app=['小明','小红']
list_name.append(",".join(list_app))
print(f'在邀请人数增加后，我决定邀请{",".join(list_name)}参加晚宴')
print(f'对了，我还疏忽了一个人，@小刚')#为使用insert()进行扩写
list_name.insert(0,"小刚")
print(f'所以最后邀请的名单是：\n{list_name}')