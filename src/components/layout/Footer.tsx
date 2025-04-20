
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Campus Lost & Found. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="#" className="underline underline-offset-4 hover:text-foreground">Terms</Link>
          <Link to="#" className="underline underline-offset-4 hover:text-foreground">Privacy</Link>
          <Link to="#" className="underline underline-offset-4 hover:text-foreground">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
