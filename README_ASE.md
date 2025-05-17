# Entwicklung Footer Elemente ASE 14. und 15.05.2025
# Dokumentation – Footer- und Kontaktanpassungen (Actyra)

Diese Dokumentation beschreibt alle  vorgenommenen Änderungen am Projekt "Actyra", insbesondere an Footer, Kontaktformularen und allgemeinen Informationsseiten. 

---

## 1. Datei: `src/components/footer.js`

### Änderungen:

* **Newsletter-Formular** mit Dummy-Funktion ("Coming Soon" beim Absenden)
* Überschrift korrigiert zu: `Newsletter abonnieren`
* Button- und Eingabefeld-Styling vereinheitlicht (Dark-/Light-Mode unterstützt)
* **Mini-Galerie (Gallery)**:

  * Umgebaut auf Objektstruktur `{ src, href }`
  * Jedes Bild hat eine eigene Event-Verlinkung
  * Kommentiert mit `// Bild 1`, `// Bild 2`, usw.
  * Verlinkungen zu Unterseiten erstellt z.B. FAQ

### Pfad:

`src/components/footer.js`

---

## 2. Datei: `src/app/privacy/page.js`

### Änderungen:

* `PrivacyPolicyComp` eingebunden
* Hintergrundfarbe im Dark Mode angepasst: `dark:bg-[#0D0E25]` statt `black`

### Pfad:

`src/app/privacy/page.js`

---

## 3. Datei: `src/components/footer/PrivacyPolicyComp.js`

### Inhalt:

* Datenschutzrichtlinie mit verständlicher Gliederung (Abschnitte: Datenerhebung, Nutzung, Rechte, etc.)

### Pfad:

`src/components/footer/PrivacyPolicyComp.js`

---

## 4. Datei: `src/app/terms/page.js`

### Änderungen:

* `TermsComp` eingebunden
* Dark Mode angepasst

### Pfad:

`src/app/terms/page.js`

---

## 5. Datei: `src/components/footer/TermsComp.js`

### Inhalt:

* AGB in klarer, verständlicher Sprache mit Gliederung

### Pfad:

`src/components/footer/TermsComp.js`

---

## 6. Datei: `src/app/faq/page.js`

### Änderungen:

* `FaqComp` eingebunden
* Dark Mode Hintergrund angepasst

### Pfad:

`src/app/faq/page.js`

---

## 7. Datei: `src/components/footer/FaqComp.js`

### Inhalt:

* Strukturierte Fragen und Antworten (z. B. zu Actyra, Funktionen, Support)

### Pfad:

`src/components/footer/FaqComp.js`

---

## 8. Datei: `src/app/support/page.js`

### Änderungen:

* `SupportComp` eingebunden
* Dark Mode angepasst

### Pfad:

`src/app/support/page.js`

---

## 9. Datei: `src/components/footer/SupportComp.js`

### Inhalt:

* Großes Supportbild (PNG, responsive, `rounded-2xl`)
* Rechte Seite: Kontaktdaten (E-Mail, Telefonnummer)
* Telefonnummer mit Frankfurter Vorwahl: `+49 69 555 555`

### Pfad:

`src/components/footer/SupportComp.js`

---

## 10. Datei: `src/app/contact/page.js`

### Änderungen:

* `ContactComp` eingebunden
* Dark Mode korrekt angepasst

### Pfad:

`src/app/contact/page.js`

---

## 11. Datei: `src/components/footer/ContactComp.js`

### Inhalt:

* Kontaktformular mit Feldern: Name, Firma, Telefon, E-Mail
* Dummy-Absenden mit "Coming Soon"
* Unterhalb: **Google Maps Embed** für Standort Frankfurt
* Kein Bild mehr eingebunden, sondern `<iframe>`

### Pfad:

`src/components/footer/ContactComp.js`

---

## 12. Dark Mode Hinweis

Die Standardfarbe im Dark Mode wird zentral in `global.css` gesetzt über:

```css
body {
  @apply bg-white text-black dark:bg-[#0D0E25] dark:text-white;
}
```

