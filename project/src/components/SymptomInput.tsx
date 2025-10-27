interface SymptomInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SymptomInput({ value, onChange }: SymptomInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Describe Your Symptoms
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Itchy red patches on my arms, dry and flaky skin..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={4}
      />
      <p className="mt-2 text-xs text-gray-500">
        Describe any symptoms like itching, redness, swelling, pain, etc.
      </p>
    </div>
  );
}
