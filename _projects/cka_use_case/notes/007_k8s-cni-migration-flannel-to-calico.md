# Migración de Complemento de Red: de Flannel a Calico

Este reporte detalla el procedimiento técnico para eliminar el CNI Flannel e instalar Calico en un clúster Kubernetes v1.35 activo.

## 1. Fase de Limpieza (Eliminación de Flannel)
Antes de instalar un nuevo CNI, debemos eliminar los rastros del anterior para evitar conflictos en las interfaces de red y en la asignación de IPs.

### A. Eliminar Manifiestos de Flannel
Desde el nodo Maestro:
```bash
kubectl delete -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

### B. Limpieza Manual en TODOS los Nodos (Master y Workers)
Debes entrar en cada nodo y eliminar los archivos de configuración de red que Flannel dejó atrás:
```bash
sudo rm -rf /etc/cni/net.d/10-flannel.conflist
sudo ip link delete cni0
sudo ip link delete flannel.1
# Reiniciar containerd para limpiar estados de red huérfanos
sudo systemctl restart containerd
```

## 2. Fase de Instalación (Calico)
Instalaremos Calico mediante el método del Operador, que es el estándar actual.

### A. Instalar el Operador Tigera
```bash
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.3/manifests/tigera-operator.yaml
```

### B. Ajuste del CIDR (Punto Crítico)
Si inicializaste tu clúster con el CIDR de Flannel (`10.244.0.0/16`), **DEBES** modificar el archivo de configuración de Calico, ya que Calico espera `192.168.0.0/16` por defecto.

```bash
# 1. Descargar recursos
curl -O https://raw.githubusercontent.com/projectcalico/calico/v3.27.3/manifests/custom-resources.yaml

# 2. Cambiar el CIDR al que usaste en 'kubeadm init'
sed -i 's/192.168.0.0\/16/10.244.0.0\/16/g' custom-resources.yaml

# 3. Aplicar configuración
kubectl create -f custom-resources.yaml
```

## 3. Fase de Reincidencias (Reinicio de Pods)
El CNI solo asigna IPs al momento de crear el Pod. Los Pods que ya existían antes de la migración quedarán con IPs inválidas o sin red.

```bash
# Reiniciar todos los pods del sistema y de aplicaciones
kubectl delete pods --all -A
```

## 4. Verificación Final
```bash
# 1. Verificar que los nodos están 'Ready'
kubectl get nodes

# 2. Verificar que los pods de Calico están 'Running'
kubectl get pods -n calico-system
```

## 5. Justificación del Cambio
*   **Capacidad:** Calico habilita el uso de **NetworkPolicies**.
*   **Examen CKA:** Es la herramienta estándar para validar seguridad de red.
*   **Referencia:** Sin este cambio, el ejercicio de "backend-policy" realizado anteriormente sería inútil.

> **Ref. Oficial:** [Calico Installation Guide](https://docs.tigera.io/calico/latest/getting-started/kubernetes/quickstart)  
> **Ref. Oficial:** [Kubeadm Cleanup/Reset](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-reset/)


---
<!--
### **Consejo Profesional (Real World vs Exam):**

En el **mundo real**, nunca harías esto así. Crearías un nuevo clúster con Calico y migrarías las aplicaciones. Pero en un **entorno de laboratorio CKA**, saber limpiar `/etc/cni/net.d/` y reiniciar las interfaces es una habilidad de **Troubleshooting** nivel experto que te salvará si algo falla en la red.
-->
