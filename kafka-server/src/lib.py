from confluent_kafka import Consumer, Producer
import json
import os
import socket
import torch.nn as nn
import numpy as np
import cv2

from dotenv import load_dotenv
from typing import Dict
import torch
import torchvision
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms
from scipy import stats as st


import numpy as np
import face_recognition
from PIL import Image, ImageDraw
from IPython.display import display
from BasicUtil import BasicUtil
from MyDataSet import MyDataset

targets: Dict[str, int] = {"1": 0, "2": 0, "3": 1, "4": 1, "5": 2, "6": 2, \
    "7": 3, "8": 3, "HR_1": 0, "HR_2": 1, "HR_3": 2, "HR_4": 3}

IMG_SIZE: int = 224
NUM_FRAMES_PER_VIDEO: int = 16
IMG_SIZE: int = 224

load_dotenv()