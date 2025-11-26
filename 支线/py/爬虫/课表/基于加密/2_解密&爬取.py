import requests
import json
import os
from datetime import datetime

url = 'http://222.243.161.213:81/hnrjzyxyhd/student/curriculum'

tokens='eyJhbGciOiJIUzUxMiJ9.eyJhdWQiOiIyMDI0MDE2MzAxMjEiLCJleHAiOjE3NjE3MjM0ODI5MDcsImlhdCI6MTc2MTcwOTA4MjkwN30.HQe7Y3Wf5Rh5Bd8VuXZyjqWk32Rumi-8PDXpZNdGmJQPRBl1uDhJfiLC4tLBC-WwZPLlbGFTdAbLf5Uxuf_PQQ'
zc=10

params = {
    'week': str(zc),  # 使用变量 zc 作为请求的周次
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
    'token': tokens
}

response = requests.post(url, params=params, headers=headers)

print('状态码:', response.status_code)
print('响应内容:')
data = response.json()
print(data)

# 保存课表数据
if data.get('code') == '1' and data.get('data'):
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
else:
    print('❌ 获取课表数据失败!')
