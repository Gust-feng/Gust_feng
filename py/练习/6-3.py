#Python字典可用于模拟现实生活中的字典，但为避免混淆，我们将后者称为词汇表。·想出你在前面学过的5个编程词汇，将它们用作词汇表中的键，并将它们的含义作为值存储在词汇表中。·以整洁的方式打印每个词汇及其含义。为此，你可以先打印词汇，在它后面加上一个冒号，再打印词汇的含义；也可在一行打印词汇，再使用换行符(\n)插入一个空行，然后在下一行以缩进的方式打印词汇的含义。
#这个需求并不复杂，所以 不写了。
#我本来是不想写的，但是6-4.py需要使用本文件。
list_name={
    'list':'列表',
    'sort':'排序',
    'print':'打印',
    'input':'输入',
    'append':'添加'
}
#我并不明白文件要求的，因为我认为又更优解
for i,k in list_name.items():
    print(f'这是py中的一些词汇，或许很简单，但也基础如\n{i}的作用是{k}\n')