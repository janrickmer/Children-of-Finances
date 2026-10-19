---
name: Children of Finances
description: "Finanzprotokoll von CoM Kenya und CoM Germany als Kassetten-Hülle: heller Inlay-Karton, Kugelschreiber-Blau, ein einziger oranger Druckakzent, lesbar im Sonnenlicht."
colors:
  paper: "#FDFDFB"
  paper-2: "#F2F4FA"
  paper-3: "#E6EAF4"
  white: "#FFFFFF"
  ink: "#141B3D"
  ink-2: "#4A5373"
  pen: "#1E3A8A"
  pen-faded: "#6B86C5"
  rule: "#D3DBEE"
  pencil: "#6B6B6B"
  pencil-line: "#A6A6A6"
  orange: "#BE400B"
  orange-deep: "#A33608"
  orange-bright: "#F06A1D"
  orange-wash: "#FFE6D2"
  orange-ink: "#3D1F09"
  red: "#B42228"
  red-wash: "#FCE9E9"
  red-ink: "#8F1A1F"
  green: "#17703A"
  green-wash: "#E5F3E9"
  amber: "#7A4B00"
  amber-wash: "#FFF1CC"
typography:
  display:
    fontFamily: "'Patrick Hand SC', 'Comic Neue', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 400
    lineHeight: 1.15
  headline:
    fontFamily: "'Patrick Hand SC', 'Comic Neue', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0.01em"
  wordmark:
    fontFamily: "'Patrick Hand SC', 'Comic Neue', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.01em"
  title-lg:
    fontFamily: "'Patrick Hand SC', 'Comic Neue', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 400
    lineHeight: 1.05
  title:
    fontFamily: "'Patrick Hand SC', 'Comic Neue', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.1
  title-sm:
    fontFamily: "'Patrick Hand SC', 'Comic Neue', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.15
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.5
  button:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.2
  meta:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label-sm:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.35
  caption:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  badge: "4px"
  radius: "6px"
  radius-lg: "10px"
  pill: "999px"
  round: "50%"
spacing:
  hair: "4px"
  tight: "8px"
  gap: "12px"
  inset: "16px"
  card: "20px"
  group: "28px"
  section: "40px"
  section-mobile: "32px"
  gutter-mobile: "14px"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.radius}"
    padding: "0 18px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.orange-deep}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.pen}"
    typography: "{typography.button}"
    rounded: "{rounded.radius}"
    padding: "0 18px"
    height: "46px"
  button-secondary-hover:
    backgroundColor: "{colors.paper-2}"
  button-danger:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.red}"
    typography: "{typography.button}"
    rounded: "{rounded.radius}"
    padding: "0 18px"
    height: "46px"
  button-danger-hover:
    backgroundColor: "{colors.red-wash}"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    typography: "{typography.button}"
    rounded: "{rounded.radius}"
  button-small:
    padding: "0 12px"
    height: "38px"
  button-approve:
    padding: "8px 12px"
    height: "44px"
  info-button:
    textColor: "{colors.pen}"
    rounded: "{rounded.round}"
    size: "30px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.pen}"
    typography: "{typography.body}"
    rounded: "{rounded.radius}"
    padding: "10px 12px"
    height: "46px"
  lang-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.pen}"
    padding: "0 12px"
    height: "36px"
  lang-button-active:
    backgroundColor: "{colors.pen}"
    textColor: "{colors.white}"
  tape-band:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.radius-lg}"
    padding: "12px 16px"
  tape-total:
    textColor: "{colors.green}"
    typography: "{typography.title-lg}"
  tape-track:
    backgroundColor: "{colors.white}"
    height: "14px"
  tape-fill:
    backgroundColor: "{colors.red}"
  warning-box:
    backgroundColor: "{colors.orange-wash}"
    textColor: "{colors.orange-ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.radius-lg}"
    padding: "14px 16px"
  red-head:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.title-lg}"
    padding: "12px 16px"
  red-count:
    backgroundColor: "{colors.white}"
    textColor: "{colors.red}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  all-good:
    backgroundColor: "{colors.green-wash}"
    textColor: "{colors.green}"
    rounded: "{rounded.radius-lg}"
    padding: "14px 16px"
  choice:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.radius-lg}"
    padding: "14px 16px"
    height: "56px"
  choice-expense-active:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.white}"
  choice-income-active:
    backgroundColor: "{colors.green}"
    textColor: "{colors.white}"
  period-title:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.radius}"
    padding: "8px 12px"
  period-title-current:
    backgroundColor: "{colors.paper-3}"
  badge-complete:
    backgroundColor: "{colors.green-wash}"
    textColor: "{colors.green}"
    rounded: "{rounded.badge}"
    padding: "2px 9px"
  badge-approved:
    backgroundColor: "{colors.amber-wash}"
    textColor: "{colors.amber}"
    rounded: "{rounded.badge}"
    padding: "2px 9px"
  badge-incomplete:
    backgroundColor: "{colors.red-wash}"
    textColor: "{colors.red-ink}"
    rounded: "{rounded.badge}"
    padding: "2px 9px"
  badge-draft:
    textColor: "{colors.pencil}"
    rounded: "{rounded.badge}"
    padding: "2px 9px"
  thumb:
    backgroundColor: "{colors.paper-2}"
    rounded: "{rounded.radius}"
    size: "64px"
  bubble:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.radius-lg}"
    padding: "14px 16px"
  modal:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.radius-lg}"
    padding: "22px"
    width: "520px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.radius-lg}"
    padding: "12px 14px"
  photo-credit:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    typography: "{typography.caption}"
    padding: "6px 12px 8px"
---

# Design System: Children of Finances

## Overview

