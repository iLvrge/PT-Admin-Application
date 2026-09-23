import React, {useState} from 'react';
import { Button, Fade, TextField, Typography } from "@mui/material";
import useStyles from "./styles";
import {withRouter} from 'react-router-dom'
import { problemType, retryAfterSeconds } from '../../api/problem'

/**
 * What to tell someone whose sign-in failed.
 *
 * This screen used to claim bad credentials whatever had happened, including
 * when the rate limiter had locked the address out or the API was down. The
 * console's sign-in limit is the strictest in the API, so that message was
 * actively misleading here.
 */
const signInMessage = (error) => {
  if (!error) return '';
  if (!error.response) {
    return 'Could not reach the server. Please try again in a moment.';
  }
  if (problemType(error) === 'rate-limited') {
    const wait = retryAfterSeconds(error);
    const minutes = wait ? Math.ceil(wait / 60) : null;
    return minutes
      ? `Too many sign-in attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`
      : 'Too many sign-in attempts. Please try again later.';
  }
  if (problemType(error) === 'admin-required') {
    return 'That account does not have admin access.';
  }
  if (error.response.status >= 500) {
    return 'The server had a problem signing you in. Please try again.';
  }
  return 'Your username and password are not correct!';
};

function Login(props) {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [heading, setHeading] = useState("SignIn");
  const [forgetUsername, setForgetUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(true);
  
  const onSignIn = () => {
    props.login({
      username,
      password
    })
      .catch(err => {
        setError(err);
      });
  };

  const onReset = () => {
    console.log("RESET");
    props.forget({
      username: forgetUsername
    }).catch(err => {
      setError(err);
    });
  };

  return (
    <div className={classes.loginForm}>
      <Typography
        variant   = "h1"
        className = {classes.greeting}
      >
        {heading}
      </Typography>
      <Fade in={!!error}>
        <Typography
          color     = "secondary"
          className = {classes.errorMessage}
        >
          {signInMessage(error)}
        </Typography>
      </Fade>
      
      {
        login 
        ?
        <div>
          <TextField
          id          = {"username"}
          value       = {username}
          onChange    = {e => setUsername(e.target.value)}
          InputProps  = {{
            classes: {
              underline: classes.textFieldUnderline,
              input: classes.textField,
            }
          }}
          margin      = "normal"
          placeholder = "UserName"
          type        = "text"
          fullWidth
        />

        <TextField
          id          = "password"
          value       = {password}
          onChange    = {e => setPassword(e.target.value)}
          InputProps  = {{
            classes: {
              underline: classes.textFieldUnderline,
              input: classes.textField,
            },
          }}
          margin      = "normal"
          placeholder = "Password"
          type        = "password"
          fullWidth
        />
        <div className={classes.formButtons}>
          <Button
            variant   = "contained"
            color     = "primary"
            size      = "large"
            disabled  = {
              username.length === 0 || password.length === 0
            }
            onClick   = {onSignIn}
          >
            Login
          </Button>
          <Button
            color     = "primary"
            size      = "large"
            className = {classes.forgetButton}
            onClick = {() => {
              setHeading("Forget Password");
              setLogin(false);
            }}
          >
            Forget Password
          </Button>
        </div>
        </div>
        :
        <div>
          {
            props.auth_email_sent
            ?
            <Fade in={true}>
              <Typography
                color     = "secondary"
              >
                We have sent you an email.
              </Typography>
            </Fade>
            :
            ''
          }
          <TextField
            id          = {"forgetUsername"}
            value       = {forgetUsername}
            onChange    = {e => setForgetUsername(e.target.value)}
            InputProps  = {{
              classes: {
                underline: classes.textFieldUnderline,
                input: classes.textField,
              }
            }}
            margin      = "normal"
            placeholder = "UserName"
            type        = "text"
            fullWidth
          />
          <Button
            variant   = "contained"
            color     = "primary"
            size      = "large"
            disabled  = {
              forgetUsername.length === 0
            }
            onClick   = {onReset}
          >
            Reset
          </Button>
          <Button
            color     = "primary"
            size      = "large"
            className = {classes.forgetButton}
            onClick = {() => {
              setHeading("SignIn");
              setLogin(true);
            }}
          >
            Cancel
          </Button>
        </div>
      }
      
    </div>
  );
}

export default withRouter(Login);