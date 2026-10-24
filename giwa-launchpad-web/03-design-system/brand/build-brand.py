"""Builds the Bros wordmark and compact mark as SVG.

Run: /vercel/share/bros-tools/py/bin/python build-brand.py
Needs fontTools. Source face: Antonio (OFL), instanced at wght 700.
The B is drawn here (one stem, two bowls with a gap: two people sharing one spine).
"r", "o", "s" come from Antonio Bold outlines, which the OFL permits in a logo.
"""
import math
import os
import subprocess
import sys

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "fonts", "source", "Antonio[wght].ttf")
BOLD = "/tmp/Antonio-Bold-brand.ttf"


def oklch_to_hex(l, c, h):
    a, b = c * math.cos(math.radians(h)), c * math.sin(math.radians(h))
    l_ = l + 0.3963377774 * a + 0.2158037573 * b
    m_ = l - 0.1055613458 * a - 0.0638541728 * b
    s_ = l - 0.0894841775 * a - 1.2914855480 * b
    L, M, S = l_ ** 3, m_ ** 3, s_ ** 3
    r = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S
    g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S
    bl = -0.0041960863 * L - 0.7034186147 * M + 1.7076147010 * S

    def enc(x):
        x = max(0.0, min(1.0, x))
        x = 12.92 * x if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055
        return round(x * 255)

    return "#{:02x}{:02x}{:02x}".format(enc(r), enc(g), enc(bl))


INK = oklch_to_hex(0.19, 0.012, 262)
SIGN = oklch_to_hex(0.865, 0.165, 95)
PAPER = oklch_to_hex(0.982, 0.003, 250)

if not os.path.exists(BOLD):
    subprocess.run([sys.executable, "-m", "fontTools.varLib.instancer", SRC, "wght=700", "-o", BOLD, "-q"], check=True)
font = TTFont(BOLD)
gs = font.getGlyphSet()
cmap = font.getBestCmap()
hmtx = font["hmtx"]
CAP = font["OS/2"].sCapHeight  # 1760 at 2048 upm


def bounds(ch):
    bp = BoundsPen(gs)
    gs[cmap[ord(ch)]].draw(bp)
    return bp.bounds


xmin_i, _, xmax_i, _ = bounds("I")
STEM = xmax_i - xmin_i
BAR = round(STEM * 0.74)
GAP = round(STEM * 0.2)
MID_BAR = round(BAR * 0.62)


def rounded_d(x0, y0, x1, y1, r):
    """Outer contour of a bowl: flat on the stem side, rounded on the right. y-up font units."""
    r = min(r, (y1 - y0) / 2, (x1 - x0))
    return (
        f"M{x0} {y0} L{x1 - r} {y0} A{r} {r} 0 0 1 {x1} {y0 + r} "
        f"L{x1} {y1 - r} A{r} {r} 0 0 1 {x1 - r} {y1} L{x0} {y1} Z"
    )


def counter(x0, y0, x1, y1, r):
    """Inner counter, drawn in reverse so the even-odd fill punches it out."""
    r = max(8, min(r, (y1 - y0) / 2, (x1 - x0)))
    return (
        f"M{x0} {y0} L{x0} {y1} L{x1 - r} {y1} A{r} {r} 0 0 0 {x1} {y1 - r} "
        f"L{x1} {y0 + r} A{r} {r} 0 0 0 {x1 - r} {y0} Z"
    )


def custom_b(left):
    """Two bowls on one stem with a gap between them. Returns (path in y-up units, advance)."""
    stem_r = left + STEM
    lower_top = round(CAP * 0.5) - GAP // 2
    upper_bot = lower_top + GAP
    upper_right = left + round(STEM * 2.78)
    lower_right = left + round(STEM * 2.98)
    side = round(STEM * 0.9)
    ro = round(STEM * 0.95)
    parts = [
        f"M{left} 0 L{stem_r} 0 L{stem_r} {CAP} L{left} {CAP} Z",
        rounded_d(stem_r - 1, upper_bot, upper_right, CAP, ro),
        counter(stem_r - 1, upper_bot + MID_BAR, upper_right - side, CAP - BAR, ro - side),
        rounded_d(stem_r - 1, 0, lower_right, lower_top, ro),
        counter(stem_r - 1, BAR, lower_right - side, lower_top - MID_BAR, ro - side),
    ]
    return " ".join(parts), lower_right + round(STEM * 0.42)


def glyph_path(ch):
    pen = SVGPathPen(gs)
    gs[cmap[ord(ch)]].draw(pen)
    return pen.getCommands(), hmtx[cmap[ord(ch)]][0]


def flip(path_d, dx, baseline, scale):
    return f'<path transform="translate({dx:.2f} {baseline:.2f}) scale({scale:.5f} {-scale:.5f})" d="{path_d}"/>'


def wordmark(fill, plate=None, cap_px=100.0, tracking=-40):
    s = cap_px / CAP
    pad_x, pad_y = cap_px * 0.34, cap_px * 0.3
    x = 0.0
    paths = []
    b_path, b_adv = custom_b(0)
    paths.append((b_path, x))
    x += b_adv + tracking
    for ch in "ros":
        d, adv = glyph_path(ch)
        paths.append((d, x))
        x += adv + tracking
    width_units = x - tracking
    w = width_units * s + (2 * pad_x if plate else 0)
    h = cap_px + (2 * pad_y if plate else 0) + (0 if plate else cap_px * 0.02)
    ox = pad_x if plate else 0
    base = (pad_y + cap_px) if plate else cap_px
    body = "".join(flip(d, ox + px * s, base, s) for d, px in paths)
    plate_el = f'<rect width="{w:.1f}" height="{h:.1f}" rx="{cap_px * 0.06:.1f}" fill="{plate}"/>' if plate else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" width="{w:.0f}" height="{h:.0f}" role="img" aria-label="Bros">'
        f"<title>Bros</title>{plate_el}<g fill=\"{fill}\" fill-rule=\"evenodd\">{body}</g></svg>\n"
    )


def mark(fill, plate, size=512.0):
    b_path, b_adv = custom_b(0)
    cap_px = size * 0.6
    s = cap_px / CAP
    glyph_w = (b_adv - round(STEM * 0.42)) * s
    ox = (size - glyph_w) / 2
    base = (size + cap_px) / 2
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size:.0f} {size:.0f}" width="{size:.0f}" height="{size:.0f}" role="img" aria-label="Bros">'
        f'<title>Bros</title><rect width="{size:.0f}" height="{size:.0f}" rx="{size * 0.12:.1f}" fill="{plate}"/>'
        f'<g fill="{fill}" fill-rule="evenodd">{flip(b_path, ox, base, s)}</g></svg>\n'
    )


OUT = {
    "bros-wordmark-plate.svg": wordmark(SIGN, plate=INK),
    "bros-wordmark-plate-yellow.svg": wordmark(INK, plate=SIGN),
    "bros-wordmark-ink.svg": wordmark(INK),
    "bros-wordmark-paper.svg": wordmark(PAPER),
    "bros-mark.svg": mark(SIGN, INK),
    "bros-mark-yellow.svg": mark(INK, SIGN),
}
for name, svg in OUT.items():
    with open(os.path.join(HERE, name), "w") as f:
        f.write(svg)
print(f"stem={STEM} bar={BAR} gap={GAP} cap={CAP} ink={INK} sign={SIGN} paper={PAPER}")
print("wrote", ", ".join(OUT))
