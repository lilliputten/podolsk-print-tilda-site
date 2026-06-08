<!--
@since 2026.06.05, 18:44
@changed 2026.06.05, 19:27
-->

# Compillable js and css assets for podolsk-print site

- Version: 0.0.0
- Last changes timestamp: 2026.06.08 19:40:29 +0300

## Resources

Site: https://podolsk-print.ru/

## Inject mode

Use environment variables (in command-line or in the `.env` files):

- `INJECT=true`
- `INJECT_PATH="../inject/"`

To populate built assets in the specific destination (the target project, for instance).

## Colors

![gold: #db7](https://badgen.net/badge/gold/%23db7/db7)

## Fonts

https://fonts.google.com/specimen/Manrope

## Optimization of svgo assets

All the svg resources in the `public/assets` folder might be optimized by a single command:

```bash
pnpm svgo public/assets
pnpm optimize-assets
```

See the svgo configuration file `public/assets/svgo.config.js`.
