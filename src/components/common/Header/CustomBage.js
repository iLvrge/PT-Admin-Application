import './CustomBage.css'
import React from "react";
import { Badge as BadgeBase } from "@mui/material";
import { useTheme } from "@mui/material/styles"

// styles
const useStyles = () => ({
  "badge": "pt-header-custom-bage-badge",
});

/*
 * The badge colour is the one genuinely dynamic style in this app: it is looked
 * up from the theme using the `color` and `colorBrightness` props, so unlike
 * the other 393 classes it cannot be a static rule.
 *
 * It used to be handled by building a throwaway component with withStyles on
 * every render, which generated a fresh JSS class each time and was the last
 * thing keeping a style engine in the bundle. Passing the value as a CSS custom
 * property does the same job: the stylesheet owns the rule, and only the single
 * value that actually varies travels inline.
 *
 * getColor returns undefined for an unknown colour, exactly as before. The
 * custom property is then not set, the declaration in CustomBage.css is
 * dropped, and the Badge keeps its own background - the same outcome as the old
 * code assigning backgroundColor: undefined.
 *
 * This file is therefore NOT regenerated: it has no makeStyles call left for
 * the extractor to find.
 */
export default function CustomBadge({ children, colorBrightness, color, ...props }) {
  const classes = useStyles();
  const theme = useTheme();
  const background = getColor(color, theme, colorBrightness);

  return (
    <BadgeBase
      classes={{ badge: classes.badge }}
      style={background ? { '--pt-badge-bg': background } : undefined}
      {...props}
    >
      {children}
    </BadgeBase>
  );
}

function getColor(color, theme, brigtness = "main") {
  if (color && theme.palette[color] && theme.palette[color][brigtness]) {
    return theme.palette[color][brigtness];
  }
}
