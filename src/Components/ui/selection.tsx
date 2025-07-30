export default function Selection(
  {
    value, option, setValue, data
  }: {
    value: string,
    option?: string
    data: string[],
    setValue: React.Dispatch<React.SetStateAction<string>>
  }) {

  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="cursor-pointer bg-transparent focus:outline-none"
    >
      {option && <option value="">{option}</option>}
      {data.map((el, i) => (
        <option value={el} key={i}>
          {el}
        </option>
      ))}
    </select>
  )
}