import Hero from "@/components/Hero"
import Shirts from "@/components/Shirts"
import Featured from "@/components/Featured"

interface PageProps {
  searchParams: { [key: string]: string | undefined }
}

const page = async ({searchParams}: PageProps) => {
  return (
     <div>   
        <Hero />
        <Featured />
        <Shirts searchParams = {searchParams}/>    
    </div>
    
  )
}

export default page