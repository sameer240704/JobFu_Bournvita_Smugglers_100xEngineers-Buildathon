import Sidebar from "@/components/ui/Sidebar";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
