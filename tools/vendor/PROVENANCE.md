# Vendored module provenance

`wardleyLabelPlacement.js` / `.d.ts` are compiled from mermaid's pure
label-placement module. Do not hand-edit — re-sync instead.

- Source: https://github.com/mermaid-js/mermaid
- Path: packages/mermaid/src/diagrams/wardley/wardleyLabelPlacement.ts
- Commit: 57797f9760836b27485e4b07b60b9a6ea45f2476

## Re-sync

    npx -y -p typescript@5 tsc /path/to/wardleyLabelPlacement.ts \
      --module es2022 --target es2022 --declaration --outDir tools/vendor

Then update the Commit line above.
