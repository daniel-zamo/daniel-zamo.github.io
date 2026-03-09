# ENV para vimrc
cat <<EOF > ~/.vimrc
set tabstop=2
set shiftwidth=2
set expandtab
set number
syntax on
EOF

# Activar autocompletado
source <(kubectl completion bash)

# Crear alias 'k'
alias k=kubectl
complete -F __start_kubectl k

# Otros (sugeridos)
export do="--dry-run=client -o yaml"
# Ejemplo de uso `k run pod --image=nginx $do` (ver que lo usa como variable)

export now="--grace-period=0 --force"
# Ejemplo:
## `k run pod -- sleep 1d` #<-- (el comando lanza un pod y lo deja "reposar" durante 1 día
## `k delete pod pod $now` #<-- Fuerza eliminar el pod (ver variables $now fue definida así) 
