from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

OUTPUT_DIR = Path(__file__).resolve().parent
STUDENT = "OGWAL ALLAN"
APP_URL = "https://allan2468coder.github.io/wdd330-sleepoutside/open-gallery/"
SOURCE_URL = "https://github.com/Allan2468coder/wdd330-sleepoutside/tree/main/src/open-gallery"
BOARD_URL = "https://trello.com/b/0E3oXaWh/smookie"
VIDEO_URL = "[Add public video URL after recording]"
INK = colors.HexColor("#24231F")
OLIVE = colors.HexColor("#54624B")
PAPER = colors.HexColor("#F7F5EF")
MUTED = colors.HexColor("#69675F")
LINE = colors.HexColor("#DCD8CE")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="DocTitle", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=25, leading=31, textColor=INK, alignment=TA_LEFT, spaceAfter=8))
styles.add(ParagraphStyle(name="SubtitleOG", parent=styles["Normal"], fontName="Helvetica", fontSize=12, leading=17, textColor=OLIVE, spaceAfter=16))
styles.add(ParagraphStyle(name="SectionOG", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=15, leading=19, textColor=OLIVE, spaceBefore=12, spaceAfter=7, keepWithNext=True))
styles.add(ParagraphStyle(name="SubsectionOG", parent=styles["Heading3"], fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=INK, spaceBefore=8, spaceAfter=4, keepWithNext=True))
styles.add(ParagraphStyle(name="BodyOG", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.4, leading=14, textColor=INK, spaceAfter=7))
styles.add(ParagraphStyle(name="SmallOG", parent=styles["BodyText"], fontName="Helvetica", fontSize=8, leading=11, textColor=MUTED, spaceAfter=4))
styles.add(ParagraphStyle(name="TableHeadOG", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=colors.white))
styles.add(ParagraphStyle(name="TableCellOG", parent=styles["BodyText"], fontName="Helvetica", fontSize=7.6, leading=10, textColor=INK))
styles.add(ParagraphStyle(name="TableCellBoldOG", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=7.7, leading=10, textColor=INK))
styles.add(ParagraphStyle(name="CalloutOG", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=9, leading=13, textColor=OLIVE, backColor=PAPER, borderColor=LINE, borderWidth=0.5, borderPadding=8, spaceBefore=6, spaceAfter=10))


def P(text, style="BodyOG"):
    return Paragraph(text, styles[style])


def link(label, url):
    return f'<link href="{escape(url)}" color="#54624B"><u>{escape(label)}</u></link>'


def bullet(text):
    return P(f'<font color="#54624B"><b>•</b></font>  {text}')


class AssessmentDoc(BaseDocTemplate):
    def __init__(self, filename, title):
        super().__init__(str(filename), pagesize=letter, leftMargin=.72*inch, rightMargin=.72*inch, topMargin=.72*inch, bottomMargin=.62*inch, title=title, author=STUDENT, subject="WDD 330 Week 7 development document")
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        self.addPageTemplates(PageTemplate(id="main", frames=frame, onPage=self.draw_page))

    def draw_page(self, canvas, doc):
        canvas.saveState()
        width, height = letter
        canvas.setFillColor(OLIVE)
        canvas.rect(0, height - 10, width, 10, fill=1, stroke=0)
        canvas.setStrokeColor(LINE)
        canvas.line(self.leftMargin, 0.47*inch, width-self.rightMargin, 0.47*inch)
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(self.leftMargin, 0.30*inch, "WDD 330  |  Open Gallery  |  " + self.title_short)
        canvas.drawRightString(width-self.rightMargin, 0.30*inch, f"Page {doc.page}")
        canvas.restoreState()


def metadata_block():
    rows = [
        [P("STUDENT", "TableHeadOG"), P(escape(STUDENT), "TableCellBoldOG")],
        [P("PROJECT", "TableHeadOG"), P("Open Gallery - shared art search for the AIC and The Met", "TableCellOG")],
        [P("LIVE APP", "TableHeadOG"), P(link(APP_URL, APP_URL), "TableCellOG")],
        [P("SOURCE", "TableHeadOG"), P(link("GitHub source folder", SOURCE_URL), "TableCellOG")],
        [P("TRELLO", "TableHeadOG"), P(link("Smookie - Open Gallery project board", BOARD_URL), "TableCellOG")],
    ]
    table = Table(rows, colWidths=[.95*inch, 5.75*inch], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (0,-1), OLIVE),
        ("BACKGROUND", (1,0), (1,-1), PAPER),
        ("BOX", (0,0), (-1,-1), .5, LINE),
        ("INNERGRID", (0,0), (-1,-1), .35, LINE),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING", (0,0), (-1,-1), 7),
        ("RIGHTPADDING", (0,0), (-1,-1), 7),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ]))
    return table


