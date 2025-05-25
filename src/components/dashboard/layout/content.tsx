import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
interface ContentLayoutProps {
    title: string;
    children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
    return (
        <>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={title} />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </>
    );
}
