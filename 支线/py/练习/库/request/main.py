import requests
import json

burp='burp_ca.pem'
property={
    'http': 'http://127.0.0.1:8080',
}

c=requests.Session()
data = {'key': 'value'}


html=c.get('http://sso.hnsoftedu.com/login',proxies=property,verify=burp,json=data)
print(html.status_code)
print(html.cookies)
html=c.get('http://sso.hnsoftedu.com',proxies=property,verify=burp,json=data)