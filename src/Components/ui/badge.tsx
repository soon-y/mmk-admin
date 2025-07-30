export default function Badge(status: string) {
  return (
    <div>
      <div className={`
      ${status === 'approved' || status === 'delivered' ? 'bg-green-100 border-green-600 text-green-600' : ''} 
      ${status === 'declined' ? 'bg-red-100 border-red-500 text-red-500' : ''} 
      ${status === 'ordered' ? 'bg-gray-100 border-black text-black' : ''} 
      ${status === 'processing completed' ? 'bg-yellow-100 border-yellow-600 text-yellow-600' : ''} 
      ${status === 'shipped' ? 'bg-orange-100 border-orange-600 text-orange-600' : ''} 
      flex justify-center border-2 py-1 px-2 rounded-full w-fit`}>
        <p className="capitalize">{status}</p>
      </div>
    </div>
  )
}
