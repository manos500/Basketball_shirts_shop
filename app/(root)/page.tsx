import Hero from "@/components/Hero"
import { getEuroleagueTeams, getNBATeams } from "@/lib/actions/teams"
import Featured from "@/components/Featured"

interface PageProps {
  searchParams: { [key: string]: string | undefined }
}

const page = async ({searchParams}: PageProps) => {
  const nbaTeams = await getNBATeams();
  const euroleagueTeams = await getEuroleagueTeams();
  return (
     <div className="bg-light-light">   
        <Hero />
        <div className="flex justify-center pt-10">
          <h1 className="text-heading-2">NBA Teams</h1>
        </div>
        <Featured items={nbaTeams} type="team"/>  
        <div className="flex justify-center mx-auto sm:ml-0 pt-10">
          <h1 className="text-heading-2 mx-auto">Euroleague Teams</h1>
        </div>
        <Featured items={euroleagueTeams} type="team"/>  

    </div>
    
  )
}

export default page