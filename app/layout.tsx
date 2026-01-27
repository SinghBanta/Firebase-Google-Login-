import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import LoadingProvider from "./loadingProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body  className="flex flex-col min-h-screen">
        <AuthProvider>
          <LoadingProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer/>
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
