import defaultTheme from "./default";

import { createTheme, adaptV4Theme } from "@mui/material";

const overrides = {
  typography: {
    h1: {
      fontSize: "3rem",
    },
    h2: {
      fontSize: "2rem",
    },
    h3: {
      fontSize: "1.64rem",
    },
    h4: {
      fontSize: "1.5rem",
    },
    h5: {
      fontSize: "1.285rem",
    },
    h6: {
      fontSize: "1.142rem",
    },
  },
};

/*
 * Component defaults that changed between MUI v4 and v5, restored here.
 *
 * v4 defaulted TextField, Select and FormControl to the `standard` variant - a
 * single underline. v5 defaults them to `outlined`, a full box. Nothing in this
 * app passes `variant` explicitly (27 TextFields, 7 Selects, 12 FormControls),
 * so without this every input in the product would quietly change shape,
 * starting with the sign-in form.
 *
 * Setting it on the theme rather than editing 46 call sites keeps the change in
 * one reviewable place, and covers any input added later by someone who has
 * never heard of this migration.
 */
const v4ComponentDefaults = {
  components: {
    MuiTextField: { defaultProps: { variant: 'standard' } },
    MuiSelect: { defaultProps: { variant: 'standard' } },
    MuiFormControl: { defaultProps: { variant: 'standard' } },

    /*
     * The sorted column's header text, kept readable.
     *
     * v5's TableSortLabel paints `.Mui-active` with palette.text.primary and
     * its arrow with text.secondary. This app's palette is a LIGHT one -
     * text.primary is rgba(0, 0, 0, 0.87) - while its tables are dark
     * (rgb(34, 34, 34)). So the one sorted column rendered black on near-black
     * and disappeared, while every other header stayed white. It showed up on
     * "Name" because orderBy starts as 'name', making it the only active label.
     *
     * Inheriting instead of naming a colour means the label matches whatever
     * header it sits in, so this keeps working if a table is ever light.
     *
     * The real root cause is a light palette driving a dark UI. Switching the
     * palette to dark would fix this and an unknown number of similar cases at
     * once, but it would repaint every screen in the product - not something to
     * change while verifying a migration.
     */
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: 'inherit',
          '&.Mui-active': { color: 'inherit' },
          '&.Mui-active .MuiTableSortLabel-icon': { color: 'inherit' },
          '&:hover': { color: 'inherit' },
        },
        /*
         * Colour only - no opacity. MUI hides an inactive column's arrow with
         * opacity: 0 and reveals it on hover; setting an opacity here showed an
         * arrow on every header at once, which reads as "all columns sorted".
         */
        icon: { color: 'inherit' },
      },
    },
  },
};

export default {
  default: createTheme(
    adaptV4Theme({ ...defaultTheme, ...overrides }),
    v4ComponentDefaults
  ),
};
