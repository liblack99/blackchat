import React from "react";

interface Props extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode; // Se permite recibir un nodo React como hijos
}

const Section: React.FC<Props> = ({children, ...rest}) => {
  return <section {...rest}>{children}</section>;
};

export default Section;
