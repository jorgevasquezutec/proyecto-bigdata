from confluent_kafka import Consumer, Producer
import json
import os
import socket
from dotenv import load_dotenv
load_dotenv()


class FakeDetector:
    def __init__(self):
        servers = os.getenv('BROKERS')
        self.confConsumer = {
            'bootstrap.servers': servers,
            'group.id': 'fake-detector',
            'max.poll.interval.ms': '500000',
            'session.timeout.ms': '120000',
            'request.timeout.ms': '120000'
        }
        self.confProducer = {
            'bootstrap.servers': servers,
            'client.id': socket.gethostname()+'-fake-detector',
        }
        self.producer = Producer(self.confProducer)

    def produce(self, topic, msg):
        self.producer.produce(topic, key=None, value=msg)
        self.producer.flush()

    def filtered(self, msg):
        event = json.loads(msg.decode('utf-8'))
        print(event)
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
                if self.filtered(value):
                    self.produce('filtered', value)
                else:
                    self.produce('celery', value)
               
        except KeyboardInterrupt:
            print("interrupted error ")
            self.consumer.close()

capture = FakeDetector()
capture.consume('loginattempt')
