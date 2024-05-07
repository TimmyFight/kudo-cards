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
    const createdKudoCard = await KudoCard.create(data);
    return createdKudoCard;
  } catch (error: any) {
    return { error: `Failed to create Kudo Card: ${error.message}` };
  }
}

export async function fetchKudoCards(): Promise<
  CardParameters[] | ErrorResponse
> {
  connectToDB();

  try {
    const currentDate = new Date();

    const oneMonthBefore = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate()
    );

    const oneMonthBeforeUTC = oneMonthBefore.toISOString();
    const currentDateUTC = currentDate.toISOString();

    const kudoCards = await KudoCard.find({
      created: {
        $gte: oneMonthBeforeUTC,
        $lt: currentDateUTC,
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
