import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


const Page = async () => {

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id); 
    if(!userInfo?.onboarding) redirect('/onboarding'); //to check if onboarding is done or not

    // get notifications/activities on your posts
    const activity = await getActivity(userInfo._id);

    return(
        <section>
            <h1 className="head-text mb-10">Activity</h1>

            <section className="mt-10 flex flex-col gap-5">
                {activity.length > 0 ? (
                    <>
                        {activity.map((activity) => (
                            <Link key={activity.id} href={`/thread/${activity.parentId}`}>
                                <article className="activity-card">
                                    <Image 
                                    src={activity.author.image}
                                    alt="profile image"
                                    width={20}
                                    height={20}
                                    className="rounded-full object-cover"
                                    />
                                    <p className="!text-small-regular text-light-1">
                                        <span className="mr-1 text-primary-500">
                                            {activity.author.name}
                                        </span>{" "}
                                        replied to your thread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ):(
                    <p className="!text-base-regular text-light-3">No Activity yet</p>
                )}
            </section>
        </section>
    )
}

export default Page;