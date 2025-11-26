import requests
import base64
import json
import os
import sys
from datetime import datetime
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

# 设置标准输出编码为UTF-8，避免在后台运行时出现编码错误
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# ==================== 配置信息 ====================
USER_NO = "你的学号"#不建议硬编码建议换种方式获取，比如环境变量等
PASSWORD = "你的密码"
TOKEN_FILE = "token_cache.json"  # Token缓存文件

# ==================== 工具函数 ====================
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

def save_token(token):
    """保存Token到本地文件"""
    try:
        with open(TOKEN_FILE, 'w', encoding='utf-8') as f:
            json.dump({
                'token': token,
                'timestamp': datetime.now().isoformat()
            }, f, ensure_ascii=False, indent=2)
        print(f"✅ Token已保存到 {TOKEN_FILE}")
    except Exception as e:
        print(f"⚠️ 保存Token失败: {e}")

def load_token():
    """从本地文件加载Token"""
    try:
        if os.path.exists(TOKEN_FILE):
            with open(TOKEN_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                token = data.get('token')
                timestamp = data.get('timestamp')
                if token:
                    print(f"📂 从缓存加载Token (保存时间: {timestamp})")
                    return token
    except Exception as e:
        print(f"⚠️ 加载Token失败: {e}")
    return None

def get_new_token():
    """获取新的Token(完整登录流程)"""
    print("\n" + "=" * 70)
    print("🔑 开始获取新Token...")
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
    
    try:
        response = requests.post(url, headers=headers, params=querystring)
        key_result = response.json()
        print(f"响应: {key_result}")
        
        # 提取动态密钥
        if key_result.get('code') == '1' and 'data' in key_result:
            dynamic_key = key_result['data']
            print(f"✅ 动态密钥: {dynamic_key}")
        else:
            print("❌ 获取密钥失败!")
            return None
    except Exception as e:
        print(f"❌ 获取密钥异常: {e}")
        return None
    
    # 步骤2: 加密密码
    print(f"\n【步骤2】使用密钥 {dynamic_key} 加密密码...")
    encrypted_pwd = encrypt_password(PASSWORD, dynamic_key)
    print(f"✅ 加密后密文: {encrypted_pwd[:50]}...")
    
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
    
    try:
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
                print(f"   {token[:50]}...")
                
                # 显示用户信息
                data = login_result['data']
                print(f"\n👤 用户信息:")
                print(f"   姓名: {data.get('name', 'N/A')}")
                print(f"   学号: {data.get('userNo', 'N/A')}")
                print(f"   学院: {data.get('academyName', 'N/A')}")
                print(f"   班级: {data.get('clsName', 'N/A')}")
                
                # 保存Token
                save_token(token)
                print("=" * 70)
                return token
            else:
                print("⚠️ 响应中没有Token")
                return None
        else:
            print(f"❌ 登录失败: {login_result.get('Msg', '未知错误')}")
            return None
    except Exception as e:
        print(f"❌ 登录请求异常: {e}")
        return None

def get_schedule(token, week_num):
    """
    获取课表数据
    
    Args:
        token: 认证Token
        week_num: 周次
        
    Returns:
        tuple: (success, data) - 成功标志和数据
    """
    url = 'http://222.243.161.213:81/hnrjzyxyhd/student/curriculum'
    
    params = {
        'week': str(week_num),
        'kbjcmsid': ''
    }
    
    headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cache-Control': 'no-cache',
        'Content-Length': '0',
        'Origin': 'http://222.243.161.213:81',
        'Referer': 'http://222.243.161.213:81/hnrjzyxyhd/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
        'token': token
    }
    
    try:
        response = requests.post(url, params=params, headers=headers)
        print(f'\n📡 状态码: {response.status_code}')
        
        data = response.json()
        
        # 检查是否是Token过期或非法访问
        if data.get('code') != '1':
            msg = data.get('Msg', data.get('msg', ''))
            print(f'⚠️ 请求失败: {msg}')
            
            # 判断是否是Token相关问题
            if any(keyword in msg.lower() for keyword in ['token', '非法', '登录', '过期', 'invalid', 'unauthorized']):
                print('🔄 检测到Token失效，需要重新获取')
                return False, None
            else:
                print('❌ 其他错误，停止执行')
                return False, None
        
        # 请求成功
        return True, data
        
    except Exception as e:
        print(f'❌ 请求异常: {e}')
        return False, None

