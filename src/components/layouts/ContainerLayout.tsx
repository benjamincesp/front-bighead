import React from "react";
import Styles from "./stylesLayout.module.css";

const ContainerLayout = ({ children }: any) => {
  return <div className={Styles.containerPrincipal}>{children}</div>;
};

export default ContainerLayout;
