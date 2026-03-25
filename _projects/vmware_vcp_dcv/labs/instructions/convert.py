# /// script
# dependencies = [
#   "pymupdf4llm",
# ]
# ///
# /// Ejecución: `uv run convert.py`
import pymupdf4llm
import pathlib

pdf_path = "ICM8_U1_LAB-MANUAL_v09-2023_Help-IT.pdf"
md_text = pymupdf4llm.to_markdown(
    pdf_path, 
    write_images=True, 
    image_path="images", 
    image_format="png"
)

pathlib.Path("labs.md").write_text(md_text)
print("¡Hecho! Texto en 'labs.md' e imágenes en la carpeta 'images/'")

