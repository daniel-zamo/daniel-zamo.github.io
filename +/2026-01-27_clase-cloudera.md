---
class_type: presencial
---

## References

- [Referencias del profesor](https://bit.ly/45o8aKa)

## Comandos repasados

```bash
find /usr/bin -type f -perm -g+s -ok -exec ls -l {} \;
```

### Casos particulares

- **find pide confirmación**

  ```bash
  find /usr/bin -type f -perm -g+s -ok -exec ls -l {} \; 2> /dev/null
  ```

- **find concatenado con xarg**

  ```bash
  find /usr/bin -type f -perm -g+s | xargs ls -lF
  # Donde: 
  # - `-F` indica da pistas de que tipo de archivo se trata
  ```

## Expresiones regulares

```bash
```

- **Regulares (BRE)**

  ```bash
  [ ] . *
  ```

- **Extendidas (ERE)**

  ```bash
  ( ) | ? + { } 
  ```

- `+`: 1 o más veces
- `{...}`: repeticiones

### Ejemplo de como guardar en variables

```bash
cat /etc/passwd | grep -vE "^[[:lower:]]+:x:([[:digit:]]+):\1"
# Con awk seria similar a 
awk -F: '$3 == $4 {print "Usuario: " $1 " | ID: " $3}' /etc/passwd
```

