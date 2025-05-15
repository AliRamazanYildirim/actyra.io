// Diese Komponente rendert Tabs für ein Profil.
// Die Tabs enthalten verschiedene Abschnitte wie "Profil", "Biletlerim", "Katıldığım Etkinlikler" und "Gelecek Etkinlikler".
// Die aktive Registerkarte wird durch die `activeTab`-Prop gesteuert, und die `setActiveTab`-Funktion wird verwendet, um die aktive Registerkarte zu ändern.

export default function ProfileTabs({ activeTab, setActiveTab }) {
    // Definiert die Tabs mit ihren IDs und Beschriftungen.
    const tabs = [
        { id: "profil", label: "Profil" },
        { id: "tickets", label: "Meine Tickets" },
        { id: "history", label: "Teilgenommene Veranstaltungen" },
        { id: "upcoming", label: "Kommende Veranstaltungen" }
    ];
    
    return (
        // Rendert die Tabs in einer horizontalen Leiste mit einer unteren Umrandung.
        <div className="flex justify-center border-b border-gray-100 pb-2">
            {tabs.map(tab => (
                // Rendert jeden Tab als Button.
                <button
                    key={tab.id} // Einzigartiger Schlüssel für jedes Tab.
                    onClick={() => setActiveTab(tab.id)} // Ändert die aktive Registerkarte bei Klick.
                    className={`px-4 py-2 mx-2 font-medium rounded-t-lg transition cursor-pointer ${
                        activeTab === tab.id
                            ? "bg-pink-600 text-white" // Stil für die aktive Registerkarte.
                            : "text-gray-900 hover:bg-[#0f172a] hover:text-white dark:text-gray-100 dark:hover:bg-white dark:hover:text-gray-900" // Stil für inaktive Registerkarten.
                    }`}
                >
                    {tab.label} {/* Beschriftung des Tabs */}
                </button>
            ))}
        </div>
    );
}