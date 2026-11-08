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
    de: ['Noch 1 Versuch, danach wird die Anmeldung für 15 Minuten gesperrt.', 'Noch {n} Versuche, danach wird die Anmeldung für 15 Minuten gesperrt.'],
    en: ['1 attempt left, then login will be blocked for 15 minutes.', '{n} attempts left, then login will be blocked for 15 minutes.'],
    sw: ['Limebaki jaribio 1, kisha kuingia kutazuiwa kwa dakika 15.', 'Yamebaki majaribio {n}, kisha kuingia kutazuiwa kwa dakika 15.'],
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

  'choose.title': { de: 'Was möchtest du tun?', en: 'What would you like to do?', sw: 'Ungependa kufanya nini?' },
  'choose.income': { de: 'Geldeingang', en: 'Money received', sw: 'Pesa zilizopokelewa' },
  'choose.incomeHint': {
    de: 'Hat CoM Kenya von jemandem Geld erhalten (bspw. die monatliche Zahlung von Children of Mathare Germany)?',
    en: 'Has CoM Kenya received money from someone (e.g. the monthly payment from Children of Mathare Germany)?',
    sw: 'Je, CoM Kenya imepokea pesa kutoka kwa mtu (kwa mfano malipo ya kila mwezi kutoka Children of Mathare Germany)?',
  },
  'choose.expense': { de: 'Bezahlung', en: 'Payment', sw: 'Malipo' },
  'choose.request': {
    de: 'Bereits planbare Kosten der Zukunft eintragen und bei CoM Germany anfragen',
    en: 'Enter future costs that can already be planned and ask CoM Germany',
    sw: 'Weka gharama za baadaye ambazo tayari zinaweza kupangwa na uombe CoM Germany',
  },
  'choose.requestHint': {
    de: 'Zum Beispiel Schulgebühren oder Kosten für ein Internat.',
    en: 'For example school fees or boarding costs.',
    sw: 'Kwa mfano ada za shule au gharama za bweni.',
  },

  'request.person': {
    de: 'Für welche Person (bspw. für welchen Schüler) wird dieses Budget gebraucht?',
    en: 'Which person (e.g. which student) is this budget needed for?',
    sw: 'Bajeti hii inahitajika kwa ajili ya mtu gani (kwa mfano mwanafunzi gani)?',
  },
  'request.purpose': {
    de: 'Was bezahlt dieses Budget (bspw. Schulgebühren, Kosten für Internat etc.)?',
    en: 'What does this budget pay for (e.g. school fees, boarding costs etc.)?',
    sw: 'Bajeti hii inalipia nini (kwa mfano ada za shule, gharama za bweni n.k.)?',
  },
  'request.purposeHint': {
    de: 'Zähle hier bitte alles auf, was mit diesem Budget bezahlt wird – jeden Posten einzeln, auch kleine.',
    en: 'Please list everything this budget pays for – each item separately, including small ones.',
    sw: 'Tafadhali orodhesha hapa kila kitu kitakacholipwa kwa bajeti hii – kila kitu peke yake, hata vitu vidogo.',
  },
  'request.period': {
    de: 'Für welchen Zeitraum würde dieses Budget die Kosten decken?',
    en: 'Which period would this budget cover the costs for?',
    sw: 'Bajeti hii ingegharimia gharama za kipindi gani?',
  },
  'request.periodFrom': { de: 'von', en: 'from', sw: 'kuanzia' },
  'request.periodTo': { de: 'bis', en: 'to', sw: 'hadi' },
  'request.amount': { de: 'Wie viel Geld wird benötigt (in KSH)?', en: 'How much money is needed (in KSH)?', sw: 'Pesa kiasi gani zinahitajika (kwa KSH)?' },
  'request.deadline': {
    de: 'Falls es möglich sein sollte, dass CoM Germany Sponsoren für diese Angelegenheit findet: An welchem Tag muss das Geld spätestens bei CoM Kenya eingehen?',
    en: 'If CoM Germany is able to find sponsors for this: by which day at the latest must the money reach CoM Kenya?',
    sw: 'Ikiwa CoM Germany itaweza kupata wafadhili kwa jambo hili: ni siku gani ya mwisho ambayo pesa lazima ziwe zimefika CoM Kenya?',
  },
  'request.submit': { de: 'Anfragen, ob dieses Budget realisierbar ist', en: 'Ask whether this budget is feasible', sw: 'Uliza kama bajeti hii inawezekana' },
  'request.unsent': {
    de: 'Noch nicht gesendet – bitte unten auf „Anfragen, ob dieses Budget realisierbar ist“ klicken.',
    en: 'Not sent yet – please click “Ask whether this budget is feasible” below.',
    sw: 'Bado halijatumwa – tafadhali bonyeza “Uliza kama bajeti hii inawezekana” hapa chini.',
  },
  'request.missing': { de: 'Bitte fülle alle Felder aus.', en: 'Please fill in all fields.', sw: 'Tafadhali jaza sehemu zote.' },
  'request.badRange': {
    de: 'Das Ende des Zeitraums liegt vor dem Anfang.',
    en: 'The end of the period is before its start.',
    sw: 'Mwisho wa kipindi uko kabla ya mwanzo wake.',
  },
  'request.pastDeadline': {
    de: 'Der Tag, an dem das Geld spätestens eingehen muss, liegt in der Vergangenheit.',
    en: 'The latest day for the money to arrive is in the past.',
    sw: 'Siku ya mwisho ya pesa kufika imeshapita.',
  },
  'request.confirm': {
    de: 'Diese Anfrage an CoM Germany schicken? Danach lässt sie sich nicht mehr ändern. Solange das deutsche Team sie noch nicht gelesen hat, kannst du sie zurückziehen.',
    en: 'Send this request to CoM Germany? It cannot be changed afterwards. You can withdraw it as long as the German team has not read it yet.',
    sw: 'Ungependa kutuma ombi hili kwa CoM Germany? Baada ya hapo haliwezi kubadilishwa. Unaweza kuliondoa ilimradi timu ya Ujerumani bado haijalisoma.',
  },
  'request.confirmYes': { de: 'Anfrage schicken', en: 'Send request', sw: 'Tuma ombi' },
  'request.sending': { de: 'Wird gesendet …', en: 'Sending …', sw: 'Inatuma …' },
  'request.sent': {
    de: 'Deine Anfrage wurde an CoM Germany geschickt.',
    en: 'Your request has been sent to CoM Germany.',
    sw: 'Ombi lako limetumwa kwa CoM Germany.',
  },
  'request.offline': {
    de: 'Keine Verbindung. Ob die Anfrage angekommen ist, ist noch unklar – bitte versuche es gleich noch einmal.',
    en: 'No connection. It is not yet clear whether the request arrived – please try again in a moment.',
    sw: 'Hakuna mtandao. Bado haijulikani kama ombi limefika – tafadhali jaribu tena baada ya muda mfupi.',
  },
  'request.pending': {
    de: 'Beim Senden ist die Verbindung abgebrochen. Bis klar ist, ob die Anfrage angekommen ist, lässt sie sich nicht ändern. Tippe noch einmal auf „Anfragen, ob dieses Budget realisierbar ist“, sobald du wieder Netz hast.',
    en: 'The connection was lost while sending. Until it is clear whether the request arrived, it cannot be changed. Tap “Ask whether this budget is feasible” again as soon as you have a connection.',
    sw: 'Mtandao ulikatika wakati wa kutuma. Hadi ijulikane kama ombi limefika, haliwezi kubadilishwa. Bonyeza tena “Uliza kama bajeti hii inawezekana” mara tu utakapopata mtandao.',
  },
  'request.badAmount': {
    de: 'Bitte gib einen Betrag größer als 0 ein.',
    en: 'Please enter an amount greater than 0.',
    sw: 'Tafadhali weka kiasi kikubwa kuliko 0.',
  },
  'request.unreadable': {
    de: 'Diese Anfrage lässt sich nicht lesen (beschädigt).',
    en: 'This request cannot be read (damaged).',
    sw: 'Ombi hili haliwezi kusomeka (limeharibika).',
  },
  'requests.title': { de: 'Anfragen an CoM Germany', en: 'Requests to CoM Germany', sw: 'Maombi kwa CoM Germany' },
  'request.lblPerson': { de: 'Für', en: 'For', sw: 'Kwa ajili ya' },
  'request.lblPurpose': { de: 'Bezahlt', en: 'Pays for', sw: 'Inalipia' },
  'request.lblPeriod': { de: 'Zeitraum', en: 'Period', sw: 'Kipindi' },
  'request.periodValue': { de: '{from} – {to}', en: '{from} – {to}', sw: '{from} – {to}' },
  'request.lblDeadline': { de: 'Spätestens bei CoM Kenya', en: 'Needed at CoM Kenya by', sw: 'Siku ya mwisho kufika CoM Kenya' },
  'request.by': { de: 'Angefragt von {name} am {date}', en: 'Requested by {name} on {date}', sw: 'Imeombwa na {name} tarehe {date}' },
  'request.statusOpen': {
    de: 'Das deutsche Team hat diese Anfrage noch nicht gesehen',
    en: 'The German team has not seen this request yet',
    sw: 'Timu ya Ujerumani bado haijaona ombi hili',
  },
  'request.statusNew': { de: 'Noch nicht als gelesen markiert', en: 'Not yet marked as read', sw: 'Bado halijawekwa alama kuwa limesomwa' },
  'request.statusRead': { de: 'Gelesen und in Absprache', en: 'Read and under discussion', sw: 'Limesomwa na linajadiliwa' },
  'request.withdraw': { de: 'Zurückziehen', en: 'Withdraw', sw: 'Ondoa ombi' },
  'request.withdrawConfirm': {
    de: 'Diese Anfrage zurückziehen? Sie wird gelöscht und CoM Germany sieht sie nicht mehr.',
    en: 'Withdraw this request? It will be deleted and CoM Germany will no longer see it.',
    sw: 'Ungependa kuondoa ombi hili? Litafutwa na CoM Germany haitaliona tena.',
  },
  'request.withdrawn': { de: 'Die Anfrage wurde zurückgezogen.', en: 'The request has been withdrawn.', sw: 'Ombi limeondolewa.' },
  'request.changed': {
    de: 'Diese Anfrage wurde inzwischen geändert. Die Ansicht ist jetzt wieder aktuell.',
    en: 'This request has changed in the meantime. The view is now up to date again.',
    sw: 'Ombi hili limebadilika wakati huo huo. Ukurasa sasa umesasishwa.',
  },
  'request.removedTitle': {
    de: 'Das deutsche Team hat die Anfrage für {person} über KSh {amount} entfernt.',
    en: 'The German team has removed the request for {person} of KSh {amount}.',
    sw: 'Timu ya Ujerumani imeondoa ombi la KSh {amount} kwa ajili ya {person}.',
  },
  'request.removedText': {
    de: 'Falls es zu einem Geldeingang auf dem Konto von CoM Kenya kommen sollte, muss dieser Geldeingang unbedingt korrekt unter „Geldeingang“ eingetragen werden.',
    en: 'If any money arrives in the CoM Kenya account, this money received must be recorded correctly under “Money received”.',
    sw: 'Ikiwa pesa zozote zitaingia kwenye akaunti ya CoM Kenya, pesa hizo lazima ziingizwe kwa usahihi chini ya “Pesa zilizopokelewa”.',
  },
  'request.removedUntil': {
    de: 'Dieser Hinweis verschwindet am {date}.',
    en: 'This notice disappears on {date}.',
    sw: 'Taarifa hii itaondoka tarehe {date}.',
  },

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

  'row.add': { de: 'Weitere Zahlung hinzufügen', en: 'Add another payment', sw: 'Ongeza malipo mengine' },
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

  'row.summaryHead': { de: 'Eintrag', en: 'Entry', sw: 'Ingizo' },
  'row.complete': { de: 'Ergänzen', en: 'Complete', sw: 'Kamilisha' },
  'row.collapse': { de: 'Zuklappen', en: 'Collapse', sw: 'Funga' },
  'row.noWhat': { de: 'Ohne Beschreibung', en: 'No description', sw: 'Bila maelezo' },
  'row.noTransfer': {
    de: 'Screenshot der Transaktion fehlt noch (freiwillig, nach dem Speichern nicht mehr möglich).',
    en: 'Transaction screenshot still missing (optional, cannot be added after saving).',
    sw: 'Picha ya skrini ya muamala bado haipo (si lazima, haiwezi kuongezwa baada ya kuhifadhi).',
  },
  'row.ready': {
    de: 'Alles ausgefüllt. Jetzt unten auf „Speichern“ tippen.',
    en: 'Everything is filled in. Now tap “Save” below.',
    sw: 'Kila kitu kimejazwa. Sasa gusa “Hifadhi” hapa chini.',
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
    de: [
      'Bei 1 vollständigen Eintrag fehlt der Screenshot der Transaktion. Nach dem Speichern kann er nicht mehr ergänzt werden. Trotzdem speichern?',
      'Bei {n} vollständigen Einträgen fehlt der Screenshot der Transaktion. Nach dem Speichern kann er nicht mehr ergänzt werden. Trotzdem speichern?',
    ],
    en: [
      '1 complete entry has no transaction screenshot. It cannot be added after saving. Save anyway?',
      '{n} complete entries have no transaction screenshot. It cannot be added after saving. Save anyway?',
    ],
    sw: [
      'Ingizo 1 lililokamilika halina picha ya skrini ya muamala. Haiwezi kuongezwa baada ya kuhifadhi. Hifadhi hata hivyo?',
      'Maingizo {n} yaliyokamilika hayana picha ya skrini ya muamala. Haziwezi kuongezwa baada ya kuhifadhi. Hifadhi hata hivyo?',
    ],
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
    de: [
      'Am {date} hat der deutsche Hilfsverein Children of Mathare Germany 1 Eintrag gesichert und zur Prüfung an die Behörden weitergegeben.',
      'Am {date} hat der deutsche Hilfsverein Children of Mathare Germany {n} Einträge gesichert und zur Prüfung an die Behörden weitergegeben.',
    ],
    en: [
      'On {date}, the German charity Children of Mathare Germany backed up 1 entry and passed it on to the authorities for review.',
      'On {date}, the German charity Children of Mathare Germany backed up {n} entries and passed them on to the authorities for review.',
    ],
    sw: [
      'Tarehe {date}, shirika la misaada la Ujerumani Children of Mathare Germany lilihifadhi ingizo 1 na kulikabidhi kwa mamlaka kwa ajili ya ukaguzi.',
      'Tarehe {date}, shirika la misaada la Ujerumani Children of Mathare Germany lilihifadhi maingizo {n} na kuyakabidhi kwa mamlaka kwa ajili ya ukaguzi.',
    ],
  },
  'band.label': { de: 'Geldeingang und Restbetrag', en: 'Money received and amount left', sw: 'Pesa zilizopokelewa na kiasi kilichobaki' },
  'band.since': { de: 'Seit Geldeingang vom {date}', en: 'Since money received on {date}', sw: 'Tangu pesa zilizopokelewa tarehe {date}' },
  'band.paid': { de: 'Bezahlt', en: 'Paid', sw: 'Imelipwa' },
  'band.left': { de: 'Übrig', en: 'Left', sw: 'Imebaki' },
  'band.over': { de: 'Überzogen um', en: 'Overspent by', sw: 'Imezidi kwa' },
  'photo.credit': {
    de: 'Foto:',
    en: 'Photo:',
    sw: 'Picha:',
  },
  'photo.changes': {
    de: 'zugeschnitten und verkleinert',
    en: 'cropped and resized',
    sw: 'imekatwa na kupunguzwa ukubwa',
  },
  'band.eur': { de: '(ca. {eur} €)', en: '(approx. €{eur})', sw: '(takriban €{eur})' },
  'band.rateTitle': {
    de: 'Tagesmittelkurs vom {date}: 1 € = {rate} KSh (freier Kursdienst currency-api)',
    en: 'Daily mid rate of {date}: €1 = KSh {rate} (free rate service currency-api)',
    sw: 'Kiwango cha wastani cha tarehe {date}: €1 = KSh {rate} (huduma huria ya viwango currency-api)',
  },
  'band.none': {
    de: 'Noch kein Geldeingang erfasst. Sobald einer eingetragen ist, siehst du hier, wie viel davon übrig ist.',
    en: 'No money received recorded yet. Once one is entered, you will see here how much of it is left.',
    sw: 'Bado hakuna pesa zilizopokelewa zilizorekodiwa. Zikishaingizwa, utaona hapa kiasi kilichobaki.',
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
  'status.incomeOpen': { de: 'noch nicht bestätigt', en: 'not yet confirmed', sw: 'bado haijathibitishwa' },
  'status.incomeVerified': { de: 'bestätigt', en: 'confirmed', sw: 'imethibitishwa' },
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
    de: [
      'Bei 1 Eintrag konnten Bilder nicht abgerufen werden. Dieser Eintrag wird nicht gelöscht und erscheint in der nächsten Sicherung erneut.',
      'Bei {n} Einträgen konnten Bilder nicht abgerufen werden. Diese Einträge werden nicht gelöscht und erscheinen in der nächsten Sicherung erneut.',
    ],
    en: [
      'Images could not be loaded for 1 entry. This entry will not be deleted and will appear again in the next backup.',
      'Images could not be loaded for {n} entries. These entries will not be deleted and will appear again in the next backup.',
    ],
    sw: [
      'Picha za ingizo 1 hazikuweza kupakuliwa. Ingizo hili halitafutwa na litaonekana tena kwenye nakala inayofuata.',
      'Picha za maingizo {n} hazikuweza kupakuliwa. Maingizo haya hayatafutwa na yataonekana tena kwenye nakala inayofuata.',
    ],
  },
  'admin.approve': { de: 'ausnahmsweise genehmigen', en: 'approve as an exception', sw: 'idhinisha kwa hali maalum' },
  'admin.incomesPending': {
    de: ['1 Geldeingang wartet auf deine Bestätigung.', '{n} Geldeingänge warten auf deine Bestätigung.'],
    en: ['1 money received entry is waiting for your confirmation.', '{n} money received entries are waiting for your confirmation.'],
    sw: ['Ingizo 1 la pesa zilizopokelewa linasubiri uthibitisho wako.', 'Maingizo {n} ya pesa zilizopokelewa yanasubiri uthibitisho wako.'],
  },
  'admin.verifyIncome': { de: 'Bestätigen', en: 'Confirm', sw: 'Thibitisha' },
  'admin.verifyIncomeConfirm': {
    de: 'Geldeingang von {from} vom {date} über KSh {amount}{eur}: Passt er zu einer Zahlung von euch? Dann bestätige ihn.',
    en: 'Money received from {from} on {date}, KSh {amount}{eur}: does it match one of your payments? Then confirm it.',
    sw: 'Pesa zilizopokelewa kutoka {from} tarehe {date}, KSh {amount}{eur}: je, zinalingana na mojawapo ya malipo yenu? Basi zithibitishe.',
  },
  'admin.incomeVerified': { de: 'Geldeingang bestätigt.', en: 'Money received confirmed.', sw: 'Pesa zilizopokelewa zimethibitishwa.' },
  'admin.removeIncome': { de: 'Löschen', en: 'Delete', sw: 'Futa' },
  'admin.removeIncomeConfirm': {
    de: 'Geldeingang von {from} vom {date} über KSh {amount}{eur} endgültig löschen?',
    en: 'Permanently delete the money received from {from} on {date}, KSh {amount}{eur}?',
    sw: 'Futa kabisa pesa zilizopokelewa kutoka {from} tarehe {date}, KSh {amount}{eur}?',
  },
  'admin.removeIncomeMoves': {
    de: 'Die Ausgaben dieses Zeitraums zählen dann zum Geldeingang vom {date}.',
    en: 'The expenses of this period will then count towards the money received on {date}.',
    sw: 'Matumizi ya kipindi hiki yatahesabiwa kwenye pesa zilizopokelewa tarehe {date}.',
  },
  'admin.removeIncomeMovesPre': {
    de: 'Die Ausgaben dieses Zeitraums zählen dann zu „Vor dem ersten erfassten Geldeingang“.',
    en: 'The expenses of this period will then count as “Before the first recorded money received”.',
    sw: 'Matumizi ya kipindi hiki yatahesabiwa kama “Kabla ya pesa za kwanza zilizorekodiwa”.',
  },
  'admin.removeIncomeFinal': { de: 'Das kann nicht rückgängig gemacht werden.', en: 'This cannot be undone.', sw: 'Hili haliwezi kutenduliwa.' },
  'admin.removeIncomeCheck': {
    de: 'Ja, dieser Geldeingang ist falsch oder doppelt eingetragen.',
    en: 'Yes, this money received entry is wrong or entered twice.',
    sw: 'Ndiyo, ingizo hili la pesa zilizopokelewa si sahihi au limeingizwa mara mbili.',
  },
  'admin.removeIncomeYes': { de: 'Endgültig löschen', en: 'Delete permanently', sw: 'Futa kabisa' },
  'admin.incomeRemoved': { de: 'Geldeingang gelöscht.', en: 'Money received entry deleted.', sw: 'Ingizo la pesa zilizopokelewa limefutwa.' },
  'admin.incomeChanged': {
    de: 'Der Geldeingang wurde inzwischen geändert, gelöscht oder gesichert. Die Ansicht ist jetzt aktuell.',
    en: 'The money received entry has been changed, deleted or backed up in the meantime. The view is now up to date.',
    sw: 'Ingizo la pesa zilizopokelewa limebadilishwa, limefutwa au limehifadhiwa kwa sasa. Mwonekano sasa umesasishwa.',
  },
  'admin.incomeDuplicate': {
    de: 'Gleicher Betrag und gleiches Datum wie ein anderer Geldeingang – doppelt eingetragen?',
    en: 'Same amount and date as another money received entry – entered twice?',
    sw: 'Kiasi na tarehe sawa na ingizo lingine la pesa zilizopokelewa – limeingizwa mara mbili?',
  },
  'admin.requests': { de: 'Geldanfragen', en: 'Money requests', sw: 'Maombi ya pesa' },
  'admin.requestsNone': {
    de: 'Zurzeit gibt es keine Geldanfragen vom Team in Kenia.',
    en: 'There are currently no money requests from the team in Kenya.',
    sw: 'Kwa sasa hakuna maombi ya pesa kutoka kwa timu ya Kenya.',
  },
  'admin.requestsNew': {
    de: ['1 neue Geldanfrage ist noch nicht als gelesen markiert.', '{n} neue Geldanfragen sind noch nicht als gelesen markiert.'],
    en: ['1 new money request is not yet marked as read.', '{n} new money requests are not yet marked as read.'],
    sw: ['Ombi 1 jipya la pesa bado halijawekwa alama kuwa limesomwa.', 'Maombi {n} mapya ya pesa bado hayajawekwa alama kuwa yamesomwa.'],
  },
  'admin.markRead': { de: 'Gelesen und in Absprache', en: 'Read and under discussion', sw: 'Limesomwa na linajadiliwa' },
  'admin.markReadConfirm': {
    de: 'Die Anfrage für {person} als „gelesen und in Absprache“ markieren? Das Team in Kenia sieht das sofort und kann die Anfrage danach nicht mehr zurückziehen.',
    en: 'Mark the request for {person} as “read and under discussion”? The team in Kenya sees this immediately and can no longer withdraw the request afterwards.',
    sw: 'Ungependa kuweka alama kwenye ombi kwa ajili ya {person} kuwa “limesomwa na linajadiliwa”? Timu ya Kenya itaona hili mara moja na haitaweza tena kuliondoa ombi hilo.',
  },
  'admin.markReadYes': { de: 'Markieren', en: 'Mark', sw: 'Weka alama' },
  'admin.requestRead': {
    de: 'Die Anfrage ist als „gelesen und in Absprache“ markiert.',
    en: 'The request is marked as “read and under discussion”.',
    sw: 'Ombi limewekwa alama kuwa “limesomwa na linajadiliwa”.',
  },
  'admin.removeRequest': { de: 'Löschen', en: 'Delete', sw: 'Futa' },
  'admin.removeRequestConfirm': {
    de: 'Die Anfrage für {person} über KSh {amount} löschen? Das Team in Kenia sieht vier Tage lang den Hinweis, dass ihr die Anfrage entfernt habt.',
    en: 'Delete the request for {person} of KSh {amount}? For four days the team in Kenya will see a notice that you removed the request.',
    sw: 'Ungependa kufuta ombi la KSh {amount} kwa ajili ya {person}? Kwa siku nne timu ya Kenya itaona taarifa kwamba mmeondoa ombi hilo.',
  },
  'admin.removeUnreadableConfirm': {
    de: 'Diese nicht lesbare Anfrage löschen?',
    en: 'Delete this unreadable request?',
    sw: 'Ungependa kufuta ombi hili lisilosomeka?',
  },
  'admin.removeRequestYes': { de: 'Anfrage löschen', en: 'Delete request', sw: 'Futa ombi' },
  'admin.requestRemoved': { de: 'Die Anfrage wurde gelöscht.', en: 'The request has been deleted.', sw: 'Ombi limefutwa.' },
  'admin.requestGone': {
    de: 'Das Team hatte diese Anfrage schon zurückgezogen.',
    en: 'The team had already withdrawn this request.',
    sw: 'Timu ilikuwa tayari imeondoa ombi hili.',
  },
  'admin.requestEurHint': {
    de: '€-Werte in Klammern sind ungefähr: Tagesmittelkurs von heute (freier Kursdienst currency-api).',
    en: '€ values in brackets are approximate: today’s daily mid rate (free rate service currency-api).',
    sw: 'Thamani za € kwenye mabano ni za takriban: kiwango cha wastani cha leo (huduma huria ya viwango currency-api).',
  },
  'admin.eurHint': {
    de: '€-Werte in Klammern sind ungefähr: Tagesmittelkurs am Datum des Geldeingangs (freier Kursdienst currency-api).',
    en: '€ values in brackets are approximate: daily mid rate on the date of the money received (free rate service currency-api).',
    sw: 'Thamani za € kwenye mabano ni za takriban: kiwango cha wastani cha siku ya pesa zilizopokelewa (huduma huria ya viwango currency-api).',
  },
  'admin.unverifiedExport': {
    de: ['1 Geldeingang ist noch nicht bestätigt. Er wird trotzdem gesichert, steht in der PDF als „noch nicht bestätigt“ und lässt sich nach dem Löschen nicht mehr bestätigen. Jetzt herunterladen?', '{n} Geldeingänge sind noch nicht bestätigt. Sie werden trotzdem gesichert, stehen in der PDF als „noch nicht bestätigt“ und lassen sich nach dem Löschen nicht mehr bestätigen. Jetzt herunterladen?'],
    en: ['1 money received entry is not yet confirmed. It will still be backed up, appears in the PDF as “not yet confirmed” and cannot be confirmed after deleting. Download now?', '{n} money received entries are not yet confirmed. They will still be backed up, appear in the PDF as “not yet confirmed” and cannot be confirmed after deleting. Download now?'],
    sw: ['Ingizo 1 la pesa zilizopokelewa bado halijathibitishwa. Bado litahifadhiwa, litaonekana kwenye PDF kama “bado haijathibitishwa” na haliwezi kuthibitishwa baada ya kufutwa. Pakua sasa?', 'Maingizo {n} ya pesa zilizopokelewa bado hayajathibitishwa. Bado yatahifadhiwa, yataonekana kwenye PDF kama “bado haijathibitishwa” na hayawezi kuthibitishwa baada ya kufutwa. Pakua sasa?'],
  },
  'admin.downloadAnyway': { de: 'Trotzdem herunterladen', en: 'Download anyway', sw: 'Pakua hata hivyo' },
  'admin.downloadAgain': {
    de: 'Die heruntergeladene PDF enthält diesen Geldeingang noch im alten Stand. Bitte lade die aktuelle Datenlage erneut herunter, bevor du löschst.',
    en: 'The downloaded PDF still contains this money received entry in its old state. Please download the current data again before deleting.',
    sw: 'PDF iliyopakuliwa bado ina ingizo hili la pesa zilizopokelewa katika hali yake ya zamani. Tafadhali pakua data ya sasa tena kabla ya kufuta.',
  },
  'admin.downloadOutdated': {
    de: 'Seit dem Herunterladen hat sich etwas geändert (z. B. wurde ein Geldeingang bestätigt oder gelöscht). Es wurde nichts gelöscht. Bitte lade die aktuelle Datenlage erneut herunter.',
    en: 'Something has changed since the download (e.g. money received was confirmed or deleted). Nothing was deleted. Please download the current data again.',
    sw: 'Kuna kilichobadilika tangu kupakua (k.m. pesa zilizopokelewa zimethibitishwa au zimefutwa). Hakuna kilichofutwa. Tafadhali pakua data ya sasa tena.',
  },
  'admin.archiveStale': {
    de: 'Die Daten haben sich seit dem Herunterladen geändert. Es wurde nichts gelöscht. Bitte lade die aktuelle Datenlage erneut herunter.',
    en: 'The data has changed since the download. Nothing was deleted. Please download the current data again.',
    sw: 'Data imebadilika tangu ilipopakuliwa. Hakuna kilichofutwa. Tafadhali pakua data ya sasa tena.',
  },
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
    de: [
      'Die Datei „{file}“ mit 1 Eintrag wurde heruntergeladen. Bitte prüfe, ob sie vollständig gespeichert wurde, bevor du den Eintrag löschst.',
      'Die Datei „{file}“ mit {n} Einträgen wurde heruntergeladen. Bitte prüfe, ob sie vollständig gespeichert wurde, bevor du die Einträge löschst.',
    ],
    en: [
      'The file “{file}” with 1 entry has been downloaded. Please check that it was saved completely before deleting the entry.',
      'The file “{file}” with {n} entries has been downloaded. Please check that it was saved completely before deleting the entries.',
    ],
    sw: [
      'Faili “{file}” yenye ingizo 1 imepakuliwa. Tafadhali hakikisha imehifadhiwa kikamilifu kabla ya kufuta ingizo hilo.',
      'Faili “{file}” yenye maingizo {n} imepakuliwa. Tafadhali hakikisha imehifadhiwa kikamilifu kabla ya kufuta maingizo.',
    ],
  },
  'admin.delete': {
    de: 'Heruntergeladene Einträge aus der Datenbank löschen',
    en: 'Delete downloaded entries from the database',
    sw: 'Futa maingizo yaliyopakuliwa kutoka kwenye hifadhidata',
  },
  'admin.deleteConfirm': {
    de: [
      'Soll der heruntergeladene Eintrag samt Bildern endgültig aus der Datenbank gelöscht werden? Das kann nicht rückgängig gemacht werden.',
      'Sollen die {n} heruntergeladenen Einträge samt Bildern endgültig aus der Datenbank gelöscht werden? Das kann nicht rückgängig gemacht werden.',
    ],
    en: [
      'Should the downloaded entry including images be permanently deleted from the database? This cannot be undone.',
      'Should the {n} downloaded entries including images be permanently deleted from the database? This cannot be undone.',
    ],
    sw: [
      'Je, ingizo lililopakuliwa pamoja na picha lifutwe kabisa kutoka kwenye hifadhidata? Hili haliwezi kutenduliwa.',
      'Je, maingizo {n} yaliyopakuliwa pamoja na picha yafutwe kabisa kutoka kwenye hifadhidata? Hili haliwezi kutenduliwa.',
    ],
  },
  'admin.deleteCheck': {
    de: 'Ich habe die PDF-Datei gespeichert und geöffnet.',
    en: 'I have saved and opened the PDF file.',
    sw: 'Nimehifadhi na kufungua faili ya PDF.',
  },
  'admin.deleteYes': { de: 'Endgültig löschen', en: 'Delete permanently', sw: 'Futa kabisa' },
  'admin.deleted': {
    de: ['1 Eintrag wurde gelöscht.', '{n} Einträge wurden gelöscht.'],
    en: ['1 entry has been deleted.', '{n} entries have been deleted.'],
    sw: ['Ingizo 1 limefutwa.', 'Maingizo {n} yamefutwa.'],
  },
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

// Texte mit Anzahl: [Einzahl, Mehrzahl]; gewählt wird nach params.n.
export function t(key, params = {}) {
  const entry = T[key];
  let text = entry ? entry[current] || entry.de : key;
  if (Array.isArray(text)) text = Number(params.n) === 1 ? text[0] : text[1];
  for (const [k, v] of Object.entries(params)) text = text.split(`{${k}}`).join(String(v));
  return text;
}
