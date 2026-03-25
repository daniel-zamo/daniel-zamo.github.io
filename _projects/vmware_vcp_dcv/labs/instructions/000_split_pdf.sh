ARCHIVO="ICM8_U1_LAB-MANUAL_v09-2023_Help-IT.pdf"
TOTAL=$(qpdf --show-npages "$ARCHIVO")
CONTADOR=1
OUT_DIR="pdf"

mkdir -p ${OUT_DIR}

for ((i=1; i<=$TOTAL; i+=2)); do
    j=$((i+1))
    
    # Definimos el par de páginas (maneja si el total es impar)
    if [ $j -gt $TOTAL ]; then PAGS="$i"; else PAGS="$i,$j"; fi
    
    # Generamos el nombre con el contador correlativo (001, 002, 003...)
    NOMBRE_SALIDA=$(printf "pag_%03d.pdf" $CONTADOR)
    
    echo "Procesando páginas $PAGS en $NOMBRE_SALIDA..."
    
    # Ejecutamos pdfjam
    pdfjam --nup 2x1 --landscape "$ARCHIVO" "$PAGS" --outfile "${OUT_DIR}/${NOMBRE_SALIDA}"
    
    # Incrementamos el contador para el siguiente archivo
    ((CONTADOR++))
done
