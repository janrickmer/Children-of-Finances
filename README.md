# Children of Finances

Finanzprotokoll für **Children of Mathare Kenya** und **Children of Mathare Germany**.
Das Team in Kenia erfasst Geldeingänge und jede Ausgabe mit Rechnungsfoto. Der Schatzmeister
in Deutschland sieht alles ein, genehmigt Ausnahmen, lädt eine PDF-Sicherung herunter und
löscht danach die gesicherten Einträge.

## Zugänge

| Passwort (GitHub-Secret) | Wer | Was |
|---|---|---|
| `PASSWORD_USER` | Team in Kenia | Name eingeben, Geldeingänge und Bezahlungen erfassen, unvollständige Einträge ergänzen |
| `PASSWORD_ADMIN` | Schatzmeister | Alles einsehen, ausnahmsweise genehmigen, PDF herunterladen, Einträge löschen, Sicherungen einlesen |

Die Passwörter stehen **nirgends im Code**. Sie liegen nur als verschlüsselte GitHub-Secrets vor.

## Sicherheit in Kürze

- **Ende-zu-Ende-Verschlüsselung:** Texte, Beträge, Namen und Fotos werden im Browser mit
  AES-256-GCM verschlüsselt. Cloudflare speichert nur unlesbare Daten. Im Klartext liegen dort nur
  technische Angaben: Status (Entwurf/unvollständig/vollständig/genehmigt) und Zeitstempel.
- **Passwortprüfung auf dem Server:** Der Browser leitet aus dem Passwort zwei Schlüssel ab
  (PBKDF2, 600.000 Runden + HKDF). Einer geht zur Prüfung an den Worker, der andere entsperrt den
  Datenschlüssel und verlässt den Browser nie.
- **Begrenzte Anmeldeversuche:** höchstens 5 pro IP-Adresse (bei IPv6 pro /64-Netz) in 15 Minuten
  und höchstens 100 Fehlversuche aller Adressen zusammen pro Stunde. Jeder Versuch wird gezählt,
  bevor das Passwort geprüft wird. Während eines Angriffs können sich deshalb auch berechtigte
  Personen kurzzeitig nicht neu anmelden; bestehende Anmeldungen laufen weiter.
- **Rollen werden serverseitig erzwungen:** Abgeschlossene Einträge kann niemand mehr ändern.
  Nur der Schatzmeister kann genehmigen und löschen.
- Die Anmeldung gilt nur im aktuellen Browser-Tab, höchstens 12 Stunden.
- **Datenstandort:** Die D1-Datenbank wird mit `jurisdiction: eu` angelegt, die Daten bleiben in der EU.
- **Ehrlicher Hinweis:** Kurze, erratbare Passwörter bleiben die Schwachstelle. Wer ein Passwort
  kennt, hat den vollen Zugang dieser Rolle. Längere Passwörter erhöhen den Schutz deutlich.

## Speichern

- Jede Eingabe wird **jede Sekunde** verschlüsselt auf dem Gerät gesichert. Sobald Internet da ist,
  wird sie an den Server übertragen. Gesendet wird nur, was sich geändert hat. Bei Serverstörungen
  wird automatisch erneut versucht; nichts wird verworfen.
- Bearbeiten zwei Personen gleichzeitig denselben unvollständigen Eintrag, werden ihre Änderungen
  feldweise zusammengeführt.
- Fotos werden im Browser auf höchstens 2000 px verkleinert und als JPEG gespeichert.
  Pro Bild sind das meist 0,3–1 MB.
- Speicher: Cloudflare D1 (kostenlos, 500 MB pro Datenbank). Weil der Schatzmeister regelmäßig
  sichert und löscht, reicht das für mehrere hundert Belege zwischen zwei Sicherungen.
  Die Belegung wird in der Schatzmeister-Ansicht angezeigt; ab 80 % erscheint eine Warnung.

## Aufbau der Veröffentlichung

```
Browser ──► https://children-of-finances.children-of-mathare.de   (GitHub Pages: Oberfläche)
   │
   └──────► https://children-of-finances.<subdomain>.workers.dev  (Cloudflare Worker: Anmeldung + verschlüsselter Speicher in D1)
```

