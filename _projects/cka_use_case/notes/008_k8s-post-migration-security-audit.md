# Auditoría de Seguridad: Verificación de NetworkPolicies Post-Migración

Este reporte documenta la validación final de la capacidad de cumplimiento de políticas (*enforcement*) del clúster tras migrar el CNI de Flannel a Calico en la versión 1.35.

## 1. Validación del Motor de Políticas (Enforcement Engine)
A diferencia de Flannel, Calico instala un controlador que vigila los objetos `NetworkPolicy` y traduce las reglas a nivel de Kernel (IPtables).

```bash
# Verificar que el controlador de Calico está activo
kubectl get pods -n calico-system -l k8s-app=calico-kube-controllers
```

## 2. Re-despliegue del Escenario de Prueba
Debido a la migración, los Pods anteriores deben ser recreados para asegurar que tienen las nuevas etiquetas y la configuración de red gestionada por Calico.

```bash
# Limpiar y recrear el namespace de prueba
kubectl delete ns secure-app --ignore-not-found
kubectl create ns secure-app

# Crear Pods con sus etiquetas de identificación
kubectl run backend --image=nginx -n secure-app --labels="app=database"
kubectl run frontend --image=busybox -n secure-app --labels="app=webapp" -- sleep 3600
kubectl run intruder --image=busybox -n secure-app --labels="app=hacker" -- sleep 3600
```

## 3. Aplicación de la Política de Aislamiento
Aplicamos la regla de "Zero Trust": Solo el `frontend` puede hablar con el `backend`.

```yaml
# backend-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-only-frontend
  namespace: secure-app
spec:
  podSelector:
    matchLabels:
      app: database
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: webapp
    ports:
    - protocol: TCP
      port: 80
```
`kubectl apply -f backend-policy.yaml`

## 4. Pruebas de Conectividad (La Prueba Real)

### A. Prueba Autorizada (Debe funcionar)
```bash
BACKEND_IP=$(kubectl get pod backend -n secure-app -o jsonpath='{.status.podIP}')
kubectl exec frontend -n secure-app -- wget -qO- --timeout=2 $BACKEND_IP
```
*   **Resultado esperado:** `HTTP/1.1 200 OK`. Acceso permitido por el motor de Calico.

### B. Prueba Denegada (Debe fallar)
```bash
kubectl exec intruder -n secure-app -- wget -qO- --timeout=2 $BACKEND_IP
```
*   **Resultado esperado:** `wget: download timed out`. **ÉXITO.** Ahora el tráfico es bloqueado activamente.

## 5. Conclusión de la Auditoría
| Estado | Comportamiento con Flannel | Comportamiento con Calico |
| :--- | :--- | :--- |
| **Conectividad Autorizada** | Permitida | Permitida |
| **Bloqueo de Intrusos** | **FALLIDO** (Tráfico pasaba) | **EXITOSO** (Tráfico bloqueado) |

**Veredicto:** El clúster ha sido configurado correctamente para cumplir con los estándares de seguridad requeridos en la certificación CKA.

> **Ref. Oficial:** [Calico Network Policy Troubleshooting](https://docs.tigera.io/calico/latest/networking/network-policy/troubleshoot-network-policy)  
> **Ref. Oficial:** [Kubernetes Network Policies Task](https://kubernetes.io/docs/tasks/administer-cluster/declare-network-policy/)

---
<!--

### **Resumen para tu estudio de CKA:**

Si este ejercicio ha funcionado, significa que:
1.  Tu **Kernel** está configurado con `br_netfilter` (lo hicimos en el ritual).
2.  Tu **Runtime** (Containerd) está hablando bien con el CNI.
3.  Tu **CNI** (Calico) está gestionando correctamente las reglas de red.

Has resuelto uno de los mayores desafíos de configuración manual. Ahora tienes un entorno robusto donde puedes practicar cualquier otra tarea del examen (Deployments, RBAC, PV/PVC, etc.).

-->
