type odoMeterType = {
  odoReading: number
}

const OdoMeter = ({ odoReading }: odoMeterType) => {
  const odo = odoReading.toString().padStart(7, '0').split('')

  return (
    <div className='bg-[#1c1c1c] rounded-md border border-gray-700 shadow-lg flex px-2 py-2 justify-between'>
      <div className='flex space-x-1'>
        {odo.map((digit, index) => {
          return (
            <div key={index} className="flex space-x-1">
              {index === 1 || index === 3 ? (
                <>
                  <div
                    className='bg-[#2a2a2a] text-white text-sm w-5 h-8 flex items-center justify-center font-mono border border-gray-600 rounded-sm'
                  >
                    {digit}
                  </div>
                  <div
                    className='text-orange-500 text-3xl flex items-center'
                  >
                    ,
                  </div>
                </>
              ) : (
                <div
                  className='bg-[#2a2a2a] text-white text-sm w-5 h-8 flex items-center justify-center font-mono border border-gray-600 rounded-sm'
                >
                  {digit}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className='flex flex-col justify-end items-end'>
        <span className='text-orange-500 uppercase text-xs tracking-widest'>
          kms
        </span>
        <span className='text-[#fff] text-xs tracking-widest'>MILES</span>
      </div>
    </div>
  )
}

export default OdoMeter
