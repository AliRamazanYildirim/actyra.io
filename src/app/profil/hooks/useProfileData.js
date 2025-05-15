import { useState, useEffect } from "react";
import eventSeedData from "@/data/eventSeedData.js";

export default function useProfileData(user) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    // Benutzerinformationen laden
    useEffect(() => {
        if (user) {
            setName(user.fullName || "");
            setImage(user.imageUrl || "");
            setImageError(false);
            setUploadedImage(null);

            // Beispiel-Eventdaten laden
            if (eventSeedData && eventSeedData.length > 0) {
                // Teilgenommene Events
                setAttendedEvents([
                    {
                        ...eventSeedData[0],
                        id: eventSeedData[0].slug,
                        date: new Date(eventSeedData[0].date).toLocaleDateString("de-DE"),
                    },
                    {
                        ...eventSeedData[1],
                        id: eventSeedData[1].slug,
                        date: new Date(eventSeedData[1].date).toLocaleDateString("de-DE"),
                    },
                ]);

                // Zukünftige Events
                setUpcomingEvents([
                    {
                        ...eventSeedData[2],
                        id: eventSeedData[2].slug,
                        date: new Date(eventSeedData[2].date).toLocaleDateString("de-DE"),
                    },
                    {
                        ...eventSeedData[3],
                        id: eventSeedData[3].slug,
                        date: new Date(eventSeedData[3].date).toLocaleDateString("de-DE"),
                    },
                ]);
            }
        }
    }, [user]);

    // Profil speichern
    const handleSave = () => {
        const finalImage = uploadedImage || image;

        if (!uploadedImage && image && !image.startsWith("http")) {
            alert("Bitte geben Sie eine gültige Bild-URL ein");
            return;
        }

        alert(`Name: ${name}\nBild aktualisiert\nProfil aktualisiert (Demo)`);
        setEditing(false);
    };

    return {
        editing,
        setEditing,
        name,
        setName,
        image,
        setImage,
        uploadedImage,
        setUploadedImage,
        imageError,
        setImageError,
        attendedEvents,
        upcomingEvents,
        handleSave,
    };
}