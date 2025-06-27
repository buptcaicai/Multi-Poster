import Header from "./header";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <div>
         <Header />
         <main className="w-full max-w-7xl">{children}</main>
      </div>
   );
}
