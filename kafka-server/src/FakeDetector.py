from confluent_kafka import Consumer, Producer
import json
import os
import socket
import torchvision
import torch.nn as nn
import torch
import numpy as np
import cv2
from dotenv import load_dotenv
from typing import List, Dict, Union
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms
from PIL import Image

IMG_SIZE: int = 224
NUM_FRAMES_PER_VIDEO: int = 16
targets: Dict[str, int] = {"1": 0, "2": 0, "3": 1, "4": 1, "5": 2, "6": 2, \
    "7": 3, "8": 3, "HR_1": 0, "HR_2": 1, "HR_3": 2, "HR_4": 3}

load_dotenv()

class MyDataset(Dataset):
    def __init__(self, list_IDs, labels):
        self.list_IDs = list_IDs
        self.labels = labels

    def __len__(self):
        return len(self.list_IDs)

    def __getitem__(self, index):
        # Select sample
        ID = self.list_IDs[index]

        # Load data and get label
        preprocess = transforms.Compose([
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        X = preprocess(Image.fromarray(ID))
        y = self.labels[index]
        return X, y

def video2frames(video_path: str, resize: Union[int, int] = (IMG_SIZE, IMG_SIZE)) -> np.array:
    cap = cv2.VideoCapture(video_path)
    frames: list = []
    is_there_frame: bool = True
    num_total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
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
    assert len(frames)==NUM_FRAMES_PER_VIDEO
    return np.array(frames)

class FakeDetector:
    def __init__(self):
        servers = os.getenv('BROKERS')
        self.confConsumer = {
            'bootstrap.servers': servers,
            'group.id': 'fake-detector',
            'max.poll.interval.ms': '500000',
            'session.timeout.ms': '120000',
        }
        self.confProducer = {
            'bootstrap.servers': servers,
            'client.id': socket.gethostname()+'-fake-detector',
            'request.timeout.ms': '120000'
        }
        self.producer = Producer(self.confProducer)

    def produce(self, topic, msg):
        self.producer.produce(topic, key=None, value=msg)
        self.producer.flush()

    def filtered(self, msg):
        event = json.loads(msg.decode('utf-8'))
        any_video = event['any_video']
        model = torchvision.models.resnet18(pretrained=True)
        for e in model.parameters():
            e.requires_grad = False
        device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
        model.fc = nn.Linear(in_features=512, out_features=4, bias=True)
        model.load_state_dict(torch.load("../models/resnet18_5.pt"))
        model.to(device)
        frames = video2frames(any_video)
        dataset_x = [*dataset_x, *frames]
        dataset_x = np.array(dataset_x)
        vector_path: List[str] = f.split("\\")
        tmp = [targets[vector_path[-1][:-4]]]*NUM_FRAMES_PER_VIDEO
        dataset_y = [*dataset_y, *tmp]
        tensor_y_test = torch.as_tensor(dataset_y)
        data_test: MyDataset = MyDataset(dataset_x, tensor_y_test)
        test_loader: DataLoader = DataLoader(dataset=data_test, shuffle=False)
        print(len(test_loader))
        for images, labels in test_loader:
            images = images.to(device)
            labels = labels.to(device)
            outputs = model(images)
            _, predicted = torch.max(outputs.data, 1)
        # outputs = model(video2frames(any_video))
        # _, predicted = torch.max(outputs.data, 1)
        return predicted == 0

    def consume(self, topic):
        self.consumer = Consumer(self.confConsumer)
        self.topic = topic
        self.consumer.subscribe([self.topic])

        try:
            while True:
                msg = self.consumer.poll(1.0)
                if msg is None:
                    continue
                value = msg.value()
                if msg.error():
                    print("Consumer error: {}".format(msg.error()))
                    self.produce('celery', value)
                    continue
                if self.filtered(value):
                    self.produce('filtered', value)
                else:
                    self.produce('celery', value)
               
        except KeyboardInterrupt:
            print("interrupted error ")
            self.consumer.close()

capture = FakeDetector()
capture.consume('loginattempt')