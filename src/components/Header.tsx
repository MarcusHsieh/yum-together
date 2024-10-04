import Link from "next/link";

const Title = ( {title} : {title: string} ) => {
    return (
        <div className="container flex flex-col items-center">
            <Link
                className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
                href="/"
            >
                <div className="text-4xl text-bold text-blue-800"> {title} </div>
            </Link>
        </div>
    );
};

const Header = () => {
    return (
        <header>
            <Title title="YumTogether" />
        </header>
    );
};

export default Header;