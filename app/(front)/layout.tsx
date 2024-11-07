
export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-grow mx-auto container px-4">{children}</main>
  );
}