Alle `main`-Container wurden angepasst, um `dark:bg-black` zu entfernen oder korrekt auf `dark:bg-[#0D0E25]` zu setzen.

---

## Hinweis zur Erweiterung


* Newsletter-Formular ist vorbereitet für echte Anbindung (z. B. Mailchimp)
* Die Seitenstruktur ist modular und sauber getrennt





# Dokumentation ASE Entwicklung 06.05.2025
KategorienSection.js  / war nur Platzhalter 
Kategorien Kacheln eingefügt 
Scriptverantwortlicher eingefügt

# neues Verzeichnis in public  + Icons 
public/kategorien --> neu angelegt   --> wieder glöscht weil nicht mehr benötigt das Fonatawesome.com Icons genutzt werden
# gelöscht 


# Scriptanpassung
**Script: EventForm.js** --> H1 Überschrift "Tragen Sie hier Ihr Event ein" 
Scriptverantwortlicher nachgetragen


# neues Verzeichnis erstellt unter src/
src/icons 

hier wurden die Kategorieicons abgeholt von 
https://fontawesome.com/





# Dokumentation ASE Entwicklung 28.04.2025

Dieses Dokument beschreibt die wichtigsten Skripte im Projekt **Event erstellen**.

---

## 📂 src/components/EventForm.js

**Beschreibung:**  
Das Hauptformular für Veranstalter:innen zur Eingabe aller Eventdetails.

**Funktionen:**

- Eingabe von: Titel, Beschreibung, Ort, Kategorie, Datum, Ticketanzahl, Preis und Spendenbetrag.
- Bild-Upload-Funktion über die Komponente `ImageUpload`.
- Übergibt die Formulardaten an `EventPreview` zur Vorschau.
- Client-Komponente (`"use client"`).

---

## 📂 src/components/EventPreview.js

**Beschreibung:**  
Zeigt eine Vorschau des erstellten Events an, bevor es gespeichert wird.

**Funktionen:**

- Übernimmt die Daten aus dem `EventForm`.
- Stellt das Event im gleichen Design dar wie öffentliche Eventkarten.
- Zeigt Eventbild, Titel, Datum, Ort, Preis und Beschreibung.
- Ermöglicht eine Kontrolle vor finalem Speichern.

---

## 📂 src/components/HeroEventErstellen.js

**Beschreibung:**  
Der große Einstiegsbereich ("Hero") der Event erstellen Seite.

**Funktionen:**

- Vollflächiger, responsiver Bereich mit Farbverlaufshintergrund.
- Anzeige des Slogans:  
  _"Planen Sie Ihr Event mit Actyra. Erreichen Sie Ihr Publikum – und unterstützen Sie Projekte, die Gutes bewirken."_
- Keine Bild- oder Video-Elemente mehr enthalten (bereinigt).
- Fokus auf klare, einladende Darstellung.

---

## 📂 src/components/ImageUpload.js

**Beschreibung:**  
Komponente für den Upload eines Eventbildes oder Flyers.

**Funktionen:**

- Ermöglicht die Auswahl und lokale Vorschau eines Bildes.
- Prüft Bildformat und Größe (z.B. JPEG, PNG).
- Übergibt das Bild an das `EventForm`.
- Feedback an den User bei erfolgreichem Upload oder Fehlern.

---

## 📂 src/data/categories.js

**Beschreibung:**  
Statische Datendatei zur Auswahl der Eventkategorie im Formular.

**Funktionen:**

- Listet alle verfügbaren Kategorien als Array auf.
- Beispielkategorien: "Konzert", "Workshop", "Sportevent", "Kultur", etc.
- Wird in `EventForm` importiert und für Dropdown-Auswahl genutzt.
- Später leicht erweiterbar für dynamische Kategorien (z.B. aus MongoDB).

---

# ✨ Hinweis

Alle Komponenten sind modular aufgebaut und können unabhängig angepasst werden.  
Sie folgen einheitlichen TailwindCSS- und React-Standards für einfaches Customizing und Responsive Design.
