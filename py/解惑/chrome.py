from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By  
import time

drive = webdriver.Chrome(service=Service(r'..\其他\chromedriver-win64\chromedriver-win64\chromedriver.exe'))

drive.maximize_window()
drive.get("http://192.168.31.163:8080/")
html=drive.page_source
time.sleep(4)
with open('../其他/文件/Gust-feng.txt','w',encoding='utf-8') as f:
    f.write(html)

username=drive.find_element(by=By.ID,value='username') 
password=drive.find_element(by=By.ID,value='password')

# 输入数据
username.send_keys('admin')
password.send_keys('gustfeng')

# 提交数据的几种方法：

# 方法1：查找提交按钮并点击
submit_btn=drive.find_element(by=By.CLASS_NAME,value='login-btn')  # 修正类名
submit_btn.click()

# 方法2：如果按钮是type="submit"的input标签
# submit_btn=drive.find_element(by=By.XPATH,value='//input[@type="submit"]')
# submit_btn.click()

# 方法3：直接在密码框按回车键提交
# from selenium.webdriver.common.keys import Keys
# password.send_keys(Keys.ENTER)

# 方法4：通过表单提交
# form=drive.find_element(by=By.TAG_NAME,value='form')
# form.submit()

time.sleep(3)  # 等待提交完成
drive.quit()  # 关闭浏览器