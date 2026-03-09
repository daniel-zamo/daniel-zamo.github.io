import argparse
import asyncio
from pathlib import Path
import edge_tts

async def generate_voice():
    parser = argparse.ArgumentParser(description="Generador de Voz TTS")
    parser.add_argument("input", help="Archivo .srt en español")
    parser.add_argument("--outdir", help="Directorio de salida", default=".")
    parser.add_argument("--voice", default="es-ES-AlvaroNeural", help="Voz de Edge-TTS")
    args = parser.parse_args()

    input_path = Path(args.input)
    out_dir = Path(args.outdir)
    out_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = out_dir / f"{input_path.stem}.mp3"

    # Limpiar SRT para leer solo texto
    with open(input_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        clean_text = " ".join([l.strip() for l in lines if not l.strip().isdigit() and "-->" not in l])

    print(f"🎙️ Generando audio en {output_file}...")
    communicate = edge_tts.Communicate(clean_text, args.voice)
    await communicate.save(str(output_file))
    print(f"✅ Audio completado.")

if __name__ == "__main__":
    asyncio.run(generate_voice())