**Creative North Star: "Die Kassetten-Hülle"**

Children of Finances sieht aus wie das Inlay einer selbst bespielten Musikkassette: fast weißer Karton, darauf in Kugelschreiber eingetragen, was Menschen erfassen, und in einem einzigen Orange gedruckt, was die Hülle selbst sagt. Jeder Geldeingang ist eine Kassettenseite mit fester Länge, jede Zahlung ein Titel darauf, ihr Betrag rechtsbündig wie eine Laufzeit. Die Seite darf nicht überlaufen. Das ist das Band, die Signatur des Systems.

Die Oberfläche ist ein Arbeitswerkzeug (Modus Operate). Sie ist für ein günstiges Handy draußen im kenianischen Tageslicht gebaut und für den Laptop des Schatzmeisters. Deshalb ist sie hell, kontrastreich und flach: tiefe Tinte auf Karton (16,44:1), Kugelschreiber-Blau für Werte (10,17:1), 2-px-Striche statt Schatten und große Bedienflächen für den Daumen. Dichte entsteht durch Tabellen, Titelzeilen und Bänder, nicht durch ein Karten-Raster. Die handgeschriebene Blockschrift trägt Wortmarke, Überschriften und den Betrag auf dem Band. Alles, was bedient, gelesen oder geprüft werden muss, steht in der Systemschrift.

Schlank zu sein gehört zur Gestalt: eine einzige selbst gehostete Schrift (23 KB), Fotos aus offenen Sammlungen höchstens 800 px breit als WebP, im Datensparmodus gar nicht geladen. Die Welt verweigert ausdrücklich den grauen Verwaltungs-Standard mit Karten-Raster und das dunkle Neon-Finanz-Klischee.

**Key Characteristics:**
- Heller Inlay-Karton als Grund, gewählt für Sonnenlicht und nicht nach Kategorie.
- Drei Tinten mit fester Bedeutung: Kugelschreiber-Blau für Eingetragenes, tiefe Tinte für Text, Bleistift für Vorläufiges; dazu Orange als einziger gedruckter Akzent.
- Rahmen sind 2-px-Striche in Kugelschreiber-Blau; Schatten tragen nur schwebende Ebenen.
- Patrick Hand SC (selbst gehostet) für Wortmarke, Überschriften und das Band, die Systemschrift für Bedienung und Daten.
- Das Band: ein Füllbalken pro Geldeingang, Überlauf in Rot, Beträge rechtsbündig mit Tabellenziffern.
- Pflichtfarben: Rot für Unvollständiges, Grün für Geldeingänge, Vollständiges und den Danke-Satz, nie als einziges Signal.
- Beide Flaggen und der dreifache orange Streifen bilden die Kopfzeile.
- Knappe Bewegung: Druck-Feedback, Eintritt schwebender Ebenen und ein kurzer Seitenwechsel beim Umschalten, jeweils mit Ersatz bei reduzierter Bewegung.

## Colors

Ein heller Karton mit drei Tinten (Tinte, Kugelschreiber, Bleistift), einem gedruckten Orange und zwei Pflicht-Signalfarben.

### Primary
- **Hüllen-Orange** (`orange`): die Leitfarbe. Sie färbt Überschriften in Blockschrift, den einen Hauptknopf je Bereich („Speichern“, „Anmelden“, „Aktuelle Datenlage herunterladen“), die gedrückte Wahl „Bezahlung“, die Plakette „Aktueller Zeitraum“ und das Warnsymbol. Auf Karton erreicht sie 5,25:1, weiße Schrift darauf 5,35:1.
- **Gedrücktes Orange** (`orange-deep`): Hover des Hauptknopfs, nur bei feinem Zeiger; weiße Schrift darauf 6,80:1. Es steht im Stylesheet als Literal, nicht als Custom Property.
- **Streifen-Orange** (`orange-bright`): gehört nur dem dreifachen Marken-Streifen unter der Kopfzeile und den drei Eckstreifen am Band. Mit 3,04:1 trägt es nie Text.
- **Verblasstes Orange** (`orange-wash`) mit **Orange-Tinte** (`orange-ink`): der Warnkasten. Text darauf 12,52:1, das orange Warnsymbol 4,46:1.

### Secondary
- **Kugelschreiber-Blau** (`pen`): alles, was Menschen eintragen, also Werte in Eingabefeldern und Daten in Tabellen. Dazu die Wortmarke, Links, die aktive Sprache und jeder 2-px-Rahmen. Auf Karton 10,17:1.
- **Verblasstes Blau** (`pen-faded`): Rahmen von Eingabefeldern, Vorschaubildern, Auswahlkacheln und Geister-Knöpfen in Ruhe, der Fokusring, die Bildlaufleiste sowie Sortier- und Aufklapp-Symbole in Ruhe. Auf Karton 3,53:1, ausreichend als Grenze eines Bedienelements.

### Tertiary
Die Pflichtfarben aus dem Auftrag.
- **Prüfungs-Rot** (`red`): ausschließlich für Unvollständiges, Fehlendes, Überlauf und Gefahr. Dazu gehören die rote Tabelle „Unvollständige Eingaben“, Pflichtsternchen, Fehlermeldungen, „Bezahlt“ und die Füllung im Band, Ausgaben beim Schatzmeister, Lösch-Knöpfe und der Status „offline“. Auf Karton 6,44:1, weiße Schrift darauf 6,56:1.
- **Rot-Hauch** (`red-wash`) mit **Rot-Tinte** (`red-ink`): fehlende Zellen, der Tabellenkopf der roten Tabelle beim Schatzmeister und die Plakette „unvollständig“ (7,69:1).
- **Eingangs-Grün** (`green`): Geldeingänge (der Betrag im Band, Zeilen der Erfolgstabelle, die gedrückte Wahl „Geldeingang“), außerdem „vollständig“, „Alles gespeichert“ und der Danke-Satz. Auf Karton 6,04:1, weiße Schrift darauf 6,15:1.
- **Grün-Hauch** (`green-wash`): Fläche des Danke-Satzes und der Plakette „vollständig“ (5,37:1).
- **Bernstein** (`amber`) auf **Bernstein-Hauch** (`amber-wash`): nur für die Plakette „ausnahmsweise genehmigt“ (6,60:1).

