#!/usr/bin/env bash

### Configurar usuario para `sudo`
echo "$USER ALL=(ALL) NOPASSWD:ALL"|sudo tee /etc/sudoers.d/$USER
### Configurar usuario para usuario su (admin en wheel)
sudo usermod -G wheel -a $USER
sudo sed -i \
  's/^#auth\t\trequired\tpam_wheel.so use_uid$/&\nauth\t\trequired\tpam_wheel.so use_uid/' \
  /etc/pam.d/su
### Deshabilitar _firewalld_ y _SELinux_
sudo systemctl disable --now firewalld
sudo sed -i.org 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
### Configuración Dnf (flags)
echo 'fastestmirror=1' | sudo tee -a /etc/dnf/dnf.conf
echo 'max_parallel_downloads=6' | sudo tee -a /etc/dnf/dnf.conf
echo 'deltarpm=true' | sudo tee -a /etc/dnf/dnf.conf
### Actualizar paquetes del sistema
sudo dnf upgrade -y --refresh
sudo dnf -y update
# Agregar repo y habilitar fedora-third-party
sudo dnf -y install fedora-workstation-repositories
## sudo dnf install fedora-repos fedora-repos-modular
# Repositorios Fusion
sudo dnf install -y https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-"$(rpm -E %fedora)".noarch.rpm
sudo dnf install -y https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-"$(rpm -E %fedora)".noarch.rpm
dnf install -y rpmfusion-free-appstream-data rpmfusion-nonfree-appstream-data

# Agregar mas repositorios
sudo dnf install createrepo_c
sudo dnf upgrade -y --refresh

### Instalación paquetes (para CLI)
sudo dnf -y install \
  git htop vim \
  rsync openssh-server openssh-clients

### Habilitar/instalar flatpak
sudo dnf -y install flatpak
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak update
### Deshabilitar swap sobre zram
sudo systemctl disable --now systemd-zram-setup@zram0.service
sudo dnf remove -y zram-generator zram-generator-defaults
sudo swapoff -a && sudo swapon -a
#echo "Se han ejecutado las tareas."
