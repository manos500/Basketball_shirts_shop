import { prisma } from "@/lib/prisma";

export async function getNBATeams() {
    const nbaLeague  = await prisma.league.findUnique({
        where: {slug: "nba"},
        select: { id: true },
    });

    if (!nbaLeague ) {
        return [];
    }


    const nbaTeams = await prisma.team.findMany({
        where: { leagueId: nbaLeague.id },
        orderBy: { name: 'asc' },
        include: {
            league: true,
        }
    })

     return nbaTeams.map((team) => ({
        id: team.id,
        name: team.name,
        slug: team.slug,
        logoUrl: team.logoUrl,
        league: team.league
        ? { id: team.league.id, name: team.league.name, slug: team.league.slug }
        : null,
    }));
}

export async function getEuroleagueTeams() {
    const euroleague  = await prisma.league.findUnique({
        where: {slug: "euroleague"},
        select: { id: true },
    });

    if (!euroleague ) {
        return [];
    }


    const euroleagueTeams = await prisma.team.findMany({
        where: { leagueId: euroleague.id },
        orderBy: { name: 'asc' },
        include: {
            league: true,
        }
    })

     return euroleagueTeams.map((team) => ({
        id: team.id,
        name: team.name,
        slug: team.slug,
        logoUrl: team.logoUrl,
        league: team.league
        ? { id: team.league.id, name: team.league.name, slug: team.league.slug }
        : null,
    }));
}