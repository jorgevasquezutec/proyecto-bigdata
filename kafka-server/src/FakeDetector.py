
from lib import *
from statistics import mode
import torch.optim as optim
from typing import List, Dict, Union

targets: Dict[str, int] = {"1": 0, "2": 0, "3": 1, "4": 1, "5": 2, "6": 2, \
    "7": 3, "8": 3, "HR_1": 0, "HR_2": 1, "HR_3": 2, "HR_4": 3}
types: List[str] = set(targets.values())

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
        try:
            # URL = 'http://localhost:3001/videos/'
            # video ='2a4l7Lts2071cNEcpGVg2SzzZuASWQFFC8jXZ8Z4WyIzTceg5aoXAkArwEk0MzqW.webm'
            event = json.loads(msg.decode('utf-8'))
            # any_video = 'response.webm'
            any_video = event['any_video']
            # any_video = '../datasets/test_release/1/3.avi'
            model = torchvision.models.resnet101(pretrained=True)
            for e in model.parameters():
                e.requires_grad = False
            device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
            model.fc = nn.Linear(in_features=2048, out_features=len(types), bias=True)
            optimizer = optim.SGD(model.parameters(), lr=1e-4, weight_decay=0.005, momentum=0.9)
            model.load_state_dict(torch.load("../models/resnet101.pt"))
            model.eval()
            model.to(device)
            frames = BasicUtil.video2frames(any_video)
            # print(frames)
            dataset_x = []
            dataset_x = [*dataset_x, *frames]
            dataset_x = np.array(dataset_x)
            tensor_y_test = torch.as_tensor(np.array([0 for i in range(16)]))
            data_test: MyDataset = MyDataset(dataset_x, tensor_y_test)
            test_loader: DataLoader = DataLoader(dataset=data_test, shuffle=False)
            res = []
            for images, _ in test_loader:
                images = images.to(device)
                outputs = model(images)
                _, predicted = torch.max(outputs.data, 1)
                res.append(np.array(predicted.cpu())[0])
            # return st.mode(res) == 0
            return mode(res)==0
            # print(st.mode(np.array(res)))
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
                if self.filtered(value):
                    self.produce('filtered', value)
                else:
                    obj = json.loads(value.decode('utf-8'))
                    payload = {
                        'user_id': obj['user_id'],
                        'first_video': obj['first_video'],
                        'any_video': obj['any_video'],
                        'any_video_key': obj['any_video_key'],
                        'sessionID': obj['sessionID'],
                        'file_path': obj['file_path'],
                        'error': "El video no es correcto"
                    }
                    # tmp['error'] = "El video no es correcto"
                    self.produce('celery', json.dumps(payload))
               
        except KeyboardInterrupt:
            print("interrupted error ")
            self.consumer.close()

capture = FakeDetector()
capture.consume('loginattempt')