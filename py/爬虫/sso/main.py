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

pwd=Service(r'其他\chromedriver-win64\chromedriver-win64\chromedriver.exe')
driver=webdriver.Chrome(service=pwd)
driver.maximize_window()
driver.get('http://sso.hnsoftedu.com/login')
wait('//*[@id="login-normal"]/div[2]/form')

cookies=driver.get_cookies()


with open('cookies.txt','w') as f:
    f.write(str(cookies))

lujing=r"爬虫\sso\临时文件\yzm.jpg"
# 重新获取验证码并保存识别，类似于‘换一张’
tupian=requests.get('http://sso.hnsoftedu.com/api/captcha/generate/DEFAULT',cookies={i['name']:i['value'] for i in cookies}).content
with open(lujing, 'wb') as f:
    f.write(tupian)

ocr=ddddocr.DdddOcr()
image=open(lujing,'rb').read()
yzm_api=ocr.classification(image)

user=driver.find_element(By.XPATH,'//*[@id="login-normal"]/div[2]/form/div[1]/nz-input-group/input')
passward=driver.find_element(By.XPATH,'//*[@id="login-normal"]/div[2]/form/div[2]/nz-input-group/input')
yzm=driver.find_element(By.XPATH,'//*[@id="login-normal"]/div[2]/form/app-verification/nz-input-group/input')
clik=driver.find_element(By.XPATH,'//*[@id="login-normal"]/div[2]/form/div[6]/div/button')
user.send_keys(user_value)
passward.send_keys(password_value)
yzm.send_keys(str(yzm_api))
clik.click()
NAME_LIST='/html/body/app-root/app-index/section/main/section/app-web/section/div[1]/div/form/div[1]/nz-form-control/div/div'
wait(NAME_LIST)
name=driver.find_element(By.XPATH,NAME_LIST).text
driver.get('http://my.hnsoftedu.com/home')
JW_LIST='//*[@id="root"]/div/div/div[2]/div[2]/div/div[1]/div[2]/div[2]/div/div[2]/div[1]/img'
wait(JW_LIST)
jw=driver.find_element(By.XPATH,JW_LIST).click()
kebiao='/html/body/div[1]/div[2]/div[1]'
wait(kebiao)
print(f'欢迎你，{name}同学！')
# 成功登录并导航到课表界面
time.sleep(10)#后续保存为html文件，并使用正则表达式提取信息