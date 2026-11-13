"""Turn free-exercise-db (Unlicense) 2-frame photos into transparent looping WebP figures.

usage: python3 build-photo-moves.py <img_dir_name> <out.webp> [size]
"""
import io
import sys
import urllib.request

import numpy as np
from PIL import Image
from rembg import new_session, remove

BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'
_s = {}


def sess(name):
    if name not in _s:
        _s[name] = new_session(name)
    return _s[name]


def cut(im):
    a = np.array(remove(im, session=sess('isnet-general-use'), only_mask=True, post_process_mask=True))
    b = np.array(remove(im, session=sess('u2net_human_seg'), only_mask=True, post_process_mask=True))
    rgba = im.convert('RGBA')
    rgba.putalpha(Image.fromarray(np.maximum(a, b)))
    return rgba


def build(name, out, size=360):
    frames = [cut(Image.open(io.BytesIO(urllib.request.urlopen(f'{BASE}{name}/{i}.jpg').read())).convert('RGB')) for i in (0, 1)]
    boxes = [f.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox() for f in frames]
    x0 = min(b[0] for b in boxes); y0 = min(b[1] for b in boxes)
    x1 = max(b[2] for b in boxes); y1 = max(b[3] for b in boxes)
    side = int(max(x1 - x0, y1 - y0) * 1.08)
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    sq = []
    for f in frames:
        c = Image.new('RGBA', (side, side), (0, 0, 0, 0))
        c.paste(f, (side // 2 - cx, side // 2 - cy))
        sq.append(c.resize((size, size), Image.LANCZOS))
    a, b = sq
    seq, dur = [a], [900]
    for k in range(1, 7):
        seq.append(Image.blend(a, b, k / 7)); dur.append(45)
    seq.append(b); dur.append(900)
    for k in range(1, 7):
        seq.append(Image.blend(b, a, k / 7)); dur.append(45)
    seq[0].save(out, save_all=True, append_images=seq[1:], duration=dur, loop=0, quality=72, method=6)


if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 360)
