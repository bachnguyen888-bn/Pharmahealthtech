# Stage render

The purple 3D artwork behind the product screenshot (`site/img/stage-*.webp`) is a real three.js
scene, rendered offline. Nothing here ships with the site.

```sh
npm install
npx http-server -p 8091 .          # scene.html loads three from ./node_modules
node render.mjs http://127.0.0.1:8091/scene.html stage.png 3840 2160
```

Then export `stage.png` at 2880 and 1440 pixels wide as WebP (quality 0.9) into `site/img/`.
The centre of the frame sits behind the browser window, so keep shapes near the edges.
