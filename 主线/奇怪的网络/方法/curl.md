# CURL使用方法

| 选项                | 说明                   | 示例                               |
| ------------------- | ---------------------- | ---------------------------------- |
| `-X METHOD`         | 指定 HTTP 方法         | `-X POST`                          |
| `-d "k=v"`          | 发送表单/JSON 正文     | `-d "name=tom&age=20"`             |
| `-H "h:v"`          | 添加请求头             | `-H "Authorization: Bearer TOKEN"` |
| `-L`                | 跟随 301/302 跳转      | `-L`                               |
| `-o file`           | 保存响应到文件         | `-o page.html`                     |
| `-O`                | 使用远程文件名保存     | `-O`                               |
| `-k`                | 忽略 HTTPS 证书校验    | `-k`                               |
| `-u user:pass`      | Basic 认证             | `-u admin:secret`                  |
| `-c jar`            | 保存 Cookie            | `-c cookie.txt`                    |
| `-b jar`            | 读取 Cookie            | `-b cookie.txt`                    |
| `-v`                | 详细模式（调试）       | `-v`                               |
| `-s`                | 静默模式（不输出进度） | `-s`                               |
| `-w "%{http_code}"` | 输出自定义信息         | `-o /dev/null -w "%{http_code}"`   |

# 1. 下载文件
curl -O https://example.com/file.zip

# 2. 带进度条续传
curl -C - -O https://example.com/big.iso

# 3. 上传文件（multipart）
curl -F "file=@photo.jpg" https://httpbin.org/post

# 4. 发 JSON
curl -X POST https://api.xxx.com/users \
     -H "Content-Type: application/json" \
     -d '{"name":"tom"}'

# 5. 带 Bearer Token
curl -H "Authorization: Bearer $TOK" https://api.github.com/user

# 6. 只拿状态码
curl -s -o /dev/null -w "%{http_code}" https://example.com

# 7. 跟随跳转并保存最终页面
curl -L -o result.html https://t.cn/AbCdEF

# 8. 调试请求与响应头
curl -v https://example.com 2>&1 | less

# 9. 限制超时
curl -m 5 https://slow-site.com          # 总超时 5 秒

# 10. 使用代理
curl -x http://127.0.0.1:8080 https://example.com