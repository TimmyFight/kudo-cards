import StrongText from "@/components/Atoms/StrongText/StrongText";
import Typography from "@/components/Atoms/Typography/Typography";
import { quots } from "@/constants/index";

import styles from "./BottomBar.module.css";

const BottomBar = () => {
  return (
    <footer className={styles.bottomBar}>
      <section className={styles.carouselContainer}>
        {quots.map((quot) => (
          <Typography customClass="textCenter" key={quot.sentence}>
            <>
              <StrongText>{`"`}</StrongText>
              {quot.sentence}
              <StrongText>{`" - ${quot.author}`}</StrongText>
            </>
          </Typography>
        ))}
      </section>
    </footer>
  );
};

export default BottomBar;
