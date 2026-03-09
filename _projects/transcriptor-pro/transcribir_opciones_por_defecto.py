import sys
from faster_whisper import WhisperModel

def run():
    model_size = "medium" # Puedes usar "large-v3" para máxima precisión
    # Correr en GPU si tienes NVIDIA (cuda) o CPU si no.
    model = WhisperModel(model_size, device="cpu", compute_type="int8")

    # archivo_entrada es el primer argumento
    input_file = sys.argv[1]
    
    # task="transcribe" genera el texto en el idioma detectado.
    # Si el curso es en inglés, pondremos el idioma de salida aquí.
    segments, info = model.transcribe(input_file, beam_size=5)

    print(f"Idioma detectado: {info.language} con probabilidad {info.language_probability}")

    with open("transcripcion.srt", "w", encoding="utf-8") as f:
        for i, segment in enumerate(segments):
            # Formato simple para SRT (puedes mejorarlo)
            f.write(f"{i+1}\n")
            f.write(f"{segment.start:.2f} --> {segment.end:.2f}\n")
            f.write(f"{segment.text.strip()}\n\n")

if __name__ == "__main__":
    run()
