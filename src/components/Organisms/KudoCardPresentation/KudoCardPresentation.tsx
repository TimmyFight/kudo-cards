"use client";

import { usePathname } from "next/navigation";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";

import { fetchKudoCard } from "@/app/lib/actions/kudoCard.actions";
import CopyToClipboard from "@/components/Atoms/CopyToClipboard/CopyToClipboard";
import Headings from "@/components/Atoms/Headings/Headings";
import Loading from "@/components/Atoms/Loading/Loading";
import Typography from "@/components/Atoms/Typography/Typography";
import KudoCard from "@/components/Molecules/KudoCard/KudoCard";

import styles from "./KudoCardPresentation.module.css";

interface Parameters {
  cardId: string;
}

const KudoCardPresentation = ({ cardId }: Parameters) => {
  const [isLoading, setIsLoading] = useState(true);
  const [kudoCardSaved, setKudoCardSaved] = useState<CardParameters | {}>({});
  const pathname = usePathname();
  const fullURL = `${window?.location?.origin}${pathname}` || "";

  const getKudoCard = async () => {
    if (cardId) {
      try {
        const kudoCard = await fetchKudoCard({ cardId: cardId });

        setKudoCardSaved(kudoCard);
      } catch (error) {
        enqueueSnackbar(error as string, {
          variant: "error",
          preventDuplicate: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getKudoCard();
  }, [cardId]);

  if (kudoCardSaved && "cardTitle" in kudoCardSaved) {
    return (
      <section className={styles.presentationContainer}>
        <Headings level={3} customClass="resetMargins">
          <>Copy the link and share the Kudo Card</>
        </Headings>
        <CopyToClipboard valueToCopy={fullURL} />
        <KudoCard kudoCard={kudoCardSaved} />
      </section>
    );
  }

  if (isLoading) {
    return (
      <section>
        <Loading />
      </section>
    );
  }

  return (
    <>
      <SnackbarProvider maxSnack={1} />
      <Typography>
        <>Kudo Card not found!</>
      </Typography>
    </>
  );
};

export default KudoCardPresentation;
