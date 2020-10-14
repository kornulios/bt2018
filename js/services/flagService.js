function importAll(r) {
  return r.keys().map((r) => {
    return "images/" + r;
  });
}

export const images = importAll(require.context("../../static/flags", false, /\.(svg)$/));

export const flagImages = {
  ITA: "images/italy.svg",
  NOR: "images/norway.svg",
}