import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import ImageUpload from "@/components/ProfilImageUpload";
import PasswordSection from "@/components/PasswordSection";
import useProfileData from "@/app/profil/hooks/useProfileData";

export default function ProfileContent({ user }) {
    const {
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
        handleSave,
    } = useProfileData(user);

    // Bestimme das anzuzeigende Bild
    const displayImage = uploadedImage || image;

    return (
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-xl p-8 space-y-6">
            {/* Profilübersicht */}
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-28 h-28 rounded-full border-4 border-pink-500 shadow-md overflow-hidden relative">
                    {displayImage && !imageError ? (
                        <Image
                            src={displayImage}
                            alt={name || "Profilbild"}
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <Image
                            src="/default-avatar.png"
                            alt="Standard-Profilbild"
                            fill
                            className="object-cover"
                        />
                    )}
                </div>

                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">
                        {name || "Kein Name angegeben"}
                    </h2>
                    <p className="text-gray-100 mb-2">
                        {user.emailAddresses[0].emailAddress}
                    </p>
                </div>
            </div>

            {/* Bearbeitungsmodus */}
            {editing && (
                <div className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                    </div>

                    {/* Bild-Upload-Komponente */}
                    <ImageUpload
                        image={image}
                        setImage={setImage}
                        uploadedImage={uploadedImage}
                        setUploadedImage={setUploadedImage}
                        imageError={imageError}
                        setImageError={setImageError}
                    />

                    {/* Passwortänderungsbereich */}
                    <PasswordSection />
                </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 justify-center pt-4">
                {editing ? (
                    <>
                        <Button
                            onClick={handleSave}
                            className="bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
                        >
                            Speichern
                        </Button>
                        <Button
                            onClick={() => setEditing(false)}
                            variant="outline"
                            className="cursor-pointer"
                        >
                            Abbrechen
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            onClick={() => setEditing(true)}
                            className="bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
                        >
                            ✏️ Bearbeiten
                        </Button>
                        <SignOutButton redirectUrl="/">
                            <Button variant="outline" className="cursor-pointer">
                                🔒 Abmelden
                            </Button>
                        </SignOutButton>
                    </>
                )}
            </div>
        </div>
    );
}