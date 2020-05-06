import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createRecipe } from "./graphql/mutations";
import { getRecipe, listRecipes } from "./graphql/queries";
import { withAuthenticator } from "@aws-amplify/ui-react";

import "./App.css";

const initialState = {
  name: "",
  instructions: "",
  prepTime: null,
  cookTime: null,
};

function App() {
  const [formState, setFormState] = useState(initialState);
  const [recipesList, setRecipesList] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const addRecipe = async () => {
    try {
      if (!formState.name) return;
      const recipe = { ...formState };
      setRecipesList([...recipesList, recipe]);
      setFormState(initialState);
      const response = await API.graphql(
        graphqlOperation(createRecipe, { input: recipe })
      );
      console.log("Add Recipe Response", response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await API.graphql(graphqlOperation(listRecipes));
      const recipes = response.data.listRecipes.items;
      console.log("Fetch All Recipes Response", response, "Recipes", recipes);
      setRecipesList(recipes);
    } catch (error) {
      console.log(error);
    }
  };

  const setInput = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <label htmlFor="name">Recipe Title:</label>
          <br />
          <input
            type="text"
            id="name"
            onChange={(e) => setInput("name", e.target.value)}
          />
          <br />
          <label htmlFor="instructions">Recipe Instructions:</label>
          <br />
          <textarea
            rows="10"
            id="instructions"
            onChange={(e) => setInput("instructions", e.target.value)}
          ></textarea>
          <br />
          <label htmlFor="prepTime">Prep Time:</label>
          <br />
          <input
            type="text"
            id="prepTime"
            onChange={(e) => setInput("prepTime", e.target.value)}
          />
          <br />
          <label htmlFor="cookTime">Cooking Time:</label>
          <br />
          <input
            type="text"
            id="cookTime"
            onChange={(e) => setInput("cookTime", e.target.value)}
          />
          <br />
          <button type="submit" onClick={addRecipe}>
            Add Recipe
          </button>
        </div>
        <div>
          {recipesList.map((recipe) => {
            return recipe ? (
              <>
                <h5>Enjoy one of your recipes:</h5>
                <div>
                  {recipe.name}
                  <ul>
                    <li>Prep Time: {recipe.prepTime} mins</li>
                    <li>Cook Time: {recipe.cookTime} mins</li>
                    <li>{recipe.instructions.split(";\n").join(". ")}</li>
                  </ul>
                </div>
              </>
            ) : (
              "You haven't added any recipes"
            );
          })}
        </div>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