### Neutral
- **Inlay-Karton** (`paper`): Seitengrund und Grund jeder gerahmten Fläche.
- **Getönter Karton** (`paper-2`): Tabellenköpfe, Zeitraum-Überschriften, Hover-Fläche, Download-Bereich und der Fotorahmen beim Laden.
- **Kräftiger Karton** (`paper-3`): der aktuelle Zeitraum und der geöffnete Info-Knopf.
- **Weiß** (`white`): Eingabefelder, Sprechblase und Bandspur, außerdem Schrift auf Orange, Rot, Grün, Kugelschreiber-Blau und Tinte.
- **Tiefe Tinte** (`ink`): Fließtext und Feldbeschriftungen (16,44:1), dazu der Grund der Meldungen.
- **Verdünnte Tinte** (`ink-2`): Nebentexte, Untertitel, Tabellenköpfe und Bildnachweise (7,43:1).
- **Bleistift** (`pencil`): Vorläufiges. Dazu gehören Platzhalter (5,33:1 auf Weiß), der Hinweis „nicht gespeichert“, die Plakette „Entwurf“ und das leere Band.
- **Bleistiftlinie** (`pencil-line`): gestrichelte Ränder von Entwürfen und leerem Band (2,39:1). Sie begleitet nur; der Zustand steht immer auch als Text da.
- **Zeilenlinie** (`rule`): 1-px-Linien zwischen Tabellenzeilen und Titelzeilen und der Rahmen der Zeitraum-Filter bei den Sicherungen (1,36:1). Sie rahmt nie ein Bedienelement.

