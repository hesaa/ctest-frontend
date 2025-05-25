import { ContentLayout } from "@/components/dashboard/layout/content"
import { SectionCards } from "@/components/dashboard/section-cards"
export default function Dashboard() {
    return (
        <ContentLayout title="Dashboard">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                <p>setlah action, add, delete, update somehow datanya gak kereload.</p>
            </div>

        </ContentLayout>
    );
}
