import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { client } from "../sanity/lib/client";
import { NAV_CATEGORIES_QUERY } from "../sanity/lib/queries";
import "./globals.css";

export const metadata = {
  title: "Vari | Height-Adjustable Standing Desks & Office Furniture",
  description:
    "Vari Site is an online store offering a wide range of quality products at great prices, with a fast and secure shopping experience.",
};

export default async function RootLayout({ children }) {
  const categories = await client
  .fetch(NAV_CATEGORIES_QUERY, {}, { next: { revalidate: 30 } })
  .catch(() => []);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Navbar categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
