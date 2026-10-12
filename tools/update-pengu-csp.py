"""Recompute the CSP hashes for site/clearhealth-pengu.html after editing it.

The Pengu page keeps its CSS and script inline, and its Content-Security-Policy allows them by
SHA-256 hash. Any edit to the <style> or <script> changes the hash, so run this afterwards:

    python3 tools/update-pengu-csp.py

It rewrites the hashes in the page's own CSP <meta> tag and in site/_headers (Netlify), where the
site-wide policy lists them next to 'self'.
"""
import base64
import hashlib
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = ROOT / 'site' / 'clearhealth-pengu.html'
HEADERS = ROOT / 'site' / '_headers'


def sha(text):
    return "'sha256-" + base64.b64encode(hashlib.sha256(text.encode('utf-8')).digest()).decode() + "'"


html = PAGE.read_text(encoding='utf-8')
css = re.search(r'<style>(.*?)</style>', html, re.S).group(1)
js = re.findall(r'<script>(.*?)</script>', html, re.S)[-1]
script_hash, style_hash = sha(js), sha(css)

html = re.sub(r"script-src [^;\"]+", f"script-src {script_hash}", html, count=1)
html = re.sub(r"style-src [^;\"]+", f"style-src {style_hash}", html, count=1)
PAGE.write_text(html, encoding='utf-8')

headers = HEADERS.read_text(encoding='utf-8')
headers = re.sub(r"script-src [^;\n]+", f"script-src 'self' {script_hash}", headers, count=1)
headers = re.sub(r"style-src [^;\n]+", f"style-src 'self' {style_hash}", headers, count=1)
HEADERS.write_text(headers, encoding='utf-8')

print('script-src', script_hash)
print('style-src ', style_hash)
