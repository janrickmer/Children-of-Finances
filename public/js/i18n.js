// Alle Texte der Oberfläche in Deutsch, Englisch und Swahili.
// Die Swahili-Übersetzungen sollten von einer Muttersprachlerin / einem Muttersprachler geprüft werden.

const T = {
  'lang.label': { de: 'Sprache', en: 'Language', sw: 'Lugha' },

  'login.title': { de: 'Bitte gib das Passwort ein.', en: 'Please enter the password.', sw: 'Tafadhali weka nenosiri.' },
  'login.password': { de: 'Passwort', en: 'Password', sw: 'Nenosiri' },
  'login.submit': { de: 'Anmelden', en: 'Log in', sw: 'Ingia' },
  'login.checking': { de: 'Passwort wird geprüft …', en: 'Checking password …', sw: 'Inakagua nenosiri …' },
  'login.wrong': { de: 'Das Passwort ist falsch.', en: 'The password is incorrect.', sw: 'Nenosiri si sahihi.' },
  'login.remaining': {
    de: 'Noch {n} Versuch(e), danach wird die Anmeldung für 15 Minuten gesperrt.',
    en: '{n} attempt(s) left, then login will be blocked for 15 minutes.',
    sw: 'Yamebaki majaribio {n}, kisha kuingia kutazuiwa kwa dakika 15.',
  },
  'login.locked': {
    de: 'Zu viele Fehlversuche. Bitte warte {min} Minuten.',
    en: 'Too many failed attempts. Please wait {min} minutes.',
    sw: 'Majaribio mengi sana yameshindwa. Tafadhali subiri dakika {min}.',
  },
  'login.notReady': {
    de: 'Die Seite ist noch nicht eingerichtet.',
    en: 'The website has not been set up yet.',
    sw: 'Tovuti bado haijawekwa tayari.',
  },
  'error.offline': {
    de: 'Keine Verbindung zum Server. Bitte prüfe deine Internetverbindung.',
    en: 'No connection to the server. Please check your internet connection.',
    sw: 'Hakuna muunganisho na seva. Tafadhali angalia mtandao wako.',
  },
  'error.generic': {
    de: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.',
    en: 'An error occurred. Please try again.',
    sw: 'Hitilafu imetokea. Tafadhali jaribu tena.',
  },
  logout: { de: 'Abmelden', en: 'Log out', sw: 'Toka' },

  'name.question': {
    de: 'Wer bedient gerade diese Internetseite?',
    en: 'Who is using this website right now?',
    sw: 'Nani anatumia tovuti hii sasa hivi?',
  },
  'name.hint': {
    de: 'Bitte gib deinen vollständigen Namen ein (Vor- und Nachname).',
    en: 'Please enter your full name (first and last name).',
    sw: 'Tafadhali andika jina lako kamili (jina la kwanza na jina la ukoo).',
  },
  'name.label': { de: 'Vollständiger Name', en: 'Full name', sw: 'Jina kamili' },
  'name.invalid': {
    de: 'Bitte gib Vor- und Nachnamen ein.',
    en: 'Please enter your first and last name.',
    sw: 'Tafadhali andika jina la kwanza na jina la ukoo.',
  },
  'name.continue': { de: 'Weiter', en: 'Continue', sw: 'Endelea' },
  'name.current': { de: 'Angemeldet als {name}', en: 'Signed in as {name}', sw: 'Umeingia kama {name}' },
  'name.change': { de: 'Name ändern', en: 'Change name', sw: 'Badilisha jina' },

  'warning.text': {
    de: 'Es ist wichtig, dass absolut jede noch so kleine Zahlung hier protokolliert wird. Wenn es zu Finanzprüfungen kommt, muss für jede Zahlung eine Rechnung vorliegen. Sobald für eine einzige Zahlung, egal wie klein der Geldbetrag auch sein mag, keine Rechnung vorliegt, besteht die Möglichkeit, dass die deutschen Behörden das gesamte Projekt "Children of Mathare" schließen und zukünftige Zahlungen stoppen. Es besteht höchste Priorität, Rechnungen zu erhalten, lesbar zu fotografieren und hochzuladen. Falls eine Rechnung von einem Verkäufer nicht vorliegt, musst du dich darum kümmern, diese nachträglich einzuholen.',
    en: 'It is essential that every single payment, no matter how small, is recorded here. If there is a financial audit, a receipt must exist for every payment. If even one payment has no receipt, no matter how small the amount, the German authorities may close the entire "Children of Mathare" project and stop all future payments. Getting receipts, photographing them legibly and uploading them has the highest priority. If a seller has not given you a receipt, you must make sure to obtain it afterwards.',
    sw: 'Ni muhimu sana kwamba kila malipo, hata yawe madogo kiasi gani, yarekodiwe hapa. Ukaguzi wa fedha ukifanyika, lazima kuwe na risiti kwa kila malipo. Ikiwa hata malipo moja tu hayana risiti, bila kujali kiasi ni kidogo kiasi gani, mamlaka za Ujerumani zinaweza kufunga mradi mzima wa "Children of Mathare" na kusitisha malipo yote ya baadaye. Kupata risiti, kuzipiga picha zinazosomeka vizuri na kuzipakia ni kipaumbele cha juu kabisa. Ikiwa muuzaji hajakupa risiti, ni lazima uhakikishe unaipata baadaye.',
  },

  'incomplete.title': { de: 'Unvollständige Eingaben', en: 'Incomplete entries', sw: 'Maingizo ambayo hayajakamilika' },
  'incomplete.none': {
    de: 'Alle bisher angelegten Einträge waren vollständig. Danke!',
    en: 'All entries created so far were complete. Thank you!',
    sw: 'Maingizo yote yaliyowekwa hadi sasa yalikuwa kamili. Asante!',
  },
  'incomplete.intro': {
    de: 'Diese Einträge sind noch nicht vollständig. Bitte ergänze die fehlenden Angaben und klicke dann auf „Speichern“.',
    en: 'These entries are not complete yet. Please add the missing information and then click “Save”.',
    sw: 'Maingizo haya bado hayajakamilika. Tafadhali ongeza taarifa zinazokosekana kisha bonyeza “Hifadhi”.',
  },

  'choose.title': { de: 'Was möchtest du eintragen?', en: 'What would you like to record?', sw: 'Ungependa kurekodi nini?' },
  'choose.income': { de: 'Geldeingang', en: 'Money received', sw: 'Pesa zilizopokelewa' },
  'choose.incomeHint': {
    de: 'Hat CoM Kenya von jemandem Geld erhalten (bspw. die monatliche Zahlung von Children of Mathare Germany)?',
    en: 'Has CoM Kenya received money from someone (e.g. the monthly payment from Children of Mathare Germany)?',
    sw: 'Je, CoM Kenya imepokea pesa kutoka kwa mtu (kwa mfano malipo ya kila mwezi kutoka Children of Mathare Germany)?',
  },
  'choose.expense': { de: 'Bezahlung', en: 'Payment', sw: 'Malipo' },

  'income.from': { de: 'Von wem hast du Geld erhalten?', en: 'Who did you receive money from?', sw: 'Ulipokea pesa kutoka kwa nani?' },
  'income.amount': { de: 'Wie viele KSH hast du erhalten?', en: 'How many KSH did you receive?', sw: 'Ulipokea KSH ngapi?' },
  'income.date': {
    de: 'An welchem Tag hast du das Geld erhalten?',
    en: 'On which day did you receive the money?',
    sw: 'Ulipokea pesa siku gani?',
  },
  'income.saved': {
    de: 'Der Geldeingang wurde gespeichert.',
    en: 'The money received has been saved.',
    sw: 'Pesa zilizopokelewa zimehifadhiwa.',
  },
  'income.unsaved': {
    de: 'Noch nicht gespeichert – bitte auf „Speichern“ klicken.',
    en: 'Not saved yet – please click “Save”.',
    sw: 'Bado haijahifadhiwa – tafadhali bonyeza “Hifadhi”.',
  },
  'income.missing': {
    de: 'Bitte fülle alle drei Felder aus.',
    en: 'Please fill in all three fields.',
    sw: 'Tafadhali jaza sehemu zote tatu.',
  },

  'col.what': { de: 'Was wurde bezahlt?', en: 'What was paid for?', sw: 'Nini kililipiwa?' },
  'col.date': { de: 'An welchem Tag wurde das bezahlt?', en: 'On which day was this paid?', sw: 'Hii ililipwa siku gani?' },
  'col.amount': {
    de: 'Wie viel Geld wurde hier bezahlt (Angabe in der Währung KSH)?',
    en: 'How much money was paid here (amount in KSH)?',
    sw: 'Kiasi gani cha pesa kililipwa hapa (kwa KSH)?',
  },
  'col.receipt': {
    de: 'Lade hier ein Foto / Bild deiner Rechnung hoch.',
    en: 'Upload a photo / image of your receipt here.',
    sw: 'Pakia hapa picha ya risiti yako.',
  },
  'col.receiptInfo': {
    de: 'Eine Rechnung kann auch eine handschriftliche Notiz sein. Wichtig ist, dass darauf steht, was genau gekauft wurde, wie viel davon gekauft wurde, wie viel Geld bezahlt wurde, an welchem Tag und zu welcher Uhrzeit dies bezahlt wurde und in welcher Stadt dieser Kauf stattfand. Auch wichtig ist, dass der vollständige Name des Verkäufers darauf steht. Wichtig ist auch, dass der Verkäufer dies unterschreibt. Wenn der Beleg von einem computergesteuerten Kassensystem ausgedruckt wurde, ist die Unterschrift nicht notwendig.',
    en: 'A receipt can also be a handwritten note. It is important that it states exactly what was bought, how much of it was bought, how much money was paid, on which day and at what time it was paid, and in which town the purchase took place. It is also important that the full name of the seller is on it. It is also important that the seller signs it. If the receipt was printed by a computerised till system, a signature is not necessary.',
    sw: 'Risiti inaweza pia kuwa maandishi ya mkono. Ni muhimu iandikwe ni nini hasa kilinunuliwa, kiasi gani kilinunuliwa, kiasi gani cha pesa kililipwa, siku gani na saa ngapi malipo yalifanyika, na katika mji gani ununuzi ulifanyika. Pia ni muhimu jina kamili la muuzaji liwe juu yake. Pia ni muhimu muuzaji aweke sahihi yake. Ikiwa risiti ilichapishwa na mashine ya kompyuta ya mauzo, sahihi haihitajiki.',
  },
  'col.receiptInfoButton': { de: 'Hinweis zur Rechnung anzeigen', en: 'Show note about receipts', sw: 'Onyesha maelezo kuhusu risiti' },
  'col.transfer': {
    de: 'Lade hier einen Screenshot deiner Transaktion (bspw. MPESA) hoch, damit nachvollzogen werden kann, wer das Geld erhalten hat.',
    en: 'Upload a screenshot of your transaction (e.g. M-PESA) here so that it can be traced who received the money.',
    sw: 'Pakia hapa picha ya skrini ya muamala wako (kwa mfano M-PESA) ili iweze kuthibitishwa nani alipokea pesa.',
  },
  'col.transferOptional': {
    de: 'freiwillig, aber bitte nach Möglichkeit hochladen',
    en: 'optional, but please upload it if possible',
    sw: 'si lazima, lakini tafadhali ipakie ikiwezekana',
  },
  'col.note': { de: 'Eigener Hinweis zu dieser Zahlung', en: 'Your own note on this payment', sw: 'Maelezo yako kuhusu malipo haya' },
  'col.required': { de: 'Pflichtfeld', en: 'required', sw: 'lazima' },
  'col.name': { de: 'Eingetragen von', en: 'Entered by', sw: 'Imeingizwa na' },
  'col.started': { de: 'Begonnen am', en: 'Started on', sw: 'Ilianzishwa' },
  'col.enteredAt': { de: 'Eingetragen am', en: 'Entered on', sw: 'Iliingizwa' },
  'col.status': { de: 'Status', en: 'Status', sw: 'Hali' },
  'col.action': { de: 'Aktion', en: 'Action', sw: 'Kitendo' },
  'col.kind': { de: 'Art', en: 'Type', sw: 'Aina' },
  'col.whatOrFrom': { de: 'Was / Von wem', en: 'What / From whom', sw: 'Nini / Kutoka kwa nani' },
  'col.amountShort': { de: 'Betrag (KSH)', en: 'Amount (KSH)', sw: 'Kiasi (KSH)' },
  'col.dateShort': { de: 'Datum', en: 'Date', sw: 'Tarehe' },
  'col.receiptShort': { de: 'Rechnung', en: 'Receipt', sw: 'Risiti' },
  'col.transferShort': { de: 'Transaktion', en: 'Transaction', sw: 'Muamala' },
  'col.noteShort': { de: 'Hinweis', en: 'Note', sw: 'Maelezo' },
  'col.file': { de: 'Datei', en: 'File', sw: 'Faili' },

  'field.what': { de: 'Beschreibung', en: 'description', sw: 'maelezo' },
  'field.date': { de: 'Datum', en: 'date', sw: 'tarehe' },
  'field.amount': { de: 'Betrag', en: 'amount', sw: 'kiasi' },
  'field.receipt': { de: 'Rechnung', en: 'receipt', sw: 'risiti' },
  'missing.list': { de: 'Fehlt: {list}', en: 'Missing: {list}', sw: 'Inakosekana: {list}' },

  'row.add': { de: '+ Weitere Zahlung hinzufügen', en: '+ Add another payment', sw: '+ Ongeza malipo mengine' },
  'row.delete': { de: 'Entwurf löschen', en: 'Delete draft', sw: 'Futa rasimu' },
  'row.deleteConfirm': {
    de: 'Diese Zeile wirklich löschen?',
    en: 'Do you really want to delete this row?',
    sw: 'Una uhakika unataka kufuta mstari huu?',
  },
  'row.editedBy': { de: 'zuletzt bearbeitet von {name}', en: 'last edited by {name}', sw: 'ilihaririwa mwisho na {name}' },

  'upload.add': { de: 'Bild hochladen', en: 'Upload image', sw: 'Pakia picha' },
  'upload.more': { de: 'Weiteres Bild', en: 'Another image', sw: 'Picha nyingine' },
  'upload.pdf': {
    de: 'PDF-Dateien können nicht hochgeladen werden. Bitte mache einen Screenshot der PDF-Datei und lade den Screenshot hoch.',
    en: 'PDF files cannot be uploaded. Please take a screenshot of the PDF file and upload the screenshot.',
    sw: 'Faili za PDF haziwezi kupakiwa. Tafadhali piga picha ya skrini ya faili ya PDF kisha upakie picha hiyo.',
  },
  'upload.notImage': {
    de: 'Bitte lade nur Bilddateien hoch (z. B. JPG oder PNG).',
    en: 'Please upload image files only (e.g. JPG or PNG).',
    sw: 'Tafadhali pakia faili za picha pekee (kwa mfano JPG au PNG).',
  },
  'upload.failed': {
    de: 'Das Bild konnte nicht gelesen werden. Bitte versuche es mit einem anderen Foto oder einem Screenshot.',
    en: 'The image could not be read. Please try another photo or a screenshot.',
    sw: 'Picha haikuweza kusomwa. Tafadhali jaribu picha nyingine au picha ya skrini.',
  },
  'upload.remove': { de: 'Bild entfernen', en: 'Remove image', sw: 'Ondoa picha' },
  'upload.processing': { de: 'Bild wird verarbeitet …', en: 'Processing image …', sw: 'Inachakata picha …' },
  'upload.pending': { de: 'wird hochgeladen', en: 'uploading', sw: 'inapakiwa' },
  'upload.wait': {
    de: 'Bitte warte, bis alle Bilder verarbeitet sind, und klicke dann erneut auf „Speichern“.',
    en: 'Please wait until all images have been processed, then click “Save” again.',
    sw: 'Tafadhali subiri hadi picha zote zichakatwe, kisha bonyeza “Hifadhi” tena.',
  },
  'upload.tooLate': {
    de: 'Dieser Eintrag wurde inzwischen abgeschlossen. Das Bild wurde nicht hinzugefügt.',
    en: 'This entry has been completed in the meantime. The image was not added.',
    sw: 'Ingizo hili limekamilishwa wakati huo huo. Picha haikuongezwa.',
  },

  save: { de: 'Speichern', en: 'Save', sw: 'Hifadhi' },
  'save.ok': { de: 'Erfolgreich gespeichert: {n}', en: 'Saved successfully: {n}', sw: 'Yamehifadhiwa kikamilifu: {n}' },
  'save.incomplete': {
    de: 'Unvollständig, nach oben zu „Unvollständige Eingaben“ verschoben: {n}',
    en: 'Incomplete, moved up to “Incomplete entries”: {n}',
    sw: 'Hayajakamilika, yamehamishiwa juu kwenye “Maingizo ambayo hayajakamilika”: {n}',
  },
  'save.stillIncomplete': {
    de: 'Noch unvollständig: {n}',
    en: 'Still incomplete: {n}',
    sw: 'Bado hayajakamilika: {n}',
  },
  'save.nothing': { de: 'Es gibt nichts zu speichern.', en: 'There is nothing to save.', sw: 'Hakuna cha kuhifadhi.' },
  'save.noTransfer': {
    de: 'Bei {n} vollständigen Eintrag/Einträgen fehlt der Screenshot der Transaktion. Nach dem Speichern kann er nicht mehr ergänzt werden. Trotzdem speichern?',
    en: '{n} complete entry/entries have no transaction screenshot. It cannot be added after saving. Save anyway?',
    sw: 'Maingizo {n} yaliyokamilika hayana picha ya skrini ya muamala. Haiwezi kuongezwa baada ya kuhifadhi. Hifadhi hata hivyo?',
  },
  'save.anyway': { de: 'Trotzdem speichern', en: 'Save anyway', sw: 'Hifadhi hata hivyo' },
  back: { de: 'Zurück', en: 'Go back', sw: 'Rudi' },
  cancel: { de: 'Abbrechen', en: 'Cancel', sw: 'Ghairi' },
  close: { de: 'Schließen', en: 'Close', sw: 'Funga' },
  yes: { de: 'Ja', en: 'Yes', sw: 'Ndiyo' },

  'success.title': {
    de: 'Erfolgreich eingetragene finanzielle Ausgaben',
    en: 'Successfully recorded expenses',
    sw: 'Matumizi ya fedha yaliyorekodiwa kikamilifu',
  },
  'success.intro': {
    de: 'Diese Einträge sind abgeschlossen und können nicht mehr geändert oder gelöscht werden.',
    en: 'These entries are final and can no longer be changed or deleted.',
    sw: 'Maingizo haya yamekamilika na hayawezi kubadilishwa wala kufutwa tena.',
  },
  'success.empty': {
    de: 'Zurzeit gibt es hier keine Einträge.',
    en: 'There are currently no entries here.',
    sw: 'Kwa sasa hakuna maingizo hapa.',
  },
  'success.archived': {
    de: 'Am {date} hat der deutsche Hilfsverein Children of Mathare Germany {n} Einträge gesichert und zur Prüfung an die Behörden weitergegeben.',
    en: 'On {date}, the German charity Children of Mathare Germany backed up {n} entries and passed them on to the authorities for review.',
    sw: 'Tarehe {date}, shirika la misaada la Ujerumani Children of Mathare Germany lilihifadhi maingizo {n} na kuyakabidhi kwa mamlaka kwa ajili ya ukaguzi.',
  },
  'period.current': { de: 'Aktueller Zeitraum', en: 'Current period', sw: 'Kipindi cha sasa' },
  'period.since': {
    de: 'Ab Geldeingang vom {date}: KSH {amount} von {from}',
    en: 'From money received on {date}: KSH {amount} from {from}',
    sw: 'Kuanzia pesa zilizopokelewa tarehe {date}: KSH {amount} kutoka kwa {from}',
  },
  'period.pre': {
    de: 'Vor dem ersten erfassten Geldeingang',
    en: 'Before the first recorded money received',
    sw: 'Kabla ya pesa za kwanza zilizorekodiwa',
  },

  'status.complete': { de: 'vollständig', en: 'complete', sw: 'kamili' },
  'status.approved': { de: 'ausnahmsweise genehmigt', en: 'approved as an exception', sw: 'imeidhinishwa kwa hali maalum' },
  'status.draft': { de: 'Entwurf', en: 'Draft', sw: 'Rasimu' },
  'status.incomplete': { de: 'unvollständig', en: 'incomplete', sw: 'haijakamilika' },
  'kind.income': { de: 'Geldeingang', en: 'Money received', sw: 'Pesa zilizopokelewa' },
  'kind.expense': { de: 'Ausgabe', en: 'Expense', sw: 'Matumizi' },

  'sync.saved': { de: 'Alles gespeichert', en: 'All saved', sw: 'Kila kitu kimehifadhiwa' },
  'sync.saving': { de: 'Wird gespeichert …', en: 'Saving …', sw: 'Inahifadhi …' },
  'sync.offline': {
    de: 'Offline – Eingaben sind auf diesem Gerät gesichert und werden später übertragen.',
    en: 'Offline – your input is stored on this device and will be uploaded later.',
    sw: 'Nje ya mtandao – maingizo yako yamehifadhiwa kwenye kifaa hiki na yatatumwa baadaye.',
  },
  'sync.conflict': {
    de: 'Ein Eintrag wurde inzwischen von jemand anderem abgeschlossen. Es wird die gespeicherte Fassung angezeigt.',
    en: 'An entry was completed by someone else in the meantime. The saved version is shown.',
    sw: 'Ingizo moja limekamilishwa na mtu mwingine wakati huo huo. Toleo lililohifadhiwa linaonyeshwa.',
  },
  'sync.expired': {
    de: 'Deine Anmeldung ist abgelaufen. Bitte melde dich erneut an. Deine Eingaben bleiben auf diesem Gerät gesichert.',
    en: 'Your login has expired. Please log in again. Your input remains stored on this device.',
    sw: 'Muda wako wa kuingia umeisha. Tafadhali ingia tena. Maingizo yako yanabaki yamehifadhiwa kwenye kifaa hiki.',
  },

  'admin.title': { de: 'Ansicht Schatzmeister', en: 'Treasurer view', sw: 'Ukurasa wa Mweka Hazina' },
  'admin.uploadBackups': { de: 'Sicherungen hochladen', en: 'Upload backups', sw: 'Pakia nakala za akiba' },
  'admin.incomes': { de: 'Geldeingänge', en: 'Money received', sw: 'Pesa zilizopokelewa' },
  'admin.spent': { de: 'Ausgaben', en: 'Expenses', sw: 'Matumizi' },
  'admin.remaining': { de: 'Übrig', en: 'Remaining', sw: 'Iliyobaki' },
  'admin.noIncome': { de: 'Noch kein Geldeingang erfasst.', en: 'No money received recorded yet.', sw: 'Bado hakuna pesa zilizopokelewa zilizorekodiwa.' },
  'admin.archivedIncome': { de: 'bereits gesichert', en: 'already backed up', sw: 'tayari imehifadhiwa' },
  'admin.sumHint': {
    de: 'Ausgaben = alle erfassten Zahlungen mit Datum und Betrag (auch unvollständige und Entwürfe), die ab diesem Geldeingang bis zum nächsten bezahlt wurden.',
    en: 'Expenses = all recorded payments with date and amount (including incomplete ones and drafts) paid from this money received until the next one.',
    sw: 'Matumizi = malipo yote yaliyorekodiwa yenye tarehe na kiasi (pamoja na yasiyokamilika na rasimu) yaliyolipwa kuanzia pesa hizi zilipopokelewa hadi zinazofuata.',
  },
  'admin.incomeDrafts': {
    de: 'Begonnene, noch nicht gespeicherte Geldeingänge',
    en: 'Money received that was started but not saved yet',
    sw: 'Pesa zilizopokelewa zilizoanzishwa lakini bado hazijahifadhiwa',
  },
  'admin.imagesMissing': {
    de: 'Bei {n} Eintrag/Einträgen konnten Bilder nicht abgerufen werden. Diese Einträge werden nicht gelöscht und erscheinen in der nächsten Sicherung erneut.',
    en: 'Images could not be loaded for {n} entry/entries. These entries will not be deleted and will appear again in the next backup.',
    sw: 'Picha za ingizo/maingizo {n} hazikuweza kupakuliwa. Maingizo haya hayatafutwa na yataonekana tena kwenye nakala inayofuata.',
  },
  'admin.approve': { de: 'ausnahmsweise genehmigen', en: 'approve as an exception', sw: 'idhinisha kwa hali maalum' },
  'admin.approveConfirm': {
    de: 'Diesen Eintrag trotz fehlender Angaben ausnahmsweise genehmigen? Er wird dann zu den erfolgreichen Einträgen verschoben.',
    en: 'Approve this entry as an exception despite missing information? It will then be moved to the successful entries.',
    sw: 'Idhinisha ingizo hili kwa hali maalum licha ya taarifa zinazokosekana? Litahamishiwa kwenye maingizo yaliyofanikiwa.',
  },
  'admin.olderThanWeek': {
    de: 'Dieser Eintrag wurde vor mehr als einer Woche begonnen.',
    en: 'This entry was started more than a week ago.',
    sw: 'Ingizo hili lilianzishwa zaidi ya wiki moja iliyopita.',
  },
  'admin.download': { de: 'Aktuelle Datenlage herunterladen', en: 'Download current data', sw: 'Pakua data za sasa' },
  'admin.preparing': { de: 'PDF wird erstellt … {done}/{total}', en: 'Creating PDF … {done}/{total}', sw: 'Inaunda PDF … {done}/{total}' },
  'admin.downloaded': {
    de: 'Die Datei „{file}“ mit {n} Einträgen wurde heruntergeladen. Bitte prüfe, ob sie vollständig gespeichert wurde, bevor du die Einträge löschst.',
    en: 'The file “{file}” with {n} entries has been downloaded. Please check that it was saved completely before deleting the entries.',
    sw: 'Faili “{file}” yenye maingizo {n} imepakuliwa. Tafadhali hakikisha imehifadhiwa kikamilifu kabla ya kufuta maingizo.',
  },
  'admin.delete': {
    de: 'Heruntergeladene Einträge aus der Datenbank löschen',
    en: 'Delete downloaded entries from the database',
    sw: 'Futa maingizo yaliyopakuliwa kutoka kwenye hifadhidata',
  },
  'admin.deleteConfirm': {
    de: 'Sollen die {n} heruntergeladenen Einträge samt Bildern endgültig aus der Datenbank gelöscht werden? Das kann nicht rückgängig gemacht werden.',
    en: 'Should the {n} downloaded entries including images be permanently deleted from the database? This cannot be undone.',
    sw: 'Je, maingizo {n} yaliyopakuliwa pamoja na picha yafutwe kabisa kutoka kwenye hifadhidata? Hili haliwezi kutenduliwa.',
  },
  'admin.deleteCheck': {
    de: 'Ich habe die PDF-Datei gespeichert und geöffnet.',
    en: 'I have saved and opened the PDF file.',
    sw: 'Nimehifadhi na kufungua faili ya PDF.',
  },
  'admin.deleteYes': { de: 'Endgültig löschen', en: 'Delete permanently', sw: 'Futa kabisa' },
  'admin.deleted': { de: '{n} Einträge wurden gelöscht.', en: '{n} entries have been deleted.', sw: 'Maingizo {n} yamefutwa.' },
  'admin.nothingToDownload': {
    de: 'Es gibt keine erfolgreichen Einträge zum Herunterladen.',
    en: 'There are no successful entries to download.',
    sw: 'Hakuna maingizo yaliyofanikiwa ya kupakua.',
  },
  'admin.storage': { de: 'Datenbank belegt: {used} von 500 MB', en: 'Database used: {used} of 500 MB', sw: 'Hifadhidata imetumika: {used} kati ya MB 500' },
  'admin.storageWarn': {
    de: 'Der Speicher ist fast voll. Bitte bald sichern und löschen.',
    en: 'Storage is almost full. Please back up and delete soon.',
    sw: 'Hifadhi imekaribia kujaa. Tafadhali hifadhi nakala na ufute hivi karibuni.',
  },
  'admin.missingImage': { de: 'Bild fehlt noch', en: 'image not yet available', sw: 'picha bado haipo' },

  'backup.title': { de: 'Hochgeladene Sicherungen', en: 'Uploaded backups', sw: 'Nakala za akiba zilizopakiwa' },
  'backup.intro': {
    de: 'Die Dateien werden nur in diesem Browser gelesen und nirgendwo gespeichert. Zeile anklicken, um die Bilder anzuzeigen.',
    en: 'The files are only read in this browser and are not stored anywhere. Click a row to show the images.',
    sw: 'Faili zinasomwa kwenye kivinjari hiki pekee na hazihifadhiwi popote. Bonyeza mstari ili kuona picha.',
  },
  'backup.reading': { de: 'Lese „{file}“ …', en: 'Reading “{file}” …', sw: 'Inasoma “{file}” …' },
  'backup.invalid': {
    de: '„{file}“ ist keine Sicherung dieser Internetseite.',
    en: '“{file}” is not a backup from this website.',
    sw: '“{file}” si nakala ya akiba ya tovuti hii.',
  },
  'backup.count': { de: '{n} Einträge aus {f} Datei(en)', en: '{n} entries from {f} file(s)', sw: 'Maingizo {n} kutoka faili {f}' },
  'backup.shown': { de: 'angezeigt: {n}', en: 'shown: {n}', sw: 'yanayoonyeshwa: {n}' },
  'backup.duplicates': {
    de: '{n} doppelte Einträge wurden übersprungen.',
    en: '{n} duplicate entries were skipped.',
    sw: 'Maingizo {n} yaliyorudiwa yamerukwa.',
  },
  'backup.filterName': { de: 'Eingetragen von', en: 'Entered by', sw: 'Imeingizwa na' },
  'backup.all': { de: 'Alle', en: 'All', sw: 'Wote' },
  'backup.enteredRange': { de: 'Eintragungszeitpunkt', en: 'Time of entry', sw: 'Muda wa kuingiza' },
  'backup.paidRange': { de: 'Bezahldatum', en: 'Payment date', sw: 'Tarehe ya malipo' },
  'backup.from': { de: 'von', en: 'from', sw: 'kuanzia' },
  'backup.to': { de: 'bis', en: 'to', sw: 'hadi' },
  'backup.reset': { de: 'Filter zurücksetzen', en: 'Reset filters', sw: 'Ondoa vichujio' },
  'backup.closeView': { de: 'Ansicht schließen', en: 'Close view', sw: 'Funga ukurasa' },
  'backup.noImages': { de: 'Keine Bilder', en: 'No images', sw: 'Hakuna picha' },
};

const SUPPORTED = ['de', 'en', 'sw'];
const LOCALES = { de: 'de-DE', en: 'en-KE', sw: 'sw-KE' };
let current = 'de';

export function initLang() {
  let saved = null;
  try {
    saved = localStorage.getItem('cof-lang');
  } catch { /* privater Modus */ }
  if (SUPPORTED.includes(saved)) current = saved;
  else {
    const nav = (navigator.language || 'de').slice(0, 2);
    current = SUPPORTED.includes(nav) ? nav : 'en';
  }
  document.documentElement.lang = current;
  return current;
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  current = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem('cof-lang', lang);
  } catch { /* ignorieren */ }
}

export function getLang() {
  return current;
}

export function locale() {
  return LOCALES[current];
}

export function t(key, params = {}) {
  const entry = T[key];
  let text = entry ? entry[current] || entry.de : key;
  for (const [k, v] of Object.entries(params)) text = text.split(`{${k}}`).join(String(v));
  return text;
}
