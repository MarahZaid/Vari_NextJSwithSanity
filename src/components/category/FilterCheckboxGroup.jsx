export default function FilterCheckboxGroup({
  title,
  filterType,
  options,
  selectedValues,
  onToggle,
  hideTitle = false,
}) {
  return (
    <div className={hideTitle ? "" : "mb-8"}>
      {!hideTitle && (
        <h3 className="mb-3 font-semibold text-[#007fad]">{title}</h3>
      )}

      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 text-sm text-[#333]"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => onToggle(filterType, option.value)}
              className="h-4 w-4 accent-[#003349]"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}