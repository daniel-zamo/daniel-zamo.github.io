Here are the 4 scenarios I gave you earlier, rewritten exactly as they would appear in the **CKA Exam Portal**.

---

### **Important: Setup for all scenarios**
Before starting any task, the exam will always give you the context:
`kubectl config use-context <cluster-name>`

---

### **Scenario 1: Troubleshooting a Node**
**Weight: 7%**

**Task:**
A worker node named `worker-01` is currently in a `NotReady` state. Inspect the node to identify the root cause of the failure. 
- Resolve the issue and ensure the node status changes to `Ready`.
- Ensure that any service you start is configured to launch automatically on boot.

**Constraints:**
- You can SSH into the node using `ssh worker-01`.
- Do not modify any other configuration files unless necessary for the fix.

---

### **Scenario 2: ETCD Backup and Restore**
**Weight: 10%**

**Context:** `cluster-control-plane`

**Task:**
First, create a snapshot of the existing **etcd** instance. 
- Save the snapshot at the following location: `/opt/cluster-snapshots/etcd-backup.db`.
- Use the following TLS certificates for authentication:
    - CA certificate: `/etc/kubernetes/pki/etcd/ca.crt`
    - Client certificate: `/etc/kubernetes/pki/etcd/server.crt`
    - Client key: `/etc/kubernetes/pki/etcd/server.key`

Next, restore the etcd state from the snapshot file located at `/var/lib/backup/etcd-snapshot-previous.db` (provided in the environment). 

**Warning:** Be careful with the data directory for the restore process.

---

### **Scenario 3: Persistent Volumes and Storage**
**Weight: 8%**

**Task:**
Create a **PersistentVolume** named `safari-pv` with the following specifications:
- Capacity: `2Gi`
- Access Mode: `ReadWriteOnce`
- Reclaim Policy: `Retain`
- Storage Class Name: `local-storage`
- HostPath: `/mnt/data`

Create a **PersistentVolumeClaim** in the `marketing` namespace:
- Name: `safari-pvc`
- Request: `1Gi`
- Storage Class Name: `local-storage`

Finally, create a **Pod** named `nginx-storage` in the `marketing` namespace:
- Image: `nginx:alpine`
- Volume Mount Path: `/usr/share/nginx/html`
- Use the PVC named `safari-pvc`.

---

### **Scenario 4: Node Scheduling and Taints**
**Weight: 6%**

**Task:**
A node named `node-victus` has been reserved for specialized workloads. 
- Apply a **Taint** to this node. The taint key should be `env`, the value `production`, and the effect `NoSchedule`.
- Create a **Pod** named `prod-app` in the `default` namespace using the `nginx` image.
- Configure the Pod to be scheduled on `node-victus` by adding the appropriate **Tolerations**.
- Additionally, use a **nodeSelector** to ensure the pod specifically targets `node-victus`.

---

### **Scenario 5: Cluster Upgrade (Bonus Practice)**
**Weight: 12%**

**Task:**
The current version of the cluster is `1.29.0`. Upgrade the **control-plane** node only to Kubernetes version `1.30.0`.
- Upgrade `kubeadm`, `kubelet`, and `kubectl`.
- Drain the node before the upgrade and uncordon it after the upgrade is complete.

---

### **CKA "Exam Idioms" to remember:**

1.  **"Identify the root cause":** This means use `journalctl -u kubelet`, `systemctl status containerd`, or look at `/var/log/pods`.
2.  **"Ensure changes are persistent":** Make sure you `systemctl enable` services or edit the correct config files, not just temporary flags.
3.  **"In the X namespace":** If you forget `-n <namespace>`, you get 0 points.
4.  **"Downtime is acceptable":** Usually mentioned in ETCD or Upgrade tasks, meaning you can stop the API server for a moment.
5.  **"Use the dry-run to generate a manifest":** They don't say this, but it's the only way to finish on time.

**Expert advice:** When reading the tasks in English, look for the **Keywords** (Pod name, Namespace, Path). Don't try to translate the whole paragraph; just extract the **Requirements**.

Do you want me to explain any of these English instructions in detail?
