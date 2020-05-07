import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 400,
      backgroundColor: "white",
    },
  },
}));

export default function RecipeInputs({ formState, setInput, addRecipe }) {
  const classes = useStyles();
  //   const [value, setValue] = React.useState('Controlled');

  //   const handleChange = (event) => {
  //     setValue(event.target.value);
  //   };

  return (
    <div className={classes.root}>
      <div style={{ border: "2px solid white" }}>
        <TextField
          id="outlined-multiline-flexible"
          label="Recipe Name"
          multiline
          rowsMax={4}
          onChange={(e) => setInput("name", e.target.value)}
          variant="outlined"
          value={formState.name}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: 400,
          border: "2px solid white",
        }}
      >
        <TextField
          id="outlined-textarea"
          label="Cook Time"
          rowsMax={2}
          multiline
          variant="outlined"
          onChange={(e) => setInput("cookTime", e.target.value)}
          value={formState.cookTime}
          style={{ width: 200 }}
        />
        <TextField
          id="outlined-textarea"
          label="Prep Time"
          rowsMax={2}
          multiline
          variant="outlined"
          onChange={(e) => setInput("prepTime", e.target.value)}
          value={formState.prepTime}
          style={{ width: 200 }}
        />
      </div>
      <div>
        <TextField
          id="outlined-multiline-static"
          label="Recipe Instructions"
          multiline
          rows={4}
          placeholder="Instructions go here..."
          variant="outlined"
          onChange={(e) => setInput("instructions", e.target.value)}
          value={formState.instructions}
        />
      </div>
      <input
        type="file"
        accept="image/png"
        onChange={(e) => {
          // console.log("New Pic + name", e.target.files[0]);
          setInput("recipePic", e.target.files[0]);
        }}
        value={formState.recipePic}
      />
      <button onClick={() => addRecipe()}>Add Recipe</button>
    </div>
  );
}
