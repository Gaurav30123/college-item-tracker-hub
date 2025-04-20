
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import ReportForm from "@/components/forms/ReportForm";
import Footer from "@/components/layout/Footer";
import { LostItem, FoundItem } from "@/types";
import { addItem } from "@/services/itemService";

export default function Report() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemType = searchParams.get("type") as "lost" | "found" || "lost";

  const handleFormSubmit = (data: Omit<LostItem | FoundItem, "id" | "status" | "createdAt">) => {
    const newItem = addItem(data, itemType);
    navigate(`/${itemType}-items/${newItem.id}`);
  };

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
        
        <ReportForm defaultType={itemType} onSubmit={handleFormSubmit} />
      </main>
      
      <Footer />
    </div>
  );
}
