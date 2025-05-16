//Scriptverantwortlicher : ASE


import React from "react";

function PrivacyPolicyComp() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 pt-24 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Datenschutz­erklärung</h1>

      <div className="space-y-8 text-base leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Allgemeine Hinweise</h2>
          <p>
            Der Schutz deiner persönlichen Daten ist uns sehr wichtig. In dieser Datenschutzerklärung erfährst du,
            welche Daten wir erfassen, wie wir sie nutzen und welche Rechte du hast.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Welche Daten werden erfasst?</h2>
          <p>
            Beim Besuch dieser Website werden automatisch Informationen wie IP-Adresse, Browsertyp, Datum und Uhrzeit des Zugriffs gespeichert.
            Darüber hinaus erfassen wir Daten, wenn du ein Formular ausfüllst oder dich mit uns in Verbindung setzt.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Zweck der Datennutzung</h2>
          <p>
            Die erhobenen Daten werden genutzt, um unsere Website bereitzustellen, zu optimieren und mit dir zu kommunizieren.
            Dazu gehört auch die Analyse des Nutzerverhaltens zur Verbesserung unseres Angebots.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Weitergabe an Dritte</h2>
          <p>
            Eine Weitergabe deiner Daten an Dritte erfolgt nur, wenn dies gesetzlich erlaubt ist oder du ausdrücklich eingewilligt hast.
            Wir arbeiten ggf. mit vertrauenswürdigen Dienstleistern (z. B. Hosting oder Analyse) zusammen, die sich an die DSGVO halten.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Deine Rechte</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Auskunft über gespeicherte Daten</li>
            <li>Berichtigung unrichtiger Daten</li>
            <li>Löschung oder Einschränkung der Verarbeitung</li>
            <li>Widerspruch gegen die Verarbeitung</li>
            <li>Datenübertragbarkeit (sofern technisch möglich)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Cookies und Tracking</h2>
          <p>
            Unsere Website verwendet Cookies, um bestimmte Funktionen bereitzustellen und das Nutzerverhalten zu analysieren.
            Du kannst die Speicherung in den Browser-Einstellungen anpassen oder ablehnen.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">7. Speicherdauer</h2>
          <p>
            Wir speichern personenbezogene Daten nur so lange, wie es für die genannten Zwecke erforderlich ist
            oder gesetzliche Aufbewahrungspflichten bestehen.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">8. Sicherheit</h2>
          <p>
            Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um deine Daten gegen unbefugten Zugriff,
            Verlust oder Manipulation zu schützen.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">9. Kontakt</h2>
          <p>
            Bei Fragen zum Datenschutz kannst du uns jederzeit kontaktieren – die entsprechenden Kontaktdaten findest du im Impressum.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PrivacyPolicyComp;
