"use client";
import Image, { StaticImageData } from "next/image";

const FoodPost = ({
  pfp,
  name,
  content,
  foodImage,
  score,
  restaurantName,
  role,
}: {
  pfp: StaticImageData;
  name: string;
  content: string;
  foodImage: StaticImageData;
  score: number;
  restaurantName: string;
  role: string;
}) => {
  return (
    <div className="flex border rounded-lg shadow-lg p-4 mb-5 bg-gray-100">
      <div className="flex flex-col items-center pr-4">
        <Image
          src={pfp}
          alt={name}
          width={80}
          height={80}
          className="rounded-full"
        />
        <div className="text-center mt-2">
          <p className="font-bold text-orange-600 text-xl">{name}</p>
          <p className="text-orange-500">{role}</p>
        </div>

        <div className="flex flex-col items-center justify-center mt-4">
          <span className="text-xl font-bold">{score}</span>
          <div className="relative w-2 h-24 bg-gray-300 mt-1">
            <div
              className="absolute bottom-0 w-full bg-orange-500"
              style={{ height: `${score}%` }}
            ></div>
          </div>
          <p className="text-orange-500 font-bold mt-2">Score</p>
        </div>
      </div>

      <div className="flex-grow">
        <p className="font-bold text-2xl text-gray-800 mb-2">{restaurantName}</p>

        <Image
          src={foodImage}
          alt={restaurantName}
          width={400}
          height={300}
          className="rounded-lg"
        />
        <div className="mt-3 justify-center text-gray-700 text-center">{content}</div>
      </div>
    </div>
  );
};

export default FoodPost;


// "use client";
// import Image, { StaticImageData } from "next/image";

// const FoodPost = ({ pfp, name, content } : {pfp: StaticImageData, name: string, content: string}) => {
//     return (
//         <div className="flex">
//             <Image
//                 src={pfp}
//                 alt={name}
//                 width={50}
//                 height={50}
//                 className="mr-4"
//             />
//             <div>
//                 <p>{name}</p>
//                 <p className="text-gray-500">{content}</p>
//             </div>
//         </div>
//     );
// };

// export default FoodPost;