---
version: 1
slug: "public-index-html"
primary_target: "public/index.html"
related_targets: ["public/js/view-user.js","public/js/view-admin.js","public/css/style.css"]
---

# Surface: Children of Finances (gesamte Oberfläche: Anmeldung, Kenia-Team, Schatzmeister)

Mode: Operate. Primär am Handy draußen bei Tageslicht (Kenia-Team), sekundär Laptop (Schatzmeister). Langsame, teure mobile Daten.

## Direction contract

THESIS: Jeder Geldeingang ist eine Kassettenseite mit fester Länge, die nicht überlaufen darf; jede Zahlung ist ein Titel darauf. Die Oberfläche verweigert den grauen Verwaltungs-Standard mit Karten-Raster und das dunkle Neon-Finanz-Klischee.

OWN-WORLD: Fast weißer Inlay-Karton (#FDFDFB), Kugelschreiber-Blau für alles, was Menschen eintragen (Werte, Eingaben, Beträge), tiefe Tinte für Fließtext, Bleistift-Grau für Vorläufiges (Entwürfe), Orange als einziger gedruckter Akzent (dreifacher Marken-Streifen, Überschriften, Hauptknöpfe). Pflichtfarben: Rot für Unvollständiges, Grün für Geldeingänge, Vollständiges und den Danke-Text. Handgeschriebene Blockschrift (Patrick Hand SC, selbst gehostet) nur für Wortmarke, Überschriften und das Band; Bedienelemente und Tabellendaten in der Systemschrift. Rahmen 2 px in Kugelschreiber-Blau, Zeilenlinien in verblasstem Blau.

STORY: Das Team sieht sofort, wie viel vom aktuellen Geldeingang übrig ist, was noch fehlt (rot, ganz oben) und trägt die nächste Zahlung mit Foto in Sekunden ein; nichts geht verloren. Der Schatzmeister überblickt alle Seiten (Zeiträume), genehmigt Lücken und sichert.

FIRST VIEWPORT: Handy 390 px: weiße Kopfzeile mit beiden Flaggen, Wortmarke in Blockschrift und orangem Dreifach-Streifen; darunter Name und Speicherstatus. Dann das Band des aktuellen Zeitraums (Datum und Betrag des Geldeingangs, Füllbalken, bezahlt/übrig rechtsbündig). Darunter der verblasste orange Warnkasten, dann die rote Tabelle bzw. der grüne Danke-Satz, dann „Was möchtest du tun?" mit Geldeingang/Bezahlung und (volle Breite) der Geldanfrage. Hauptaktion: orangefarbener Knopf „Speichern" unter der Eingabe. Schatzmeister: Seiten-Spalte links mit allen Zeiträumen als Bänder, rechts rote Tabelle, Erfolgstabelle, Sichern.

FORM: Herausforderer aus dem Katalog (vernacular-ephemera-cassette-j-card), vom Nutzer gewählt statt der zugeteilten Richtung (eigene Liste Nr. 4, Duka-Schild); Signatur: das Band „Seite darf nicht überlaufen" (Füllbalken pro Geldeingang, Überlauf rot, Beträge rechtsbündig wie Laufzeiten); Wechsel Geldeingang/Bezahlung als kurzer Seitenwechsel. seed:949a8e65f851fb45

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Amendments

- 19.10.2026, vom Nutzer entschieden („Fotos auch in der App"): echte, frei lizenzierte Fotos aus Wikimedia Commons, vom Nutzer aus geprüften Kandidaten ausgewählt. Cover der Hülle auf Anmeldung und Namensschritt (Foto als Vorderseite, Formular als Innenseite, getrennt durch eine 2-px-Falz; Handy oben 16:9, Desktop links). Leerzustände: Gemüsestand (Team), Ngong Hills (Schatzmeister). Jedes Foto trägt Titel, Urheber, Lizenz und „zugeschnitten und verkleinert" sichtbar darunter; höchstens 800 px breit als WebP; bei Datensparmodus nicht geladen. Keine erkennbaren Personen, keine Kinder, keine Elendsbilder, keine dominanten Logos.
- 19.10.2026, vom Nutzer entschieden („Wenn du das für richtig hältst, machen wir das!“): Am Handy zeigt die rote Tabelle des Teams jeden unvollständigen Eintrag zuerst als kompakte Zeile (was, Betrag, „Fehlt: …“, wer/wann) mit dem Knopf „Ergänzen“; ein Tipp klappt das Formular auf. Am Desktop bleibt sie direkt ausfüllbar.
- 29.10.2026, vom Nutzer entschieden: Geldeingänge muss der Schatzmeister bestätigen. Unbestätigte zählen sofort und tragen überall den Chip „noch nicht bestätigt“ (gelb), bestätigte beim Schatzmeister „bestätigt“ (grün). Im Band der Seitenleiste: „Bestätigen“ (orange) und „Löschen“ (rot, mit Häkchen-Abfrage, auch für bestätigte), Hinweis „doppelt eingetragen?“ bei gleichem Datum und Betrag, oben ein Wartehinweis. Ungefährer Euro-Wert „(ca. … €)“ klein unter dem KSh-Betrag des Geldeingangs, nur im Band des Schatzmeisters, nie bei Ausgaben.
- 08.11.2026, vom Nutzer entschieden: Geldanfragen. Die Frage heißt jetzt „Was möchtest du tun?“; als dritte Kachel über die volle Breite „Bereits planbare Kosten der Zukunft eintragen und bei CoM Germany anfragen“ (Kalender-Symbol, gedrückt in Kugelschreiber-Blau, weil sie nichts Geschehenes einträgt). Formular mit fünf Pflichtfragen (Person, was das Budget alles bezahlt mit Erklärung „alles aufzählen“, Zeitraum von/bis, Betrag in KSH, spätester Tag), Knopf „Anfragen, ob dieses Budget realisierbar ist“ (orange). Jede Anfrage als Karte (2-px-Rahmen in Kugelschreiber-Blau): wer und wie viel oben, darunter Bezahlt/Zeitraum/Spätestens, dann der Stand als Zeile: gelb „Das deutsche Team hat diese Anfrage noch nicht gesehen“ bzw. „Noch nicht als gelesen markiert“, grün „Gelesen und in Absprache“. Beim Schatzmeister ganz oben das Feld „Geldanfragen“ mit „(ca. … €)“ zum Kurs von heute, „Gelesen und in Absprache“ (orange) und „Löschen“ (rot). Eine gelöschte Anfrage meldet beim Team vier Tage lang oben einen gelben, gestrichelt gerahmten Hinweis (abgelegt).

## Unresolved

- Swahili-Texte von Muttersprachler prüfen lassen (inhaltlich, nicht gestalterisch).