Der Worker beantwortet API-Anfragen nur von der eigenen Domain (`ALLOWED_ORIGINS` in `wrangler.toml`).
Unter der `workers.dev`-Adresse ist die Oberfläche zusätzlich als Ausweichadresse erreichbar.

## Einrichtung (einmalig)

**Cloudflare**
1. Kostenloses Konto anlegen: <https://dash.cloudflare.com/sign-up>
2. Unter **Workers & Pages** eine `workers.dev`-Subdomain wählen.
3. **Account-ID** kopieren (rechts auf der Seite „Workers & Pages“).
4. **API-Token** erstellen: Profil → API Tokens → Create Token → Vorlage „Edit Cloudflare Workers“.
   Zusätzlich nötig ist die Berechtigung *Account → D1 → Edit*.

**GitHub**
5. Unter *Settings → Secrets and variables → Actions* vier Secrets anlegen:
   `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `PASSWORD_USER`, `PASSWORD_ADMIN`.
6. *Settings → Pages* → Source: **GitHub Actions**.
7. **Actions → Deploy → Run workflow** starten.
8. *Settings → Pages* → Custom domain: `children-of-finances.children-of-mathare.de` → Save.
   Sobald das Zertifikat bereit ist, **Enforce HTTPS** einschalten.

**DNS (beim bisherigen Anbieter von children-of-mathare.de, kein Umzug)**
9. Einen CNAME-Eintrag anlegen: Name `children-of-finances`, Ziel `janrickmer.github.io`.

Veröffentlicht wird immer über **Actions → Deploy → Run workflow**, und zwar nur vom
Standard-Branch des Repositorys aus. Gibt es später einen Branch `main`, löst auch jeder Push
darauf das Deployment aus.

## Passwort ändern

Ändere **genau eines** der beiden Secrets `PASSWORD_USER` / `PASSWORD_ADMIN` und starte den
Workflow erneut. Mit dem unveränderten Passwort wird der Datenschlüssel neu verpackt, die Daten
bleiben lesbar und alle Anmeldungen laufen ab. Willst du beide ändern, mach es nacheinander
in zwei Durchläufen.

## Sicherungs-PDF

- Pro Eintrag gibt es eine Infoseite, danach eine Seite pro Rechnungsbild und pro Transaktionsnachweis.
- Konnte ein Bild beim Export nicht geladen werden, wird dieser Eintrag **nicht** gelöscht und kommt
  in der nächsten Sicherung erneut vor.
- Eingebettet ist die Datei `children-of-finances-daten.json` mit allen Angaben. Die Bilder werden
  beim Einlesen direkt aus den Bildseiten gelesen, mit SHA-256-Prüfsumme.
- „Sicherungen hochladen“ liest beliebig viele dieser PDFs **nur im Browser** und zeigt sie
  filter- und sortierbar an. Es wird nichts gespeichert.

## Lokale Entwicklung

```bash
npm install
PASSWORD_USER=Test1 PASSWORD_ADMIN=Test2 npm run setup:local
npm run dev   # http://localhost:8787
```

## Aufbau

```
worker/index.js        API (Anmeldung, Einträge, Bilder, Sicherung/Löschen) + statische Dateien
schema.sql             Tabellen in D1
scripts/setup.mjs      Datenbank anlegen, Passwörter/Schlüssel einrichten (lokal & in GitHub Actions)
public/                Oberfläche (ohne Build-Schritt)
  config.js            Adresse des Workers (wird beim Deployment eingetragen)
  js/kdf.js            Schlüsselableitung (Browser + Setup identisch)
  js/session.js        Anmeldung, Verschlüsselung, API
  js/store.js          Datenbestand, sekündliches Speichern, Abgleich
  js/images.js         Fotos verkleinern, verschlüsseln, hoch-/herunterladen
  js/view-user.js      Ansicht Kenia-Team
  js/view-admin.js     Ansicht Schatzmeister
  js/pdf-export.js     Sicherungs-PDF
  js/backup-import.js  Sicherungen einlesen
  js/i18n.js           Texte Deutsch / Englisch / Swahili
  vendor/pdf-lib.min.js  pdf-lib 1.17.1 (MIT-Lizenz)
```
