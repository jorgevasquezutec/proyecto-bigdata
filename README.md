# paso1: Levantar docker kafka


```python
docker-compose up -d
```


NOTA: si no tienes instalado nodemon ejecuta

```python
 npm i -g nodemon
```


# paso2:  levantar spoofing-kafka-server


## create env

```python
conda env create -f environment.yml
```

## activate env

```python
conda activate spoofing-kafka
```

## install dependencys

```python
make pip-tools
```


## ejecutar la configuracion incial

```python
  cd kafka-sever/src && jupyter nbconvert --execute --to notebook Admin.ipynb
```

## ejecutar Auth

```python
  cd kafka-sever/src && python Auth.py
```

## ejecutar 

```python
  cd kafka-sever/src && python Auth.py
```


# paso3: Levantar server

### instalar dependencias

```python
cd server && npm install

```

### levantar server

```python
cd server && nodemon index.js

```

# paso 4 : Levantar front


### instalar dependencias

```python
cd client && npm install

```

### levantar server

```python
cd client && npm run dev
```
