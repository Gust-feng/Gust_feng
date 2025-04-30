#你刚得知有位嘉宾无法赴约，因此需要另外邀请一位嘉宾
list_name=['候一簇花开','超越','晚来怀海棠']
print(f'我想和{",".join(list_name)}一起共进晚餐')
list_name_del=list_name.pop(1)
list2_name="怎会这么狼狈"
list_name.insert(1,list2_name)
print(f'但{list_name_del}无法赴约，所以我重兴邀请了{list2_name}')
print(f'我又重新邀请了{",".join(list_name)}参加晚餐')    