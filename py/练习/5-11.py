#序数表示位置，如1st和2nd。大多数序数都以th结尾，只有1、2和3例外。·在一个列表中存储数字1～9。·遍历这个列表。·在循环中使用一个if-elif-else结构，以打印每个数字对应的序数。输出内容应为1st、2nd、3rd、4th、5th、6th、7th、8th和9th，但每个序数都独占一行。
numble=[1,2,3,4,5,6,7,8,9]
name=[1,2]
for i,o in zip(numble,name):
    if i==o:
        print(f'{i}st\n')
        print('@name')
    elif i==3:
        print(f'{i}\n@3')
    else:
        print(f'{i}th\n')
        print('其他')
        #有缺漏的代码，但就这样吧。