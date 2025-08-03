export default function Input(
  {
    label, type, value, setValue, classname, readOnly, placeholder
  }: {
    label: string,
    type: string
    value: string | number,
    classname?: string 
    setValue: React.Dispatch<React.SetStateAction<string>>
    readOnly?: boolean,
    placeholder?: string,
  }) {
  return (
    <div className={`rounded-xl ${classname}`}>
      <input
        id={label}
        className="w-full rounded-xl bg-white px-4 py-2"
        readOnly={readOnly}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
    </div>
  )
}