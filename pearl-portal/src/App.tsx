import React, {useEffect, useState} from 'react';
import './App.css';
import {darkTheme, lightTheme} from "./theme";
import {useSelector} from "react-redux";
import {RootState} from "./redux/slices/rootSlice";
import {Theme, ThemeProvider} from "@mui/material";
import MainPage from "./pages/main/MainPage";
import FadeIn from "react-fade-in";
import 'ag-grid-enterprise';

const App = () => {
  const {isDarkTheme} = useSelector((state: RootState) => state.app);
  const [localTheme, setLocalTheme] = useState<Theme>(lightTheme)

  /**
   * Sets the theme on start
   */
  useEffect(() => {
      setLocalTheme(isDarkTheme ? darkTheme : lightTheme);
  }, [isDarkTheme])

  return (<>
      <ThemeProvider theme={localTheme ?? (isDarkTheme ? darkTheme : lightTheme)}>
          <FadeIn>
              <MainPage/>
          </FadeIn>
      </ThemeProvider>
  </>);
}

export default App;
