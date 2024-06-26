"use server";

import KudoCard from "../models/kudoCard.models";
import { connectToDB } from "../mongoose";

interface CreateCardParameters {
  data: CardParameters;
}

interface fetchKudoCardParameters {
  cardId: string;
}

interface AddHeartParameters {
  cardId: string;
  hearts: number;
}

type ErrorResponse = { error: string };

export async function createKudoCard({
  data,
}: CreateCardParameters): Promise<CardParameters | ErrorResponse> {
  connectToDB();

  try {
    if (data.from === "") data.from = "John Doe: The Unsung Hero";
    const createdKudoCard = await KudoCard.create(data);
    return createdKudoCard;
  } catch (error: any) {
    return { error: `Failed to create Kudo Card: ${error.message}` };
  }
}

export async function fetchKudoCards(
  choosenDate: string
): Promise<CardParameters[] | ErrorResponse> {
  connectToDB();

  try {
    const startMonth = new Date(choosenDate);
    const endMonth = new Date(choosenDate);
    endMonth.setMonth(endMonth.getMonth() + 1);
    endMonth.setDate(0);

    console.log("endMonth", endMonth);

    const startMonthUTC = startMonth.toISOString();
    const endMonthUTC = endMonth.toISOString();

    const kudoCards = await KudoCard.find({
      created: {
        $gte: startMonthUTC,
        $lt: endMonthUTC,
      },
    }).sort({ created: -1 });

    return kudoCards as CardParameters[];
  } catch (error: any) {
    return { error: `Failed to get Kudo Cards: ${error.message}` };
  }
}

export async function fetchKudoCard({
  cardId,
}: fetchKudoCardParameters): Promise<CardParameters | ErrorResponse> {
  connectToDB();

  try {
    const kudoCard = await KudoCard.findById(cardId);

    return kudoCard as CardParameters;
  } catch (error: any) {
    return { error: `Failed to get Kudo Card ${cardId}: ${error.message}` };
  }
}

export async function addHeart({
  cardId,
  hearts,
}: AddHeartParameters): Promise<number | ErrorResponse> {
  connectToDB();

  try {
    const updatedKudoCard = await KudoCard.findOneAndUpdate(
      { _id: cardId },
      {
        hearts: hearts + 1,
      }
    );

    return updatedKudoCard.hearts + 1;
  } catch (error: any) {
    return { error: `Failed to add heart: ${error.message}` };
  }
}
