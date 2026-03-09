This is a classic **high-value question** (usually worth 7-9 points). In the CKA, NetworkPolicies are often the difference between passing and failing because if you miss one label or one port, the entire test case fails.

Here is the scenario exactly as it would appear in the exam portal:

---

### **Scenario: Restrict Network Traffic**
**Weight: 8%**
**Context:** `cluster-staging`

**Task:**
Create a **NetworkPolicy** named `allow-db-access` in the `finance` namespace to restrict ingress traffic to the Pods labeled `app=mysql`.

**Requirements:**
1.  Allow **Ingress** traffic only from Pods in the **same namespace** (`finance`) that have the label `app=frontend`.
2.  The traffic must only be allowed on **TCP port 3306**.
3.  Ensure that all other incoming traffic to Pods labeled `app=mysql` in the `finance` namespace (from any other Pods or Namespaces) is **denied**.

**Constraints:**
- Do not apply the policy to any other Pods or Namespaces.
- Verify that the policy is correctly targeting the intended Pods.

---

### **Expert Analysis (How to solve it under pressure):**

When you see this in the exam, follow these steps using the **Official Documentation**:

#### 1. Don't write the YAML from scratch
Search for "NetworkPolicy" in `kubernetes.io/docs`. Copy the "Basic NetworkPolicy" example and paste it into `policy.yaml`.

#### 2. Edit with Vim (Your `~/.vimrc` will save you here)
Your file should look like this:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-db-access
  namespace: finance          # VERY IMPORTANT: Must be in the correct namespace
spec:
  podSelector:
    matchLabels:
      app: mysql              # The TARGET pods
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:            # SOURCE pods
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 3306              # RESTRICTED port
```

#### 3. The "Default Deny" Catch
In Kubernetes, once you apply a NetworkPolicy to a set of Pods, **an implicit "Default Deny" is automatically applied** to those Pods for that policy type. By specifically allowing `app=frontend`, you are automatically denying everything else to the `app=mysql` pods. You don't need a second policy.

#### 4. Common Mistake to avoid: Namespace Selector
If the question said "Allow traffic from Pods in the **`public`** namespace", you would need a `namespaceSelector`. But since this question says "**same namespace**", you **must not** use a `namespaceSelector`.

---

### **Pro-Tip for your Lab (Rocky Linux + KVM):**
To truly test this in your home lab:
1.  **Install a CNI that supports NetworkPolicies.** (Flannel does NOT support them; **Calico** or **Cilium** do). Since you are studying for CKA, use **Calico**.
2.  Create the `finance` namespace.
3.  Run a "database" pod: `k run db --image=nginx -n finance --labels="app=mysql"`.
4.  Run a "frontend" pod: `k run fe --image=nginx -n finance --labels="app=frontend"`.
5.  Run a "hacker" pod: `k run hacker --image=nginx -n finance --labels="app=hacker"`.
6.  Apply the policy.
7.  **Test:** 
    *   From `fe`: `k exec fe -n finance -- nc -zv <db-ip-address> 3306` (Should work).
    *   From `hacker`: `k exec hacker -n finance -- nc -zv <db-ip-address> 3306` (Should timeout/fail).

**If the "hacker" pod can still reach the "db" pod, your CNI is not working or the policy is wrong.**

Would you like me to give you a **Troubleshooting** scenario (the ones worth 30% of the exam)?
