## Ref principal consultada: https://docs.fedoraproject.org/en-US/quick-docs/how-to-set-nvidia-as-primary-gpu-on-optimus-based-laptops/
#### Ref 2: https://phoenixnap.com/kb/fedora-nvidia-drivers
sudo dnf -y install \
    https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm \
    https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm

# Se da por supuesto cumplido que los repositorios FUSION estan instalados y habilitados
#sleep 120
sudo dnf -y install akmod-nvidia

# Instalar mas paquetes - opcionales o mas completo, y para arquitectura i686
sudo dnf -y install gcc kernel-headers kernel-devel akmod-nvidia xorg-x11-drv-nvidia xorg-x11-drv-nvidia-libs xorg-x11-drv-nvidia-cuda xorg-x11-drv-nvidia-libs.i686

# sleep 60
## Esperar unos minutos o reiniciar, antes de lo siguiente (https://docs.fedoraproject.org/en-US/quick-docs/how-to-set-nvidia-as-primary-gpu-on-optimus-based-laptops/)
sudo akmods --force && sudo dracut --force

# Para la conf. sobre X11
sudo dnf -y install xrandr
sudo cp -ivp /usr/share/X11/xorg.conf.d/nvidia.conf /etc/X11/xorg.conf.d/
sudo sed -i 's/Option "BaseMosaic" "on"/&\n\tOption "PrimaryGPU" "yes"/' /etc/X11/xorg.conf.d/nvidia.conf
sudo reboot

# Verificar
glxinfo | egrep "OpenGL vendor|OpenGL renderer"


# Instalar algunos paquetes (utiles para verificar trabajo sobre la/s GPU)
sudo dnf -y install nvtop screenfetch