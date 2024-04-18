import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate("/")}>Baecomm Rallyz</Logo>
    </HeaderContainer>
  );
};

export default Header;

export const HeaderContainer = styled.section`
  position: sticky;
  top: 0;
  z-index: 30;
  background-color: rgb(66, 66, 66);
  width: 100vw;
  height: 60px;
  padding: 0px 20px;
  display: flex;
  justify-content: start;
  align-items: center;
`;

export const Logo = styled.button`
  padding: 5px 10px;
  color: white;
  font-size: 20px;
  font-weight: 600;
`;
