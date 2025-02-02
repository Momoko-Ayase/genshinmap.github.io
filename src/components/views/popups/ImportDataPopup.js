/**
 * Provides the interface for the popup which displays
 * when clicking "Import Data" or "Import Legacy Data" in the Options tab of the map controls.
 */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
} from '@material-ui/core';

import { t } from '~/components/i18n/Localization';
import { clearImportError } from '~/redux/ducks/error';
import { InputTextArea } from '~/components/interface/Input';
import DialogTitle from '~/components/views/popups/DialogTitle';
import { SafeHTML } from '~/components/Util';

const useStyles = makeStyles({
  dialog: {
    backgroundColor: '#f0e9e2',
  },
});

const _ImportDataPopup = ({
  title,
  content,
  contentSupports, // Leave null to avoid displaying.
  bookmarklet = '',
  onConfirm,
  trigger,
  error = '',
  clearError,
}) => {
  const [textarea, setTextarea] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const classes = useStyles();
  const closePopup = () => {
    clearError();
    setIsDialogOpen(false);
  };

  const onClickConfirm = () => {
    const success = onConfirm(textarea);

    if (success) closePopup();
  };
  return (
    <div>
      {React.cloneElement(trigger, { onClick: () => setIsDialogOpen(true) })}
      <Dialog
        PaperProps={{ className: classes.dialog }}
        open={isDialogOpen}
        fullWidth
        maxWidth="lg"
        onClose={() => {
          clearError();
          setIsDialogOpen(false);
        }}
      >
        <DialogTitle onClose={() => setIsDialogOpen(false)}>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <SafeHTML>{content}</SafeHTML>
            {contentSupports && <SafeHTML>{contentSupports}</SafeHTML>}
            {bookmarklet !== '' ? (
              <>
                <SafeHTML>{t('bookmarklet-content')}</SafeHTML>
                <a href={bookmarklet}>{t('bookmarklet-click-link')}</a>
              </>
            ) : null}
          </DialogContentText>
          <InputTextArea
            text={textarea}
            onChange={(value) => setTextarea(value)}
            fullWidth
            error={error !== ''}
            helperText={error !== '' ? error : t('paste-here')}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="large"
            color="primary"
            aria-label={t('cancel')}
            tabIndex={0}
            onClick={closePopup}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            aria-label={t('confirm')}
            tabIndex={0}
            onClick={onClickConfirm}
          >
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  error: state.importError,
});
const mapDispatchToProps = (dispatch) => ({
  clearError: () => dispatch(clearImportError()),
});
const ImportDataPopup = connect(mapStateToProps, mapDispatchToProps)(_ImportDataPopup);

export default ImportDataPopup;
