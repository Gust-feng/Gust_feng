import requests #确保提前安装

# GET
html=requests.get('https://gust-feng.github.io/my-hone/')
with open('文本.txt','w',encoding='utf-8') as f:
    f.write(html.text)
    '''
    html.text默认使用网站声明的编码进行解码
    html.encoding='utf-8'手动设置设置编码
    html.content.decode('utf-8')使用content指定编码
    '''
    # html.content将会返回原始数据(二进制)
print(html.content.decode('utf-8'))
#通常来说几乎所有中文网站都会使用utf-8，所以不必升入了解，只需要知道使用 html.text

# POST
data={'usename':'admin','password':'admin'}
html_2=requests.post('https://ex.com',data=data)
# html_2=request.post('https://ex.com',json=data)
print(html_2)
