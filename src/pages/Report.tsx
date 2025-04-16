
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import ReportForm from "@/components/forms/ReportForm";

export default function Report() {
  const [searchParams] = useSearchParams();
  const itemType = searchParams.get("type") as "lost" | "found" || "lost";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Report an Item</h1>
          <p className="text-muted-foreground">
            Fill out the form below to report a lost or found item on campus.
          </p>
        </div>
        
        <ReportForm defaultType={itemType} />
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Campus Lost & Found. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
