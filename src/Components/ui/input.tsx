export default function Input(
  {
    label, type, value, setValue
  }: {
    label: string,
    type: string
    value: string | number,
    setValue: React.Dispatch<React.SetStateAction<string>>
  }) {
  return (
    <div>
      <input
        id={label}
        className="w-full rounded-xl bg-white px-4 py-2"
        type={type}
        value={value}
        onChange={(e) => type === 'number' ? Number(e.target.value) > 0 ? setValue(e.target.value) : '' : setValue(e.target.value)}
        required
      />
    </div>
  )
}