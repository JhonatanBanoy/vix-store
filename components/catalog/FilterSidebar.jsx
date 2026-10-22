import Filters from "./Filters";

export default function FilterSidebar() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-card border border-line bg-paper p-5">
        <h2 className="font-display text-base font-bold">Filtros</h2>
        <div className="mt-5">
          <Filters />
        </div>
      </div>
    </aside>
  );
}
