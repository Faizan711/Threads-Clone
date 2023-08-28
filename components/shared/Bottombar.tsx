'use client'

import { usePathname, useRouter } from 'next/navigation'
import {sidebarLinks} from '@/constants'
import Link from 'next/link';
import Image from 'next/image';

function Bottombar(){

    const router = useRouter();
    const pathname = usePathname();

    return(
        <section className="bottombar">
            <div className="bottombar_container">
            {sidebarLinks.map((link) => {

                const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;                   

                return (
                    <div>
                        <Link 
                        href={link.route}
                        key={link.label}
                        className={`bottombar_link ${isActive && 'bg-primary-500'}`}
                        >
                            <Image
                            src={link.imgURL}
                            alt={link.label}
                            width={24}
                            height={24}
                            />
                            {/* splitting word using regex for tablet view */}
                            <p className='text-subtle-medium text-light-1 max-sm:hidden'>{link.label.split(/\s+/)[0]}</p>
                        </Link>
                    </div>
                )}
                )}
            </div>
        </section>
    )
}

export default Bottombar;