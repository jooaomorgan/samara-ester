import { Outlet } from "react-router-dom";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { Footer } from "./Footer";
import { Header } from "./Header";

export default function StoreLayout() {
  useSmoothScroll();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="conteudo" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
