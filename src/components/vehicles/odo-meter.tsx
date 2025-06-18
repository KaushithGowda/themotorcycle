type OdoMeterProps = {
  odoReading: string
}

const OdoMeter: React.FC<OdoMeterProps> = ({ odoReading }) => {
  const digits = odoReading.padStart(7, '0').split('')

  return (
    <div className='bg-gray-100 dark:bg-[#1c1c1c] rounded-md border border-gray-300 dark:border-gray-700 shadow-lg flex px-2 py-2 justify-between'>
      <div className='flex space-x-1'>
        {digits.map((digit, index) => (
          <div key={index} className='flex items-center space-x-1'>
            <div className='bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-sm w-5 h-8 flex items-center justify-center font-mono border border-gray-400 dark:border-gray-700 rounded-sm'>
              {digit}
            </div>
            {(index === 1 || index === 3) && (
              <div className='text-gray-500 dark:text-gray-400 text-2xl leading-none'>
                ,
              </div>
            )}
          </div>
        ))}
      </div>
      <div className='flex flex-col justify-end items-end ml-2'>
        <span className='font-extrabold uppercase text-xs tracking-widest text-gray-700 dark:text-gray-200'>
          kms
        </span>
        <span className='font-extrabold text-xs tracking-widest text-gray-400 dark:text-gray-700'>
          MILES
        </span>
      </div>
    </div>
  )
}

export default OdoMeter
