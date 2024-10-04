import ProfileCard from "@/components/profileCard";
import riolu1 from "/public/riolu1.webp";

export default function Profile() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <ProfileCard
                profilePicture={riolu1}
                username={"Riolu"}
                title={"Foodie"}
                foodPosts={10}
            />
        </div>
    );
}