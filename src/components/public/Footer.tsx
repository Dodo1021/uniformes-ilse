import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-[var(--color-cream)]">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <h4 className="font-semibold mb-2 text-[var(--color-navy)]">
            Uniformes Ilse
          </h4>
          <p className="text-slate-600">
            Uniformes quirúrgicos y zapatos de hospital para profesionales de la
            salud en México.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Navegación</h4>
          <ul className="space-y-1 text-slate-600">
            <li>
              <Link href="/catalogo">Catálogo</Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=uniformes">Uniformes</Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=zapatos">Zapatos</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contacto</h4>
          <p className="text-slate-600">
            WhatsApp:{" "}
            <a href="https://wa.me/522721670992" className="underline">
              +52 272 167 0992
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Powered by{" "}
        <a
          href="https://ytuweb.mx"
          className="font-medium text-[var(--color-navy)] hover:text-[var(--color-turquoise-dark)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          ¿Y Tu Web?
        </a>{" "}
        · ytuweb.mx
      </div>
    </footer>
  );
}
