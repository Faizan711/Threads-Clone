import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const Page = async () => {

        
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id); 
    if(!userInfo?.onboarding) redirect('/onboarding'); //to check if onboarding is done or not

    return(
        <section>
            <h1 className="head-text mb-10">Search</h1>
        </section>
    )
}

export default Page;