import { Studies } from "@/util";

export const getMaxIdx = (studies: Studies) => {
  switch (studies) {
    case "ST_PH":
      return 10;
    case "ST_ME_HUMAN":
      return 11;
    case "BE_PTA":
      return 9;
    case "BE_ARZT":
      return 8;
    case "TA":
      return 7;
    case "ST_ME_ZM":
      return 10;
    case "BE_APO":
      return 9;
    case "ST_ME_TIER":
      return 10;
    case "AUS_ME":
      return 10;
    case "BE_ME":
      return 8;
    case "AUS_PTA":
      return 10;
    default:
      return 11;
  }
};

export const getVideo3DIdx = (studies: Studies) => {
  switch (studies) {
    case "ST_PH":
      return 3;
    case "ST_ME_HUMAN":
      return 3;
    case "BE_PTA":
      return 3;
    case "BE_ARZT":
      return 3;
    case "ST_ME_ZM":
      return 3;
    case "BE_APO":
      return 3;
    case "ST_ME_TIER":
      return 3;
    case "AUS_ME":
      return 3;
    case "BE_ME":
      return 3;
    case "AUS_PTA":
      return 3;
    default:
      return 3;
  }
};

export const getVideoUpVoteIdx = (studies: Studies) => {
  switch (studies) {
    case "ST_PH":
      return 9;
    case "ST_ME_HUMAN":
      return 10;
    case "BE_PTA":
      return 8;
    case "BE_ARZT":
      return 7;
    case "ST_ME_ZM":
      return 9;
    case "BE_APO":
      return 8;
    case "ST_ME_TIER":
      return 9;
    case "AUS_ME":
      return 9;
    case "BE_ME":
      return 7;
    case "AUS_PTA":
      return 9;
    default:
      return 10;
  }
};
