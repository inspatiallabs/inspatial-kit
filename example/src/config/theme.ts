import { createTheme } from "../../../modules/in-widget/src/theme/index.ts";
const theme = createTheme({
  root: { "--brand": "hsl(274 100% 50%)", "--background": "hsl(228 52% 96%)" },
  dark: { "--background": "hsl(233 44% 12%)" },
  attr: "data-theme",
});
theme.mount();
theme.set("dark");
// theme.update({ root: { '--brand': 'hsl(280 100% 60%)' } });
