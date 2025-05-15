import { useState } from "react";

export default function usePasswordManagement() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = () => {
    // Passwort-Validierungsprüfungen
    if (newPassword.length < 8) {
      setPasswordError("Das Passwort muss mindestens 8 Zeichen lang sein");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Die Passwörter stimmen nicht überein");
      return;
    }

    // In einer echten Anwendung wird dies mit einer API integriert
    alert("Passwort wurde aktualisiert (Demo)");
    resetForm();
  };

  const handlePasswordReset = (email) => {
    // In einer echten Anwendung wird dies mit einer API integriert
    alert(`Ein Link zum Zurücksetzen des Passworts wurde an ${email} gesendet (Demo)`);
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    passwordError,
    setPasswordError,
    handlePasswordChange,
    handlePasswordReset,
    resetForm
  };
}