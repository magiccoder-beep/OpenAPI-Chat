"use client";

import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  faArrowLeft,
  faArrowRight,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useImageDimensions } from "@/hooks";
import { useAppDispatch, useAppSelector, userActions } from "@/redux";
import { i18n, tutorial } from "@/lng/logic";
import Colors from "@/constants/colors";
import constants from "@/constants/general";
import {
  getImg,
  Studies,
  getMaxIdx,
  getVideo3DIdx,
  getVideoUpVoteIdx,
  mapStudies,
  getStudiesValue,
} from "@/util";

type Props = {};

const Tutorial: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const aspectRatio = 1080 / 1920;
  const maxWidthPercent = 80;
  const maxHeightPercent = 80;
  const { imageWidth, imageHeight } = useImageDimensions(
    aspectRatio,
    maxWidthPercent,
    maxHeightPercent
  );
  const { tutorialSeen, user } = useAppSelector((state) => state.users);
  const { data: translation } = useAppSelector((state) => state.i18n);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [studies, setStudies] = useState<Studies>(mapStudies(user.studies));
  const [text, setText] = useState<{
    title: string;
    description: string;
    para1: string;
    para2: string;
    para3: string;
    para4: string;
  }>({
    title: "",
    description: "",
    para1: "",
    para2: "",
    para3: "",
    para4: "",
  });

  useEffect(() => {
    if (user && user.studies) {
      setStudies(mapStudies(user.studies));
    }
  }, [user]);

  useEffect(() => {
    let title: string = "";
    let description: string = "";
    let para1: string = "";
    let para2: string = "";
    let para3: string = "";
    let para4: string = "";
    if (currentIdx === 0) {
      title = tutorial(
        translation,
        getStudiesValue(studies),
        "title",
        currentIdx
      );
      description = tutorial(
        translation,
        getStudiesValue(studies),
        "description",
        currentIdx
      );
    }
    if (currentIdx > 0 && currentIdx < getMaxIdx(studies)) {
      title = tutorial(
        translation,
        getStudiesValue(studies),
        "title",
        currentIdx
      );
      description =
        tutorial(
          translation,
          getStudiesValue(studies),
          "description",
          currentIdx
        )?.length > 0
          ? tutorial(
              translation,
              getStudiesValue(studies),
              "description",
              currentIdx
            )
          : "";
      if (currentIdx === getVideo3DIdx(studies)) {
        para1 = i18n(translation, "tutorial", "einfachTippen");
      }
    }
    if (currentIdx === getMaxIdx(studies)) {
      title = i18n(translation, "tutorial", "vielSpaB");
      description = i18n(translation, "tutorial", "denkImmer");
      para1 = i18n(translation, "tutorial", "DuSolltestNie");
      para2 = i18n(translation, "tutorial", "LiebeGrube");
      para3 = i18n(translation, "tutorial", "Apotheker");
      para4 = i18n(translation, "tutorial", "Grunder");
    }
    setText({ title, description, para1, para2, para3, para4 });
  }, [currentIdx, studies, translation]);

  const goNext = () => {
    if (currentIdx === getMaxIdx(studies)) {
      dispatch(userActions.setTutorialSeen(true));
      setTimeout(() => router.replace("/ask"), 100);
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const goBack = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const onClose = () => {
    router.replace("/ask");
  };

  return (
    <div
      className={`${
        (currentIdx === 0 || currentIdx === getMaxIdx(studies)) && "tutorial-bg"
      }
        ${currentIdx % 2 === 0 ? "bg-secondary" : "bg-primary"}
        flex flex-col justify-start items-center h-screen w-screen overflow-y-scroll transparent-scrollbar`}
    >
      {currentIdx > 0 && (
        <div className="fixed bottom-5 lg:bottom-10 left-5 lg:left-10">
          <FontAwesomeIcon
            className="w-5 md:w-6 h-5 md:h-6 cursor-pointer bg-white rounded-full p-1 lg:p-2"
            icon={faArrowLeft}
            color={
              currentIdx % 2 === 0 ? Colors.secondaryColor : Colors.primaryColor
            }
            onClick={goBack}
          />
        </div>
      )}
      <div className="fixed bottom-5 lg:bottom-10 right-5 lg:right-10">
        <FontAwesomeIcon
          className="w-5 md:w-6 h-5 md:h-6 cursor-pointer bg-white rounded-full p-1 lg:p-2"
          icon={faArrowRight}
          color={
            currentIdx % 2 === 0 ? Colors.secondaryColor : Colors.primaryColor
          }
          onClick={goNext}
        />
      </div>
      {tutorialSeen && (
        <div className="fixed top-5 lg:top-10 right-5 lg:right-10">
          <FontAwesomeIcon
            className="w-5 md:w-6 h-5 md:h-6 cursor-pointer bg-white rounded-full p-1 lg:p-2"
            icon={faClose}
            color={
              currentIdx % 2 === 0 ? Colors.secondaryColor : Colors.primaryColor
            }
            onClick={onClose}
          />
        </div>
      )}
      <div className="flex flex-col w-[90%] md:w-[80%] lg:w-[30%] items-center justify-start text-white">
        {currentIdx === 0 && (
          <>
            <div className="w-36 -mb-12">
              <Image
                src="/assets/img/tutorial/logo.png"
                alt="pharmazing"
                width={1080}
                height={1920}
              />
            </div>
            <h1 className="font-fontBold text-4xl font-bold mb-16 text-center">
              {text.title}
            </h1>
            <p className="font-fontBold text-3xl font-bold mb-2 text-center">
              {text.description}
            </p>
          </>
        )}
        {currentIdx > 0 && currentIdx < getMaxIdx(studies) && (
          <>
            <h1 className="font-fontBold text-3xl font-bold mt-8 mb-2 text-center">
              {text.title}
            </h1>
            {text.description && (
              <p className="font-fontBold text-lg font-bold text-center mb-2">
                {text.description}
              </p>
            )}
            {currentIdx === getVideo3DIdx(studies) && (
              <div className="bg-secondary px-3 py-1 mb-2">
                <p className="font-fontBold text-lg font-bold text-center">
                  {text.para1}
                </p>
              </div>
            )}
            {currentIdx != getVideo3DIdx(studies) &&
              currentIdx != getVideoUpVoteIdx(studies) &&
              !(
                currentIdx === 6 &&
                (studies === "BE_PTA" || studies === "BE_APO")
              ) && (
                <Image
                  src={getImg(currentIdx, studies).uri}
                  alt={`image${currentIdx}`}
                  width={imageWidth}
                  height={imageHeight}
                  loading="lazy"
                />
              )}
            {currentIdx === getVideo3DIdx(studies) && (
              <Image
                src={`${constants.cloudfrontUrl}/tutorial/3Dnew.gif`}
                alt={`image${currentIdx}`}
                width={imageWidth}
                height={imageHeight}
                loading="lazy"
              />
            )}
            {currentIdx === getVideoUpVoteIdx(studies) && (
              <Image
                src="/assets/img/tutorial/upvote.gif"
                alt={`image${currentIdx}`}
                width={imageWidth}
                height={imageHeight}
                loading="lazy"
              />
            )}
            {currentIdx === 6 &&
              (studies === "BE_PTA" || studies === "BE_APO") && (
                <Image
                  src="/assets/img/tutorial/plant.gif"
                  alt={`image${currentIdx}`}
                  width={imageWidth}
                  height={imageHeight}
                  loading="lazy"
                />
              )}
          </>
        )}
        {currentIdx === getMaxIdx(studies) && (
          <div className="flex flex-col justify-between items-center pb-16 h-screen w-full">
            <div className="flex flex-col justify-center items-center">
              <div className="w-40 -mt-8 -mb-12">
                <Image
                  src="/assets/img/tutorial/logo.png"
                  alt="pharmazing"
                  width={1080}
                  height={1920}
                />
              </div>
              <p className="font-fontBold text-4xl font-bold mb-4 text-center">
                {text.title}
              </p>
              <p className="font-fontBold text-3xl font-bold mb-8 text-center">
                {text.description}
              </p>
              <p className="font-fontBold text-3xl font-bold text-center">
                {text.para1}
              </p>
            </div>
            <div className="flex justify-between lg:justify-around items-center w-full">
              <div className="w-32 lg:w-36">
                <Image
                  src="/assets/img/tutorial/emin.png"
                  alt="pharmazing"
                  width={776}
                  height={1072}
                />
              </div>
              <div className="flex flex-col justify-end items-start h-full">
                <p className="font-fontBold text-xl font-bold mb-2">
                  {text.para2}
                </p>
                <p className="font-fontBold text-xl font-bold mb-3">
                  Emin Karayel
                </p>
                <p className="font-fontBold text-xl font-bold">{text.para3}</p>
                <p className="font-fontBold text-xl font-bold">{text.para4}</p>
                <p className="font-fontBold text-xl font-bold">pharmazing</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorial;
