from lib import *


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