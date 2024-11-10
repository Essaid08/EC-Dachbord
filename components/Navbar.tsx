import { UserButton, auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import {MainNav} from "@/components/main-nav"
import StoreSwitcher from "@/components/store-switcher"
import prismadb from "@/lib/prismadb"

const Navbar = async() => {
    const {userId , user} = auth()
    
    if(!userId) {
        redirect('/sign-in')
    }

    const stores = await prismadb.store.findMany({
        where : {
            userId,
        }
    })

    return (
        <div className="border-r border-gray-300">
            <div className="flex flex-col border-black h-16 items-center px-3">
                <StoreSwitcher items={stores}/>
                <MainNav className="mx-6"/>
                <div className=" border-gray-300 border-y py-4 w-full flex items-center justify-center space-x-4">
                    <UserButton afterSignOutUrl="/"/>
                    <p className="text-black">
                        {user?.firstName}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Navbar