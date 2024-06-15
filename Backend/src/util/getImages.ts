import constants from "@/constants/general";
import { Studies } from "@/util";

export const getImg = (idx: number, studies: Studies) => {
  if (studies === "ST_PH") {
    return get_ST_PH_Image(idx);
  } else if (studies === "ST_ME_HUMAN") {
    return get_ST_ME_HUMAN_Image(idx);
  } else if (studies === "ST_ME_ZM") {
    return get_ST_ME_ZM_Image(idx);
  } else if (studies === "BE_PTA") {
    return getPTABerufImage(idx);
  } else if (studies === "BE_APO") {
    return get_BE_APO_Image(idx);
  } else if (studies === "ST_ME_TIER") {
    return get_ST_ME_TIER_Image(idx);
  } else if (studies === "BE_ARZT") {
    return get_BE_ARZT_Image(idx);
  } else if (studies === "AUS_ME") {
    return get_AUS_ME_Image(idx);
  } else if (studies === "BE_ME") {
    return get_BE_ME_Image(idx);
  } else if (studies === "AUS_PTA") {
    return get_AUS_PTA_Image(idx);
  } else {
    return getOtherImage(idx);
  }
};

const getOtherImage = (idx: number) => {
  switch (idx) {
    case 1:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/2.png" };
    case 2:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/3.png" };
    case 3:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/4.png" };
    case 4:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/5.png" };
    case 5:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/6.png" };
    case 6:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/7.png" };
    case 7:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/8.png" };
    case 8:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/9.png" };
    case 9:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/10.png" };
    default:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/empty.png" };
  }
};

const get_ST_ME_TIER_Image = (idx: number) => {
  switch (idx) {
    case 1:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_TIER/2.png" };
    case 2:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_TIER/3.png" };
    case 4:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_TIER/5.png" };
    case 5:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_TIER/6.png" };
    case 6:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_TIER/7.png" };
    case 7:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_TIER/8.png" };
    case 8:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_TIER/9.png" };
    case 9:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_TIER/10.png" };
    default:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/empty.png" };
  }
};

const get_BE_ARZT_Image = (idx: number) => {
  switch (idx) {
    case 1:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ARZT/2.png" };
    case 2:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ARZT/3.png" };
    case 4:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ARZT/5.png" };
    case 5:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ARZT/6.png" };
    case 6:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ARZT/7.png" };
    case 7:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ARZT/8.png" };
    default:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/empty.png" };
  }
};

const getPTABerufImage = (idx: number) => {
  switch (idx) {
    case 1:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_PTA/2.png" };
    case 2:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_PTA/3.png" };
    case 3:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_PTA/4.png" };
    case 4:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_PTA/5.png" };
    case 5:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_PTA/6.png" };
    case 6:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_PTA/7.png" };
    case 7:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_PTA/8.png" };
    case 8:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_PTA/9.png" };
    default:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/empty.png" };
  }
};

const get_AUS_ME_Image = (idx: number) => {
  switch (idx) {
    case 1:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_ME/2.png" };
    case 2:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_ME/3.png" };
    case 3:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_ME/4.png" };
    case 4:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_ME/5.png" };
    case 5:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_ME/6.png" };
    case 6:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_ME/7.png" };
    case 7:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_ME/8.png" };
    case 8:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_ME/9.png" };
    default:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/empty.png" };
  }
};

const get_BE_ME_Image = (idx: number) => {
  switch (idx) {
    case 1:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ME/2.png" };
    case 2:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ME/3.png" };
    case 3:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ME/4.png" };
    case 4:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ME/5.png" };
    case 5:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ME/6.png" };
    case 6:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ME/7.png" };
    case 7:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_ME/8.png" };
    default:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/empty.png" };
  }
};

const get_BE_APO_Image = (idx: number) => {
  switch (idx) {
    case 1:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_APO/2.png" };
    case 2:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_APO/3.png" };
    case 3:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_APO/4.png" };
    case 4:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_APO/5.png" };
    case 5:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_APO/6.png" };
    case 6:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_APO/7.png" };
    case 7:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_APO/8.png" };
    case 8:
      return { uri: constants.cloudfrontUrl + "/tutorial/BE_APO/9.png" };
    default:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/empty.png" };
  }
};

const get_ST_PH_Image = (idx: number) => {
  switch (idx) {
    case 1:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_PH/2.png" };
    case 2:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_PH/3.png" };
    case 3:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_PH/4.png" };
    case 4:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_PH/5.png" };
    case 5:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_PH/6.png" };
    case 6:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_PH/7.png" };
    case 7:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_PH/8.png" };
    case 8:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_PH/9.png" };
    case 9:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_PH/9.png" };
    default:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/empty.png" };
  }
};

const get_AUS_PTA_Image = (idx: number) => {
  switch (idx) {
    case 1:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_PTA/2.png" };
    case 2:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_PTA/3.png" };
    case 4:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_PTA/5.png" };
    case 5:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_PTA/6.png" };
    case 6:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_PTA/7.png" };
    case 7:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_PTA/8.png" };
    case 8:
      return { uri: constants.cloudfrontUrl + "/tutorial/AUS_PTA/9.png" };
    default:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/empty.png" };
  }
};

const get_ST_ME_HUMAN_Image = (idx: number) => {
  switch (idx) {
    case 1:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_HUMAN/2.png" };
    case 2:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_HUMAN/3.png" };
    case 3:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_HUMAN/4.png" };
    case 4:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_HUMAN/5.png" };
    case 5:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_HUMAN/6.png" };
    case 6:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_HUMAN/7.png" };
    case 7:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_HUMAN/8.png" };
    case 8:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_HUMAN/9.png" };
    case 9:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_HUMAN/10.png" };
    case 10:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_HUMAN/11.png" };
    default:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/empty.png" };
  }
};

const get_ST_ME_ZM_Image = (idx: number) => {
  switch (idx) {
    case 1:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_ZM/2.png" };
    case 2:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_ZM/3.png" };
    case 3:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_ZM/4.png" };
    case 4:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_ZM/5.png" };
    case 5:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_ZM/6.png" };
    case 6:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_ZM/7.png" };
    case 7:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_ZM/8.png" };
    case 8:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_ZM/9.png" };
    case 9:
      return { uri: constants.cloudfrontUrl + "/tutorial/ST_ME_ZM/10.png" };
    default:
      return { uri: constants.cloudfrontUrl + "/tutorial/OTHER/empty.png" };
  }
};
