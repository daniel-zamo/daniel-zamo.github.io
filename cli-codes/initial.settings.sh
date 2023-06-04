#!/usr/bin/env bash
# El ISO usado para instalar fue el Fedora-Everything-netinst-x86_64-38-1.6.iso
# En el asistente de instalación solo se eligio el meta grupo "KDE Plasma Workplaces", y sin ningun paquete mas seleccionado
# Function to display the confirmation prompt
function confirm() {
    while true; do
        read -p "Ejecutar la configuración mínima/inicial de Fedora 38? (YES/NO/CANCEL) " yn
        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            [Cc]* ) exit;;
            * ) echo "Ingresar YES, NO, or CANCEL.";;
        esac
    done
}

# Example usage of the confirm function
if confirm; then
    echo "User chose YES. Executing the operation..."


    ### Configurar usuario para uso de `sudo`. En fichero 
    ###### independiente y para que no le solicite password
    echo "$USER ALL=(ALL) NOPASSWD:ALL"|sudo tee /etc/sudoers.d/$USER

    ### Configurar usuario para usuario su (admin en wheel)
    sudo usermod -G wheel -a $USER
    sudo sed -i \
      's/^#auth\t\trequired\tpam_wheel.so use_uid$/&\nauth\t\trequired\tpam_wheel.so use_uid/' \
      /etc/pam.d/su
    
    ### Deshabilitar _firewalld_ y _SELinux_
    sudo sed -i.org 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config 
    
    ### Configuración Dnf (flags)
    echo 'fastestmirror=1' | sudo tee -a /etc/dnf/dnf.conf
    echo 'max_parallel_downloads=6' | sudo tee -a /etc/dnf/dnf.conf
    echo 'deltarpm=true' | sudo tee -a /etc/dnf/dnf.conf
    
    ### Actualizar paquetes del sistema
    sudo dnf upgrade -y --refresh
    sudo dnf -y update
    
    ### Instalación algunos paquetes
    sudo dnf -y install \
      wget curl \
      git vim vim-enhanced tmux \
      rsync openssh-server openssh-clients #\
      #btop htop
    
    ### Deshabilitar swap sobre zram
    sudo systemctl disable --now systemd-zram-setup@zram0.service
    sudo dnf remove -y zram-generator zram-generator-defaults
    sudo swapoff -a && sudo swapon -a
    
    echo "Se han ejecutado las tareas."
else
    echo "No se ejecuto nada. Saliendo del script..."
fi
