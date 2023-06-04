# Instalación de editor kate
sudo dnf -y install kate kate-plugins perl-Syntax-Highlight-Engine-Kate
# Instalación de hugo
sudo dnf -y install hugo
# Instalación de Visual Code Studio
cat <<EOF |sudo tee /etc/yum.repos.d/vscode.repo
[vscode]
name=Visual Studio Code
baseurl=https://packages.microsoft.com/yumrepos/vscode
enabled=1
gpgcheck=1
priority=20
gpgkey=https://packages.microsoft.com/keys/microsoft.asc
EOF
sudo dnf -y update --refresh
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc 
sudo dnf -y install code
