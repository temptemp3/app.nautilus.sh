import React from "react";
import styled from "styled-components";

const ListRoot = styled.div`
  display: flex;
  gap: 32px;
  flex-direction: column;
  margin-top: 64px;
`;

const Heading = styled.h3`
  font-family: Nohemi;
  font-size: 40px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: 0em;
  text-align: left;
  color: #9933ff;
  margin: 0px;
`;

const Container = styled.div`
  width: 100%;
`;

interface ListProps {
  title: string;
  children: any;
}

export const List: React.FC<ListProps> = ({ title, children }) => {
  return (
    <ListRoot>
      <Heading>{title}</Heading>
      <Container>{children}</Container>
    </ListRoot>
  );
};

export default List;
