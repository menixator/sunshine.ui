import * as colors from "material-ui/colors";

import { getContrastRatio, darken } from "material-ui/styles/colorManipulator";

const mainPalette = [400, 500];
const altPalette = [];

// mainColors have alternative palettes
const mainColors = [
  "red",
  "pink",
  "purple",
  "deepPurple",
  "indigo",
  "blue",
  "lightBlue",
  "cyan",
  "green",
  "lightGreen",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deepOrange"
];

// neutralColors do not.
const neutralColors = ["grey", "blueGrey"];

let unfurlMainPalette = color => [...mainPalette.map(hue => colors[color][hue])];
let unfurlAltPalette = color => [...altPalette.map(hue => colors[color][hue])];

const allColors = ["rgba(63, 188, 255, 1)"].concat(...mainColors.map(unfurlMainPalette));

let random = palette => {
  if (palette.size === allColors.length) throw new Error("palette exhausted!");

  let randomColor = allColors[Math.floor(Math.random() * allColors.length)];

  if (palette.has(randomColor)) return random(palette);

  palette.add(randomColor);
  return randomColor;
};

export default function findMeAColor(palette) {
  return random(palette);
}
