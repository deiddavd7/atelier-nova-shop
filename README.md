# Atelier Nova Portfolio Shop

Nuovo progetto statico e indipendente per un portfolio shop online.

## Come aprirlo

Apri `index.html` nel browser.

Per test locale:

```bash
python3 -m http.server 4173
```

Poi apri `http://localhost:4173`.

## Struttura

- `index.html`: struttura delle sezioni, shop e carrello
- `styles.css`: layout responsive e direzione visiva
- `script.js`: prodotti, filtri, carrello e modulo contatti
- `assets/hero-shop.png`: immagine hero generata per il progetto
- `assets/studio-process.png`: immagine editoriale per la sezione processo
- `.github/workflows/pages.yml`: deploy statico su GitHub Pages
- `site.webmanifest`, `sitemap.xml`, `robots.txt`, `404.html`: file di pubblicazione

## Funzioni incluse

- Filtri prodotti per categoria
- Schede prodotto con descrizione e dettagli rapidi
- Carrello laterale con quantità, rimozione e totale
- Soglia spedizione gratuita demo
- Checkout demo pronto per integrazione futura
- Messaggi a schermo per azioni e form contatti
- Sezione processo con immagine editoriale dedicata
- Portfolio con metriche progetto
- Pacchetti servizi e testimonial
- Footer con navigazione rapida
- Meta SEO, Open Graph, favicon e file `robots.txt`
- Modal dettagli prodotto con materiali, formato e disponibilità
- Checkout demo con form e conferma ordine
- Newsletter demo e FAQ
- Skip link, focus visibile e miglioramenti accessibilità
- Ricerca, ordinamento e preferiti nello shop
- Animazioni progressive, nav attiva e pulsante torna-su
- Manifest PWA base e workflow GitHub Pages
- Garanzie operative, policy, pagina 404 e sitemap
- Dati strutturati JSON-LD per sito, organizzazione e prodotti
- Form contatti con tipo progetto e timeline

## Prossimi step consigliati

- Personalizzare nome, testi, prezzi e prodotti
- Collegare il checkout a Stripe, Shopify Buy Button o WooCommerce
- Collegare il form contatti a Formspree, Netlify Forms o backend dedicato
- Attivare GitHub Pages da `Settings > Pages > Source: GitHub Actions`
- Sostituire i contenuti demo con lavori, foto e casi studio reali
