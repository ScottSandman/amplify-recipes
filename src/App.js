import React, { useState, useEffect } from "react";
import { Link, Router, navigate } from "@reach/router";
import { API, graphqlOperation, Storage, Auth } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { v4 as uuidv4 } from "uuid";

import { onCreateRecipe } from "./graphql/subscriptions";
import { listRecipes } from "./graphql/queries";
import { createRecipe } from "./graphql/mutations";

import "./App.css";

import RecipeInputs from "./components/RecipeInputs";
import RecipeList from "./components/RecipeList";
import RecipeCard from "./components/RecipeCard";
import RecipeDetails from "./components/RecipeDetails";

const initialState = {
  name: "",
  instructions: "",
  prepTime: "",
  cookTime: "",
  recipePic: undefined,
};

// setTimeout(() => {
//   subscription.unsubscribe();
// }, 100000);

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
  }, []);

  const addRecipe = async () => {
    try {
      if (!formState.name) return;
      const subscription = await subscribe();
      // subscription.unsubscribe();
      const uuid = uuidv4() + ".png";
      const file = formState.recipePic;
      const imageResponse = await Storage.put("images/" + uuid, file, {
        level: accessLevel,
        contentType: "image/png",
      });
      // console.log("image response", imageResponse);
      const recipe = { ...formState, recipePic: imageResponse.key };
      setFormState(initialState);
      const response = await API.graphql(
        graphqlOperation(createRecipe, { input: recipe })
      );
    } catch (error) {
      console.log(error);
    }
  };

  async function subscribe() {
    try {
      console.log("auth", Auth, "currentAuthUser", Auth.user.username);
      const subscription = await API.graphql(
        graphqlOperation(onCreateRecipe, {
          owner: Auth.user.username,
        })
      ).subscribe({
        next: (recipeData) => {
          // console.log("recipeData", recipeData);
          setRecipesList([
            ...recipesList,
            recipeData.value.data.onCreateRecipe,
          ]);
        },
      });

      return subscription;
    } catch (error) {
      console.log(error);
    }
  }

  const fetchRecipes = async () => {
    try {
      const response = await API.graphql(graphqlOperation(listRecipes));
      console.log("fetch recipes response", response);
      const recipes = response.data.listRecipes.items;
      console.log("fetch recipes", recipes);
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
      </header>
      <Router>
        <RecipeList
          path="/"
          recipesList={recipesList}
          imageList={imageList}
          accessLevel={accessLevel}
        >
          {/* <RecipeCard path="/"> */}

          {/* </RecipeCard> */}
        </RecipeList>
        <RecipeDetails
          path=":id"
          recipesList={recipesList}
          accessLevel={accessLevel}
        />
        <RecipeInputs
          path="CreateRecipe"
          formState={formState}
          setInput={setInput}
          addRecipe={addRecipe}
        />
      </Router>
    </div>
  );
}

export default withAuthenticator(App);
