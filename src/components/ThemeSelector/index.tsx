import React, { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../../store/themeSlice";
interface ThemeSelectorProps {
  children?: ReactNode;
}
const ThemeSelector: React.FC<ThemeSelectorProps> = ({ children }) => {
  const dispatch = useDispatch();
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  return <div onClick={handleToggleTheme}>{children}</div>;
};
export default ThemeSelector;
