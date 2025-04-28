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
