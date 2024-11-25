all:
	npm start

clean:
	fuser -k 3000/tcp

re:
	fuser -k 3000/tcp
	npm start
