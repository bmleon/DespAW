FROM ubuntu
RUN apt update && apt install -yq --no-install-recommends \
    apache2 \
    curl \
    nano \
    net-tools iputils-ping 

# Mantener vivo el contenedor 
# tail es un comando que nunca acaba su ejecución 
CMD [ "tail -f /dev/null" ]