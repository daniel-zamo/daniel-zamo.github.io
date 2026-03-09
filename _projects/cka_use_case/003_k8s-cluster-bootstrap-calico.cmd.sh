# Inicialización y Configuración del Clúster v1.35 con Calico CNI

## Este reporte detalla los comandos para configurar el nodo **Master** y la unión de los nodos **Worker**, utilizando **Calico** como solución de red para habilitar el cumplimiento de políticas de seguridad.

## 1. Configuración del Nodo Master (master-01)

### A. Inicialización del Plano de Control
#### Para Calico, utilizaremos el rango de red de Pods recomendado por el fabricante. Inicializamos el clúster con el CIDR estándar de Calico
sudo kubeadm init --pod-network-cidr=192.168.0.0/16 --node-name master-01

### B. Configuración de Acceso para el Usuario (kubeconfig)
#### Para que el usuario `candidate` administre el clúster sin usar `sudo`.

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

### C. Instalación del CNI Calico (Método Operador)
#### Calico se instala en dos pasos para permitir una gestión avanzada vía el operador de Tigera.

#### 1. Instalar el Tigera Operator
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.3/manifests/tigera-operator.yaml

#### 2. Instalar los recursos personalizados (Configuración de red)
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.3/manifests/custom-resources.yaml

#### > **Ref. Oficial:** [Kubeadm: Create Cluster](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)  
#### > **Ref. Oficial:** [Calico Quickstart](https://docs.tigera.io/calico/latest/getting-started/kubernetes/quickstart)

## 2. Configuración de los Nodos Worker (worker-01, worker-02)

### A. Comando de Unión (Join)
#### Copia el comando generado al final del `kubeadm init` y ejecútalo en cada worker. Si el token expiró, puedes generar uno nuevo con `kubeadm token create --print-join-command`.

sudo kubeadm join 172.17.17.10:6443 --token <token_id> \
    --discovery-token-ca-cert-hash sha256:<hash_cert_ca>

## 3. Verificación del Clúster

### A. Estado de los Nodos
#### Los nodos tardarán ~60s en pasar a Ready mientras se descargan las imágenes de Calico
kubectl get nodes -o wide

### B. Estado de los Pods de Red
#### Verificar que el sistema de red está operando
kubectl get pods -n calico-system

