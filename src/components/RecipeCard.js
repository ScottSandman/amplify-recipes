import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import { Link } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function RecipeCard({
  recipe,
  imageList,
  accessLevel,
  id,
  recipesList,
}) {
  const classes = useStyles();
  // console.log(imageList[0]);
  console.log("Recipe Card", recipe);
  return (
    // <div>{recipesList.filter((recipe) => (recipe.id = id))[0].id}</div>
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {recipe.name.slice(0, 1)}
          </Avatar>
        }
        title={<Link to={recipe.id}>{recipe.name}</Link>}
      ></CardHeader>
      {/* {imageList[0] && (
        <S3Image
          key={recipe.recipePic ? recipe.recipePic : imageList[0].key}
          imgKey={recipe.recipePic ? recipe.recipePic : imageList[0].key}
          level={accessLevel}
          theme={{ photoImg: { width: 345 } }}
        />
      )} */}
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {recipe.prepTime}
          {" mins"}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {recipe.cookTime}
          {" mins"}
        </Typography>
      </CardContent>
    </Card>
  );
}
