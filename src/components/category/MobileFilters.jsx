"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FilterCheckboxGroup from "./FilterCheckboxGroup";
import { filterGroups } from "./filterGroups";

export default function MobileFilters({ filters, onToggle }) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  return (
    <div className="mb-6 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-[#003349] py-3 text-sm font-bold text-white"
      >
        FILTER
      </button>

      {open && (
        <div className="mt-1 bg-[#f8f9fa]">
          {filterGroups.map((group) => {
            const isGroupOpen = openGroup === group.filterType;
            return (
              <div key={group.filterType} className="border-b border-black/10">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroup(isGroupOpen ? null : group.filterType)
                  }
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
                >
                  {group.title}
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${isGroupOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isGroupOpen && (
                  <div className="px-4 pb-4">
                    <FilterCheckboxGroup
                      filterType={group.filterType}
                      options={group.options}
                      selectedValues={filters[group.filterType]}
                      onToggle={onToggle}
                      hideTitle
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}