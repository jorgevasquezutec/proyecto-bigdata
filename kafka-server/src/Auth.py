from lib import *
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
        cvideo = msg['first_video']
        svideo = msg['any_video']
        #16 FRAMES
        frameCvideo = BasicUtil.video2framesSR(cvideo)
        frameSvideo = BasicUtil.video2framesSR(svideo)
        face_lo = face_recognition.face_encodings(frameCvideo[0])[0]
        face_lo2 = face_recognition.face_encodings(frameSvideo[0])[0]

        matches = face_recognition.compare_faces([face_lo], face_lo2)
        return matches[0]
        
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
