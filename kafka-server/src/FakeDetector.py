
from lib import *

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
            # video ='6xfgIsjz2EAF4zij1TN6YSeLVjHa9AnH5Qo3URnfbvMGCZ2IgMpTd8qKHVWOozPN.webm'
            event = json.loads(msg.decode('utf-8'))
            any_video = event['any_video']
            print(any_video)
            model = torchvision.models.resnet18(pretrained=True)
            for e in model.parameters():
                e.requires_grad = False
            device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
            print(device)
            model.fc = nn.Linear(in_features=512, out_features=4, bias=True)
            model.load_state_dict(torch.load("../models/resnet18_5.pt"))
            model.to(device)
            frames = BasicUtil.video2frames(any_video)
            # print("frames",frames)
            # print(len(frames))
            dataset_x = []
            dataset_x = [*dataset_x, *frames]
            dataset_x = np.array(dataset_x)
            tensor_y_test = torch.as_tensor(np.array([0 for i in range(16)]))
            data_test: MyDataset = MyDataset(dataset_x, tensor_y_test)
            test_loader: DataLoader = DataLoader(dataset=data_test, shuffle=False)
            # print("test_loader", len(test_loader))
            res = []
            for images, _ in test_loader:
                images = images.to(device)
                outputs = model(images)
                _, predicted = torch.max(outputs.data, 1)
                res.append(np.array(predicted.cpu())[0])
            print(res)
            return st.mode(res).mode[0] == 0
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
                    self.produce('celery', value)
               
        except KeyboardInterrupt:
            print("interrupted error ")
            self.consumer.close()

capture = FakeDetector()
capture.consume('loginattempt')