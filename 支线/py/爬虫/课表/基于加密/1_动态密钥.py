import requests
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

# 用户信息
USER_NO = "202401630121"
PASSWORD = "@Misszhou2023"

def encrypt_password(password, key):
    """使用AES-ECB加密密码"""
    # 密钥处理(确保16字节)
    key = key.ljust(16, '0')[:16]
    
    # AES-ECB加密
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    encrypted = cipher.encrypt(pad(password.encode('utf-8'), AES.block_size))
    
    # 双重Base64编码
    first_b64 = base64.b64encode(encrypted).decode('utf-8')
    second_b64 = base64.b64encode(first_b64.encode('utf-8')).decode('utf-8')
    
    return second_b64

print("=" * 70)
print("🚀 开始自动登录流程")
print("=" * 70)

# 步骤1: 获取动态密钥
print("\n【步骤1】获取动态密钥...")
url = "http://222.243.161.213:81/hnrjzyxyhd/getKey"
querystring = {"userNo": USER_NO}

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Length": "0",
    "DNT": "1",
    "Origin": "http://222.243.161.213:81",
    "Referer": "http://222.243.161.213:81/hnrjzyxysjd/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
}

response = requests.post(url, headers=headers, params=querystring)
key_result = response.json()
print(f"响应: {key_result}")

# 提取动态密钥
if key_result.get('code') == '1' and 'data' in key_result:
    dynamic_key = key_result['data']
    print(f"✅ 动态密钥: {dynamic_key}")
else:
    print("❌ 获取密钥失败!")
    exit(1)

# 步骤2: 加密密码
print(f"\n【步骤2】使用密钥 {dynamic_key} 加密密码...")
encrypted_pwd = encrypt_password(PASSWORD, dynamic_key)
print(f"✅ 加密后密文: {encrypted_pwd}")

# 步骤3: 登录请求
print(f"\n【步骤3】发送登录请求...")
url = "http://222.243.161.213:81/hnrjzyxyhd/login"

querystring = {
    "userNo": USER_NO,
    "pwd": encrypted_pwd,
    "encode": "1",
    "captchaData": "",
    "codeVal": ""
}

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Length": "0",
    "DNT": "1",
    "Origin": "http://222.243.161.213:81",
    "Referer": "http://222.243.161.213:81/hnrjzyxysjd/",
    "token": "null",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
}

response = requests.post(url, headers=headers, params=querystring)
login_result = response.json()

print(f"\n响应: {login_result}")

# 步骤4: 提取Token
print("\n" + "=" * 70)
if login_result.get('code') == '1' and '登录成功' in login_result.get('Msg', ''):
    print("✅✅✅ 登录成功! ✅✅✅")
    
    if 'data' in login_result and 'token' in login_result['data']:
        token = login_result['data']['token']
        print(f"\n🎫 Token获取成功:")
        print(f"   {token}")
        
        # 显示用户信息
        data = login_result['data']
        print(f"\n👤 用户信息:")
        print(f"   姓名: {data.get('name', 'N/A')}")
        print(f"   学号: {data.get('userNo', 'N/A')}")
        print(f"   学院: {data.get('academyName', 'N/A')}")
        print(f"   班级: {data.get('clsName', 'N/A')}")
        
        # 替换课表.py中的token
        print(f"\n💾 正在更新课表.py中的token...")
        try:
            with open('课表.py', 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 查找并替换token
            import re
            # 匹配 tokens='...' 这一行
            pattern = r"(tokens=')[^']*(')"
            new_content = re.sub(pattern, r'\1' + token + r'\2', content)
            
            with open('课表.py', 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✅ Token已更新到课表.py")
        except Exception as e:
            print(f"❌ 更新课表.py失败: {e}")
    else:
        print("⚠️ 响应中没有Token")
else:
    print(f"❌ 登录失败: {login_result.get('Msg', '未知错误')}")

print("=" * 70)