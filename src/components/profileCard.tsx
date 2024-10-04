import React from 'react';
import Image, { StaticImageData } from 'next/image';

type ProfileCardProps = {
  profilePicture: StaticImageData;
  username: string;
  title: string;
  foodPosts: number;
};

const ProfileCard = ({ profilePicture, username, title, foodPosts }: ProfileCardProps) => {
  return (
    
    <div className="flex flex-col bg-green-100 shadow-lg rounded-lg p-10 justify-center overflow-hidden">
      <div className="flex justify-center">
          <Image
            className="w-40 h-40 rounded-full border-4 border-white"
            src={profilePicture}
            alt="Profile Picture"
            width={160}
            height={160}
          />
        </div>
        <div className="text-center mt-4">
          <h2 className="text-4xl font-semibold text-gray-800">{username}</h2>
          <p className="text-gray-600">{title}</p>
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">Food Posts</p>
          <p className="text-3xl font-bold text-gray-800">{foodPosts}</p>
        </div>
      {/* <div className="min-w-44 mx-auto bg-green-100 shadow-lg rounded-lg overflow-hidden p-10 justify-center items-center">
        
      </div> */}
    </div>
  );
};

export default ProfileCard;
