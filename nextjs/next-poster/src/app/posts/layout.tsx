import Header from "./header";

export default function PostLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <>
         <Header />
         <main>{children}</main>
      </>
   );
}
