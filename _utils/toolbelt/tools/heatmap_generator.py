import json
import yaml
from PIL import Image
import os
import customtkinter as ctk
from tools.tool import Tool
from tools.utils.ctk_utils import create_io_header

class HeatmapGenerator(Tool):
  def __create_ui__(self, mainframe):
    create_io_header(mainframe, "x", "x.json")