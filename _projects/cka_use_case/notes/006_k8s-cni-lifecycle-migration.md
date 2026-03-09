# Reporte 2: Ciclo de Vida del CNI y Procesos de Migración

Este reporte responde a por qué la red se instala "después" y los riesgos de migrar una red funcional.

## 1. ¿Por qué no se instala desde un inicio?
Es una cuestión de dependencias de arranque ("Chicken and Egg problem"):
1.  `kubeadm init` debe primero levantar el **API Server** y el **Kubelet**.
2.  El CNI en Kubernetes se despliega normalmente como un **DaemonSet** (Pods que corren en todos los nodos).
3.  Para que un DaemonSet pueda ejecutarse, el API Server debe estar vivo. Por lo tanto, el CNI es técnicamente una aplicación que corre "sobre" Kubernetes para dar servicio al propio Kubernetes.

## 2. ¿Es normal cambiar el CNI en un clúster funcional?
**No, es una operación de "corazón abierto".**
En producción, cambiar el CNI es extremadamente raro y peligroso porque:
*   Requiere reiniciar todos los Pods del clúster para que obtengan nuevas IPs bajo el nuevo esquema.
*   Puede haber inconsistencias en las tablas de `iptables` del host.
*   **Justificación:** Se instala directamente al inicio basándose en los requisitos (¿Necesito seguridad? Calico. ¿Es algo simple? Flannel).

## 3. Responsabilidades Principales del CNI
Un CNI tiene tres misiones críticas:
1.  **IPAM (IP Address Management):** Asignar una IP única a cada Pod en todo el clúster.
2.  **Conectividad L2/L3:** Garantizar que el Pod A en el Nodo 1 pueda hablar con el Pod B en el Nodo 2 sin NAT.
3.  **Aislamiento (Políticas):** (Opcional según el CNI) Controlar qué Pods pueden hablar con quién.

## 4. Justificación de soluciones más utilizadas
*   **Calico:** Elegido por su motor de políticas de red. Es el que **debes dominar para el examen CKA**. [Calico Docs](https://docs.tigera.io/calico/latest/about/).
*   **Flannel:** Elegido por simplicidad extrema (usa VXLAN por defecto). Ideal para entornos donde no se requiere seguridad entre Pods. [Flannel Repo](https://github.com/flannel-io/flannel).
*   **Cilium:** Elegido por empresas tecnológicas que buscan seguridad profunda y reemplazo de `kube-proxy` mediante eBPF. [Cilium Docs](https://docs.cilium.io/en/stable/overview/intro/).

> **Ref. Oficial:** [Kubeadm: Installing a Pod network add-on](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)

