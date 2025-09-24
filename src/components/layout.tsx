import NewUser from "./auth/new-user";
import FloatButton from "./float-button";
import Footer from "./footer/footer";
import Header from "./header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <>
        <div className="content">{children}</div>
      </>

      <FloatButton />
      <NewUser />
      <Footer />
    </>
  );
}
