from datetime import datetime

from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.enums import TA_RIGHT, TA_CENTER
from reportlab.lib.units import cm

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from app.paths import get_file, FONTS_DIR, IMG_PATH

pdfmetrics.registerFont(TTFont("TNR", get_file(FONTS_DIR, "TIMES.TTF")))
pdfmetrics.registerFont(TTFont("TNR-Bold", get_file(FONTS_DIR, "TIMESBD.TTF")))
pdfmetrics.registerFont(TTFont("TNR-Italic", get_file(FONTS_DIR, "TIMESI.TTF")))
pdfmetrics.registerFont(TTFont("TNR-Bold-Italic", get_file(FONTS_DIR, "TIMESBI.TTF")))

pdfmetrics.registerFontFamily(
    "TNR",
    normal="TNR",
    bold="TNR-Bold",
    italic="TNR-Italic",
    boldItalic="TNR-Bold-Italic"
)

def current_semester() -> str:
    month = datetime.now().month
    year = datetime.now().year
    last_year = year - 1

    if month >= 1 and month <= 2:
        return f"Zimowy {last_year}/{year}"
    elif month >= 2 and month <= 9:
        return f"Letni {last_year}/{year}"
    else:
        return f"Zimowy {year}/{year + 1}"
    
def format_date(date_str: str) -> str:
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    return date_obj.strftime("%d.%m.%Y")

# TODO: Jakoś to fajniej jeszcze zrobić
def add_pdf_metadata(canvas, doc):
    canvas.setTitle("Repertuar")
    canvas.setSubject("Repertuar")
    canvas.setKeywords([
        "program",
        "muzyka",
        "repertuar"
    ])


def generate_pdf(data: dict) -> bytes:
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm
    )

    styles = getSampleStyleSheet()

    styles["Normal"].fontName = "TNR"
    styles["Normal"].boldFontName = "TNR-Bold"
    styles["Normal"].italicFontName = "TNR-Italic"
    styles["Normal"].boldItalicFontName = "TNR-Bold-Italic"

    styles.add(ParagraphStyle(
        name="HeaderRight",
        parent=styles["Normal"],
        alignment=TA_RIGHT,
        fontSize=10,
        leading=13,
        fontName="TNR"
    ))

    styles.add(ParagraphStyle(
        name="CenterTitle",
        parent=styles["Normal"],
        alignment=TA_CENTER,
        fontSize=16,
        leading=20,
        spaceBefore=20,
        spaceAfter=20,
        fontName="TNR-Bold"
    ))

    styles.add(ParagraphStyle(
        name="SectionHeader",
        parent=styles["Normal"],
        fontSize=12,
        leading=14,
        spaceBefore=15,
        spaceAfter=8,
        fontName="TNR-Bold"
    ))

    styles.add(ParagraphStyle(
        name="Composer",
        parent=styles["Normal"],
        fontSize=10,
        leading=13,
        spaceBefore=8,
        fontName="TNR-Bold"
    ))

    styles.add(ParagraphStyle(
        name="ProgramLine",
        parent=styles["Normal"],
        fontSize=10,
        leading=13,
        leftIndent=20,
        fontName="TNR",
        italicFontName="TNR-Italic"
    ))

    story = []

    logo = Image(get_file(IMG_PATH, "logo.png"), width=1.4*cm, height=1.8*cm)

    header_text = (
        f"{format_date(data['event_info']['event_date'])}<br/>"
        f"{data['unit']['university']}<br/>"
        f"{data['unit']['faculty']}<br/>"
        f"{data['unit']['department']}"
    )

    header = Table(
        [[logo, Paragraph(header_text, styles["HeaderRight"])]],
        colWidths=[4 * cm, 11 * cm]
    )
    header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (1, 0), (1, 0), "RIGHT")
    ]))

    story.append(header)
    story.append(Spacer(1, 20))

    title_text: str = f"{data['event_info']['event_name']} - {data['unit']['course_name']}"
    story.append(Paragraph(title_text, styles["CenterTitle"]))

    for s in data["students"]:
        story.append(Paragraph(
            f"<b>Student</b>: {s['name']}<br/>"
            f"<b>Nr indeksu</b>: {s['index']}<br/>"
            f"<b>Rok studiów</b>: {s['year']}<br/>"
            f"<b>Semestr</b>: {current_semester()}<br/>"
            f"<b>Instrument</b>: {s['instrument']}",
            styles["Normal"]
        ))
        story.append(Spacer(1, 10))

    main = data["teachers"]["main"]
    main_teacher_text: str = f"{main['title']} {main['name']}" + (f", {main['add_title']}" if main.get("add_title") else "")
    story.append(Paragraph(
        f"<b>Pedagog prowadzący</b>: {main_teacher_text}",
        styles["Normal"]
    ))

    for a in data["teachers"].get("assistants", []):
        assistant_text: str = f"{a['title']} {a['name']}" + (f", {a['add_title']}" if a.get("add_title") else "")
        story.append(Paragraph(
            f"<b>Asystent</b>: {assistant_text}",
            styles["Normal"]
        ))

    story.append(Spacer(1, 15))

    story.append(Paragraph("Program:", styles["SectionHeader"]))

    for piece in data["repertoire"]:
        c = piece["composer"]
        story.append(Paragraph(
            f"{c['name']} ({c['birthYear']} – {c['deathYear']})",
            styles["Composer"]
        ))

        story.append(Paragraph(
            f"<i>{piece['title']}</i> {piece['catalogNumber']}",
            styles["Normal"]
        ))

        for part in piece["parts"]:
            story.append(Paragraph(
                f"{part['number']} <i>{part['name']}</i>",
                styles["ProgramLine"]
            ))

        story.append(Spacer(1, 12))

    doc.build(
        story,
        onFirstPage=add_pdf_metadata,
        onLaterPages=add_pdf_metadata
    )


    buffer.seek(0)
    return buffer.read()
