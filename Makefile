
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
	kubectl apply -f kubernetes/redpanda.yaml

kub-delete-redpanda:
	kubectl delete -f kubernetes/redpanda.yaml

kub-delete-all:
	kubectl delete -f kubernetes/redpanda.yaml
	kubectl delete -f kubernetes/face-spoofing.yaml
	kubectl delete -f kubernetes/face-detector.yaml
	kubectl delete -f kubernetes/cloud-server.yaml
	kubectl delete -f kubernetes/cloud-front.yaml
	kubectl delete -f kubernetes/ingress-service.yaml 
	

kub-create-all:
	kubectl apply -f kubernetes/redpanda.yaml
	kubectl apply -f kubernetes/cloud-server.yaml
	kubectl apply -f kubernetes/cloud-front.yaml
	kubectl apply -f kubernetes/face-spoofing.yaml
	kubectl apply -f kubernetes/face-detector.yaml
	kubectl apply -f kubernetes/ingress-service.yaml 


kub-create-fb:
	kubectl apply -f kubernetes/cloud-server.yaml
	kubectl apply -f kubernetes/cloud-front.yaml
	kubectl apply -f kubernetes/ingress-service.yaml

kub-del-fb:
	kubectl delete -f kubernetes/cloud-server.yaml
	kubectl delete -f kubernetes/cloud-front.yaml
	kubectl delete -f kubernetes/ingress-service.yaml

kub-keda:
	kubectl apply -f kubernetes/keda.yaml

kub-delete-keda:
	kubectl delete -f kubernetes/keda.yaml