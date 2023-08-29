import AccountProfile from "@/components/forms/AccountProfile";

async function Page(){
    return(
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">Complete your Profile now to use Threads</p>

            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile/>
            </section>
        </main>
    )
}

export default Page;