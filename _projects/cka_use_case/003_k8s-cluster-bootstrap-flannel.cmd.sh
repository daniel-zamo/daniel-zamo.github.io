# Inicialización y Unión del Clúster Kubernetes v1.35

## Este reporte detalla los comandos diferenciados para el nodo **Master (Control Plane)** y los nodos **Worker**.

## 1. Configuración del Nodo Master (master-01)
### El Control Plane es el cerebro del clúster. Se debe inicializar definiendo el rango de red de los Pods (CIDR).

### A. Inicialización del API Server
#### Definimos el CIDR 10.244.0.0/16 (Estándar para Flannel CNI)
sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --node-name master-01

### B. Configuración del Acceso (kubeconfig)
#### Para que el usuario `candidate` pueda ejecutar comandos `kubectl`:
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

### C. Instalación del Complemento de Red (CNI)
#### Los Pods no podrán comunicarse ni el DNS funcionará hasta que se instale un driver de red (Aplicando Flannel como solución de red ligera).
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

### > **Ref. Oficial:** [Creación de un clúster con kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)

## 2. Configuración de los Nodos Worker (worker-01, worker-02)
### Una vez el Master está listo, los workers deben unirse al clúster utilizando el token generado durante el `kubeadm init`.

### A. Comando de Unión (Join)
#### Se debe ejecutar en cada worker con privilegios de `sudo`. El comando tiene el siguiente formato:
sudo kubeadm join <IP_MASTER>:6443 --token <token_id> \
    --discovery-token-ca-cert-hash sha256:<hash_cert_ca>

### B. Verificación desde el Master
#### Tras la unión, verifica el estado de los nodos:
kubectl get nodes -o wide

#### *Los nodos deben pasar de estado `NotReady` a `Ready` en aproximadamente 60 segundos.*

### > **Ref. Oficial:** [Unión de nodos worker](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#join-nodes)

