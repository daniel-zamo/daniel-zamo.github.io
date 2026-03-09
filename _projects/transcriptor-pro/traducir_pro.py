import sys
from deep_translator import GoogleTranslator

def traducir_srt(archivo_entrada):
    translator = GoogleTranslator(source='en', target='es')
    archivo_salida = archivo_entrada.replace(".srt", "_es.srt")
    
    with open(archivo_entrada, 'r', encoding='utf-8') as f:
        lineas = f.readlines()

    with open(archivo_salida, 'w', encoding='utf-8') as f:
        for linea in lineas:
            # Si la línea tiene tiempos (-->) o es un número de índice, no la traducimos
            if "-->" in linea or linea.strip().isdigit() or not linea.strip():
                f.write(linea)
            else:
                # Traducimos solo el texto
                f.write(translator.translate(linea) + "\n")
    
    print(f"✅ Archivo traducido generado: {archivo_salida}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        traducir_srt(sys.argv[1])
    else:
        print("Uso: uv run traducir_pro.py subtitulos.srt")
