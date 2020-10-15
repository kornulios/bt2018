function importAll(r) {
  return r.keys().map((r) => {
    return "images/" + r;
  });
}

export const images = importAll(require.context("../../static/flags", false, /\.(svg)$/));

const flagImagesMap = {
  ITA: "images/italy.svg",
  NOR: "images/norway.svg",
  SWE: "images/sweden.svg",
  FIN: "images/finland.svg",
  FRA: "images/france.svg",
  BEL: "images/belgium.svg",
  ROM: "images/romania.svg",
  GER: "images/germany.svg",
  RUS: "images/russia.svg",
  AUT: "images/austria.svg",
  BUL: "images/bulgaria.svg",
  LTU: "images/lithuania.svg",
  LAT: "images/latvia.svg",
  UKR: "images/ukraine.svg",
  POL: "images/poland.svg",
  EST: "images/estonia.svg",
  USA: "images/usa.svg",
  CHI: "images/china.svg",
  JPN: "images/japan.svg",
  KOR: "images/korea.svg",
  CAN: "images/canada.svg",
  SVK: "images/slovakia.svg",
  SLO: "images/slovenia.svg",
  BLR: "images/belarus.svg",
  KAZ: "images/kazakhstan.svg",
  CZE: "images/czech.svg",
  SUI: "images/switzerland.svg",
};

export const flagImages = () => {
  return Object.keys(flagImagesMap).reduce((acc, name) => {
    const img = new Image();
    img.src = flagImagesMap[name];
    acc[name] = img;

    return { ...acc };
  }, {});
};
