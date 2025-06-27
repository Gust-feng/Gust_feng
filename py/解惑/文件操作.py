import os
'''
with open(r"../其他/文件/Gust-feng.txt", 'r', encoding='utf-8', buffering=1) as f:
    content = f.read()
    #print(content) 
    pwd=os.getcwd()  # 获取当前工作目录
    print(f'当前路径：{pwd}')
    ls=os.listdir(pwd)  # 列出当前目录下的所有文件和文件夹
    print(f'当前路径文件列表：{ls}')
'''
# 结果以运行位置为准
pwd=os.getcwd()  # 获取当前工作目录
print(f'当前路径：{pwd}')
ls=os.listdir(pwd)
print(f'当前文件列表：{ls}')