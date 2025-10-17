from re import X
from xml.etree.ElementPath import xpath_tokenizer
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
from dotenv import load_dotenv
def wait(b):
    WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,b)))

# 加载.env文件中的环境变量
load_dotenv()

service = Service(r'其他\chromedriver-win64\chromedriver.exe')
driver = webdriver.Chrome(service=service)

driver.maximize_window()
driver.get("http://222.243.161.213:81/hnrjzyxysjd/#/login")
wait('//*[@id="app"]/div/form/div[1]/div/input')
user=driver.find_element(By.XPATH, '//*[@id="app"]/div/form/div[1]/div/input')
password=driver.find_element(By.XPATH,'//*[@id="app"]/div/form/div[2]/div/input')
click=driver.find_element(By.XPATH,'//*[@id="app"]/div/div[2]/button')
user_value = os.getenv('user')
password_value = os.getenv('password')
if user_value is None or password_value is None:
    raise ValueError("环境变量未设置")
user.send_keys(user_value)
password.send_keys(password_value)
click.click()
time.sleep(1)
kebiao=driver.find_element(By.XPATH,'//*[@id="app"]/div/div[2]/div[1]')
kebiao.click()
time.sleep(2)

html=driver.page_source
with open('其他/文件/课表.html','w',encoding='utf-8') as f:
    f.write(html)#并未进行正则匹配

# 超简数据提取
from bs4 import BeautifulSoup
import csv

with open('其他/文件/课表.html','r',encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

courses = []
for day in soup.select('.course-form'):
    day_map = {'Sunday':'周日','monday':'周一','Tuesday':'周二','Wednesday':'周三','Thursday':'周四','Friday':'周五','Saturday':'周六'}
    day_name = day_map.get(day.get('id',''),'')
    
    for course in day.select('.van-swipe-item'):
        text = course.text.strip()
        if '-' in text and '@' in text:
            name, rest = text.split('-',1)
            teacher = rest.split('@')[0] if '@' in rest else rest.split('-')[0]
            location = rest.split('@')[1].rstrip('-') if '@' in rest else ''
            courses.append([day_name, name, teacher, location])

with open('其他/文件/移动教务课表.csv','w',encoding='utf-8-sig',newline='') as f:
    csv.writer(f).writerow(['星期','课程名称','教师','地点'])
    csv.writer(f).writerows(courses)

print(f'提取了{courses.__len__()}条课程')

driver.quit()