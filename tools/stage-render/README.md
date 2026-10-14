# Stage render

The 3D artwork on the Pengu page is a real three.js scene, rendered offline.
Nothing here ships with the site.

- `scene.html`: the purple stage from the old pharmacy page. That page has been removed, so its
  images are no longer in `site/`.
- `pastel.html`: the pastel iridescent stage on the Pengu page (`site/img/stage-pengu-*.webp`).
- `station.html`: Pengu's health station, the hero scene on the Pengu page (`site/img/station-*.webp`).
  It also reports each station's label position in `window.__anchors` (percent of the frame); the
  `.st-*` rules in the Pengu page's CSS use those numbers.

```sh
npm install
npx http-server -p 8091 .          # scene.html loads three from ./node_modules
node render.mjs http://127.0.0.1:8091/scene.html stage.png 3840 2160    # or pastel.html
```

Then export `stage.png` at 2880 and 1440 pixels wide as WebP (quality 0.9) into `site/img/`.
The centre of the frame sits behind the browser window, so keep shapes near the edges.
