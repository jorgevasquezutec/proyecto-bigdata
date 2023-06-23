
import cv2
from typing import Union
import numpy as np

IMG_SIZE: int = 224
NUM_FRAMES_PER_VIDEO: int = 16


class BasicUtil:
    def __init__(self):
        pass
    @staticmethod
    def video2frames(video_path: str, resize: Union[int, int] = (IMG_SIZE, IMG_SIZE)) -> np.array:
        print("init video2frames")
        cap = cv2.VideoCapture(video_path)
        frames: list = []
        is_there_frame: bool = True
        num_total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        print("num_total_frames", num_total_frames)
        resampling_rate: int = int(num_total_frames / NUM_FRAMES_PER_VIDEO)
        idf: int = 0
        while is_there_frame and len(frames) < NUM_FRAMES_PER_VIDEO:
            idf += 1
            is_there_frame, frame = cap.read()
            if frame is None: 
                return np.array([])
            if idf % resampling_rate == 0:
                # grayscale
                # frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                # resize
                frame = cv2.resize(frame, resize)
                frames.append(frame)
        #assert len(frames)==NUM_FRAMES_PER_VIDEO
        print("cantidad frames: ", len(frames))
        return np.array(frames)

    @staticmethod
    def video2framesSR(video_path: str, resize: Union[int, int] = (IMG_SIZE, IMG_SIZE)) -> np.array:
        # print("video2frames2")
        cap = cv2.VideoCapture(video_path)
        frames: list = []
        is_there_frame: bool = True
        num_total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        resampling_rate: int = int(num_total_frames / NUM_FRAMES_PER_VIDEO)
        idf: int = 0
        # print(len(frames))
        while is_there_frame and len(frames) < NUM_FRAMES_PER_VIDEO:
            idf += 1
            is_there_frame, frame = cap.read()
            if frame is None: 
                return np.array([])
            if idf % resampling_rate == 0:
                # grayscale
                # frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                # resize
                # frame = cv2.resize(frame, resize)
                frames.append(frame)
        #assert len(frames)==NUM_FRAMES_PER_VIDEO
        print("video2frames: ", len(frames))
        return np.array(frames)