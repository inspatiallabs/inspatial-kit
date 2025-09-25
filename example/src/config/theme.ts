import { createTheme } from "../../../modules/in-widget/src/theme/index.ts";
// #########################################################(CREATE THEME)#########################################################
// Use this to create your custom theme variables
const theme = createTheme({
  root: { "--brand": "yellow", "--background": "hsl(228 52% 96%)" },
  dark: { "--background": "hsl(233 44% 12%)" },
  attr: "data-theme",
});
theme.mount();
theme.set("dark");
// theme.update({ root: { '--brand': 'hsl(280 100% 60%)' } });
