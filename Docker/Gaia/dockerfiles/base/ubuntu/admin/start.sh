#!/bin/bash
set -e
newUser(){
    useradd -rm -d /home/${USUARIO} -s /bin/bash ${USUARIO}
    echo "${USUARIO}:1234" | chpasswd
    echo "Bienvenido ${USUARIO} ... " > /home/${USUARIO}/bienvenida.txt
}

main(){
    newUser
    tail -f /dev/null
}

main