from re import X
from xml.etree.ElementPath import xpath_tokenizer
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import time
import os
from dotenv import load_dotenv

# 加载.env文件中的环境变量
load_dotenv()

service = Service(r'其他\chromedriver-win64\chromedriver-win64\chromedriver.exe')
driver = webdriver.Chrome(service=service)

driver.maximize_window()
driver.get("http://222.243.161.213:81/hnrjzyxysjd/#/login")
time.sleep(2)
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
driver.quit()