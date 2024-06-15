"use client";

export const i18n = (translations: any, page: string, name: string): string => {
  if (page in translations) {
    const pageTranslations = translations[page];
    if (name in pageTranslations) {
      return pageTranslations[name] as string;
    }
  }
  return name;
};

export const tutorial = (
  translations: any,
  name: string,
  type: string,
  idx: number
): string => {
  const page = "tutorial";
  if (page in translations) {
    const pageTranslations = translations[page];
    if (name in pageTranslations) {
      const nameTranslations = pageTranslations[name];
      if (type in nameTranslations) {
        const typeTranslations = nameTranslations[type];
        if (idx in typeTranslations) {
          return typeTranslations[idx];
        }
      }
    }
  }
  return name;
};
