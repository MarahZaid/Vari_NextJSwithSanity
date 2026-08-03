import FilterCheckboxGroup from "./FilterCheckboxGroup";
import { filterGroups } from "./filterGroups";

export default function FiltersSidebar({ filters, onToggle }) {
  return (
    <div className="hidden w-72 pr-6 lg:block">
      <hr className="mb-6 border-black/10" />

      {filterGroups.map((group) => (
        <div key={group.filterType}>
          <FilterCheckboxGroup
            title={group.title}
            filterType={group.filterType}
            options={group.options}
            selectedValues={filters[group.filterType]}
            onToggle={onToggle}
          />
          <hr className="mb-6 border-black/10" />
        </div>
      ))}
    </div>
  );
}