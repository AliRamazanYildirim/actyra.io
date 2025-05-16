import React from "react";

export default function TermsComp() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 pt-24 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Allgemeine Geschäftsbedingungen (AGB)
      </h1>

      <div className="space-y-8 text-base leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Website „Actyra“ sowie für alle darüber angebotenen Dienste und Inhalte.
            Mit dem Zugriff auf unsere Website erklärst du dich mit diesen Bedingungen einverstanden.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Nutzungsbedingungen</h2>
          <p>
            Die Nutzung unserer Website ist nur im Rahmen der geltenden Gesetze und dieser AGB gestattet.
            Insbesondere ist es untersagt, Inhalte unbefugt zu kopieren, zu verbreiten oder sicherheitsrelevante Funktionen zu umgehen.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Rechte und Pflichten der Nutzer</h2>
          <p>
            Nutzer verpflichten sich, wahrheitsgemäße Angaben zu machen, keine rechtswidrigen Inhalte zu veröffentlichen
            und keine Rechte Dritter zu verletzen. Für alle bereitgestellten Inhalte tragen die Nutzer selbst die Verantwortung.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Haftungsausschluss und Gewährleistung</h2>
          <p>
            Wir übernehmen keine Haftung für die Richtigkeit, Vollständigkeit oder Aktualität der bereitgestellten Informationen.
            Ebenso haften wir nicht für technische Ausfälle oder Datenverluste, sofern kein Vorsatz oder grobe Fahrlässigkeit vorliegt.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Vertragslaufzeit und Kündigung</h2>
          <p>
            Eine Nutzung der Website ist in der Regel unverbindlich. Soweit darüber hinaus Verträge abgeschlossen werden,
            gelten jeweils die dort vereinbarten Laufzeiten und Kündigungsfristen.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Änderungen der AGB</h2>
          <p>
            Wir behalten uns vor, diese AGB jederzeit mit Wirkung für die Zukunft zu ändern.
            Über wesentliche Änderungen informieren wir dich rechtzeitig auf der Website.
            Die weitere Nutzung gilt als Zustimmung zu den Änderungen.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">7. Kontakt</h2>
          <p>
            Bei Fragen zu diesen AGB oder anderen rechtlichen Anliegen kannst du uns jederzeit kontaktieren.
            Die Kontaktdaten findest du im Impressum dieser Website.
          </p>
        </div>
      </div>
    </section>
  );
}
