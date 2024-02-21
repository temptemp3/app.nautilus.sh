import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../store/store";

const ListRoot = styled.div`
  padding-top: 64px;
  display: flex;
  gap: 32px;
  flex-direction: column;
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
  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );
  return (
    <ListRoot>
      <Heading
        style={{
          color: isDarkTheme ? "white" : undefined,
        }}
      >
        {title}
      </Heading>
      <Container>{children}</Container>
    </ListRoot>
  );
};

export default List;
