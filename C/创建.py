import os

def generate_c_files():
    # 获取当前目录下的所有文件
    current_dir = os.getcwd()
    files = [f for f in os.listdir(current_dir) if f.endswith('.c')]

    # 提取现有文件的编号
    existing_numbers = []
    for file in files:
        try:
            major, minor = map(int, file.split('.')[:2])
            existing_numbers.append((major, minor))
        except (IndexError, ValueError):
            continue

    # 确定新文件的起始编号
    if existing_numbers:
        existing_numbers.sort()
        last_major, last_minor = existing_numbers[-1]
        if last_minor == 9:
            start_major = last_major + 1
            start_minor = 0
        else:
            start_major = last_major
            start_minor = last_minor + 1
    else:
        start_major, start_minor = 1, 0

    # 生成 10 个新的 .c 文件
    for i in range(10):
        major = start_major + (start_minor + i) // 10
        minor = (start_minor + i) % 10
        new_file_name = f"{major}.{minor}.c"
        with open(new_file_name, 'w') as f:
            f.write("")
        print(f"Created: {new_file_name}")

if __name__ == "__main__":
    generate_c_files()