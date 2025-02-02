/**
 * Provides the interface for the individual routes
 * within the Routes tab of the Map controls.
 */

import { makeStyles, Box, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import { MapRoutes } from '~/components/data/MapFeatures';
import { getFilterIconURL } from '~/components/data/MapFeaturesData';
import { localizeField } from '~/components/i18n/FeatureLocalization';
import { Image } from '~/components/interface/Image';
import { setRouteDisplayed } from '~/redux/ducks/displayed';

const ICON_BORDER_IMAGE = require('../../../../images/controls/filter_border.png').default;

const useStyles = makeStyles((_theme) => ({
  iconBorder: {
    position: 'absolute',
    top: -1,
    left: -37,
    width: 79,
    height: 79,
    /* This URL MUST start with a '/' to indicate it is an absolute URL. */
    background: ({ bgImage }) => `url(${bgImage}) no-repeat`,
    backgroundSize: '100% 100%',
  },
  icon: {
    position: 'absolute',
    width: 70,
    height: 70,
    top: 2,
    left: 2,
  },
  noselect: {
    // Prevent selecting the text.
    '-webkit-touch-callout': 'none' /* iOS Safari */,
    '-webkit-user-select': 'none' /* Safari */,
    '-khtml-user-select': 'none' /* Konqueror HTML */,
    '-moz-user-select': 'none' /* Firefox */,
    '-ms-user-select': 'none' /* Internet Explorer/Edge */,
    'user-select':
      'none' /* Non-prefixed version, currently
                                    supported by Chrome and Opera */,
  },
  routeRoot: {
    // Position relative so the frame image can be positioned absolutely.
    position: 'relative',
    // Make space for the image.
    margin: '0 0 10px 37px',
    width: 'calc(100% - 43px)',
    height: 74,
    // Prevent the box getting squished.
    flexShrink: 0,

    border: '1px solid #d2c6bb',
    cursor: 'pointer',
    color: '#78583d',

    background: 'linear-gradient(270deg, #ffffff -95.11%, rgba(255, 255, 255, 0) 100%), #f0e9e2',

    // Align the text.
    padding: '0 8px 0 48px',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    fontSize: 18,
    boxSizing: 'border-box',
  },
  routeRootActive: {
    background:
      'linear-gradient(270deg, rgba(171, 143, 119, 0.5) -46.99%, rgba(143, 110, 76, 0.5) 198.5%), #ab8f77',
    color: '#f2f0ee',
  },
}));

/**
 * A button in the Filters, with the icon of a Map route on it.
 * Pressing this toggles display of that Map route.
 * @param {*} routeKey The key of the route.
 */
// Note: The dispatchers generated by mapDispatchToProps
// shadow their associated action generators.
/* eslint-disable no-shadow */
const _MapControlsRouteButton = ({ routeKey, active, setRouteDisplayed }) => {
  const classes = useStyles({ bgImage: ICON_BORDER_IMAGE });

  const mapRoute = MapRoutes[routeKey];

  // Hide button if route is not enabled.
  if (!mapRoute?.enabled ?? true) return null;

  const toggleRoute = () => {
    setRouteDisplayed(!active);
  };

  return (
    <Box
      onClick={toggleRoute}
      className={clsx(classes.routeRoot, classes.noselect, active ? classes.routeRootActive : null)}
    >
      <Box className={classes.iconBorder}>
        <Image
          className={classes.icon}
          srcPNG={getFilterIconURL(mapRoute.icons.filter, 'png')}
          srcWebP={getFilterIconURL(mapRoute.icons.filter, 'webp')}
        />
      </Box>
      <Typography>{localizeField(mapRoute.name)}</Typography>
    </Box>
  );
};

const mapStateToProps = (state, { routeKey }) => ({
  active: state?.displayed?.routes[routeKey] ?? false,
  // Adding language to the props, even if it isn't used,
  // causes the component to re-render when the language changes.
  lang: state.options.overrideLang,
});
const mapDispatchToProps = (dispatch, { routeKey }) => ({
  setRouteDisplayed: (newState) => dispatch(setRouteDisplayed(routeKey, newState)),
});
const MapControlsRouteButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlsRouteButton);

export default MapControlsRouteButton;
