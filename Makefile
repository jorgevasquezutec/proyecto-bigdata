
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