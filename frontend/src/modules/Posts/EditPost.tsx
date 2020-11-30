import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import firebase from "firebase";

import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";

interface IPostParams {
  postID: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    button: {
      margin: theme.spacing(1),
    },
  })
);

const EditPost = () => {
  const classes = useStyles();

  let { postID } = useParams<IPostParams>();

  const [post, setPost] = useState<firebase.firestore.DocumentData>();

  const postsRef = firebase.firestore().collection("posts");

  const [postStatus, setPostStatus] = useState();

  const createPost = () => {
    var facebookPost = firebase.functions().httpsCallable("makeFacebookPost");
    facebookPost({ postID: postID }).then(function (result) {
      setPostStatus(result.data.permalink_url);
    });
  };

  const loadPost = async () => {
    postsRef
      .doc(postID)
      .get()
      .then((doc) => setPost(doc.data()));
  };

  useEffect(() => {
    loadPost();
  }, []);

  return (
    <>
      {!post ? (
        <LinearProgress />
      ) : (
        <>
          <Typography variant="h4">
            Editing {post.title ? post.title : "Untitled Post"}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                margin="normal"
                variant="outlined"
                fullWidth
                id="title"
                label="Post Title"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
              />
              <TextField
                margin="normal"
                variant="outlined"
                fullWidth
                id="content"
                label="Post Content"
                multiline
                rows={12}
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                helperText={`${post.content.length}/280 (Twitter Character Limit)`}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <div>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Post Locations</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      // control={<Checkbox checked={gilad} onChange={handleChange} name="gilad" />}
                      control={<Checkbox name="facebook" />}
                      label="Facebook"
                    />
                    <FormControlLabel
                      control={<Checkbox name="twitter" />}
                      label="Twitter"
                    />
                    <FormControlLabel
                      control={<Checkbox name="linkedin" />}
                      label="Linkedin"
                    />
                    <FormControlLabel
                      control={<Checkbox name="slack" />}
                      label="Slack"
                    />
                  </FormGroup>
                </FormControl>
              </div>
              <div>
                <FormControl margin="dense" component="fieldset">
                  <FormLabel component="legend">Posting Method</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox name="scheduled" />}
                      label="Schedule Post"
                    />
                  </FormGroup>
                </FormControl>
              </div>
              <Button
                variant="contained"
                className={classes.button}
                endIcon={<SendIcon />}
              >
                Post Now
              </Button>
            </Grid>
            <Grid xs={12}>
              <div>
                <Button
                  variant="contained"
                  className={classes.button}
                  endIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  endIcon={<SaveIcon />}
                >
                  Save Draft
                </Button>
              </div>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default EditPost;
