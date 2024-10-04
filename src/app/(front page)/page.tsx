import Image from "next/image";
import FoodPost from "@/components/FoodPost";
import Heading1 from "@/components/Heading1";
import ProfileCard from "@/components/profileCard";
import Header from "@/components/Header";

import pfp1 from "/public/riolu1.webp";
import riolu2 from "/public/riolu2.webp";
import riolu3 from "/public/riolu3.webp";
import riolu4 from "/public/riolu4.webp";
import riolu5 from "/public/riolu5.webp";
import riolu6 from "/public/riolu6.webp";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-between p-16 gap-5 font-roboto">
      <Header/>
      <Heading1 Heading1 = "Recent Food Posts"/>
      
      <FoodPost 
        pfp={pfp1} 
        name={"Riolu"} 
        content={"Vanilla ice cream!"}
        foodImage={riolu4}
        score={80}
        restaurantName="Riolu's Ice Cream"
        role="Foodie"
      />
      <FoodPost 
        pfp={riolu2} 
        name={"Riolu"} 
        content={"Flowers!"}
        foodImage={riolu5}
        score={20}
        restaurantName="Riolu's Flowers?"
        role="Foodie"
      />
      <FoodPost 
        pfp={riolu3} 
        name={"Riolu"} 
        content={"Vanilla ice cream again..."}
        foodImage={riolu4}
        score={70}
        restaurantName="Riolu's Ice Cream"
        role="Foodie"
      />
    </main>
  );
}
