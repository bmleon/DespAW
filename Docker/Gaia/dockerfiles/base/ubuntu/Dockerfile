FROM ubuntu 
ARG USUARIO
ENV USUARIO=${USUARIO}}
RUN apt update && apt install -yq --no-install-recommends \
     apache2 \
     curl \
     nano \
     net-tools iputils-ping

# delegar la responsabilidad de la configuracion de las imagenes (no se hace en el DFile)
# a los scripts llamados Entrypoints (script de inicio para un contenedor)
# mantener vivo el contenedor. 
# tail es un comando que nunca acaba su ejecucion

#CMD [ "tail", "-f", "/dev/null" ]
#Copiar los etrypoint (admin) dentro del contenedor en /root/admin /bin/admin
RUN mkdir -p /root/base/ubuntu/admin
#directorio actual dentro del contnedor
WORKDIR /root/base/ubuntu/admin
# 1 . --> es referente al contexto en docker compose
# 2 . --> es refernte al WORKDIR dentro del contenedor
COPY ./dockerfiles/base/ubuntu/admin .
RUN chmod o+x ./start.sh

#script de arraque para crear la iso y ejecutar el contenedor
ENTRYPOINT [ "./start.sh" ]