def professional_document():
    out = OUTPUT_DIR / "W07-Professional-Development.pdf"
    doc = AssessmentDoc(out, "W07 Professional Development - Open Gallery")
    doc.title_short = "Professional Development"
    story = [P("Professional Development", "DocTitle"), P("W07 Final Project | Open Gallery", "SubtitleOG"), metadata_block(), Spacer(1, 12)]
    story += [P("Project development summary", "SectionOG"), P("I developed Open Gallery as a responsive art-discovery experience within the existing Vite project. The application brings together public collection records from the Art Institute of Chicago (AIC) and The Metropolitan Museum of Art (The Met), allowing visitors to search either collection or both from one interface. Search results are generated from live JSON responses and normalized so the same result, details, and saved-work features can be used across the providers."), P("The work expanded from the initial search and results experience to include artwork detail pages, museum record links, saved works in browser local storage, responsive layouts, accessible interaction states, and production deployment through GitHub Pages. The interface communicates loading, empty results, partial provider failure, and unavailable records instead of leaving users without feedback.")]
    story += [P("Professional skills practiced", "SectionOG")]
    sections = [
        ("API research and integration", "I compared the AIC and Met API structures and selected endpoints for both collection search and individual record details. Since the museums use different field names and image conventions, I convert their responses into a shared artwork format before rendering them. Met search results can require multiple object lookups, so I bound the concurrency of those requests to five at a time.", "artworks.js - API requests, normalization, and bounded Met requests."),
        ("Maintainable frontend architecture", "I separated API/data work, search page behavior, detail behavior, favorites persistence, markup, and CSS into focused modules and pages. This keeps changes local to the responsibility being updated and uses native browser APIs and ES modules rather than a JavaScript framework.", "main.js, artworks.js, detail.js, favorites.js, and favorites-page.js."),
        ("Resilience and quality assurance", "I handle the museums independently so a failure at one provider does not hide a successful response from the other. I added image fallbacks and meaningful status states. Automated tests cover normalization, pagination, Met request concurrency, API failures, and saved-work behavior. The project lint and production builds were also run.", "OpenGallery.test.js; npm test; npm run lint; standard and GitHub Pages builds."),
        ("Accessibility and responsive interaction", "I used semantic regions and labels, a skip link, visible keyboard focus, accessible status messages, alternative text, responsive layouts, and reduced-motion handling. Entrance animations are disabled when reduced motion is requested.", "The three Open Gallery HTML pages and styles.css."),
        ("Deployment and project coordination", "I configured a GitHub Actions workflow to build the Vite dist directory and publish it to GitHub Pages. I used the project Trello board to organize and report the W5, W6, and W7 tasks.", "deploy-pages.yml; public app and source links above; Smookie Trello board."),
    ]
    for heading, text, evidence in sections:
        story += [P(heading, "SubsectionOG"), P(text), P(f"<b>Evidence:</b> {escape(evidence)}", "SmallOG")]
    story += [P("Reflection", "SectionOG"), P("A key design decision was to normalize external API data at the application boundary. Although the museums expose different JSON schemas, the interface can work consistently when every result uses the same fields. I also learned that graceful network failure is part of frontend design: provider requests should be independent, and the page should explain which data is available rather than silently failing."), P("Testing revealed issues that a successful production build alone would not catch: the Jest setup referenced a missing Babel preset, and an empty test file caused the test command to fail before useful assertions ran. I corrected the test setup and added focused coverage for the app's data and persistence behaviors. This made the work more repeatable and gave me concrete checks for the important paths."), P("Remaining student steps", "SectionOG"), bullet("Confirm that the displayed name, OGWAL ALLAN, matches the required name order and spelling."), bullet("Record and publish the required approximately five-minute screen demonstration with my face visible at the beginning; discuss the running application and the code."), bullet("Replace the video placeholder below with the public recording URL, then test the link in a private/incognito browser."), bullet("Review the official course template requirements and upload the required documents to Canvas."), Spacer(1, 4), P(f"<b>Video URL:</b> {escape(VIDEO_URL)}", "CalloutOG"), P("This PDF is a generated submission draft based on the project evidence. Review the first-person reflection for accuracy and complete the video field before final submission.", "SmallOG")]
    doc.build(story)
    return out


