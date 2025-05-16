import React from "react";

export default function FaqComp() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 pt-24 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">Häufige Fragen (FAQ)</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Was ist Actyra?</h2>
          <p>
            Actyra ist eine Plattform für soziale und kulturelle Veranstaltungen. Du kannst Events entdecken, selbst erstellen oder daran teilnehmen.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Kostet die Nutzung etwas?</h2>
          <p>
            Die Nutzung der Plattform ist grundsätzlich kostenlos. Für bestimmte Premium-Funktionen oder kostenpflichtige Events können Gebühren anfallen.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Wie kann ich eigene Events erstellen?</h2>
          <p>
            Über den Button „Event erstellen“ im Hauptmenü kannst du ein eigenes Event anlegen, Bilder hochladen und vieles mehr.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Gibt es einen Support bei Problemen?</h2>
          <p>
            Ja. Du kannst dich über die Seite „Customer Support“ an unser Team wenden. Wir helfen dir gerne weiter.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Wie funktioniert der Dark-/Light-Mode?</h2>
          <p>
            Du kannst den Modus über das Sonnen- oder Mondsymbol in der Navigation wechseln. Deine Einstellung wird automatisch gespeichert.
          </p>
        </div>
      </div>
    </section>
  );
}
