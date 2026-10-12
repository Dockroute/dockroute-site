import { cn } from "@/lib/cn";

const inputBase =
  "w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground outline-none transition-colors focus:border-fd-primary focus:ring-2 focus:ring-fd-ring/30";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  help,
  error,
  monospace = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  help?: string;
  error?: string;
  monospace?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-fd-foreground">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          inputBase,
          monospace && "font-mono",
          error && "border-red-500",
        )}
      />
      {error ? (
        <span className="block text-xs text-red-500">{error}</span>
      ) : help ? (
        <span className="block text-xs text-fd-muted-foreground">{help}</span>
      ) : null}
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  help,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  help?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-fd-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(inputBase, "appearance-none")}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {help ? (
        <span className="block text-xs text-fd-muted-foreground">{help}</span>
      ) : null}
    </label>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  help,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  help?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-4 rounded border-fd-border accent-fd-primary"
      />
      <span className="space-y-0.5">
        <span className="block text-sm font-medium text-fd-foreground">
          {label}
        </span>
        {help ? (
          <span className="block text-xs text-fd-muted-foreground">{help}</span>
        ) : null}
      </span>
    </label>
  );
}
