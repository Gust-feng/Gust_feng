import requests
import json
#确保终端目录正确
burp='burp_ca.pem'

# 代理设置
proxies = {
    'http': 'http://127.0.0.1:8080',
    'https': 'http://127.0.0.1:8080',
}
# 请求的网页
papg='http://sso.hnsoftedu.com/api/captcha/generate/DEFAULT'

params={
    'usename':'admin',}
# 字典更简洁,但不能重复键值
post={
    'usename':'admin',
    'password':'admin'
}

post_list=[('usename','admin'),('password','admin')]

headers={
    'User-Agent':'Gust-feng',
    #'Content-Type': 'application/json',
}

#请求消息
soures=requests.get(papg, proxies=proxies, verify=burp,params=params,headers=headers,json=post)



# 保存代码
'''
with open('html.html','w') as f:
    f.write(soures.text)
'''
with open('html.jpg','wb') as f:
    f.write(soures.content)
