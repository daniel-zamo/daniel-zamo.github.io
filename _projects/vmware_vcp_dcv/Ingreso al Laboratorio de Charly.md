
## 1. Conectar a RDP

- RDP Server: (VER KeepPassXC)
- Username: (VER KeepPassXC)
- Domain: (VER KeepPassXC)

## 2. Tunel Ssh Reverse

Abrir tunel reverse ssh (Dejo en PowerShell 7 para hacerlo mediante ejecución de funciones), este se abre sobre mi hardware y dominio

## 3. Abro ssh desde mi host cliente

### 3.1 Ssh desde Desktop Linux

```bash
ssh -J [usuario_tunel_reverse]@[my_domain]:[port_del_tunel] -D 1080 -p [puerto_relay] '[Domain_AD]\[Usuario_AD]'@localhost
```

### 3.2 Ssh desde Desktop Windows

????

## 4. Navegación con Proxy - Extensión SwitchyOmega (V3)

En este caso se utiliza la extensión [SwitchyOmega (V3)](chrome-extension://hihblcmlaaademjlakdpicchbjnnnkbo/options.html#!/about "About") sobre un Google Chrome.

### Configuración de la extensión y creación del proxy

![[Pasted image 20260316090446.png]]

![[Pasted image 20260316090551.png]]

![[Pasted image 20260316090940.png]]

Una vez configurado la conexión será establecida con esta activada.

**Activación de la conexión**

![[Pasted image 20260316091402.png]]

![[Pasted image 20260316091322.png]]

## 5. vSphere Client Mediante Navegador y Vía Tunel

Establecido/activado el tunel y activado en el navegador con proxy, vSphere estará disponible en la URL (credenciales y accesos en fichero de credenciales).

![[Pasted image 20260316092019.png]]