import Image from "next/image";
import { SignOutButton } from "@clerk/nextjs";
import ImageUpload from "@/components/ProfilImageUpload";
import PasswordSection from "@/components/PasswordSection";
import useProfileData from "@/app/profil/hooks/useProfileData";
import { Edit3, LogOut, Save, X, Mail, User as UserIcon } from "lucide-react";

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

  const displayImage = uploadedImage || image;

  return (
    <div className="bg-white/95 dark:bg-[#0d0f26]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-10 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-pink-500/80 shadow-lg overflow-hidden relative shrink-0">
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

        <div className="space-y-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {name || "Kein Name angegeben"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-4 h-4 text-pink-500 shrink-0" />
            <span>{user.emailAddresses[0]?.emailAddress}</span>
          </p>
        </div>
      </div>

      {/* Edit Mode Form */}
      {editing ? (
        <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              Dein Anzeigename
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Profilbild ändern
            </label>
            <ImageUpload
              image={image}
              setImage={setImage}
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
              imageError={imageError}
              setImageError={setImageError}
            />
          </div>

          <PasswordSection />

          {/* Edit Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Änderungen speichern</span>
            </button>

            <button
              onClick={() => setEditing(false)}
              className="py-3 px-6 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
              <span>Abbrechen</span>
            </button>
          </div>
        </div>
      ) : (
        /* Normal Mode Actions */
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setEditing(true)}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Profil bearbeiten</span>
          </button>

          <SignOutButton redirectUrl="/">
            <button className="py-3 px-6 rounded-2xl border border-red-300 dark:border-red-800/60 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all">
              <LogOut className="w-4 h-4" />
              <span>Abmelden</span>
            </button>
          </SignOutButton>
        </div>
      )}
    </div>
  );
}