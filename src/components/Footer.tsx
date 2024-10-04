import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import camera from "/public/icons/camera.svg"
import profile from "/public/icons/profile.svg"
import home from "/public/icons/home.svg"

type Button1Props = {
    Label: StaticImageData;
    altText: string;
    href: string;
}

const Button1 = ( {Label, altText, href} : Button1Props) => {
    return (
        <Link href={href}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                <Image src={Label} alt={altText} width={30} height={30} />
            </button>
        </Link>
    );
};

const Footer = () => {
    return (
        <div className="fixed bottom-0 w-full flex flex-row justify-center py-4 bg-slate-400 gap-4">
            {/* front page */}
            <Button1 Label={home} altText={"Home"} href="/" />
            {/* camera page (new food entry/post) */}
            <Button1 Label={camera} altText={"New entry"} href="/new-entry" />
            {/* profile page */}
            <Button1 Label={profile} altText={"Profile"} href="/1/profile" />
        </div>
    );
};

export default Footer;