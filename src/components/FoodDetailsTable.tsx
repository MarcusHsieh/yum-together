import React from 'react';

type FoodNutrient = {
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
};

type FoodItem = {
  description: string;
  brandOwner: string;
  ingredients: string;
  servingSizeUnit: string;
  servingSize: number;
  foodNutrients: FoodNutrient[];
};

const FoodDetailsTable = ({ foodItem }: { foodItem: FoodItem }) => {
  return (
    <div className="p-4">
      {/* Food Basic Info Table */}
      <table className="w-full mb-4 text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border-b">Property</th>
            <th className="p-2 border-b">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-b font-semibold">Description</td>
            <td className="p-2 border-b">{foodItem.description}</td>
          </tr>
          <tr>
            <td className="p-2 border-b font-semibold">Brand Owner</td>
            <td className="p-2 border-b">{foodItem.brandOwner}</td>
          </tr>
          <tr>
            <td className="p-2 border-b font-semibold">Ingredients</td>
            <td className="p-2 border-b">{foodItem.ingredients}</td>
          </tr>
          <tr>
            <td className="p-2 border-b font-semibold">Serving Size</td>
            <td className="p-2 border-b">
              {foodItem.servingSize} {foodItem.servingSizeUnit}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Nutrient Details Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border-b">Nutrient Name</th>
            <th className="p-2 border-b">Nutrient Number</th>
            <th className="p-2 border-b">Unit</th>
            <th className="p-2 border-b">Value</th>
          </tr>
        </thead>
        <tbody>
          {foodItem.foodNutrients.map((nutrient, index) => (
            <tr key={index}>
              <td className="p-2 border-b">{nutrient.nutrientName}</td>
              <td className="p-2 border-b">{nutrient.nutrientNumber}</td>
              <td className="p-2 border-b">{nutrient.unitName}</td>
              <td className="p-2 border-b">{nutrient.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodDetailsTable;
