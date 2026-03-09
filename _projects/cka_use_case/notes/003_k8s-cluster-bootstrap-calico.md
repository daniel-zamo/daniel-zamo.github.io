# Inicialización y Configuración del Clúster v1.35 con Calico CNI

Este reporte detalla los comandos para configurar el nodo **Master** y la unión de los nodos **Worker**, utilizando **Calico** como solución de red para habilitar el cumplimiento de políticas de seguridad.

## 1. Configuración del Nodo Master (master-01)

### A. Inicialización del Plano de Control
Para Calico, utilizaremos el rango de red de Pods recomendado por el fabricante.

```bash
# Inicializamos el clúster con el CIDR estándar de Calico
sudo kubeadm init --pod-network-cidr=192.168.0.0/16 --node-name master-01
```

### B. Configuración de Acceso para el Usuario (kubeconfig)
Indispensable para que el usuario `candidate` administre el clúster sin usar `sudo`.

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### C. Instalación del CNI Calico (Método Operador)
A diferencia de Flannel, Calico se instala en dos pasos para permitir una gestión avanzada vía el operador de Tigera.

```bash
# 1. Instalar el Tigera Operator
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.3/manifests/tigera-operator.yaml

# 2. Instalar los recursos personalizados (Configuración de red)
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.3/manifests/custom-resources.yaml
```

> **Ref. Oficial:** [Kubeadm: Create Cluster](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)  
> **Ref. Oficial:** [Calico Quickstart](https://docs.tigera.io/calico/latest/getting-started/kubernetes/quickstart)

## 2. Configuración de los Nodos Worker (worker-01, worker-02)

### A. Comando de Unión (Join)
Copia el comando generado al final del `kubeadm init` y ejecútalo en cada worker. Si el token expiró, puedes generar uno nuevo con `kubeadm token create --print-join-command`.

```bash
sudo kubeadm join 172.17.17.10:6443 --token <token_id> \
    --discovery-token-ca-cert-hash sha256:<hash_cert_ca>
```

## 3. Verificación del Clúster

### A. Estado de los Nodos
```bash
# Los nodos tardarán ~60s en pasar a Ready mientras se descargan las imágenes de Calico
kubectl get nodes -o wide
```

### B. Estado de los Pods de Red
```bash
# Verificar que el sistema de red está operando
kubectl get pods -n calico-system
```

---
<!--
### **Diferencias clave respecto a tu estándar anterior:**

1.  **Cambio de CIDR:** Hemos pasado de `10.244.0.0/16` (Flannel) a `192.168.0.0/16` (Calico). Esto evita tener que editar manualmente los archivos YAML de Calico.
2.  **Instalación en dos fases:** Calico utiliza un "Operador". El primer archivo levanta el proceso que gestiona la red, y el segundo archivo (`custom-resources`) define la red en sí.
3.  **Preparación para el Examen:** Con este estándar, ya puedes practicar preguntas de **Network Policies** (aislamiento de tráfico), algo que con el estándar de Flannel no podías validar.

-->
