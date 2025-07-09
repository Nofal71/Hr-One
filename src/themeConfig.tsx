import {
   BrandVariants,
   Theme,
   createLightTheme,
 } from "@fluentui/react-components";
import { webLightTheme } from '@fluentui/react-components';

 
 const brandRamp: BrandVariants = {
   10: "#040301",
   20: "#1D170C",
   30: "#312613",
   40: "#403117",
   50: "#4F3C1A",
   60: "#5F481E",
   70: "#705421",
   80: "#816024",
   90: "#936D26",
   100: "#A57A29",
   110: "#B7862A",
   120: "#CA942C",
   130: "#DEA12C",
   140: "#F2AE2A",
   150: "#FEBF52",
   160: "#FFD390",
 };
 
 export const lightTheme: Theme = {
   ...createLightTheme(brandRamp),
   ...webLightTheme
  };
  