#正如文件名一样，在后续所有的文件旨在通过实际运行摸索每种方法或其他任何代码的运行规律。
#此代码的目标在于求证方法insert()的确切用法
list_1=['first','second','third']
list_1=list_1.insert(0,"unknown")
print(list_1)
#当我写下这行注释时意味着代码错误
#使用方法insert()应直接进行，即直接对列表进行操作，上述代码错在使用方法insert()后又对列表进行赋值
#而！ list_1=list_1.insert(0,"unknown") 返回值为 None，这就是为什么运行结果错误的原因
#正确的代码应该如下
list_2=['first','second','third']
list_2.insert(2,"unknown")
print(list_2)
'''这是对方法insert()的进一步理解，方法insert()中数字表示的是在列表的某一位置添加元素。这不难理解
但是，对于一个数添加在什么位置可以这么理解：在列表中添加的元素属于要添加元素位置数的规则处。
理解不了没关系，反正以后不一定看'''