# Vatsal Garg Portfolio

Static HTML, CSS and JavaScript portfolio recreated around the supplied Zolt reference: https://zolt-portfolio.framer.website/.

Existing site link: https://vatsalgargg.github.io/Portfolio_Self

Run locally: `node server.mjs`, then open http://127.0.0.1:5173. The preview server binds to loopback and serves only the explicit public files.

Includes the supplied color portrait, six projects (Bando excluded), education, certifications, skills, contact links, a text profile download, floating navigation, draggable spring ID, rotating greetings, theme switch, contextual cursor, scroll reveals, expandable note and services, and animated VG signature.

Responsive layouts cover compact phones, tablets, landscape and wide desktops. Phone navigation docks above the safe area. Cards and semantic text blocks reveal independently and replay on re-entry; phones use lighter transform-only transitions. Reduced-motion preferences and keyboard focus visibility are respected; ID dragging also supports keyboard arrows. The VG signature redraws on entry. The dark stack card includes an explicitly illustrative contribution grid and two pausable rows of local Simple Icons logos.

Run `node check.mjs` with the preview server running to verify public assets and private-file protection.

No runtime dependencies, forms or tracking. Fonts and portrait are served locally. Individual project and certificate URLs were not supplied; project arrows lead to the known GitHub or TryHackMe profiles. Project artwork is illustrative rather than captured product UI. Reference motion is recreated, not verified as identical Framer timing/physics.
