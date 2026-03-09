import argparse
import asyncio
from pathlib import Path
import edge_tts

async def process_voice():
    parser = argparse.ArgumentParser(description="Paso 3: Generación de Audio en Español (TTS)")
    parser.add_argument("input", help="Archivo .srt en español")
    parser.add_argument("--outdir", default=".", help="Carpeta de salida")
    parser.add_argument("--voice", default="es-ES-AlvaroNeural", help="Voz neural")
    args = parser.parse_args()

    input_p = Path(args.input)
    out_dir = Path(args.outdir)
    out_dir.mkdir(parents=True, exist_ok=True)
    output_mp3 = out_dir / f"{input_p.stem}.mp3"

    # Extraer solo el texto para el audio
    with open(input_p, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        text_content = " ".join([l.strip() for l in lines if not l.strip().isdigit() and "-->" not in l])

    print(f"🎙️ Generando audio neural en {output_mp3}...")
    communicate = edge_tts.Communicate(text_content, args.voice)
    await communicate.save(str(output_mp3))
    print(f"✅ Proceso finalizado con éxito.")

if __name__ == "__main__":
    asyncio.run(process_voice())
