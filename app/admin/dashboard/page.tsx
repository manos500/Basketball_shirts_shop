import  {DeleteUserButton, PlaceHolderDeleteUserButton } from '@/components/DeleteUserButton';
import UserRoleSelect from "@/components/UserRoleSelect";
import AddUserRow from '@/components/AddUserRow';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserRole } from './../../../lib/generated/prisma/index.d';

export default async function DashBoardPage() {
    const headersList = await headers();

    const session = await auth.api.getSession({
        headers: headersList,
    })

    if (!session ) redirect('/auth/sign-in');

    if (session.user.role !== 'ADMIN') {
      return (
        <div className='mx-auto container pt-20 lg:pt-30 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen'>
            <div className='space-y-8'>
                <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
                <p className='p-2 rounded-md text-lg bg-red-600  text-white font-bold'>FORBIDDEN</p>
            </div>
        
        </div>
        )
    }

    const { users } = await auth.api.listUsers({
        headers: headersList,
        query: {
            sortBy: "name",
        },
    });

    const sortedUsers = users.sort((a, b) => {
        if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
        if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
        return 0
    });
    
     return (
        <div className='mx-auto container pt-20 lg:pt-30 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen'>
            <div className='space-y-8'>
                <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
                <p className='p-2 rounded-md text-lg bg-green-600 text-white font-bold'>ACCESS GRANTED</p>
            </div>
        <div className='w-full overflow-x-auto'>
            <table className="table-auto min-w-full whitespace-nowrap">
                <thead>
                    <tr className=' text-sm text-left'>
                        <th className='px-2 py-2'>ID</th>
                        <th className='px-2 py-2'>Name</th>
                        <th className='px-2 py-2'>Email</th>
                        <th className='px-2 py-2 text-center'>Role</th>
                        <th className='px-2 py-2 text-center'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.map((user) => (
                        <tr key={user.id} className=' text-sm text-left'>
                            <td className='px-4 py-2'>{user.id.slice(0,8)}</td>
                            <td className='px-4 py-2'>{user.name}</td>
                            <td className='px-4 py-2 text-center'>{user.email}</td>
                            <td className='px-4 py-2 text-center'>
                                <UserRoleSelect userId={user.id} role={user.role as UserRole}/>
                            </td>
                            <td className='px-4 py-2 text-center'>
                                {user.role === 'ADMIN' || user.id === session.user.id ? <PlaceHolderDeleteUserButton/> : <DeleteUserButton userId={user.id}/> }
                            </td>
                        </tr>
                    ))}
                    
                </tbody>
                
            </table>
            <AddUserRow/>
        </div>
        </div>
        )
 
}
