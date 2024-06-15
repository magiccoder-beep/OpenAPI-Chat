"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "@/redux";
import { i18n } from "@/lng/logic";
import { ActivityIndicator, Modal, Select } from "@/components";
import {
  Countries,
  country_selection_options,
  Occupation,
  OTHER,
  Studies,
} from "@/data/universities";

type Props = {};

const ProfileSetup: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { data: translation } = useAppSelector((state) => state.i18n);
  const [telephone, setTelephone] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [studies, setStudies] = useState<string>("");
  const [university, setUniversity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [selectionOptions, setSelectionOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [selectedCountry, setSelectedCountry] = useState<{
    value: "NONE" | Countries;
    label?: string;
  }>({ value: "NONE" as "NONE" | Countries });
  const [selectedStudies, setSelectedStudies] = useState<{
    value: "NONE" | Studies;
  }>({ value: "NONE" as "NONE" | Studies });
  const [selectedOccupation, setSelectedOccupation] = useState<{
    value: "NONE" | Occupation;
  }>({ value: "NONE" as "NONE" | Occupation });
  const [selectedUniversity, setSelectedUniversity] = useState<{
    value: "NONE" | number;
    label?: string;
  }>({ value: "NONE" });
  const [possibleUniversities, setPossibleUniversities] = useState<
    {
      key?: number;
      value: number | string;
      label: string;
    }[]
  >([]);
  const [text, setText] = useState<{
    validCountry: string;
    fillInCountry: string;
    validOcupation: string;
    fillInOcupation: string;
    selectStudies: string;
    validStudies: string;
    validUniversity: string;
    fillUniversity: string;
    validBundesLand: string;
    fillBundesLand: string;
    country: string;
    germany: string;
    austria: string;
    lettland: string;
    placeholderCountry: string;
    ocupation: string;
    st: string;
    aus: string;
    be: string;
    placeholderST: string;
    placeholderAUS: string;
    placeholderBE: string;
    university: string;
    regionAus: string;
    regionBe: string;
    universityNotList: string;
    ausRegionNotList: string;
    beRegioNotList: string;
    nameUniversity: string;
    nameAusRegion: string;
    nameBeRegion: string;
    continue: string;
  }>({
    validCountry: "",
    fillInCountry: "",
    validOcupation: "",
    fillInOcupation: "",
    selectStudies: "",
    validStudies: "",
    validUniversity: "",
    fillUniversity: "",
    validBundesLand: "",
    fillBundesLand: "",
    country: "",
    germany: "",
    austria: "",
    lettland: "",
    placeholderCountry: "",
    ocupation: "",
    st: "",
    aus: "",
    be: "",
    placeholderST: "",
    placeholderAUS: "",
    placeholderBE: "",
    university: "",
    regionAus: "",
    regionBe: "",
    universityNotList: "",
    ausRegionNotList: "",
    beRegioNotList: "",
    nameUniversity: "",
    nameAusRegion: "",
    nameBeRegion: "",
    continue: "",
  });

  useLayoutEffect(() => {
    setText({
      validCountry: i18n(translation, "userInfo", "validCountry"),
      fillInCountry: i18n(translation, "userInfo", "fillInCountry"),
      validOcupation: i18n(translation, "userInfo", "validOcupation"),
      fillInOcupation: i18n(translation, "userInfo", "fillInOcupation"),
      selectStudies: i18n(translation, "userInfo", "selectStudies"),
      validStudies: i18n(translation, "userInfo", "validStudies"),
      validUniversity: i18n(translation, "userInfo", "validUniversity"),
      fillUniversity: i18n(translation, "userInfo", "fillUniversity"),
      validBundesLand: i18n(translation, "userInfo", "validBundesLand"),
      fillBundesLand: i18n(translation, "userInfo", "fillBundesLand"),
      country: i18n(translation, "userInfo", "country"),
      germany: i18n(translation, "general", "Germany"),
      austria: i18n(translation, "general", "Austria"),
      lettland: i18n(translation, "general", "Lettland"),
      placeholderCountry: i18n(translation, "userInfo", "placeholderCountry"),
      ocupation: i18n(translation, "userInfo", "OCUPATION"),
      st: i18n(translation, "userInfo", "ST"),
      aus: i18n(translation, "userInfo", "AUS"),
      be: i18n(translation, "userInfo", "BE"),
      placeholderST: i18n(translation, "userInfo", "placeholderST"),
      placeholderAUS: i18n(translation, "userInfo", "placeholderAUS"),
      placeholderBE: i18n(translation, "userInfo", "placeholderBE"),
      university: i18n(translation, "userInfo", "university"),
      regionAus: i18n(translation, "userInfo", "regionAus"),
      regionBe: i18n(translation, "userInfo", "regionBe"),
      universityNotList: i18n(translation, "userInfo", "universityNotList"),
      ausRegionNotList: i18n(translation, "userInfo", "ausRegionNotList"),
      beRegioNotList: i18n(translation, "userInfo", "beRegioNotList"),
      nameUniversity: i18n(translation, "userInfo", "nameUniversity"),
      nameAusRegion: i18n(translation, "userInfo", "nameAusRegion"),
      nameBeRegion: i18n(translation, "userInfo", "nameBeRegion"),
      continue: i18n(translation, "general", "continue"),
    });
  }, [translation]);

  useEffect(() => {
    const savedTelephone = sessionStorage.getItem("phoneNumber");
    if (savedTelephone) {
      setTelephone(savedTelephone);
      setTimeout(() => sessionStorage.removeItem("phoneNumber"), 1000);
    } else {
      router.replace("/");
    }
  }, [router]);

  const onChangeUniversity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    setUniversity(inputText);
  };

  const onChangeStudies = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    setStudies(inputText);
  };

  const onChangeCountry = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    setCountry(inputText);
  };

  const isValidOcupation = () => {
    return selectedOccupation.value != "NONE";
  };

  const isValidUniversity = () => {
    return selectedUniversity.value != "NONE" || university.length > 0;
  };

  const isValidCountry = () => {
    return selectedCountry.value != "NONE" || country.length > 0;
  };

  const isValidStudies = () => {
    if (selectedStudies.value == "NONE") {
      return false;
    } else if (selectedStudies.value == "OTHER") {
      return studies.length > 0;
    } else {
      return true;
    }
  };

  useEffect(() => {
    let result: { value: string; label: string }[] = [];
    if (
      selectedCountry.value !== "NONE" &&
      selectedOccupation.value !== "NONE"
    ) {
      const options =
        country_selection_options[selectedCountry.value][
          selectedOccupation.value
        ];
      const values = Object.keys(options);
      for (let i = 0; i < values?.length; i++) {
        let tempValue = values[i];
        result.push({
          value: tempValue,
          label: i18n(translation, "userInfo", tempValue),
        });
      }
    } else {
      result.push({
        value: OTHER,
        label: i18n(translation, "userInfo", OTHER),
      });
    }
    setSelectionOptions(result);
  }, [selectedCountry, selectedOccupation, translation]);

  useEffect(() => {
    let result: { key?: number; value: number | string; label: string }[] = [];
    if (
      selectedCountry.value !== "NONE" &&
      selectedOccupation.value !== "NONE" &&
      selectedStudies.value !== "NONE"
    ) {
      const countryOptions = country_selection_options[selectedCountry.value];
      const occupationOptions = countryOptions[selectedOccupation.value];
      const studiesOptions = occupationOptions[selectedStudies.value];
      const options = studiesOptions;
      if (options) {
        for (let i = 0; i < options?.length; i++) {
          let tempValue = options[i];
          result.push({ key: i, value: i, label: tempValue });
        }
      }
    } else {
      result.push({
        value: OTHER,
        label: i18n(translation, "userInfo", OTHER),
      });
    }
    setPossibleUniversities(result);
  }, [selectedCountry, selectedOccupation, selectedStudies, translation]);

  const setSelectedOcupationWrapper = (item: {
    value: Occupation;
    label: string;
  }) => {
    if (item !== null) {
      setSelectedOccupation({ value: item.value });
    } else {
      setSelectedOccupation({ value: "NONE" });
    }
  };

  const setSelectedCountryWrapper = (item: {
    value: Countries;
    label: string;
  }) => {
    if (item !== null) {
      setSelectedCountry(item);
    } else {
      setSelectedCountry({ value: "NONE" });
    }
  };

  const setSelectedStudiesWrapper = (item: {
    value: Studies;
    label: string;
  }) => {
    if (item !== null) {
      setSelectedStudies({ value: item.value });
    } else {
      setSelectedStudies({ value: "NONE" });
    }
  };

  const setSelectedUniversityWrapper = (item: {
    key?: number;
    label: string;
    value: number;
  }) => {
    if (item !== null) {
      setSelectedUniversity({ value: item.value, label: item.label });
    } else {
      setSelectedUniversity({ value: "NONE" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidCountry()) {
      setDialogMessage(text.validCountry);
      setDialogTitle(text.fillInCountry);
      setShowDialog(true);
    } else if (!isValidOcupation()) {
      setDialogMessage(text.validOcupation);
      setDialogTitle(text.fillInOcupation);
      setShowDialog(true);
    } else if (!isValidStudies()) {
      setDialogMessage(text.selectStudies);
      setDialogTitle(text.validStudies);
      setShowDialog(true);
    } else if (!isValidUniversity()) {
      if (selectedOccupation.value == "ST") {
        setDialogMessage(text.validUniversity);
        setDialogTitle(text.fillUniversity);
      } else {
        setDialogMessage(text.validBundesLand);
        setDialogTitle(text.fillBundesLand);
      }
      setShowDialog(true);
    } else {
      setIsSubmitting(true);
      sessionStorage.setItem(
        "userProfile",
        JSON.stringify({
          phoneNumber: telephone,
          university:
            university.length > 0 ? university : selectedUniversity.label,
          studies: studies.length > 0 ? studies : selectedStudies.value,
          country: country.length > 0 ? country : selectedCountry.label,
          occupation: selectedOccupation.value,
        })
      );
      router.push("/user-profile/setup");
      setIsSubmitting(false);
    }
  };

  if (!telephone) {
    return;
  }

  return (
    <div className="flex flex-col justify-center bg-black items-center w-screen h-screen">
      <Modal
        showModal={showDialog}
        title={dialogTitle}
        description={dialogMessage}
        submitButtonText="Ok"
        submitHandler={() => setShowDialog(false)}
      />
      <div className="absolute top-10 left-10">
        <FontAwesomeIcon
          className="w-8 h-8 cursor-pointer"
          icon={faArrowLeft}
          color="#ffffff"
          onClick={() => router.replace("/")}
        />
      </div>
      <div className="flex flex-col w-[90%] md:w-[60%] lg:w-[30%] items-start text-white">
        <form onSubmit={handleSubmit} className="w-full">
          <p className="font-fontBold text-2xl font-bold mb-2">
            {text.country}
          </p>
          {country.length == 0 && (
            <div className="w-full mb-2">
              <Select
                options={[
                  { value: "DE", label: text.germany },
                  { value: "AU", label: text.austria },
                  { value: "LE", label: text.lettland },
                ]}
                onChange={setSelectedCountryWrapper}
                isDisabled={isSubmitting}
              />
            </div>
          )}
          {selectedCountry.value == "NONE" && (
            <input
              type="text"
              placeholder={text.placeholderCountry}
              value={country}
              onChange={onChangeCountry}
              disabled={isSubmitting}
              className="mt-4 text-lg mb-2 bg-transparent border-secondary border-b caret-secondary px-1 w-full"
            />
          )}
          {(selectedCountry.value != "NONE" || country.length > 0) && (
            <div className="mb-2 w-full">
              <p className="font-fontBold text-2xl font-bold mb-2">
                {text.ocupation}
              </p>
              <Select
                options={[
                  { value: "ST", label: text.st },
                  { value: "AUS", label: text.aus },
                  { value: "BE", label: text.be },
                ]}
                onChange={setSelectedOcupationWrapper}
                isDisabled={isSubmitting}
              />
            </div>
          )}
          {(selectedCountry.value != "NONE" || country.length > 0) &&
            selectedOccupation.value != "NONE" && (
              <div className="mb-2 w-full">
                <p className="font-fontBold text-2xl font-bold mb-2">
                  {selectedOccupation.value == "ST" && text.st}
                  {selectedOccupation.value == "AUS" && text.aus}
                  {selectedOccupation.value == "BE" && text.be}
                </p>
                <Select
                  options={selectionOptions}
                  onChange={setSelectedStudiesWrapper}
                  isDisabled={isSubmitting}
                />
              </div>
            )}
          {selectedStudies.value == "OTHER" && (
            <input
              type="text"
              placeholder={
                selectedOccupation.value == "ST"
                  ? text.placeholderST
                  : selectedOccupation.value == "AUS"
                  ? text.placeholderAUS
                  : text.placeholderBE
              }
              value={studies}
              onChange={onChangeStudies}
              disabled={isSubmitting}
              className="mt-4 text-lg mb-2 bg-transparent border-secondary border-b caret-secondary px-1 w-full"
            />
          )}
          {(country.length > 0 || selectedCountry.value != "NONE") &&
            selectedStudies.value != "NONE" && (
              <div className="mb-2 w-full">
                <p className="font-fontBold text-2xl font-bold mb-2">
                  {selectedOccupation.value == "ST" && text.university}
                  {selectedOccupation.value == "AUS" && text.regionAus}
                  {selectedOccupation.value == "BE" && text.regionBe}
                </p>
                {possibleUniversities.length > 0 &&
                  country.length == 0 &&
                  university.length == 0 && (
                    <Select
                      options={possibleUniversities}
                      onChange={setSelectedUniversityWrapper}
                      isDisabled={isSubmitting}
                    />
                  )}
                {selectedUniversity.value == "NONE" && (
                  <input
                    type="text"
                    placeholder={
                      possibleUniversities.length > 0
                        ? selectedOccupation.value == "ST"
                          ? text.universityNotList
                          : selectedOccupation.value == "AUS"
                          ? text.ausRegionNotList
                          : text.beRegioNotList
                        : selectedOccupation.value == "ST"
                        ? text.nameUniversity
                        : selectedOccupation.value == "AUS"
                        ? text.nameAusRegion
                        : text.nameBeRegion
                    }
                    value={university}
                    onChange={onChangeUniversity}
                    disabled={isSubmitting}
                    className={`text-2xl mb-2 bg-transparent border-secondary border-b caret-secondary px-1 w-full ${
                      possibleUniversities.length > 0 &&
                      country.length == 0 &&
                      university.length == 0 &&
                      "mt-4"
                    }`}
                  />
                )}
              </div>
            )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full px-4 py-3 rounded-custom bg-secondary hover:bg-[#158c78] text-white font-fontBold font-bold text-lg"
          >
            <span>
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <span>{text.continue}</span>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
