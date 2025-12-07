import Shipping from '@/components/Shipping'


const page = () => {
  return (
    <div className=" flex justify-center pt-20 lg:pt-30 min-h-screen">
         <div className="w-full md:w-[60vw] xl:w-[35vw] bg-light-dark rounded-lg p-8 text-center space-y-6">
            <Shipping/>
         </div>
    </div>
  )
}

export default page