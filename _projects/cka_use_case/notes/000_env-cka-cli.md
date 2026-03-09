# ENV para memorizar

```bash
# ENV para vimrc
cat <<EOF > ~/.vimrc
" 1. Salto de tabulación a 2 espacios.
set tabstop=2
" 2. La identación se mueve 2 espacios.
set shiftwidth=2
" 3. EL MAS IMPORTANTE. Define tecla TAB sea "espacios reales".
set expandtab
" 4. Enumera las lineas
set number
" 5. Activa los colores
syntax on
EOF

# ENV para kubectl
alias k=kubectl
complete -F __start_kubectl k
export do="--dry-run=client -o yaml"
```
