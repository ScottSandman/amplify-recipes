import React, { useState, useEffect } from "react";
import { API, graphqlOperation, Storage, Auth } from "aws-amplify";
import { createRecipe } from "./graphql/mutations";
import { getRecipe, listRecipes } from "./graphql/queries";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { S3Text, S3Image } from "aws-amplify-react";
import { v4 as uuidv4 } from "uuid";

import "./App.css";
import RecipeCard from "./RecipeCard";
import RecipeInputs from "./RecipeInputs";

const initialState = {
  name: "",
  instructions: "",
  prepTime: "",
  cookTime: "",
  recipePic: undefined,
};

function App() {
  const [formState, setFormState] = useState(initialState);
  const [recipesList, setRecipesList] = useState([]);
  const [imageList, setImageList] = useState([]);

  const accessLevel = "private"; //only applies to S3 buckets

  useEffect(() => {
    fetchRecipes();
    Storage.list("", { level: accessLevel, contentType: "image/png" })
      .then((result) =>
        setImageList(
          result.filter((file) => {
            if (!file.key.match(/.jpg/ == false)) return file;
          })
        )
      )
      .catch((err) => console.log(err));
    // console.log(Auth);
  }, [accessLevel]);

  //set subscription appsync to fetch from bucket, then publish recipe

  const addRecipe = async () => {
    try {
      if (!formState.name) return;
      const uuid = uuidv4() + ".png";
      const file = formState.recipePic;
      const imageResponse = await Storage.put("images/" + uuid, file, {
        level: accessLevel,
        contentType: "image/png",
      });
      // .then((result) => console.log(result))
      // .catch((err) => console.log(err));
      console.log("image response", imageResponse);
      const recipe = { ...formState, recipePic: imageResponse.key };
      setRecipesList([...recipesList, recipe]);
      setFormState(initialState);
      const response = await API.graphql(
        graphqlOperation(createRecipe, { input: recipe })
      );
      // console.log("Add Recipe Response", response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await API.graphql(graphqlOperation(listRecipes));
      const recipes = response.data.listRecipes.items;
      // console.log("Fetch All Recipes Response", response, "Recipes", recipes);
      setRecipesList(recipes);
    } catch (error) {
      console.log(error);
    }
  };

  const setInput = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  // console.log("textlist", textList, "image list", imageList);

  return (
    <div className="App">
      <header className="App-header">
        <AmplifySignOut />
        <div>
          <RecipeInputs
            formState={formState}
            setInput={setInput}
            addRecipe={addRecipe}
          />
        </div>
        <div>
          <h5>Enjoy one of your recipes:</h5>
          {recipesList.map((recipe) => {
            return recipe ? (
              <div style={{ marginBottom: 20 }} key={recipe.id}>
                <RecipeCard
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
      </header>
    </div>
  );
}

export default withAuthenticator(App);
