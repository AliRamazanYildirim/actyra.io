// Importieren der notwendigen Hooks und Komponenten
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Eye as EyeIcon,
    EyeOff as EyeOffIcon,
    Lock as LockIcon,
    Key as KeyIcon,
    RefreshCw as RefreshCwIcon,
} from "lucide-react";

// Standard-Export der PasswordSection-Komponente
export default function PasswordSection() {
    // Zustand für die Passworteingaben und Fehler
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    // Funktion zur Änderung des Passworts
    const handlePasswordChange = () => {
        // Passwortvalidierung
        if (newPassword.length < 8) {
            setPasswordError("Das Passwort muss mindestens 8 Zeichen lang sein");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Die Passwörter stimmen nicht überein");
            return;
        }

        // In einer echten Anwendung würde hier ein API-Aufruf erfolgen
        alert("Passwort wurde aktualisiert (Demo)");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
    };

    // Funktion zum Zurücksetzen des Passworts
    const handlePasswordReset = () => {
        alert("Ein Link zum Zurücksetzen des Passworts wurde an Ihre E-Mail-Adresse gesendet (Demo)");
    };

    return (
        <div className="mt-8 pt-6 border-t border-gray-700">
            {/* Überschrift für den Passwortbereich */}
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                <LockIcon className="w-5 h-5 mr-2 text-pink-500" />
                Passwort ändern
            </h3>

            <div className="space-y-4 bg-gray-800/30 p-4 rounded-lg">
                {/* Eingabefeld für das aktuelle Passwort */}
                <div>
                    <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium mb-1"
                    >
                        Aktuelles Passwort
                    </label>
                    <div className="relative">
                        <input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none pr-10"
                        />
                        {/* Button zum Anzeigen/Verbergen des Passworts */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeOffIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Eingabefeld für das neue Passwort */}
                <div>
                    <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium mb-1"
                    >
                        Neues Passwort
                    </label>
                    <div className="relative">
                        <input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none pr-10"
                        />
                        {/* Button zum Anzeigen/Verbergen des Passworts */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeOffIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Anzeige der Passwortstärke */}
                    {newPassword && (
                        <div className="mt-2">
                            <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${
                                        newPassword.length < 6
                                            ? "bg-red-500"
                                            : newPassword.length < 10
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                    }`}
                                    style={{
                                        width: `${Math.min(100, newPassword.length * 10)}%`,
                                    }}
                                ></div>
                            </div>
                            <p className="text-xs mt-1 text-gray-400">
                                {newPassword.length < 6
                                    ? "Schwaches Passwort"
                                    : newPassword.length < 10
                                    ? "Mittleres Passwort"
                                    : "Starkes Passwort"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Eingabefeld zur Bestätigung des neuen Passworts */}
                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium mb-1"
                    >
                        Passwort bestätigen
                    </label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none pr-10 ${
                                confirmPassword && newPassword !== confirmPassword
                                    ? "border border-red-500"
                                    : ""
                            }`}
                        />
                        {/* Button zum Anzeigen/Verbergen des Passworts */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeOffIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {/* Fehlermeldung, wenn die Passwörter nicht übereinstimmen */}
                    {confirmPassword && newPassword !== confirmPassword && (
                        <span className="text-xs text-red-500 block mt-1">
                            Die Passwörter stimmen nicht überein
                        </span>
                    )}
                </div>

                {/* Anzeige von Passwortfehlern */}
                {passwordError && (
                    <div className="bg-red-500/20 text-red-200 p-3 rounded-md text-sm">
                        {passwordError}
                    </div>
                )}

                {/* Button zum Ändern des Passworts */}
                <div className="flex justify-end">
                    <Button
                        onClick={handlePasswordChange}
                        className="bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
                        disabled={
                            !currentPassword ||
                            !newPassword ||
                            newPassword !== confirmPassword
                        }
                    >
                        <KeyIcon className="w-4 h-4 mr-2" />
                        Passwort ändern
                    </Button>
                </div>
            </div>

            {/* Bereich zum Zurücksetzen des Passworts */}
            <div className="mt-6 p-4 border border-gray-700 rounded-lg bg-gray-800/30">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium">Passwort vergessen?</h4>
                        <p className="text-sm text-gray-200 mt-1">
                            Ein Link zum Zurücksetzen des Passworts kann an Ihre E-Mail-Adresse gesendet werden
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handlePasswordReset}
                        className="border-pink-500 text-pink-500 hover:bg-pink-500/10 cursor-pointer"
                    >
                        <RefreshCwIcon className="w-4 h-4 mr-2" />
                        Zurücksetzen
                    </Button>
                </div>
            </div>
        </div>
    );
}