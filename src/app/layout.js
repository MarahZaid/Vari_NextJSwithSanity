import Providers from "./providers";
import "./globals.css";


export const metadata = {
  title: "Vari | Height-Adjustable Standing Desks & Office Furniture",
  description:
    "Vari Site is an online store offering a wide range of quality products at great prices, with a fast and secure shopping experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}