import requests
import re

html=requests.get('https://gust-feng.github.io/my-hone/')
with open('文本.txt','w',encoding='utf-8') as f:
    f.write(html.text)
with open('文本.txt',encoding='utf-8') as f:
    read=f.read()#readlines 会返回列表
    pod='<span class="scroll-char">(.*?)</span>'
    text_1=re.search(f'{pod}',read)
    if text_1:
        print(text_1.group(1))
    else:
        print('未匹配到值')
    text_2=re.findall(f'{pod}',read)
    print(text_2)