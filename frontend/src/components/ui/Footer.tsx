import { useProfile } from "../../hooks/useProfile";

export default function Footer() {
    const profile = useProfile();
    return (
        <footer className="text-center py-4 text-slate-500 text-sm border-t border-slate-800">
            {profile?.name} © {new Date().getFullYear()}
        </footer>
    );
}
