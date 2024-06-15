import { i18n } from "@/lng/logic";

export const getDate = (offset: number, translation: any): string => {
  switch (true) {
    case offset < 3:
      return i18n(translation, "date", offset.toString());
    case offset >= 3 && offset < 7:
      return (
        i18n(translation, "date", "before") +
        " " +
        offset +
        " " +
        i18n(translation, "date", "Tage")
      );
    case offset >= 7 && offset < 14:
      return i18n(translation, "date", "lastWeek");
    case offset >= 14 && offset < 21:
      return i18n(translation, "date", "previousLastWeek");
    case offset >= 21 && offset < 28:
      return (
        i18n(translation, "date", "before") +
        " 3 " +
        i18n(translation, "date", "Weeks")
      );
    case offset >= 28 && offset < 31:
      return (
        i18n(translation, "date", "before") +
        " 4 " +
        i18n(translation, "date", "Weeks")
      );
    case offset >= 31 && offset < 60:
      return i18n(translation, "date", "lastMonth");
    case offset >= 60 && offset < 90:
      return i18n(translation, "date", "previousLastMonth");
    case offset >= 90 && offset < 120:
      return (
        i18n(translation, "date", "before") +
        " 3 " +
        i18n(translation, "date", "Months")
      );
    case offset >= 120 && offset < 150:
      return (
        i18n(translation, "date", "before") +
        " 4 " +
        i18n(translation, "date", "Months")
      );
    case offset >= 150 && offset < 180:
      return (
        i18n(translation, "date", "before") +
        " 5 " +
        i18n(translation, "date", "Months")
      );
    case offset >= 180 && offset < 210:
      return (
        i18n(translation, "date", "before") +
        " 6 " +
        i18n(translation, "date", "Months")
      );
    case offset >= 210 && offset < 240:
      return (
        i18n(translation, "date", "before") +
        " 7 " +
        i18n(translation, "date", "Months")
      );
    case offset >= 240 && offset < 270:
      return (
        i18n(translation, "date", "before") +
        " 8 " +
        i18n(translation, "date", "Months")
      );
    case offset >= 270 && offset < 300:
      return (
        i18n(translation, "date", "before") +
        " 9 " +
        i18n(translation, "date", "Months")
      );
    case offset >= 300 && offset < 330:
      return (
        i18n(translation, "date", "before") +
        " 10 " +
        i18n(translation, "date", "Months")
      );
    case offset >= 330 && offset < 360:
      return (
        i18n(translation, "date", "before") +
        " 11 " +
        i18n(translation, "date", "Months")
      );
    case offset >= 360:
      return i18n(translation, "date", "lastYear");
    default:
      return "";
  }
};
