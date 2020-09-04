import React from "react";
import {
  withStyles,
  Badge as BadgeBase
} from "@material-ui/core";
import { useTheme, makeStyles } from "@material-ui/styles";
import classnames from "classnames";

// styles
const useStyles = makeStyles(() => ({
  badge: {
    fontWeight: 600,
    height: 14,
    minWidth: 14,
    padding: 0
  },
}));

export default function CustomBadge({ children, colorBrightness, color, ...props }) {
  const classes = useStyles();
  const theme = useTheme();
  const Styled = createStyled({
    badge: {
      backgroundColor: getColor(color, theme, colorBrightness),
    },
  });

  return (
    <Styled>
      {styledProps => (
        <BadgeBase
          classes={{
            badge: classnames(classes.badge, styledProps.classes.badge),
          }}
          {...props}
        >
          {children}
        </BadgeBase>
      )}
    </Styled>
  );
}

function getColor(color, theme, brigtness = "main") {
  if (color && theme.palette[color] && theme.palette[color][brigtness]) {
    return theme.palette[color][brigtness];
  }
}

function createStyled(styles, options) {
  var Styled = function(props) {
    const { children, ...other } = props;
    return children(other);
  };

  return withStyles(styles, options)(Styled);
}
