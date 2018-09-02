export const getScreenSizeMatchMedia = (mediaQuery = '(max-width: 500px)') => {
  return window.matchMedia(mediaQuery);
};
