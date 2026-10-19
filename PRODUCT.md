# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Team von Children of Mathare Kenya (CoM Kenya):** mehrere Mitarbeitende, die Geldeingänge und jede einzelne Bezahlung mit Foto der Rechnung erfassen. Meist am Handy, oft draußen (am Markt, unterwegs) bei hellem Tageslicht. Mobile Daten sind oft langsam oder teuer. Sprache wird bei der Anmeldung gewählt: Deutsch, Englisch oder Swahili.
- **Schatzmeister von Children of Mathare Germany (deutscher Hilfsverein):** prüft alle Einträge, genehmigt fehlende Belege ausnahmsweise, sieht, wie viel von jedem Geldeingang übrig ist, lädt Sicherungen als PDF herunter, löscht danach die gesicherten Einträge und liest alte Sicherungen wieder ein.

## Product Purpose

Lückenloser, prüfbarer Nachweis jeder Zahlung von CoM Kenya. Bei Finanzprüfungen muss für jede Zahlung eine Rechnung vorliegen; fehlt auch nur eine, können die deutschen Behörden das gesamte Projekt „Children of Mathare“ schließen. Erfolg heißt: jede Zahlung ist mit lesbarem Beleg erfasst, Unvollständiges wird sichtbar und nachgeholt, und der Schatzmeister sieht jederzeit den Restbetrag pro Geldeingang.

## Positioning

Kein kommerzielles Produkt, sondern ein internes Werkzeug zwischen zwei Partnerorganisationen. Was es ausmacht: Belege zuerst (jede Zahlung braucht ein Foto der Rechnung), sekündliches automatisches Speichern auch offline, Ende-zu-Ende-Verschlüsselung, Zeiträume „von einem Geldeingang bis zum nächsten“ und eine PDF-Sicherung mit eingebetteten, wieder einlesbaren Daten.

## Operating Context

- **Kenia-Team:** Passwort und Sprache → vollständiger Name → „Geldeingang“ oder „Bezahlung“ → Zahlungen zeilenweise erfassen (Beschreibung, Datum per Kalender, Betrag in KSH, Foto(s) der Rechnung, optional Screenshot der M-PESA-Transaktion, eigener Hinweis) → „Speichern“. Vollständiges wandert in „Erfolgreich eingetragene finanzielle Ausgaben“ (nicht mehr änderbar), Unvollständiges in die rote Tabelle „Unvollständige Eingaben“ ganz oben (später ergänzbar).
- **Schatzmeister:** Geldeingänge links (grün) mit den Ausgaben bis zum nächsten Geldeingang (rot) und dem Rest; rote Tabelle mit Ausrufezeichen bei Einträgen älter als eine Woche und Knopf „ausnahmsweise genehmigen“; Erfolgstabelle; „Aktuelle Datenlage herunterladen“ (PDF) → danach Löschen; „Sicherungen hochladen“ mit filter- und sortierbarer Tabelle und aufklappbaren Zeilen.
- **Betrieb:** Oberfläche auf GitHub Pages unter https://children-of-finances.children-of-mathare.de, Speicher-Schnittstelle als Cloudflare Worker mit D1-Datenbank (Speicherort EU).

## Capabilities and Constraints

- Reines HTML/CSS/JavaScript (ES-Module) ohne Build-Schritt; Bibliothek nur pdf-lib (lokal, wird nur für den Schatzmeister nachgeladen).
- Strenge Content-Security-Policy: nur eigene Dateien, keine externen Schriften oder CDNs. Eine Schriftart müsste selbst gehostet werden. GitHub Pages erlaubt keine eigenen HTTP-Header.
- Schlank bleiben: langsame, teure mobile Daten in Kenia.
- Lesbar im Sonnenlicht auf günstigen Handys; große Bedienflächen für den Daumen.
- Fotos werden im Browser auf max. 2000 px verkleinert; Vorschaubilder in den Tabellen, Vergrößerung mit „×“ oben rechts.
- Die vom Auftraggeber vorgegebenen Texte (Spaltenüberschriften, Hinweis in der Sprechblase, Text des Warnkastens, Tabellentitel, Knopfbeschriftungen) sind feste Inhalte.

## Brand Commitments

- Name „Children of Finances“; Organisationen „Children of Mathare Kenya (CoM Kenya)“ und „Children of Mathare Germany“.
- Die deutsche und die kenianische Flagge sind Teil des Designs.
- Orange ist die Leitfarbe (Überschriften, Knöpfe, Akzente); längere Texte in einer gut lesbaren neutralen Farbe (Entscheidung vom 18.10.2026, ersetzt „Schrift grundsätzlich orange“).
- Pflicht-Elemente: rote Tabelle „Unvollständige Eingaben“ ganz oben; grüner Text „Alle bisher angelegten Einträge waren vollständig. Danke!“, wenn nichts fehlt; darüber ein verblasster orangener Kasten mit dem Warnhinweis (darf eine andere Schriftfarbe haben); Geldeingänge beim Schatzmeister grün, Ausgaben rot.

## Evidence on Hand

Echte Inhalte sind die Oberflächentexte in drei Sprachen (`public/js/i18n.js`). Es gibt kein Logo, keine Fotos und keine Bildmaterialien des Vereins. Nichts davon darf erfunden werden.

Fotos aus offenen Sammlungen (Wikimedia Commons), am 19.10.2026 vom Auftraggeber ausgewählt: Nairobis Skyline vom Uhuru Park (Cover der Anmeldung), Ngong Hills (Leerzustand Schatzmeister), ein Gemüsestand (Leerzustand Team). Sie zeigen die Welt um den Verein, nie den Verein selbst: keine erkennbaren Personen, keine Kinder, keine Elendsbilder, keine dominanten Logos. Jedes Foto trägt seinen Bildnachweis sichtbar; bei Datensparmodus werden sie nicht geladen.

## Product Principles

1. Jede Rechnung zählt: die Oberfläche führt zu vollständigen Einträgen, ohne zu schimpfen.
2. Nichts geht verloren: Speichern passiert automatisch, sichtbar und vertrauenswürdig, auch offline.
3. Lesbar in der Sonne auf einem günstigen Handy, mit dem Daumen bedienbar.
4. Der Schatzmeister erkennt Geld und Lücken auf einen Blick.
5. Schlank: funktioniert auf langsamen, teuren Verbindungen.

## Accessibility & Inclusion

Drei Sprachen (Deutsch, Englisch, Swahili) mit teils sehr langen Texten; unterschiedliche Erfahrung mit digitalen Werkzeugen; hoher Kontrast für draußen; Information nie nur über Farbe (rote Tabelle und Status tragen immer auch Text).
