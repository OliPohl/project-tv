from tkinter import filedialog
import customtkinter as ctk

def create_io_header(master: ctk.CTkFrame, default_output_dir_path : str, default_input_file_path, show_dowload_json : bool = False, dowload_path : str = None):
  scale = get_ctk_scale()
  
  frame = ctk.CTkFrame(master, fg_color="transparent", bg_color="transparent")
  frame.pack(fill="x")
  
  def _create_io_frame(isOutput : bool):
    io_frame = ctk.CTkFrame(frame, fg_color="gray15")
    io_heading = ctk.CTkLabel(io_frame, text="Output Directory" if isOutput  else "Input File", font=("Arial", 18*scale))
    io_item_frame = ctk.CTkFrame(io_frame, fg_color="transparent", bg_color="transparent")
    io_button = ctk.CTkButton(io_item_frame, text="Change", font=("Arial", 16*scale))
    io_path = ctk.CTkLabel(io_item_frame, fg_color="gray20", text=default_output_dir_path if isOutput else default_input_file_path, font=("Arial", 16*scale))
    
    def _on_io_button():
      path = ""
      if isOutput:
        path = filedialog.askdirectory()
      else:
        path = filedialog.askopenfile(filetypes="json")
      io_path.configure(text=path)
    
    io_button.configure(command=lambda: _on_io_button)
    
    io_frame.pack(padx=20*scale, pady=10*scale, expand=True, fill="x")
    io_heading.pack(side="top", padx=10*scale, pady=10*scale)
    io_item_frame.pack(side="bottom", padx=10*scale, pady=(0,15*scale), expand=True, fill="x")
    io_button.pack(side="left", padx=(10*scale, 0), pady=5*scale)
    io_path.pack(side="right", padx=10*scale, pady=5*scale, fill="x", expand=True)
    #TODO: make io frames in one row
    #TODO: link button to the button function and save the path in a config file made by another util class (also creates default config)
    #TODO: create download button that links to the geo webpage and gitignore the default folder
    
  
  _create_io_frame(True)
  _create_io_frame(False)



def get_ctk_scale():
  from screeninfo import get_monitors
  for monitor in get_monitors():
    if monitor.is_primary:
      default_window_width = (monitor.width * (2/3)).__round__()
      return default_window_width / 1707