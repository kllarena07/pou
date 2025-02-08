import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
  
  
  body{
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    background: ${({theme}) => theme.body};
    color: ${({theme}) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;

    background-size: cover;
    background-attachment: fixed;
  }

  #gradient-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    --gradient-color-1: ${({theme}) => theme.gradientColor1};
    --gradient-color-2: ${({theme}) => theme.gradientColor2};
    --gradient-color-3: ${({theme}) => theme.gradientColor3};
    transition: --gradient-color-1 0.3s ease-in-out,
                --gradient-color-2 0.3s ease-in-out,
                --gradient-color-3 0.3s ease-in-out;
  }
`

export const lightTheme = {
    // body: `url(${lightBackgroundVideo}) no-repeat center center fixed`,
    text: '#1E1E1E',
    navBackground: "rgba(255, 255, 255, 0.30)",
    navHoverBackground: "rgba(255, 255, 255, 0.50)",
    navBorder: '#E1E1E1',
    gradientColor1: '#bedcf0',
    gradientColor2: '#4bcaf1',
    gradientColor3: '#fbfbfe',
    cardBackground: '#F9F5F3'
}
export const darkTheme = {
    //body: `url(${darkBackgroundVideo}) no-repeat center center fixed`,
    //body: '#3C516B',
    text: '#EFEFEF',
    navBackground: "rgba(30, 30, 30, 0.25)",
    navHoverBackground: "rgba(30, 30, 30, 0.30)",
    navBorder: 'rgba(249, 245, 243, 0.15)',
    gradientColor1: '#13406b',
    gradientColor2: '#25161D',
    gradientColor3: '#1b1311',
    cardBackground: '#0A0A0A'
}
    