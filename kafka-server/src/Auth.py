from confluent_kafka import Consumer, Producer
import json
import socket
import os
import cv2
import numpy as np
import face_recognition
from dotenv import load_dotenv
load_dotenv()
from PIL import Image, ImageDraw
from IPython.display import display

IMG_SIZE: int = 224
NUM_FRAMES_PER_VIDEO: int = 16
IMG_SIZE: int = 224
URL = 'http://localhost:3001/videos/'

class Auth:
    def __init__(self):
        servers = os.getenv('BROKERS')
        self.confConsumer = {
            'bootstrap.servers': servers,
            'group.id': 'auth',
            'max.poll.interval.ms': '500000',
            'session.timeout.ms': '120000'
        }
        self.confProducer = {
            'bootstrap.servers': servers,
            'client.id': socket.gethostname()+'-auth',
            'request.timeout.ms': '120000'
        }
        self.producer = Producer(self.confProducer)

    def produce(self, topic, msg):
        self.producer.produce(topic, key=None, value=msg)
        self.producer.flush()

    def check(self, msg):
        event = json.loads(msg.decode('utf-8'))
        print(event)
        # user = msg['user']
        # any_video = msg['any_video']
        # first_video = msg['first_video']
        cvideo = msg['first_video']

        cap = cv2.VideoCapture(cvideo)
        

        frames: list = []
        is_there_frame: bool = True
        num_total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        resampling_rate: int = int(num_total_frames / NUM_FRAMES_PER_VIDEO)
        idf: int = 0

        while is_there_frame and len(frames) < NUM_FRAMES_PER_VIDEO:
            idf += 1
            is_there_frame, frame = cap.read()
            if idf % resampling_rate == 0:
                # grayscale
                # frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                # resize
                # frame = cv2.resize(frame, (height, width))
                frames.append(frame)

        face_lo = face_recognition.face_encodings(frames[0])[0]
        face_lo2 = face_recognition.face_encodings(frames[10])[0]

        matches = face_recognition.compare_faces([face_lo], face_lo2)

        # pil_image = Image.fromarray(frames[0])
        # pil_image1 = Image.fromarray(frames[1])
        # display(pil_image)
        # display(pil_image1)

        return matches
        

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
                if self.check(value):
                    self.produce('checked', value)
                else:
                    self.produce('celery', value)
               
        except KeyboardInterrupt:
            print("interrupted error ")
            self.consumer.close()


capture = Auth()
capture.consume('filtered')
