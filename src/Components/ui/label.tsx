export default function Label({ name }: { name: string }) {
  return (
    <label className="inline-block text-md font-bold text-gray-700 mb-1" htmlFor={name}>{name}</label>
  )
}