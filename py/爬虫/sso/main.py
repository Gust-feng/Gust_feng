import html
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from dotenv import load_dotenv
import os
import ddddocr
import requests
import time

# 加载.env文件中的环境变量
load_dotenv()
user_value = os.getenv('user')
password_value = os.getenv('password')

if user_value is None or password_value is None:
    raise ValueError("环境变量未设置")

def wait(b):
    WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,b)))

pwd=Service(r'其他\chromedriver-win64\chromedriver.exe')
driver=webdriver.Chrome(service=pwd)
driver.maximize_window()

def denlu():
    driver.get('http://sso.hnsoftedu.com/login')
    wait('//*[@id="login-normal"]/div[2]/form')
    lujing=r"爬虫\sso\临时文件\yzm.jpg"
    # 重新获取验证码并保存识别，类似于‘换一张’
    cookies=driver.get_cookies()   
    tupian=requests.get('http://sso.hnsoftedu.com/api/captcha/generate/DEFAULT',cookies={i['name']:i['value'] for i in cookies}).content
    with open(lujing, 'wb') as f:
      f.write(tupian)

    ocr=ddddocr.DdddOcr()
    image=open(lujing,'rb').read()
    yzm_api=ocr.classification(image)
    # 登录界面
    user=driver.find_element(By.XPATH,'//*[@id="login-normal"]/div[2]/form/div[1]/nz-input-group/input')
    passward=driver.find_element(By.XPATH,'//*[@id="login-normal"]/div[2]/form/div[2]/nz-input-group/input')
    yzm=driver.find_element(By.XPATH,'//*[@id="login-normal"]/div[2]/form/app-verification/nz-input-group/input')
    clik=driver.find_element(By.XPATH,'//*[@id="login-normal"]/div[2]/form/div[6]/div/button')
    user.clear()
    user.send_keys(user_value)
    passward.send_keys(password_value)
    yzm.send_keys(str(yzm_api))
    clik.click()
    time.sleep(1)

denlu()




# 获取姓名
NAME_LIST='/html/body/app-root/app-index/section/main/section/app-web/section/div[1]/div/form/div[1]/nz-form-control/div/div'

# 等待NAME_LIST，最多重试3次
max_name_retries = 3
name_retry_count = 0
name = "未获取到姓名"

while name_retry_count < max_name_retries:
    try:
        wait(NAME_LIST)
        name = driver.find_element(By.XPATH, NAME_LIST).text
        print(f"成功获取姓名: {name}")
        break  # 成功获取到姓名，退出循环
    except:
        print(f"第 {name_retry_count + 1} 次未获取到姓名，执行denlu()重试")
        name_retry_count += 1
        if name_retry_count < max_name_retries:

            denlu()  # 执行登录重试
            time.sleep(2)  # 等待页面响应
        else:
            print("已达到最大重试次数，无法获取姓名")
            name = "未获取到姓名"

driver.get('http://my.hnsoftedu.com/home')
JW_LIST='//*[@id="root"]/div/div/div[2]/div[2]/div/div[1]/div[2]/div[2]/div/div[2]/div[1]/img'
wait(JW_LIST)
jw=driver.find_element(By.XPATH,JW_LIST).click()
time.sleep(5)
driver.get('http://jw.hnsoftedu.com/jsxsd/framework/xsMainV_new.jsp?t1=1')
kebiao='/html/body/div[1]/div[2]/div[1]/div/div[2]'
wait(kebiao)
time.sleep(2)
# 获取指定元素而不是整个页面
kebiao_element = driver.find_element(By.XPATH, kebiao)
kebiao_html = kebiao_element.get_attribute('outerHTML')
with open('课表.html','w',encoding='utf-8') as f:
    f.write(kebiao_html)

# 最小化课表数据提取 - 基于HTML结构特征
from bs4 import BeautifulSoup
import json, re

# 读取HTML
with open('课表.html','r',encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

# 1. 建立颜色到课程类型的映射
course_types = {}
for li in soup.find('div', class_='time-color').find_all('li'):
    color = re.search(r'background-color:\s*([^;]+)', str(li)).group(1).strip()
    course_types[color] = li.get_text(strip=True)

# 2. 提取当前周
current_week = re.search(r'li_showWeek.*?<span[^>]*>([^<]+)</span>', str(soup)).group(1) if re.search(r'li_showWeek.*?<span[^>]*>([^<]+)</span>', str(soup)) else "第7周"

# 3. 提取课程数据
courses = []
table = soup.find('table')
weekdays = [th.get_text(strip=True) for th in table.find('thead').find_all('th')[1:]]  # 跳过头列

for row in table.find('tbody').find_all('tr')[:-1]:  # 排除备注行
    cells = row.find_all('td')
    time_info = cells[0].get_text(strip=True).replace('\n', ' ')  # 时间信息
    
    for i, cell in enumerate(cells[1:]):  # 遍历星期列
        for span in cell.find_all('span', class_='box'):
            # 提取课程类型（基于背景颜色）
            color = re.search(r'background-color:\s*([^;]+)', span.get('style', '')).group(1).strip()
            course_type = course_types.get(color, '其它')
            
            # 提取基本信息
            p_tags = span.find_all('p')
            course_name = p_tags[0].get_text(strip=True) if p_tags else ''
            teacher = p_tags[1].get_text(strip=True).split('：')[-1] if len(p_tags) > 1 else ''  # 提取教师名
            
            # 提取详细信息（从item-box）
            item_box = span.find_next_sibling('div', class_='item-box')
            full_name = item_box.find('p').get_text(strip=True) if item_box else course_name
            
            # 提取学分、地点、周次（基于图片标识）
            credits, location, week_info = "未知", "", ""
            if item_box:
                for info_span in item_box.find_all('span'):
                    text = info_span.get_text(strip=True)
                    html = str(info_span)
                    
                    if '学分：' in text:
                        credits = text
                    elif 'item1.png' in html:
                        location = text
                    elif 'item3.png' in html:
                        week_info = text
            
            courses.append({
                '课程名称': full_name,
                '教师': teacher,
                '学分': credits,
                '时间': time_info,
                '星期': weekdays[i] if i < len(weekdays) else f'星期{i+1}',
                '地点': location,
                '周次': week_info,
                '课程类型': course_type,
                '当前周': current_week
            })

# 保存结果 - 改为CSV格式
import csv

# 定义CSV列名
csv_headers = ['课程名称', '教师', '学分', '时间', '星期', '地点', '周次', '课程类型', '当前周']

# 保存为CSV文件
with open('课表数据.csv','w',encoding='utf-8-sig',newline='') as f:  # utf-8-sig确保Excel正确显示中文
    writer = csv.DictWriter(f, fieldnames=csv_headers)
    writer.writeheader()
    writer.writerows(courses)

print(f'成功提取 {len(courses)} 条课程数据，已保存为CSV格式')
for course in courses:
    print(f"{course['课程名称']} | {course['教师']} | {course['时间']} | {course['星期']} | {course['地点']}")







    
'''
# 打开新界面
driver.get('http://my.hnsoftedu.com/home')
JW_LIST='//*[@id="root"]/div/div/div[2]/div[2]/div/div[1]/div[2]/div[2]/div/div[2]/div[1]/img'
wait(JW_LIST)
jw=driver.find_element(By.XPATH,JW_LIST).click()
time.sleep(8)
iframe=driver.find_element(By.XPATH,'//*[@id="Frame0"]')
wait(iframe)


print(f'成功登录，欢迎{name}')

'''


driver.quit()