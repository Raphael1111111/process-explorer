

# KI-Prozess-Workshop App

Eine minimalistische, workshoptaugliche Web-App, mit der Teams Geschäftsprozesse visuell aufbauen und KI-Potenziale identifizieren können.

## Design-Prinzipien
- Weißer Hintergrund, viel Weißraum, große lesbare Schrift (18px+ Body)
- Weiche Farben: Prozessschritte in sanftem Blau, KI-Schritte in warmem Violett, Engpässe in gedämpftem Orange, Entscheidungen in Grün, Systeme in Grau
- Progressive Offenlegung: immer nur das Nötigste sichtbar
- Abgerundete Karten, subtile Schatten, keine harten Linien

## Aufbau der Seite

### Oberer Bereich
- Prozessname (editierbar, groß)
- Toggle zwischen **Menschenansicht** und **KI-/Technikansicht**
- Kleiner Hilfe-Button mit kontextuellen Leitfragen

### Hauptbereich: Visueller Prozess-Canvas
- Horizontaler/vertikaler Flow-Canvas mit Drag & Drop (react-flow oder eigene Implementierung)
- Elemente per Klick oder "+" Button hinzufügen
- 5 Elementtypen als einfache Palette am Rand:
  - 🔵 Prozessschritt
  - 🟢 Entscheidung (Raute)
  - 🟠 Engpass / Problemstelle
  - 🟣 KI-Schritt
  - ⚪ System / Schnittstelle
- Verbindungen zwischen Elementen durch Klick-Verbindung (Handles an den Kanten)
- Elemente sind verschiebbar, umbenennbar, löschbar

### Menschenansicht vs. KI-/Technikansicht
- **Menschenansicht**: KI-Schritte erscheinen als einfache kompakte Karte ("KI erstellt Zusammenfassung")
- **KI-/Technikansicht**: KI-Schritte klappen auf und zeigen:
  - Input (was fließt hinein)
  - Output (was kommt heraus)
  - Beteiligte Systeme
  - Prüfpunkt ja/nein
  - Menschliche Freigabe nötig ja/nein
  - Übergabe an wen

### Rechter Seitenbereich: Bearbeitungspanel (bei Auswahl eines Elements)
- Slide-in Panel, ruhig und klar
- Elementname (großes Textfeld)
- Je nach Elementtyp passende einfache Felder:
  - Prozessschritt: Beschreibung, Dauer, Verantwortlich
  - Entscheidung: Frage, Optionen
  - Engpass: Problem, Häufigkeit, Auswirkung
  - KI-Schritt: Was macht die KI?, Input, Output, Braucht menschliche Freigabe?
  - System: Name, Typ, Verbunden mit
- Leitfragen als sanfte Hinweise unter den Feldern (z.B. "Wo wiederholt sich Arbeit?", "Was könnte KI vorbereiten?")

### Geführter Einstieg
- Beim ersten Öffnen: sanfter Onboarding-Flow mit 2-3 Schritten
  - "Wie heißt der Prozess, den du abbilden möchtest?"
  - "Was ist der erste Schritt?"
  - Danach öffnet sich der Canvas mit dem ersten Element
- Leitfragen erscheinen kontextuell als dezente Tipps am unteren Rand

### Zusatzfunktionen
- Export als PNG/PDF (html-to-canvas)
- Prozess zurücksetzen
- Beispiel-Prozess laden (z.B. "Angebotserstellung" oder "Reklamationsbearbeitung")

## Technische Umsetzung
- React Flow (@xyflow/react) für den Canvas
- Zustand im React State (kein Backend)
- Tailwind CSS für das Design
- Framer Motion für sanfte Animationen beim Öffnen/Schließen von Panels

