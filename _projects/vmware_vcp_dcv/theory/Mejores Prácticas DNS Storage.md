# Lección de Arquitectura Senior: El Debate IP vs. FQDN en Almacenamiento

Esta es una de las preguntas que separan a un Administrador de Sistemas de un **Arquitecto de Soluciones**. En tu laboratorio has usado la IP `172.20.10.15`, y tu duda es totalmente válida: ¿Es esto una "ñapa" de laboratorio o es estándar de la industria?

---

## 1. La Regla de Oro: El Almacenamiento NO debe depender del DNS

En producción real, la **mejor práctica recomendada por VMware y los fabricantes de cabinas (Dell, HPE, Pure)** es utilizar **direcciones IP estáticas** para los Targets iSCSI.

### ¿Por qué evitar FQDN (Nombres)? El Problema del "Huevo y la Gallina"
Imagina este escenario de desastre en un centro de datos real:
1.  Hay un corte de energía total.
2.  Los servidores arrancan, pero las máquinas virtuales (VMs) todavía están apagadas.
3.  Tus servidores DNS (Active Directory, por ejemplo) son **máquinas virtuales** que residen en el almacenamiento iSCSI.
4.  El host ESXi intenta conectar al almacenamiento usando el nombre `cabina-storage.vclass.local`.
5.  El ESXi le pregunta al DNS: "¿Cuál es la IP de ese nombre?".
6.  **¡Fallo!** El DNS no responde porque está apagado dentro del disco que el ESXi todavía no puede leer.

**Resultado:** El almacenamiento nunca se monta y el centro de datos queda inoperable. Por eso, el almacenamiento es **Tier 0** (infraestructura base) y debe ser independiente de servicios de red superiores como el DNS.

---

## 2. ¿Qué ocurre si se cambia la IP de la cabina?

Cambiar la IP de una cabina de producción es una operación de "alto riesgo". Si cambias la IP sin avisar al ESXi:

1.  **APD (All Paths Down):** El adaptador `vmhba65` intentará reconectar a la IP vieja constantemente. En la interfaz de vSphere, verás que el Datastore se pone de color gris y las VMs se "congelan" porque no pueden escribir en disco.
2.  **Timeouts de Kernel:** El kernel de ESXi esperará unos segundos (por defecto 140s) antes de declarar el error. Si el cambio es permanente, las VMs darán un error de "I/O Error" y sus sistemas operativos (Windows/Linux) se pondrán en modo "Sólo lectura" o darán un "Pantallazo Azul".

**Procedimiento correcto para cambiar la IP (Change Management):**
*   Primero, añade la **nueva IP** en el *Dynamic Discovery* del ESXi (sin borrar la vieja).
*   Realiza el cambio de IP en la cabina física.
*   Haz un *Rescan* en el ESXi. Él encontrará los discos por el nuevo camino.
*   Una vez verificado, borras la IP vieja de la configuración del ESXi.

---

## 3. Justificación de Diseño y "Ojo Clínico"

*   **Aislamiento de Red (Air-Gap):** En producción real, la red de iSCSI suele ser una red física **totalmente separada** de la red de datos. A menudo, esa red ni siquiera tiene salida a Internet ni acceso a los servidores DNS corporativos por seguridad. Usar IPs es la única forma de que los hosts hablen con los discos en un entorno ultra-seguro.
*   **Determinismo:** En ingeniería, buscamos que las cosas sean predecibles. Una IP es determinista; un nombre DNS depende de la caché, del tiempo de respuesta del servidor DNS y de que el sufijo de dominio esté bien configurado. En almacenamiento, no queremos "probabilidades", queremos "certezas".

---

## 4. Conceptos Clave para Producción

1.  **Static IP Assignment:** Nunca, bajo ninguna circunstancia, se usa DHCP para una cabina de discos o para los puertos VMkernel de almacenamiento. Las IPs deben ser fijas y estar documentadas en el plano de red.
2.  **Storage Stack Dependency:** Entender que el orden de encendido importa. Cabina primero -> Switches de red después -> Hosts ESXi al final.
3.  **MPIO (Multipathing):** Si usas IPs, puedes configurar rutas específicas. Por ejemplo, decirle al host: "Para la IP .15 vete por el cable A, para la IP .16 vete por el cable B". Con nombres de DNS, esto es mucho más difícil de controlar con precisión.

---

## 5. Terminología Expandida para el Ingeniero Moderno

1.  **Storage Portal:** Es la combinación de IP y Puerto (por defecto 3260 para iSCSI) que el host usa para entrar a la cabina.
2.  **Discovery Session:** Es el proceso inicial donde el host le pregunta a la IP: "¿Qué tienes para mí?". Una vez que lo sabe, el host guarda esa información y ya no necesita repetir el descubrimiento en cada reinicio, a menos que fuerces un *Rescan*.
3.  **Out-of-band Management:** Es la IP de gestión de la cabina (la que usas para entrar a su web). Esta sí puede tener DNS, pero la IP de **tráfico de datos** (la que pusiste en el host) debe ser siempre IP pura.

**Conclusión del Arquitecto:** Lo que has hecho en el laboratorio (`172.20.10.15`) es **exactamente lo que harías en un entorno real de alta disponibilidad**. Estás siguiendo la mejor práctica de evitar dependencias circulares. 
