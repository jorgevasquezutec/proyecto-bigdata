
push-hub-front:
	cd client && docker build -t jorgevasquezutec/cloud-front:latest .
	docker push jorgevasquezutec/cloud-front:latest

push-hub-server:
	cd server && docker build -t jorgevasquezutec/cloud-server:latest .
	docker push jorgevasquezutec/cloud-server:latest

push-hub-spoofing:
	cd face-spoofing && docker build -t jorgevasquezutec/cloud-spoofing:latest .
	docker push jorgevasquezutec/cloud-spoofing:latest

push-hub-detector:
	cd face-detector && docker build -t jorgevasquezutec/cloud-detector:latest .
	docker push jorgevasquezutec/cloud-detector:latest


kub-redpanda:
	kubectl create -f kubernetes/redpanda.yaml

kub-delete-redpanda:
	kubectl delete -f kubernetes/redpanda.yaml

kub-delete-all:
	kubectl delete -f kubernetes/face-spoofing.yaml
	kubectl delete -f kubernetes/face-detector.yaml
	kubectl delete -f kubernetes/cloud-server.yaml
	kubectl delete -f kubernetes/cloud-front.yaml

kub-create-all:
	kubectl create -f kubernetes/cloud-server.yaml
	kubectl create -f kubernetes/cloud-front.yaml
	kubectl create -f kubernetes/face-spoofing.yaml
	kubectl create -f kubernetes/face-detector.yaml

kub-keda:
	kubectl create -f kubernetes/keda.yaml

kub-delete-keda:
	kubectl delete -f kubernetes/keda.yaml