import csv

with open('切片.py', encoding='utf-8') as f:
    wenjian=f.readlines()
    #wenti=f.read()
    print(wenjian)

with open ('文本.txt','w',encoding='utf-8') as f:
    f.write('你好\n')
    f.write('你叫什么名字？\n')

    with open('课表.csv', encoding='utf-8') as a:
        reads = csv.DictReader(a)
        for row in reads:
            # row是有序字典
            f.write(str(row['教室']) + '\n')  # 将字典转换为字符串