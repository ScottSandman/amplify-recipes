import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { S3Image } from "aws-amplify-react";

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

export default function RecipeDetails({ recipesList, id, accessLevel }) {
  const classes = useStyles();
  const recipe = recipesList.filter((recipe) => recipe.id === id)[0];
  console.log("Recipe Details", recipe);
  return recipe ? (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {recipe.name.slice(0, 1)}
          </Avatar>
        }
        title={recipe.name}
      />
      <S3Image
        key={recipe.recipePic}
        imgKey={recipe.recipePic}
        level={accessLevel}
        theme={{ photoImg: { width: 345 } }}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {recipe.prepTime}
          {" mins"}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {recipe.cookTime}
          {" mins"}
        </Typography>
        <Typography paragraph>Instructions:</Typography>
        {recipe.instructions.split(";").map((el, index) => (
          <Typography key={index} paragraph>
            {el}
          </Typography>
        ))}
      </CardContent>
    </Card>
  ) : (
    <></>
  );
}
