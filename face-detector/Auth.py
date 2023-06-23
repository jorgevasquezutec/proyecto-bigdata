
import os
import socket
from confluent_kafka import Consumer, Producer
import json
import BasicUtil
import face_recognition

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
        try :
            event = json.loads(msg.decode('utf-8'))
            print(event)
            cvideo = event['first_video']
            svideo = event['any_video']
            # 16 FRAMES
            frameCvideo = BasicUtil.video2framesSR(cvideo)
            frameSvideo = BasicUtil.video2framesSR(svideo)
            face_lo = face_recognition.face_encodings(frameCvideo[0])[0]
            face_lo2 = face_recognition.face_encodings(frameSvideo[0])[0]

            matches = face_recognition.compare_faces([face_lo], face_lo2)
            return matches[0]
            # return True
        except Exception as e:
            print(e)
            return False

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
                    obj = json.loads(value.decode('utf-8'))
                    payload = {
                        'user_id': obj['user_id'],
                        'first_video': obj['first_video'],
                        'any_video': obj['any_video'],
                        'any_video_key': obj['any_video_key'],
                        'sessionID': obj['sessionID'],
                        'file_path': obj['file_path'],
                        "error" : "No es la misma persona"
                    }
                    self.produce('celery', json.dumps(payload))
               
        except KeyboardInterrupt:
            print("interrupted error ")
            self.consumer.close()


capture = Auth()
capture.consume('filtered')
