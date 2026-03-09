## Tecnologías de k8s que incluye CKA

Exacto. Una de las claves del éxito en la **CKA** es no perder el tiempo estudiando herramientas externas. El examen es sobre **Kubernetes "Vanilla" (puro)**.

**Respuesta rápida:**
*   **Helm:** **NO** entra en la CKA (pero sí entra en la CKAD - Application Developer).
*   **Service Meshes (Istio/Linkerd):** **NO** entran.
*   **Terraform/Ansible:** **NO** entran.
*   **Prometheus/Grafana:** **NO** entran (aunque sí debes saber usar `kubectl top`, que requiere *Metrics Server*, pero este ya suele venir instalado).

El examen se centra en el **funcionamiento interno y la administración** del clúster.

---

### Dominios Oficiales de la CKA (Curriculum 2024/2025)

Los 5 dominios que la Linux Foundation evalúa, con los temas específicos que debes dominar en tu laboratorio:

#### 1. Cluster Architecture, Installation & Configuration (25%)
*   **Kubeadm install:** Instalar un clúster básico (lo que hablamos antes).
*   **RBAC (Role Based Access Control):** Crear `Roles` y `RoleBindings`. Es una pregunta fija.
*   **Etcd Backup & Restore:** Vital. Saber usar `etcdctl`.
*   **Upgrade del clúster:** Pasar de la 1.29 a la 1.30 usando `kubeadm upgrade`.
*   **Gestionar certificados:** Saber dónde están y cuándo caducan.

#### 2. Workloads & Scheduling (15%)
Aquí es donde manejas los objetos básicos.
*   **Deployments & Rollbacks:** Saber actualizar una imagen y volver atrás si falla.
*   **ConfigMaps & Secrets:** Pasarlos como variables de entorno o montarlos como volúmenes.
*   **Escalado de aplicaciones:** Cambiar réplicas.
*   **Taints & Tolerations / Node Affinity:** Controlar en qué nodo cae cada Pod.

#### 3. Services & Networking (20%)
Este bloque es donde la mayoría de la gente falla.
*   **Services:** Entender la diferencia entre `ClusterIP` y `NodePort`.
*   **Ingress:** Crear reglas de Ingress para exponer apps (el *Ingress Controller* ya estará instalado en el examen, tú solo creas el objeto `Ingress`).
*   **Network Policies:** Bloquear o permitir tráfico entre Pods/Namespaces. **Practica esto mucho.**
*   **CoreDNS:** Saber dónde está el archivo de configuración (`CoreDNS ConfigMap`) por si falla la resolución de nombres.

#### 4. Storage (10%)
*   **PV & PVC:** Crear volúmenes persistentes y reclamarlos.
*   **Storage Classes:** Entender el aprovisionamiento dinámico.
*   **Volume Mounts:** Montar discos en `/var/www/html`, etc.
*   **HostPath:** Usar carpetas del nodo físico (muy común en el examen).

#### 5. Troubleshooting (30%) - El bloque más pesado
Aquí es donde "rompes" tu laboratorio para arreglarlo.
*   **Cluster component failure:** ¿Por qué no arranca el `kube-apiserver`? (Revisar `/etc/kubernetes/manifests`).
*   **Node failure:** El nodo está `NotReady`. ¿Es el `kubelet`? ¿Es el `containerd`? ¿Es el disco lleno?
*   **Network troubleshooting:** ¿Por qué un Pod no llega a otro?
*   **Logs:** Saber usar `kubectl logs` y `journalctl -u kubelet`.

---

### ¿Qué "extras" SÍ podrían aparecer (pero son parte de K8s)?

Aunque no hay Helm, hay un par de cosas que podrían considerarse "herramientas" pero son estándar:

1.  **`crictl`:** Es la herramienta de línea de comandos para interactuar con el runtime de contenedores (CRI). Como ya no se usa Docker, si quieres ver los contenedores que corren en un nodo, usas `crictl ps`.
2.  **`apt-get`:** Para instalar los binarios de Kubernetes.
3.  **`openssl`:** A veces (rara vez) para verificar un certificado.
4.  **`jq` / `jsonpath`:** No es una herramienta de K8s, pero la necesitas para filtrar salidas largas de `kubectl`.

### Mi consejo como CKA:
En tu laboratorio de Rocky Linux, **enfócate obsesivamente en el dominio de Troubleshooting (30%) y Networking (20%)**. 

Si sabes arreglar un nodo que no conecta y sabes configurar una `NetworkPolicy`, el resto del examen (crear pods, deployments, etc.) te parecerá un juego de niños.

¿Quieres que te dé un ejemplo de una pregunta de **NetworkPolicy** en inglés, que es de las que más puntos valen?
