export type Studies =
  | "ST_PH"
  | "ST_ME_HUMAN"
  | "BE_PTA"
  | "BE_ARZT"
  | "ST_ME_ZM"
  | "BE_APO"
  | "ST_ME_TIER"
  | "AUS_PTA"
  | "BE_ME"
  | "AUS_ME"
  | "TA"
  | "OTHER";

export const mapStudies = (temp: string): Studies => {
  if (
    temp === "ST_PH" ||
    temp === "ST_ME_HUMAN" ||
    temp === "BE_PTA" ||
    temp === "BE_ARZT" ||
    temp === "ST_ME_ZM" ||
    temp === "BE_APO" ||
    temp === "ST_ME_TIER" ||
    temp === "AUS_PTA"
  ) {
    return temp;
  } else if (
    temp === "BE_KRANKEN" ||
    temp === "BE_PFLEGER" ||
    temp === "BE_RETTUNG" ||
    temp === "BE_NOTFALL" ||
    temp === "BE_PFLEGEASS" ||
    temp === "BE_DGKP"
  ) {
    return "BE_ME";
  } else if (
    temp === "AUS_RETTUNG" ||
    temp === "AUS_KRANKEN" ||
    temp === "AUS_DGKP" ||
    temp === "AUS_NOTFALL" ||
    temp === "AUS_PFLEGER" ||
    temp === "AUS_PFLEGEASS"
  ) {
    return "AUS_ME";
  } else {
    return "OTHER";
  }
};

export const getStudiesValue = (studies: Studies): Studies => {
  if (
    [
      "ST_ME_HUMAN",
      "BE_PTA",
      "BE_ARZT",
      "ST_PH",
      "ST_ME_ZM",
      "BE_APO",
      "ST_ME_TIER",
      "AUS_PTA",
      "AUS_ME",
      "BE_ME",
    ].includes(studies)
  ) {
    return studies;
  } else {
    return "OTHER";
  }
};