Die Flaggen Deutschlands und Kenias stehen in ihren amtlichen Farben als gezeichnetes SVG in der Kopfzeile. Diese Farben gehören nicht zur Palette und werden nie in die Oberfläche übernommen. Die Textmarkierung ist hellorange (#FFD3B3) mit Tinte (12,14:1), die Schreibmarke Kugelschreiber-Blau, `accent-color` Orange.

### Named Rules
**Die Kugelschreiber-Regel.** Was ein Mensch eingetragen hat, steht in Kugelschreiber-Blau; was die Hülle sagt (Überschriften, Hauptaktion), ist orange gedruckt; was man liest, ist Tinte. Ein Wert wechselt seine Farbe nur für eine Pflichtfarbe (Geldeingang grün, Fehlendes rot), nie, weil er wichtig ist.

**Die Ein-Druck-Regel.** Orange ist der einzige Akzent. Es gibt keine zweite Schmuckfarbe, und `orange-bright` gehört nur den Streifen, nie dem Text.

**Die Pflichtfarben-Regel.** Rot heißt unvollständig, fehlend, überzogen oder gefährlich; Grün heißt Geldeingang, vollständig, gespeichert oder Danke. Keine der beiden ist Schmuck, und keine trägt eine Bedeutung allein: Ein Wort oder ein Symbol sagt sie mit. Beim Schatzmeister sind Geldeingänge grün und Ausgaben rot.

## Typography

**Display Font:** Patrick Hand SC (selbst gehostet, OFL, 23 KB WOFF2, `font-display: swap`; Rückfall Comic Neue, dann Systemschrift)
**Body Font:** Systemschrift (system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial)

**Character:** Handgeschriebene Blockschrift in Kapitälchen wie die Beschriftung auf einer selbst bespielten Kassette, gepaart mit der nüchternen Systemschrift des Geräts für alles, was bedient, gelesen und geprüft wird. Die Blockschrift hat nur einen Schnitt; Hierarchie entsteht über Größe und Farbe, nie über künstliches Fett.

### Hierarchy
- **Display** (400, 2.125rem, 1.15): der Ansichtstitel „Ansicht Schatzmeister“ in Orange.
- **Headline** (400, 1.75rem, 1.15, 0.01em): Abschnittsüberschriften und Titel der Anmeldung in Orange. Die **Wortmarke** hat dieselbe Größe mit Zeilenhöhe 1 und steht in Kugelschreiber-Blau (am Handy 1.375rem).
- **Title groß** (400, 1.625rem, 1.05): der Titel der roten Tabelle in Weiß; der Betrag des Geldeingangs im Band in Grün mit Tabellenziffern (im schmalen Band 1.75rem).
- **Title** (400, 1.5rem, 1.1): Titel der Auswahlkacheln „Geldeingang“ und „Bezahlung“.
- **Title klein** (400, 1.25rem, 1.15): Zeitraum-Überschriften über der Erfolgstabelle.
- **Body** (400, 1rem, 1.5): Fließtext; Werte in Eingabefeldern mit 500.
- **Body klein** (400, 0.9375rem, 1.5): Warnkasten, Sprechblase, Fuß des Bands, Fehlermeldungen (600).
- **Label** (600, 0.9375rem): Feldbeschriftungen. Knöpfe haben dieselbe Größe und dasselbe Gewicht mit Zeilenhöhe 1.2.
- **Meta** (400, 0.875rem): Hinweise, Speicherplatz, kleine Knöpfe, Speicherstatus (600).
- **Label klein** (600, 0.8125rem, 1.35): Tabellenköpfe, Zellbeschriftungen am Handy, Plaketten (700).
- **Caption** (400, 0.6875rem, 1.4): der Bildnachweis unter Fotos.

Überschriften laufen mit `text-wrap: balance`. Die Texte kommen in drei Sprachen und sind teils sehr lang; Swahili und Deutsch brechen in Knöpfen und Kacheln um, statt abgeschnitten zu werden.

### Named Rules
**Die Blockschrift-Regel.** Patrick Hand SC nur für Wortmarke, Überschriften, Auswahlkacheln und den Betrag im Band. Nie für Knöpfe, Feldbeschriftungen, Tabellendaten oder Fließtext: Was bedient oder geprüft wird, steht in der Systemschrift.

**Die Laufzeit-Regel.** Beträge stehen rechtsbündig mit Tabellenziffern (`tabular-nums`) und ohne Umbruch, wie Laufzeiten auf einer Hülle; im Band mit „KSh“ davor.

## Layout

Eine ruhige Spalte auf Karton, keine Raster aus gleich großen Kacheln. Die App ist zentriert und höchstens 1440 px breit, mit 20 px Rand und 72 px Luft am Ende; am Handy (bis 760 px) sind es 14 px und 56 px.

**Kopfzeile.** Links die beiden Flaggen (22 px hoch), daneben die Wortmarke und der Untertitel „Children of Mathare · Kenya & Germany“. Rechts stehen Sprachwahl, Speicherstatus, Name und Abmelden. Darunter läuft der dreifache orange Streifen über die volle Breite. Am Handy wird die Kopfzeile zu einem Raster: Marke und Abmelden oben, Sprachwahl (DE/EN/SW) und Status in der Mitte, der Name unten. Die Flaggen stehen dann übereinander (14 px), der Untertitel entfällt.

**Kenia-Team.** Die Reihenfolge ist fest: das Band des aktuellen Zeitraums und der Warnkasten (Abstand 14 px), dann die rote Tabelle oder der grüne Danke-Satz (18 px darunter), dann „Was möchtest du eintragen?“ mit den zwei Auswahlkacheln und schließlich die Erfolgstabelle. Abschnitte stehen 40 px auseinander, am Handy 32 px. Die Kacheln liegen nebeneinander (höchstens 820 px), am Handy untereinander. Das Formular für einen Geldeingang ist höchstens 620 px breit; die Tabelle für Zahlungen nutzt die volle Breite.

**Schatzmeister.** Eine Seitenspalte von 300 px mit allen Zeiträumen als Bänder, klebend am oberen Rand. Rechts folgen rote Tabelle, Erfolgstabelle und Download-Bereich, mit 28 px Abstand. Unter 980 px rutscht die Spalte über den Inhalt.

**J-Karte.** Anmeldung und Namensschritt sind höchstens 440 px breit, das Foto oben im Format 16:9. Ab 900 px wird die Karte zweispaltig (bis 960 px): Foto links, Formular rechts mit höchstens 440 px.

**Tabellen am Handy.** Die bearbeitbaren Eingabetabellen des Teams werden zu Blättern: Jede Zeile ist ein gerahmtes Blatt, jede Zelle trägt ihre Beschriftung. Die Erfolgstabellen und die rote Tabelle des Schatzmeisters werden zu Titelzeilen wie auf einer Kassettenhülle. Zeile 1 zeigt was und Betrag, der Betrag rechts angeschlagen. Zeile 2 beginnt mit der Status-Plakette, dann folgt Datum · Art; in der roten Tabelle stehen dort Plakette und „Fehlt: …“ in Rot. Zeile 3 nennt, wer eingetragen hat, beim Schatzmeister mit „Eingetragen am …“, in der roten Tabelle mit „Begonnen am …“. Darunter folgen die Belege (sie dürfen umbrechen), die Notiz und in der roten Tabelle der Knopf „ausnahmsweise genehmigen“. Titelzeilen haben keinen Kasten; eine 1-px-Linie in Zeilenlinie trennt sie, in der roten Tabelle eine rote. Leere Zellen entfallen.

**Rhythmus.** Enge Gruppen mit 4 bis 8 px, Elemente mit 12 px Abstand (Knopfreihen, Kacheln, Kopf und Fuß im Band), 16 px Innenabstand in Kästen, 20 px in Karten und Formularen, 28 bis 40 px zwischen Bereichen. Ein Zeitraumtitel hat 28 px Luft darüber und 8 px darunter.

**Umbrüche.** 420 px (Container-Abfrage am Band), 760 px (Handy), 900 px (J-Karte zweispaltig), 980 px (Spalte des Schatzmeisters). Hover-Zustände gelten nur bei `(hover: hover) and (pointer: fine)`.

### Named Rules
**Die Daumen-Regel.** Eingabefelder und Hauptknöpfe sind mindestens 46 px hoch, Auswahlkacheln 56 px, der Knopf „ausnahmsweise genehmigen“ 44 px, kleine Knöpfe 38 px. Die Sprachwahl hat im Anmeldefenster 44 px und in der Kopfzeile am Handy 40 px, „Abmelden“ ist dort 44 × 40 px. Bleibt ein Element sichtbar kleiner, wird seine Tippfläche größer gezogen: Der Info-Knopf misst 30 px und nimmt 44 px an. Knöpfe stehen 12 px auseinander.

## Elevation & Depth

Das System ist flach. Tiefe entsteht aus dem 2-px-Strich in Kugelschreiber-Blau und aus drei Kartonstufen (`paper`, `paper-2`, `paper-3`). Einen Schatten gibt es nur für Ebenen, die über der Seite schweben und wieder verschwinden: Sprechblase, Bestätigungsdialog und Meldung. Dialoge legen einen Schleier aus Tinte über die Seite (rgba(20, 27, 61, 0.55)), die Bildvollansicht einen dunkleren (rgba(12, 15, 32, 0.9)). Der Ring um die Flaggen (1,5 px Tinte) und um die Plakette „Entwurf“ (1,5 px Bleistiftlinie, innen) ist ein Strich, kein Schatten.

### Shadow Vocabulary
- **Schwebend** (`box-shadow: 0 12px 32px rgba(20, 27, 61, 0.18), 0 2px 6px rgba(20, 27, 61, 0.12)`): Sprechblase, Bestätigungsdialog, Meldung.
- **Fokus-Hof** (`box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.18)`): nur am fokussierten Eingabefeld, zusammen mit dem Wechsel des Rahmens auf Kugelschreiber-Blau.

### Named Rules
**Die Flach-auf-Karton-Regel.** In Ruhe liegt alles flach auf dem Karton, gerahmt von einem Strich. Einen Schatten bekommt nur, was über der Seite schwebt und wieder verschwindet.

## Shapes

Leicht gerundete Ecken auf zwei Stufen. Bedienelemente haben 6 px (Knöpfe, Eingabefelder, Vorschaubilder, Zeitraumtitel). Behälter haben 10 px: Karten, Band, Warnkasten, rote Tabelle, Danke-Satz, Dialog, Sprechblase, Meldung und J-Karte. Plaketten und die Plakette „Aktueller Zeitraum“ haben 4 px, die Zahl im Kopf der roten Tabelle ist eine Pille. Info-Knopf, Entfernen-Knopf am Vorschaubild und der Schließen-Knopf der Vollansicht sind rund. Die Spur im Band ist 14 px hoch mit 7 px Rundung, die Flaggen haben 2 px.

Rahmen sind 2 px: durchgezogen in Kugelschreiber-Blau für Karten, Band, Knöpfe und Sprachwahl, in verblasstem Blau für Eingabefelder, Vorschaubilder, Auswahlkacheln und Geister-Knöpfe in Ruhe, in Rot für die rote Tabelle. Gestrichelt heißt vorläufig oder abgelegt: Entwürfe und leeres Band in Bleistiftlinie, ein archivierter Geldeingang in Kugelschreiber-Blau, der Bereich der Sicherungen in verblasstem Blau. Zeilenlinien in Tabellen und zwischen Titelzeilen sind 1 px.

Wiederkehrende Formen sind der dreifache Streifen und die Falz. Der Streifen läuft quer unter der Kopfzeile (drei 3-px-Linien, 3 px Abstand), steht klein in der rechten oberen Ecke jedes gefüllten Bands (drei 4-px-Balken, 18 px hoch) und erscheint im Favicon. Die Falz ist ein 2-px-Strich in Kugelschreiber-Blau zwischen Foto und Formular der J-Karte, am Handy waagerecht, am Desktop senkrecht.

### Named Rules
**Die Zwei-Pixel-Regel.** Jeder Rahmen ist ein 2-px-Strich, 1 px nur für Zeilenlinien in Tabellen. Gestrichelt heißt vorläufig oder abgelegt.

**Die Drei-Streifen-Regel.** Der dreifache orange Streifen ist das gedruckte Zeichen der Hülle: quer unter der Kopfzeile, klein in der Ecke jedes gefüllten Bands, im Favicon. Er wird nicht als Schmuck auf andere Flächen verteilt.

## Components

### Buttons
Fest und greifbar, wie ein Druckknopf am Kassettenrekorder.
- **Shape:** leicht gerundet (6 px), 2-px-Rahmen, mindestens 46 px hoch, 18 px seitlich, Symbol (18 px) und Text mit 8 px Abstand.
- **Primary:** Orange mit weißer Schrift, höchstens einer je Bereich („Speichern“, „Anmelden“, „Aktuelle Datenlage herunterladen“). Hover: gedrücktes Orange.
- **Secondary:** Karton mit Rahmen und Schrift in Kugelschreiber-Blau („Weitere Zahlung hinzufügen“, „Bild hochladen“, „Sicherungen hochladen“, „Abbrechen“). Hover: getönter Karton.
- **Danger:** Karton mit Rahmen und Schrift in Rot, Hover im Rot-Hauch. Wer gesicherte Einträge löschen will, muss im Dialog zusätzlich ein Häkchen setzen.
- **Ghost:** Rahmen in verblasstem Blau, Schrift in verdünnter Tinte, für leise Nebenaktionen („Abmelden“, „Entwurf löschen“). Am Handy zeigt „Abmelden“ nur das Symbol (44 × 40 px).
- **Small:** 38 px hoch, 12 px seitlich, 0.875rem.
- **Genehmigen:** „ausnahmsweise genehmigen“ ist 44 px hoch mit 8 px × 12 px und Zeilenhöhe 1.2. Am Desktop ist er höchstens 11rem breit und bricht in der Spalte um, in den Titelzeilen am Handy steht er auf einer Zeile.
- **Press / Focus:** Beim Drücken `scale(0.97)` über 160 ms mit `--ease-out`; Farben wechseln in 150 ms. Fokus ist ein 3-px-Umriss in verblasstem Blau mit 2 px Abstand. Ein deaktivierter Knopf hat 55 % Deckkraft und den Zeiger „warten“.

### Chips
- **Plaketten:** 0.8125rem, 700, 4 px Rundung, 2 px × 9 px. „vollständig“ Grün auf Grün-Hauch, „ausnahmsweise genehmigt“ Bernstein auf Bernstein-Hauch, „unvollständig“ Rot-Tinte auf Rot-Hauch, „Entwurf“ Bleistift mit innerem Ring in Bleistiftlinie.
- **Sprachwahl:** ein Segmentknopf mit 2-px-Rahmen in Kugelschreiber-Blau, die Segmente durch 2-px-Linien getrennt. Aktiv ist Kugelschreiber-Blau mit weißer Schrift. In der Kopfzeile am Handy stehen nur die Kürzel DE/EN/SW (40 px hoch), im Anmeldefenster drei gleich breite Knöpfe über die volle Breite (44 px).
- **Auswahlkacheln „Geldeingang“ / „Bezahlung“:** Karton, 2-px-Rahmen in verblasstem Blau, 10 px Rundung, 14 px × 16 px, mindestens 56 px hoch und sonst so hoch wie ihr Inhalt. Der Pfeil (22 px, hinein in Grün, hinaus in Orange) steht ohne Hintergrund vor dem Titel in Blockschrift, der Hinweis in verdünnter Tinte darunter. Hover (feiner Zeiger): Rahmen in Kugelschreiber-Blau. Gewählt ist die Kachel ganz gefüllt, „Bezahlung“ in Orange und „Geldeingang“ in Grün, mit weißem Titel, Pfeil und Hinweis (5,35:1 und 6,15:1). Beim Drücken `scale(0.98)`. Das darunter erscheinende Formular dreht in 240 ms ein wie eine umgedrehte Kassette (`rotateX(-12deg)` aus 6 px Höhe, Drehpunkt oben); bei reduzierter Bewegung wird es nur eingeblendet (160 ms).

### Cards / Containers
- **Corner Style:** 10 px.
- **Background:** Karton.
- **Shadow Strategy:** keine (siehe Elevation & Depth).
- **Border:** 2 px Kugelschreiber-Blau.
- **Internal Padding:** 20 px, am Handy 16 px. Das breite Formular für Zahlungen verliert am Handy seinen Rahmen, weil jede Zeile dort selbst zum Blatt wird.
- **Warnkasten:** verblasstes Orange ohne Rahmen, Orange-Tinte, oranges Warnsymbol (22 px), 14 px × 16 px. Er steht über der roten Tabelle.
- **Danke-Satz:** Grün-Hauch, Grün, 700, 1.0625rem, Häkchen (22 px), 14 px × 16 px. „Alle bisher angelegten Einträge waren vollständig. Danke!“
- **Hinweis auf eine Sicherung:** getönter Karton, Tinte, grünes Häkchen.

### Inputs / Fields
- **Style:** weißes Feld, Wert in Kugelschreiber-Blau (500, 1rem), 2-px-Rahmen in verblasstem Blau, 6 px Rundung, mindestens 46 px hoch, 10 px × 12 px. Der Platzhalter steht in Bleistift (400). Beschriftungen stehen darüber (Label, Tinte) mit 6 px Abstand, Felder 16 px untereinander.
- **Focus:** Der Rahmen wechselt auf Kugelschreiber-Blau, dazu kommt der Fokus-Hof; Übergang 150 ms.
- **Error / Missing:** In der roten Tabelle bekommt eine fehlende Zelle den Rot-Hauch und rote Rahmen an Feld und Upload-Knopf. Darunter steht „Fehlt: …“ in Rot (600, 0.875rem) mit Warnsymbol. Formularfehler stehen in Rot (600) unter dem Feld.
- **Besonderheiten:** Das Datum wird nur über den Kalender gewählt. Beträge haben Tabellenziffern und den Platzhalter „KSH“. Ein Pflichtfeld ist mit rotem Sternchen markiert.

### Navigation
- **Kopfzeile:** Flaggen mit 1,5-px-Ring in Tinte, Wortmarke in Blockschrift (Kugelschreiber-Blau), Untertitel in verdünnter Tinte, darunter der dreifache Streifen. Der Speicherstatus steht als Symbol und Text: „Alles gespeichert“ in Grün mit Häkchen, „Wird gespeichert …“ in Kugelschreiber-Blau mit drehendem Bogen (0,8 s), offline in Rot mit durchgestrichener Wolke. „Name ändern“ ist ein unterstrichener Textknopf in Kugelschreiber-Blau.
- **Mobil:** Die Kopfzeile bildet ein Raster aus drei Zeilen (siehe Layout). Es gibt keine weitere Navigation; die Ansicht ist eine Seite.

### Das Band
Ein Geldeingang als Kassettenseite mit fester Länge, das Signaturelement.
- **Aufbau:** Karton, 2-px-Rahmen in Kugelschreiber-Blau, 10 px Rundung, 12 px × 16 px, drei Eckstreifen oben rechts. Im Kopf stehen links der Absender (Tinte, 600) und „seit <Datum>“ (verdünnte Tinte), rechts der Betrag „KSh …“ in Blockschrift und Grün.
- **Spur:** 14 px hoch, weiß, 2-px-Rahmen in Kugelschreiber-Blau, 7 px Rundung. Die Füllung in Rot wächst mit `scaleX(ausgegeben / Betrag)` von links, höchstens bis 1, über 300 ms mit `--ease-out`.
- **Fuß:** links „Bezahlt“ und Betrag in Rot, rechts „Übrig“ und Betrag in Tinte (800), rechtsbündig mit Tabellenziffern.
- **Überlauf:** Spurrahmen und Restbetrag werden rot, und die Beschriftung heißt „Überzogen um“.
- **Zustände:** Ein archivierter Geldeingang hat einen gestrichelten Rahmen. Ein leeres Band ist gestrichelt in Bleistiftlinie mit Text in Bleistift und ohne Eckstreifen. Vor dem ersten Geldeingang fehlt die Spur.
- **Schmal (Container bis 420 px):** Der Betrag steht über dem Absender (1.75rem), die Beschriftungen im Fuß stehen über den Beträgen.
- **Schatzmeister:** Alle Zeiträume stehen als Bänder in der Seitenspalte, der neueste oben, mit „+ “ vor dem Eingang und „− “ vor den Ausgaben.

**Die Seite-darf-nicht-überlaufen-Regel.** Jeder Geldeingang erscheint als Band, nie als nackte Kennzahl oder Kachel. Die Füllung zeigt das Verhältnis, die Zahlen darunter sagen es, und ein Überlauf färbt Rand und Rest rot und benennt ihn.

### Rote Tabelle „Unvollständige Eingaben“
- **Aufbau:** 2-px-Rahmen in Rot, 10 px Rundung. Der Kopf ist eine rote Fläche mit Titel in Blockschrift (weiß) und der Anzahl als weiße Pille mit roter Zahl. Darunter folgen Einleitung in Tinte, die Tabelle und der Hauptknopf „Speichern“.
- **Schatzmeister:** Der Tabellenkopf steht in Rot-Tinte auf Rot-Hauch, der Betrag rechtsbündig. Einträge, die älter als eine Woche sind, tragen das Warnsymbol (24 px, rot, mit Beschriftung). Dazu kommt der Knopf „ausnahmsweise genehmigen“.
- **Mobil:** Der Außenrahmen entfällt, und der Kopf wird ein gerundeter roter Balken. Beim Team wird jede bearbeitbare Zeile ein Blatt mit rotem Rahmen. Beim Schatzmeister werden die Einträge zu Titelzeilen mit roter Trennlinie (siehe Layout); das Warnsymbol steht vorn, der Genehmigen-Knopf unten auf eigener Zeile.
- **Position:** immer ganz oben unter Band und Warnkasten. Wenn nichts fehlt, steht an ihrer Stelle der Danke-Satz.

### Erfolgstabelle und Titelzeilen
- **Desktop:** Zeilenlinien in Zeilenlinie, Kopf in verdünnter Tinte auf getöntem Karton (Label klein). Werte stehen in Kugelschreiber-Blau (500), Art und Status in Tinte (400), Zeilen eines Geldeingangs in Grün. Beträge und ihre Spaltenköpfe stehen rechtsbündig, auch der sortierbare Betragskopf in der Tabelle der Sicherungen.
- **Gruppierung:** Über jedem Zeitraum steht ein Titel in Blockschrift auf getöntem Karton. Der aktuelle Zeitraum ist auf kräftigem Karton und trägt die orange Plakette „Aktueller Zeitraum“ (Systemschrift, 0.75rem, 700, weiß).
- **Mobil:** Titelzeilen wie auf einer Kassettenhülle (siehe Layout), ohne Kasten, getrennt durch 1-px-Linien in Zeilenlinie.

### Vorschaubilder und Vollansicht
- **Vorschaubild:** 64 px Quadrat, 2-px-Rahmen in verblasstem Blau, 6 px Rundung, getönter Karton als Grund, Zeiger zum Vergrößern, beim Drücken `scale(0.96)`. Es lädt erst kurz vor dem Sichtbereich. Ein fehlendes Bild hat einen gestrichelten Rahmen und einen Text.
- **Entfernen:** roter Kreis (26 px) mit weißem ×-Symbol (14 px) und einem Ring aus Karton (2 px), oben rechts überstehend.
- **Vollansicht:** dunkler Schleier, das Bild auf Weiß (4 px Rundung, höchstens 96vw × 84vh). Oben rechts sitzt ein weißer runder Schließen-Knopf (48 px), unter dem Bild steht die Beschriftung in Weiß.

### Sprechblase, Dialog, Meldung
- **Info-Knopf:** rund, sichtbar 30 px, mit einer unsichtbaren Tippfläche von 44 px (7 px rundum). Das Symbol steht in Kugelschreiber-Blau (22 px); geöffnet liegt der Knopf auf kräftigem Karton.
- **Sprechblase:** weiß, Tinte, 2-px-Rahmen in Kugelschreiber-Blau, 10 px Rundung, der schwebende Schatten und eine Spitze in Kugelschreiber-Blau zum Knopf hin. Sie öffnet sich nach oben, wenn unten der Platz fehlt. Beim Scrollen und bei Größenänderung wandert sie mit ihrem Knopf mit. Sie schließt sich erst, wenn der Knopf das Bild verlässt, bei einem Klick daneben oder mit Escape. Der Eintritt läuft über `@starting-style` (Deckkraft 0, `scale(0.97)`), 160 ms, mit dem Drehpunkt an der Spitze.
- **Dialog:** Schleier aus Tinte (200 ms), Karton, 2-px-Rahmen, 10 px Rundung, 22 px Innenabstand, höchstens 520 px, schwebender Schatten. Der Eintritt läuft über `@starting-style` mit `scale(0.96)` in 200 ms. Knöpfe stehen rechts mit 12 px Abstand. Ein Dialog dient nur zum Bestätigen von Löschen, ausnahmsweisem Genehmigen oder Speichern ohne Überweisungsbeleg.
- **Meldung:** unten rechts, Tinte als Grund, weiße Schrift (500), 10 px Rundung, schwebender Schatten. Das Symbol ist hell getönt: Grün (#7BD89A) für Erfolg, Rot (#FF9C9C) für Fehler, Blau (#A9BCEB) für Information. Sie gleitet über `@starting-style` 12 px hoch ein (300 ms).

### J-Karte (Anmeldung und Namensschritt)
Die Kassetten-Hülle im Wortsinn: Das Foto ist das Cover, das Formular die Innenseite, getrennt durch die Falz. Am Handy steht das Foto oben (16:9), ab 900 px links mit mindestens 320 px Höhe. Ohne Foto (Datensparmodus, Ladefehler) bleibt nur das Formular als Karte.

### Fotos aus offenen Sammlungen
- **Bild:** freie Fotos aus Wikimedia Commons, in zwei Breiten (480 und 800 px) als WebP mit `srcset`, lazy und mit niedriger Priorität geladen; nur das Cover lädt sofort. Der Fotorahmen ist getönter Karton, das Bild füllt ihn mit `object-fit: cover`.
- **Nachweis:** immer sichtbar unter dem Bild, in Caption auf Karton (verdünnte Tinte): „Foto: <Titel> · <Urheber> · <Lizenz> · zugeschnitten und verkleinert“. Titel und Lizenz sind Links mit Unterstreichung in verblasstem Blau.
- **Leerzustand:** Der Text steht über einem gerahmten Foto (2 px Kugelschreiber-Blau, 10 px Rundung, Format 3:2, höchstens 420 px breit): Gemüsestand für das Team, Ngong Hills für den Schatzmeister.
- **Datensparmodus:** Ist `navigator.connection.saveData` gesetzt, wird kein Foto geladen und kein leerer Rahmen gezeigt. Lädt ein Bild nicht, verschwindet die ganze Figur.

### Icons
Ein eigenes SVG-Set im Kugelschreiber-Strich: Raster 24 px, Strich 2, runde Enden und Ecken, Farbe aus `currentColor`. Übliche Größen sind 16 px (in Zeilen), 18 px (in Knöpfen), 20 bis 22 px (in Hinweisen und Kacheln), 24 bis 26 px (Warnung beim Schatzmeister, Schließen). Ein Symbol ohne Text trägt eine Beschriftung; ein Symbol neben Text ist für Screenreader verborgen.

## Do's and Don'ts

### Do:
- **Halte den Karton hell und die Tinte dunkel.** Das System ist für Sonnenlicht: Fließtext in Tinte (16,44:1), eingetragene Werte in Kugelschreiber-Blau (10,17:1), Grenzen von Bedienelementen mindestens in verblasstem Blau (3,53:1), nie in Zeilenlinie.
- **Rahme mit einem 2-px-Strich** in Kugelschreiber-Blau; Zeilen in Tabellen trennt eine 1-px-Linie in Zeilenlinie.
- **Setze Orange für Überschriften und den einen Hauptknopf** je Bereich ein, mit weißer Schrift (5,35:1); längere Texte stehen in Tinte.
- **Zeige jeden Geldeingang als Band**, mit Füllung, „Bezahlt“ und „Übrig“, rechtsbündigen Beträgen und rotem Überlauf.
- **Halte die Pflicht-Elemente fest:** die rote Tabelle „Unvollständige Eingaben“ ganz oben, den grünen Danke-Satz, wenn nichts fehlt, darüber den verblassten orangen Warnkasten, beim Schatzmeister Geldeingänge grün und Ausgaben rot.
- **Zeige Vorläufiges in Bleistift:** gestrichelte Ränder in Bleistiftlinie, Text in Bleistift, den Zustand zusätzlich als Wort.
- **Gib jedem Foto seinen sichtbaren Nachweis** (Titel, Urheber, Lizenz, „zugeschnitten und verkleinert“): höchstens 800 px breit als WebP mit 480/800-`srcset`, lazy, im Datensparmodus gar nicht.
- **Gib Druck-Feedback mit `scale(0.97)`** über 160 ms und `--ease-out` (cubic-bezier(0.23, 1, 0.32, 1)). Schwebende Ebenen treten über `@starting-style` ein, und jede Bewegung hat einen Ersatz bei `prefers-reduced-motion`.
- **Gestalte die Browser-Oberflächen aus der Palette:** Markierung hellorange, Schreibmarke Kugelschreiber-Blau, `accent-color` Orange, Bildlaufleiste in verblasstem Blau auf getöntem Karton, Fokus als 3-px-Umriss in verblasstem Blau.
- **Zeichne Symbole aus dem eigenen Set** (24-px-Raster, Strich 2, runde Enden, `currentColor`).
- **Behalte beide Flaggen** in der Kopfzeile, in amtlichen Farben mit 1,5-px-Ring in Tinte.

### Don't:
- **Setze Patrick Hand SC nicht** für Knöpfe, Feldbeschriftungen, Tabellendaten oder Fließtext ein.
- **Setze keinen Text in `orange-bright`** (3,04:1); es gehört nur den Streifen.
- **Verwende Rot und Grün nicht als Schmuck** und nie als einziges Signal; ein Wort oder ein Symbol sagt die Bedeutung mit.
- **Füge keine zweite Akzentfarbe hinzu** und übernimm keine Flaggenfarbe in die Oberfläche.
- **Baue keinen grauen Verwaltungs-Standard mit Karten-Raster** und kein dunkles Neon-Finanz-Design.
- **Gib ruhenden Flächen keinen Schatten;** nur Sprechblase, Dialog und Meldung schweben.
- **Lade keine zweite Webschrift** und keine Sammlungsfotos über 800 px Breite (Belegfotos sind Inhalt, nicht Gestaltung).
- **Zeige auf Fotos keine erkennbaren Personen, keine Kinder, keine Elendsbilder und keine dominanten Logos.** Fotos zeigen die Welt um den Verein, nie den Verein selbst.
- **Ersetze Symbole nicht durch Unicode-Zeichen oder Emoji.** Rechenzeichen („+ “, „− “ im Band), Trennpunkte und das Pflichtsternchen sind Text, keine Symbole.
- **Stelle keine Beschriftung als Kicker über eine Überschrift;** die Überschrift trägt sich selbst.
