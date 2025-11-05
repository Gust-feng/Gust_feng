from tkinter import Tk, Label, Button, PhotoImage, Canvas
from tkinter.messagebox import showinfo
def win():
    win = Tk()
    win.title("任水覆舟")
    # 窗口
    win.geometry("800x600+100+200")
    win.minsize(400, 300)
    wenben=Label(win, text="任水覆舟" )
    image_names=PhotoImage(file="../其他/图片/示例.png")

    background=Label(win,fg='red',bg='yellow',text='背景色')
    anliu=Button(win, text="按钮",image=image_names, bd=5,command=lambda: showinfo(title="提示", message="这是一个按钮"),width=100,height=100, compound="top")

    background.pack()
    wenben.pack()
    anliu.pack()

    win.mainloop()
def canvas_win():
    canvas_win = Tk()
    cv=Canvas(canvas_win, width=800, height=600, bg='black')
    cv.pack()
    canvas_win.mainloop()
canvas_win()