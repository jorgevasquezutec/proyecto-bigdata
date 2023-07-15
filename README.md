
# Soft real time anti spoofing


## Diagrama 
![alt text](proyecto.png)

## Arquitectura Kubernetes
![alt text](diagrama.jpeg)



[Dataset](https://www.dropbox.com/s/aaz282d9wyst0w8/CASIA_faceAntisp.rar

)


## Levantar Proyecto Docker

```python
docker-compose up -d --build
```

## Levantar Eks o minikube

```python
make kub-create-all
```

## Consideraciones de Instalacion previo Levantar Eks

[KEDA](https://keda.sh/)

[Ingress-Nginx Controller](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start)

[RedPanda](https://redpanda.com/)

