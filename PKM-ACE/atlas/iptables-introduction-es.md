 Tutorial Introductorio a `iptables`

  iptables es una aplicación de línea de comandos que permite a un administrador del sistema configurar el firewall del kernel de Linux (Netfilter). Funciona
  inspeccionando los paquetes de red y decidiendo qué hacer con ellos basándose en un conjunto de reglas.

  Conceptos Fundamentales

  Para entender iptables, necesitas conocer tres conceptos clave: Tablas, Cadenas y Reglas.

   1. Tablas (Tables): Son contenedores de reglas para un propósito específico. La más común y la que usaremos aquí es la tabla filter.
       * filter: Es la tabla por defecto y se usa para decidir si un paquete debe ser permitido o no.
       * Otras tablas son nat (para reescribir direcciones) y mangle (para alterar paquetes).

   2. Cadenas (Chains): Son puntos de control dentro de una tabla donde se aplican las reglas. En la tabla filter, las tres cadenas principales son:
       * INPUT: Para paquetes que van destinados al propio sistema.
       * OUTPUT: Para paquetes generados por el propio sistema y que salen de él.
       * FORWARD: Para paquetes que atraviesan el sistema (es decir, el sistema actúa como un router).

   3. Reglas (Rules): Son las instrucciones que le dicen a iptables qué hacer. Una regla especifica un criterio (ej: "si el paquete es TCP y va al puerto 22") y una acción o
      "target".

   4. Acciones/Objetivos (Targets): La acción a tomar si un paquete coincide con una regla. Las más comunes son:
       * ACCEPT: Permitir el paso del paquete.
       * DROP: Descartar el paquete silenciosamente. El remitente no recibe ninguna respuesta.
       * REJECT: Rechazar el paquete y notificar al remitente con un error.

  ---

  Comandos Básicos de `iptables`

  ¡Advertencia! Al configurar iptables, especialmente en un servidor remoto, ten mucho cuidado. Una regla incorrecta podría bloquear tu propio acceso (por ejemplo, por
  SSH).

   1. Listar las reglas actuales:
      Este es el comando más seguro y útil para empezar. Muestra todas las reglas en la tabla filter.

   1     sudo iptables -L

      Para una vista más detallada, con números de paquete y en formato numérico (sin resolver nombres de host o puertos):

   1     sudo iptables -L -v -n

   2. Establecer la política por defecto (Default Policy):
      Una buena práctica de seguridad es bloquear todo por defecto y solo permitir lo que es explícitamente necesario.

   1     # Bloquea todo el tráfico entrante por defecto
   2     sudo iptables -P INPUT DROP
   3 
   4     # Bloquea todo el tráfico que atraviesa el sistema
   5     sudo iptables -P FORWARD DROP
   6 
   7     # (Opcional) Permite todo el tráfico saliente
   8     sudo iptables -P OUTPUT ACCEPT
      Si ejecutas sudo iptables -P INPUT DROP sin haber añadido antes una regla para permitir tu conexión SSH, ¡perderás el acceso!

   3. Añadir (Append) una regla:
      El flag -A añade una regla al final de una cadena.

   1     # Permite las conexiones SSH entrantes
   2     sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
       * -A INPUT: Añade la regla a la cadena INPUT.
       * -p tcp: Especifica que la regla es para el protocolo TCP.
       * --dport 22: Especifica el puerto de destino (destination port), en este caso, el 22 (SSH).
       * -j ACCEPT: La acción a tomar es ACCEPT (aceptar).

   4. Borrar (Flush) todas las reglas:
      Para empezar de cero, puedes borrar todas las reglas de una cadena o de todas.

   1     # Borra todas las reglas de la cadena INPUT
   2     sudo iptables -F INPUT
   3 
   4     # Borra TODAS las reglas en la tabla filter
   5     sudo iptables -F

   5. Borrar (Delete) una regla específica:
      Puedes borrar una regla especificándola exactamente como la creaste o por su número de línea.

   1     # Borrar por especificación
   2     sudo iptables -D INPUT -p tcp --dport 22 -j ACCEPT
   3 
   4     # Borrar por número de línea (primero lista las reglas con --line-numbers)
   5     sudo iptables -L --line-numbers
   6     sudo iptables -D INPUT 1  # Borra la regla número 1 de la cadena INPUT

  ---

  Ejemplo Práctico: Configurar un Firewall Básico para un Servidor Web

  Este es un conjunto de reglas común y seguro para un servidor web que solo necesita servir tráfico HTTP/HTTPS y permitir el acceso por SSH.

    1 #!/bin/bash
    2 
    3 # 1. Borrar todas las reglas existentes para empezar de cero
    4 sudo iptables -F
    5 sudo iptables -X # Borra cadenas personalizadas
    6 
    7 # 2. Establecer políticas por defecto: Bloquear todo lo que no esté permitido
    8 sudo iptables -P INPUT   DROP
    9 sudo iptables -P FORWARD DROP
   10 sudo iptables -P OUTPUT  ACCEPT # Permitimos el tráfico saliente
   11 
   12 # 3. Permitir tráfico de loopback (¡MUY IMPORTANTE!)
   13 # El sistema necesita comunicarse consigo mismo
   14 sudo iptables -A INPUT -i lo -j ACCEPT
   15 
   16 # 4. Permitir conexiones establecidas y relacionadas
   17 # Esta es la regla MÁS IMPORTANTE. Permite el tráfico de vuelta de las conexiones
   18 # que el propio servidor ha iniciado. Sin ella, nada funcionaría.
   19 sudo iptables -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
   20 
   21 # 5. Permitir servicios específicos
   22 # Permitir acceso SSH (puerto 22)
   23 sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
   24 
   25 # Permitir acceso HTTP (puerto 80)
   26 sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
   27 
   28 # Permitir acceso HTTPS (puerto 443)
   29 sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
   30 
   31 # Opcional: Limitar el acceso SSH a una IP específica para mayor seguridad
   32 # sudo iptables -A INPUT -p tcp -s TU_IP_AQUI --dport 22 -j ACCEPT

  ---

  Hacer las Reglas Permanentes (Persistencia)

  Las reglas de iptables se pierden cada vez que el sistema se reinicia. Para hacerlas permanentes, el método varía según la distribución de Linux:

   * En Debian/Ubuntu (Método recomendado):
      Usa el paquete iptables-persistent.

   1     sudo apt-get update
   2     sudo apt-get install iptables-persistent
      Durante la instalación, te preguntará si quieres guardar las reglas actuales de IPv4 e IPv6. Di que sí. Si cambias las reglas más tarde, ejecuta este comando para
  guardarlas:

   1     sudo netfilter-persistent save

   * En RHEL/CentOS/Fedora:
      Usa iptables-services.

   1     sudo dnf install iptables-services
   2     sudo systemctl enable iptables
   3     sudo service iptables save # Guarda las reglas actuales

  Este tutorial cubre los fundamentos. iptables es extremadamente potente y permite crear reglas muy complejas, pero con estos comandos ya puedes construir un firewall muy
   efectivo.
