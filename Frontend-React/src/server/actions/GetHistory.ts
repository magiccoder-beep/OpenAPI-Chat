"use server";

import axios from "axios";
import constants from "@/constants/general";

export const GetHistory = async (token: string): Promise<any[][]> => {
  try {
    const calculateDaysDiff = (start: Date, end: Date) => {
      var differenceInMilliseconds = start.getTime() - end.getTime();
      var differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
      return differenceInDays;
    };

    const shouldAddOffset = (addedOffsets: number[], offset: number) => {
      let shouldAdd = false;
      let maxElement = Math.max(...addedOffsets);
      if (offset < 7) {
        shouldAdd = true;
      } else if (offset >= 7 && offset < 14 && maxElement < 7) {
        shouldAdd = true;
      } else if (offset >= 14 && offset < 21 && maxElement < 14) {
        shouldAdd = true;
      } else if (offset >= 21 && offset < 28 && maxElement < 21) {
        shouldAdd = true;
      } else if (offset >= 28 && offset < 30 && maxElement < 28) {
        shouldAdd = true;
      } else if (offset >= 30 && offset < 60 && maxElement < 30) {
        shouldAdd = true;
      } else if (offset >= 60 && offset < 90 && maxElement < 60) {
        shouldAdd = true;
      } else if (offset >= 90 && offset < 120 && maxElement < 90) {
        shouldAdd = true;
      } else if (offset >= 120 && offset < 150 && maxElement < 120) {
        shouldAdd = true;
      } else if (offset >= 150 && offset < 180 && maxElement < 150) {
        shouldAdd = true;
      } else if (offset >= 180 && offset < 210 && maxElement < 180) {
        shouldAdd = true;
      } else if (offset >= 210 && offset < 240 && maxElement < 210) {
        shouldAdd = true;
      } else if (offset >= 240 && offset < 270 && maxElement < 240) {
        shouldAdd = true;
      } else if (offset >= 270 && offset < 300 && maxElement < 270) {
        shouldAdd = true;
      } else if (offset >= 300 && offset < 330 && maxElement < 300) {
        shouldAdd = true;
      } else if (offset >= 330 && offset < 360 && maxElement < 330) {
        shouldAdd = true;
      } else if (offset >= 360 && maxElement < 360) {
        shouldAdd = true;
      }
      return shouldAdd;
    };

    const response = await axios.post(
      constants.urlBase + "/users/fetchHistoryQuestions",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const messages = response.data.messages;

    let messagesCopy = [];
    const offset = -(new Date().getTimezoneOffset() / 60);

    let now = new Date();
    now.setHours(now.getHours() + offset);
    let monthNow = now.getMonth() + 1;
    let dayNow = now.getDate();
    let formattedDateNow =
      now.getFullYear() +
      "-" +
      (monthNow < 10 ? "0" + monthNow : monthNow) +
      "-" +
      (dayNow < 10 ? "0" + dayNow : dayNow);
    let dateNow = new Date(formattedDateNow);
    let tempDate = new Date(formattedDateNow);
    let addedOffsets = [];

    if (messages.length > 0) {
      let tempQuestion_id = messages[0].question_id;
      let questionArray = [];
      for (let i = 0; i < messages.length; i++) {
        messages[i].id = i;
        const date = new Date(messages[i].created_at);
        date.setHours(date.getHours() + offset);

        let month = date.getMonth() + 1;
        let day = date.getDate();
        let formattedDate =
          date.getFullYear() +
          "-" +
          (month < 10 ? "0" + month : month) +
          "-" +
          (day < 10 ? "0" + day : day);
        const iDate = new Date(formattedDate);

        if (i == 0) {
          tempDate = iDate;
          messagesCopy.push([
            {
              index: 0,
              role: "date",
              content: "",
              offset: calculateDaysDiff(dateNow, tempDate),
            },
          ]);
          addedOffsets.push(offset);
        }

        messages[i].created_at = date;

        if (tempQuestion_id == messages[i].question_id) {
          questionArray.push(messages[i]);
        } else {
          messagesCopy.push(questionArray);
          questionArray = [];
          questionArray.push(messages[i]);
          tempQuestion_id = messages[i].question_id;
        }
        if (tempDate.getTime() !== iDate.getTime()) {
          tempDate = iDate;
          let offset = calculateDaysDiff(dateNow, tempDate);
          let shouldAdd = shouldAddOffset(addedOffsets, offset);
          if (shouldAdd) {
            messagesCopy.push([
              {
                role: "date",
                content: "",
                offset: offset,
                id: "offset" + offset,
              },
            ]);
            addedOffsets.push(offset);
          }
        }
      }
      if (questionArray.length > 0) {
        messagesCopy.push(questionArray);
      }
    }
    return messagesCopy;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
