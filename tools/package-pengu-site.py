"""Build pengu-site.zip: a Netlify-ready site with the Pengu page as its homepage.

    python3 tools/package-pengu-site.py

Unzip it and drag the pengu-site folder onto app.netlify.com/drop (or onto the Deploys tab of an
existing Netlify site to update it). The ClearHealth page in site/ is not included.
"""
import pathlib
import shutil
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / 'site'
OUT = ROOT / 'pengu-site.zip'

with tempfile.TemporaryDirectory() as tmp:
    dest = pathlib.Path(tmp) / 'pengu-site'
    (dest / 'img').mkdir(parents=True)
    shutil.copy(SITE / 'clearhealth-pengu.html', dest / 'index.html')
    for name in ['styles.css', 'favicon.svg', 'og-pengu.jpg', '_headers']:
        shutil.copy(SITE / name, dest / name)
    shutil.copytree(SITE / 'fonts', dest / 'fonts')
    for img in SITE.glob('img/*.webp'):
        if img.name.startswith(('stage-pengu-', 'station-')):
            shutil.copy(img, dest / 'img' / img.name)
    # The 404 page, reworded for Pengu.
    page = (SITE / '404.html').read_text(encoding='utf-8')
    for old, new in [('<title>Page not found — ClearHealth</title>', '<title>Page not found · Pengu by ClearHealth</title>'),
                     ('Everything about MFP Refund Recovery is on the home page.', 'Everything about Pengu is on the home page.'),
                     ('<a class="btn btn-outline" href="/#pilot">Join the pilot</a>', '<a class="btn btn-outline" href="/#early-access">Get early access</a>')]:
        assert old in page, old
        page = page.replace(old, new)
    (dest / '404.html').write_text(page, encoding='utf-8')
    shutil.make_archive(str(OUT.with_suffix('')), 'zip', tmp, 'pengu-site')

print('wrote', OUT, OUT.stat().st_size, 'bytes')
