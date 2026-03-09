# Reporte 1: El Ecosistema CNI y su Presencia en la Certificación CKA

Este reporte analiza las soluciones de red (Container Network Interface) en el contexto del examen CKA y entornos productivos profesionales.

## 1. El CNI en el Examen CKA
En el examen real de la Linux Foundation, la situación varía según la tarea:
*   **Clústeres pre-instalados:** Casi siempre vienen con **Calico** o una solución similar ya configurada. No necesitas instalarlo, pero sí entender cómo funciona para tareas de *Troubleshooting* y *Network Policies*.
*   **Tarea de Instalación:** Si te piden crear un clúster desde cero con `kubeadm`, **tú eres responsable** de elegir e instalar un CNI. Sin esto, los nodos permanecerán en estado `NotReady` y los Pods de `CoreDNS` se quedarán en `Pending`.

## 2. Comparativa de Soluciones (Producción vs Laboratorio)

| CNI | Uso Principal | Ventajas | Desventajas |
| :--- | :--- | :--- | :--- |
| **Flannel** | Laboratorios / Edge | Ultra ligero, configuración cero. | No soporta *Network Policies* (Seguridad). |
| **Calico** | **Estándar Pro** | Soporte robusto de políticas L3/L4, muy escalable (BGP). | Configuración más compleja (requiere un operador). |
| **Cilium** | **Futuro/High-Perf** | Basado en eBPF, alta observabilidad y seguridad. | Requiere kernels modernos (v5.10+). |

**¿Cuál es el más utilizado?**
Hoy en día, **Calico** es el líder indiscutible en clústeres profesionales "on-premise" y en muchos servicios administrados. Sin embargo, **Cilium** está ganando terreno rápidamente en entornos de alta seguridad y rendimiento.

## 3. Implicancias de cambiar el CNI en el Laboratorio
Cambiar de Flannel a Calico en tu laboratorio (Ubuntu 24.04 v1.35) **sí tiene implicancias**:
1.  **Corte de Red:** Durante la transición, los Pods existentes perderán conectividad.
2.  **Limpieza:** Debes eliminar los binarios y archivos de configuración de Flannel en `/etc/cni/net.d/` en todos los nodos antes de aplicar Calico, o habrá conflictos de IP.

> **Ref. Oficial:** [Cluster Networking Concepts](https://kubernetes.io/docs/concepts/cluster-administration/networking/)  
> **Ref. Oficial:** [Network Plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

