import AddJersey from "@/components/AddJersey"

const page = () => {
  return (
    <div className="flex justify-center min-h-screen bg-light">
         <div className="w-full md:w-[60vw] xl:w-[35vw] bg-light-light rounded-lg p-8 text-center space-y-6">
            <AddJersey/>
         </div>
    </div>
  )
}

export default page