def skills_document():
    out = OUTPUT_DIR / "W07-Skills-Development.pdf"
    doc = AssessmentDoc(out, "W07 Skills Development - Open Gallery")
    doc.title_short = "Skills Development"
    story = [P("Skills Development Assessment", "DocTitle"), P("W07 Final Project | Rubric Evidence - Open Gallery", "SubtitleOG"), metadata_block(), Spacer(1, 10), P("Project summary", "SectionOG"), P("Open Gallery is a responsive art-discovery app built with semantic HTML, CSS, and vanilla JavaScript ES modules. It searches the public collections of the Art Institute of Chicago and The Metropolitan Museum of Art, normalizes their different JSON response shapes, dynamically renders artwork cards, and supports detail pages and saved works."), P("Links for grader", "SectionOG"), P(f"<b>Application:</b> {link(APP_URL, APP_URL)}<br/><b>Source:</b> {link(SOURCE_URL, SOURCE_URL)}<br/><b>Trello:</b> {link(BOARD_URL, BOARD_URL)}<br/><b>Public video:</b> {escape(VIDEO_URL)}", "BodyOG")]
    rubric = [
        ("1. JavaScript", "25", "25", "Search validation and submission; independent asynchronous provider requests using Promise.allSettled; dynamic rendering of cards from JSON; sorting and pagination; details; favorite state; stale-request protection; and loading/error/empty states.", "main.js; artworks.js; detail.js"),
        ("2. Third-party APIs", "25", "25", "Two museums and four endpoint types: AIC artwork search and artwork detail; Met collection search and individual object detail. Records link back to their museum sources.", "artworks.js; AIC and Met official API documentation"),
        ("3. JSON", "10", "10", "Each artwork normalizes into 12 properties: id, museum, title, artist, date, medium, image, record, publicDomain, department, dimensions, and credit. Arrays of these records are rendered in results and favorites.", "artworks.js; OpenGallery.test.js"),
        ("4. Advanced CSS", "10", "10", "Entrance keyframe animations for hero copy, hero artwork, and result cards; transitions and hover transforms for artwork images/favorite buttons; responsive grids; visible focus; and reduced-motion handling.", "styles.css"),
        ("5. Events", "10", "10", "More than five event types: submit, click, change, image error, pageshow, and storage events, including suggested search, paging, sort, and favorite interactions.", "main.js; detail.js; favorites-page.js"),
        ("6. LocalStorage", "5", "5", "Serializes and retrieves full artwork records with multiple properties; supports save, remove, clear, validation of stored JSON, and favorite counts across pages.", "favorites.js; OpenGallery.test.js"),
        ("7. Trello Board", "5", "5", "The public Smookie project board shows W5 setup/API/search, W6 details/favorites, and W7 testing/deployment/accessibility cards in Done with completed checklist counts at verification.", "Public board link above; trello-progress.md"),
        ("8. Video", "10", "0", "No recording link is included yet. To earn these points, record about five minutes, show your face at the beginning, demonstrate the live app and code, publish publicly, and add/test the URL.", "Pending student recording: " + VIDEO_URL),
    ]
    data = [[P("RUBRIC", "TableHeadOG"), P("MAX", "TableHeadOG"), P("EST.", "TableHeadOG"), P("EVIDENCE", "TableHeadOG"), P("LOCATION", "TableHeadOG")]]
    for criterion, maximum, score, evidence, location in rubric:
        data.append([P(escape(criterion), "TableCellBoldOG"), P(maximum, "TableCellOG"), P(score, "TableCellBoldOG"), P(escape(evidence), "TableCellOG"), P(escape(location), "TableCellOG")])
    table = Table(data, colWidths=[.94*inch, .36*inch, .38*inch, 3.28*inch, 1.74*inch], repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), OLIVE),
        ("BACKGROUND", (0,1), (-1,-1), colors.white),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, PAPER]),
        ("GRID", (0,0), (-1,-1), .35, LINE),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("ALIGN", (1,1), (2,-1), "CENTER"),
        ("LEFTPADDING", (0,0), (-1,-1), 5),
        ("RIGHTPADDING", (0,0), (-1,-1), 5),
        ("TOPPADDING", (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ]))
    story += [table, Spacer(1, 8), P("Estimated project evidence score: 90 / 100 before the video is provided. The first seven criteria are supported by current project/source/board evidence; the video criterion is currently scored zero because recording and public-link evidence are still pending. This is an estimate, not an instructor grade.", "CalloutOG")]
    story += [P("Testing and deployment evidence", "SectionOG"), bullet("Seven Jest tests pass for data normalization, AIC pagination, Met concurrency limits, API failure handling, and favorites storage."), bullet("The project lint script passes, as do normal Vite and GitHub Pages production builds."), bullet("The public GitHub Pages app, home/detail/favorites routes, and JS/CSS assets were verified; a live search returned artwork cards."), P("Submission checklist", "SectionOG"), bullet("Confirm the spelling/order of the student name and review all first-person statements."), bullet("Record/publish the video and replace the placeholder URL above."), bullet("Use the official WDD 330 skills document template if Canvas/instructor requires it; transfer this rubric evidence into its required fields."), bullet("Test app, source, board, and video links while signed out, and upload the final document to Canvas."), Spacer(1, 4), P("Prepared from the current project evidence. The video placeholder is intentional and must be replaced before final submission.", "SmallOG")]
    doc.build(story)
    return out


if __name__ == "__main__":
    for pdf in (professional_document(), skills_document()):
        print(f"Created {pdf} ({pdf.stat().st_size:,} bytes)")
