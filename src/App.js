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

// Storage.put("test.txt", "put text in private folder", {
//   level: "private",
//   contentType: "text/plain",
// })
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));

// const S3ImageUpload = ({ accessLevel }) => {
//   const [image, setImage] = useState("");

//   function onClick() {
//     const uuid = uuidv4() + ".png";
//     const file = image;
//     // console.log("HowdyUUID!", uuid);
//     Storage.put("images/" + uuid, file, {
//       level: accessLevel,
//       contentType: "image/png",
//     })
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }
//   return (
//     <>
//       <input
//         type="file"
//         accept="image/png"
//         onChange={(e) => {
//           console.log(e.target.files[0].name);
//           setImage(e.target.files[0]);
//         }}
//       />
//       <button onClick={() => onClick()}>Upload Photo</button>
//     </>
//   );
// };

function App() {
  const [formState, setFormState] = useState(initialState);
  const [recipesList, setRecipesList] = useState([]);
  const [textList, setTextList] = useState([]);
  const [accessLevel, setAccessLevel] = useState("public");
  const [imageList, setImageList] = useState([]);

  // console.log("current state", formState);

  useEffect(() => {
    fetchRecipes();
    // Storage.list("", { level: accessLevel, contentType: "text/plain" })
    //   .then((result) =>
    //     setTextList(
    //       result.filter((file) => {
    //         if (!file.key.match(/.txt/) == false) return file;
    //       })
    //     )
    //   )
    //   .catch((err) => console.log(err));
    Storage.list("images/", { level: accessLevel, contentType: "image/png" })
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

  // console.log("access level", accessLevel);

  // function submitPhoto() {
  //   const uuid = uuidv4() + ".png";
  //   const file = formState.recipePic;
  //   console.log("HowdyUUID!", uuid);
  //   setFormState({ ...formState, recipePic: uuid });
  //   Storage.put("images/" + uuid, file, {
  //     level: accessLevel,
  //     contentType: "image/png",
  //   })
  //     .then((result) => console.log(result))
  //     .catch((err) => console.log(err));
  //   console.log("Lizard formState!", formState);
  // }

  const addRecipe = async () => {
    try {
      if (!formState.name) return;
      const uuid = uuidv4() + ".png";
      const file = formState.recipePic;
      // console.log("HowdyUUID!", uuid);
      // setFormState({ ...formState, recipePic: uuid });
      Storage.put("images/" + uuid, file, {
        level: accessLevel,
        contentType: "image/png",
      })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
      const recipe = { ...formState, recipePic: uuid };
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
          {/* <S3ImageUpload accessLevel={accessLevel} /> */}
          {/* <div>
            {textList.map((txt) => (
              <S3Text key={txt.key} textKey={txt.key} level={accessLevel} />
            ))}
          </div> */}
          <button
            onClick={(e) => {
              if (accessLevel === "public") setAccessLevel("private");
              else if (accessLevel === "private") setAccessLevel("public");
            }}
          >
            {accessLevel}
          </button>

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
              <div style={{ marginBottom: 20 }}>
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
