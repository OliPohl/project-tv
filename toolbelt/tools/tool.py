import customtkinter as ctk


class Tool:
  def __init__(self, master):
    self.mainframe = ctk.CTkFrame(master)
    self.__class_init__()
    self.__create_ui__()

  def __create_ui__(self):
    pass

  def __class_init__(self):
    pass

  def show_mainframe(self):
    self.mainframe.pack(side='right', expand=True, fill='both')

  def hide_mainframe(self):
    self.mainframe.pack_forget()
  
  def close(self):
    pass