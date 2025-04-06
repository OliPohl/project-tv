import customtkinter as ctk
from screeninfo import get_monitors
from tools.tool import Tool
from tools.heatmap_generator import HeatmapGenerator
# Import new tools here

class App(ctk.CTk):
  def __init__(self):
    self.root = ctk.CTk()
    ctk.set_appearance_mode("dark")
    ctk.set_default_color_theme("dark-blue")
    self.root.title("Toolbelt")

    # Get the primary monitor dimensions and center the window with a ratio of 2/3
    for monitor in get_monitors():
      if monitor.is_primary:
        WINDOW_WIDTH = (monitor.width * (2 / 3)).__round__()
        WINDOW_HEIGHT = (monitor.height * (2 / 3)).__round__()
        POS_RIGHT = (monitor.width / 2 - WINDOW_WIDTH / 2).__round__()
        POS_DOWN = (monitor.height / 2 - WINDOW_HEIGHT / 2).__round__()
        self.root.geometry(f'{WINDOW_WIDTH}x{WINDOW_HEIGHT}+{POS_RIGHT}+{POS_DOWN}')
        self.scale = WINDOW_WIDTH / 1707
        break

    self.create_sidebar()
    self.root.mainloop()


  def create_sidebar(self):
    self.sidebar = ctk.CTkFrame(self.root)
    self.sidebar.configure(fg_color="gray10", bg_color="gray10")
    self.sidebar.pack(side='left', fill='y')

    self.sidebar_label = ctk.CTkLabel(self.sidebar, text="Toolbelt", font=("Arial", 22 * self.scale))
    self.sidebar_label.pack(padx=10*self.scale, pady=10*self.scale, ipady=5*self.scale, ipadx=10*self.scale)
    
    self.background_label = ctk.CTkLabel(self.root, text="No Tool Selected", font=("Arial", 22 * self.scale))
    self.background_label.pack(side='right', expand=True, fill='both')

    self.sidebar_entries = {}
    self.create_sidebar_entry("Heatmap Generator", HeatmapGenerator)
    # Add new tools here



  def create_sidebar_entry(self, label, item: Tool):
    button = ctk.CTkButton(self.sidebar, text=label, font=("Arial", 20*self.scale))
    button.configure(fg_color="DodgerBlue4", bg_color="DodgerBlue4")
    button.pack(fill='x', ipady=10*self.scale, pady=1)

    tool = item(self.root)
    self.sidebar_entries[label] = {
      "button": button,
      "label": label,
      "tool": tool,
    }

    def on_button_click():
      for entry in self.sidebar_entries.values():
        entry["tool"].hide_mainframe()
        entry["button"].configure(fg_color="DodgerBlue4", bg_color="DodgerBlue4")
      button.configure(fg_color="green", bg_color="green")
      tool.show_mainframe()
      self.background_label.pack_forget()

    button.configure(command=lambda: on_button_click())


if __name__ == "__main__":
  App()