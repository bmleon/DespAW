# Partimos de una imagen base de ubuntu
FROM ubuntu 

# Evitar prompts interactivos durante la instalación
ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -yq --no-install-recommends \
     apache2 \
     curl \
     nano \
     net-tools iputils-ping \
     && apt clean && rm -rf /var/lib/apt/lists/*

RUN useradd -rm -d /home/belen -s /bin/bash belen
RUN echo "belen:belen" | chpasswd

# Establece el directorio de trabajo
WORKDIR /var/www/html

# Al construir desde 'mi_Portfolio', la carpeta 'src' está al alcance directo
COPY src/ .

# Activamos el puerto 80
EXPOSE 80

# Ejecutamos apache en primer plano
CMD ["apachectl", "-D", "FOREGROUND"]