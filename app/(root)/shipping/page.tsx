import Shipping from '@/components/Shipping'


const page = () => {
  return (
    <div className=" flex justify-center pt-20 lg:pt-30">
         <div className="w-full md:w-[60vw] xl:w-[35vw] bg-light-light rounded-lg p-8 shadow-shadow-m text-center space-y-6">
            <Shipping/>
         </div>
    </div>
  )
}

export default page