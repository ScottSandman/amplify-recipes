import React from "react";
import RecipeCard from "./RecipeCard";

export default function RecipeList({ recipesList, imageList, accessLevel }) {
  return (
    <div>
      <h5>Enjoy one of your recipes:</h5>
      {recipesList.map((recipe) => {
        return recipe ? (
          <div style={{ marginBottom: 20 }} key={recipe.id}>
            <RecipeCard
              recipesList={recipesList}
              recipe={recipe}
              imageList={imageList}
              accessLevel={accessLevel}
            />
          </div>
        ) : (
          "You haven't added any recipes"
        );
      })}
    </div>
  );
}
