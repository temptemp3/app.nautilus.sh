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

const TableContainer = styled.div`
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
`;

const TableRow = styled.tr`
  width: 100%;
`;

const TableCell = styled.td`
  padding-left: 24px;
  padding-right: 24px;
`;

const LeftCell = styled(TableCell)``;

const RightCell = styled(TableCell)`
  @media (max-width: 960px) {
    display: none;
  }
`;

const Rank = styled.span`
  width: 16px;
  height: 22px;
  font-family: Nohemi;
  font-size: 24px;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: left;
`;

const Avatar = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 100px;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
`;

const ColectionName = styled.div`
  font-family: Inter;
  font-size: 24px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: left;
`;

const PriceDisplay = styled.span`
  font-family: Inter;
  font-size: 20px;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: left;
  width: 45px
  height: 22px
`;

const PriceText = styled.span`
  font-family: Inter;
  font-size: 20px;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: left;
  color: #717579;
`;

interface ListProps {
  title: string;
}

export const List: React.FC<ListProps> = ({ title }) => {
  return (
    <ListRoot>
      <Heading>{title}</Heading>
      <TableContainer></TableContainer>
    </ListRoot>
  );
};

export default List;
