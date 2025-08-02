import Label from "./label"

export default function TextArea(
  {
    label, value, setValue
  }: {
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  }) {
  return (
    <div>
      <Label name={label} />
      <textarea
          className="w-full rounded-xl bg-white px-4 py-2 h-40"
          placeholder="Description"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
    </div>
  )
}