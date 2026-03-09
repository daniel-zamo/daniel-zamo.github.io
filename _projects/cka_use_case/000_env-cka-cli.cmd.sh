# ENV para vimrc
cat <<EOF > ~/.vimrc
set tabstop=2
set shiftwidth=2
set expandtab
set number
syntax on
EOF

alias k=kubectl
complete -F __start_kubectl k
export do="--dry-run=client -o yaml"

