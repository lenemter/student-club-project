import { HeaderBar } from "../../shared/ui";
import { EditProfileForm } from "../../features/edit-profile";

export function SettingsPage() {
    return (
        <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center">
            <div className="w-full max-w-2xl flex flex-col gap-6">
                <div className="w-full flex justify-end">
                    <HeaderBar />
                </div>

                <EditProfileForm />
            </div>
        </main>
    );
}

export default SettingsPage;
