<<<<<<< HEAD
# partimos de una imagen base de ubuntu
FROM ubuntu
RUN apt update && apt install -yq --no-install-recommends \
    apache2 \
    curl \
    nano \
    net-tools iputils-ping 
RUN useradd -rm -d /home/belen -s /bin/bash belen
# para crear el password usamos el comando chpasswd
RUN echo "belen:belen" | chpasswd

#Establece el directorio de trabajo dentro del contenedor Apache
WORKDIR /var/www/html
#Copiamos el contenido del directorio src (relativo al contenedor)
COPY ./src .
# activamos el puerto 80 de apache
EXPOSE 80
# ejecutamos apache en primer plano cuando se inicie el contenedor
=======
# partimos de una imagen base de ubuntu
FROM ubuntu
RUN apt update && apt install -yq --no-install-recommends \
    apache2 \
    curl \
    nano \
    net-tools iputils-ping 
RUN useradd -rm -d /home/belen -s /bin/bash belen
# para crear el password usamos el comando chpasswd
RUN echo "belen:belen" | chpasswd

#Establece el directorio de trabajo dentro del contenedor Apache
WORKDIR /var/www/html
#Copiamos el contenido del directorio src (relativo al contenedor)
COPY ./src .
# activamos el puerto 80 de apache
EXPOSE 80
# ejecutamos apache en primer plano cuando se inicie el contenedor
>>>>>>> 4953099e06c4f02a39e5fad7eae5be0ce9bd0b52
CMD apachectl -DFOREGROUND