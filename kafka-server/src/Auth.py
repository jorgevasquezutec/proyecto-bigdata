from confluent_kafka import Consumer, Producer
import json
import socket
import os
from dotenv import load_dotenv
load_dotenv()

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
        return True
        

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