def save_schedule(data):
    """保存课表数据到文件"""
    if not data or not data.get('data'):
        print('⚠️ 无数据可保存')
        return False
    
    try:
        # 从date数组中获取zc字段（周次）
        week_num = data['data'][0]['date'][0].get('zc', '未知')
        
        # 创建保存目录
        save_dir = '大二上课表'
        os.makedirs(save_dir, exist_ok=True)
        
        # 生成文件名
        filename = f'{save_dir}/{week_num}.json'
        
        # 保存为格式化的JSON文件
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f'\n✅ 课表数据已保存到: {filename}')
        print(f'📅 周次: 第{week_num}周')
        
        # 显示课程统计
        if 'data' in data and len(data['data']) > 0:
            courses = data['data'][0].get('courses', [])
            print(f'📚 本周课程数量: {len(courses)}门')
            
            # 显示课程列表
            if courses:
                print('\n📖 课程列表:')
                for course in courses:
                    course_name = course.get('courseName', '未知课程')
                    teacher = course.get('teaName', '未知教师')
                    print(f'   • {course_name} ({teacher})')
        
        return True
    except Exception as e:
        print(f'❌ 保存数据失败: {e}')
        return False

# ==================== 主程序 ====================
def main():
    """主程序入口"""
    print("=" * 70)
    print("📚 智能课表爬虫系统")
    print("=" * 70)
    
    # 自动判断获取哪一周的课表
    current_weekday = datetime.now().weekday()  # 0=周一, 6=周日
    
    # 周末(周六、周日)获取下一周课表，工作日获取当前周课表
    if current_weekday >= 5:  # 5=周六, 6=周日
        # 周末：尝试从缓存读取当前周次+1
        cache_file = os.path.join(os.path.dirname(__file__), '大二上课表', 'week_cache.json')
        cached_week = None
        
        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'r', encoding='utf-8') as f:
                    cache_data = json.load(f)
                    cached_week = cache_data.get('currentWeek')
            except:
                pass
        
        if cached_week:
            WEEK_NUM = str(cached_week + 1)
            print(f"📅 周末模式：从缓存周次 {cached_week} 获取下一周 (第{WEEK_NUM}周)")
        else:
            # 如果没有缓存，先获取当前周确定周次，然后获取下一周
            print(f"周末模式：缓存不存在，先获取当前周确定周次")
            WEEK_NUM = ''  # 先获取当前周
            temp_token = load_token()
            if not temp_token:
                temp_token = get_new_token()
            if temp_token:
                temp_success, temp_data = get_schedule(temp_token, '')
                if temp_success and temp_data and temp_data.get('data'):
                    current_week = int(temp_data['data'][0]['date'][0].get('zc', '0'))
                    if current_week > 0:
                        WEEK_NUM = str(current_week + 1)
                        print(f"检测到当前是第{current_week}周，将获取第{WEEK_NUM}周课表")
            
            if not WEEK_NUM:
                WEEK_NUM = ''
                print(f"无法确定周次，获取当前周课表")
    else:
        # 工作日：获取当前周
        WEEK_NUM = ''
        print(f"工作日模式：获取当前周课表")
    
    # 步骤1: 尝试加载已有Token
    print(f"\n检查本地Token缓存...")
    token = load_token()
    
    # 步骤2: 如果没有Token，获取新Token
    if not token:
        print("⚠️ 没有找到有效Token，需要登录获取")
        token = get_new_token()
        if not token:
            print("❌ 获取Token失败，程序终止")
            return
    
    # 步骤3: 使用Token获取课表
    if WEEK_NUM:
        print(f"\n📅 正在获取第{WEEK_NUM}周课表...")
    else:
        print(f"\n📅 正在获取当前周课表...")
    
    success, data = get_schedule(token, WEEK_NUM)
    
    # 步骤4: 如果Token失效，重新获取并重试
    if not success:
        print("\n🔄 Token已失效，正在重新获取...")
        token = get_new_token()
        if not token:
            print("❌ 重新获取Token失败，程序终止")
            return
        
        # 使用新Token重试
        if WEEK_NUM:
            print(f"\n📅 使用新Token重新获取第{WEEK_NUM}周课表...")
        else:
            print(f"\n📅 使用新Token重新获取当前周课表...")
        
        success, data = get_schedule(token, WEEK_NUM)
        
        if not success:
            print("❌ 即使使用新Token仍然失败，程序终止")
            return
    
    # 步骤5: 保存课表数据
    if success and data:
        save_schedule(data)
        print("\n" + "=" * 70)
        print("✅ 课表爬取完成!")
        print("=" * 70)
    else:
        print("\n❌ 未能成功获取课表数据")

if __name__ == '__main__':
    main()
