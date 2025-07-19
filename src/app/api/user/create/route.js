import { NextResponse } from "next/server";


export async function POST(request) {
  // Dieser Endpunkt wurde deaktiviert. Benutzer können nur über Clerk-Webhook hinzugefügt werden.
  return NextResponse.json(
    {
      error:
        "Das Erstellen von Benutzern wird über diesen Endpunkt nicht unterstützt. Bitte verwenden Sie den Standardregistrierungsprozess für die Anmeldung.",
    },
    { status: 403 }
  );
}
