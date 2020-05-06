import React, { useState, useEffect } from "react";
import { API, graphqlOperation, Storage, Auth } from "aws-amplify";
import { createRecipe } from "./graphql/mutations";
import { getRecipe, listRecipes } from "./graphql/queries";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { S3Text } from "aws-amplify-react";

import "./App.css";

const initialState = {
  name: "",
  instructions: "",
  prepTime: "",
  cookTime: "",
};

// Storage.put("test.txt", "put text in private folder", {
//   level: "private",
//   contentType: "text/plain",
// })
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));

const S3ImageUpload = () => {
  const [image, setImage] = useState("");

  function onClick() {
    const file = image;
    Storage.put(image.name, file, {
      level: "private",
      contentType: "image/png",
    })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }
  return (
    <>
      <input
        type="file"
        accept="image/png"
        onChange={(e) => {
          console.log(e.target.files[0].name);
          setImage(e.target.files[0]);
        }}
      />
      <button onClick={() => onClick()}>Upload Photo</button>
    </>
  );
};

function App() {
  const [formState, setFormState] = useState(initialState);
  const [recipesList, setRecipesList] = useState([]);
  const [textList, setTextList] = useState([]);

  useEffect(() => {
    fetchRecipes();
    console.log(Auth);
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
        <AmplifySignOut />
        <div>
          <S3ImageUpload />
          <br />
          <label htmlFor="name">Recipe Title:</label>
          <br />
          <input
            type="text"
            id="name"
            onChange={(e) => setInput("name", e.target.value)}
            value={formState.name}
          />
          <br />
          <label htmlFor="instructions">Recipe Instructions:</label>
          <br />
          <textarea
            rows="10"
            id="instructions"
            onChange={(e) => setInput("instructions", e.target.value)}
            value={formState.instructions}
          ></textarea>
          <br />
          <label htmlFor="prepTime">Prep Time:</label>
          <br />
          <input
            type="text"
            id="prepTime"
            onChange={(e) => setInput("prepTime", e.target.value)}
            value={formState.prepTime}
          />
          <br />
          <label htmlFor="cookTime">Cooking Time:</label>
          <br />
          <input
            type="text"
            id="cookTime"
            onChange={(e) => setInput("cookTime", e.target.value)}
            value={formState.cookTime}
          />
          <br />
          <button type="submit" onClick={addRecipe}>
            Add Recipe
          </button>
        </div>
        <div>
          <h5>Enjoy one of your recipes:</h5>
          {recipesList.map((recipe) => {
            return recipe ? (
              <>
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
