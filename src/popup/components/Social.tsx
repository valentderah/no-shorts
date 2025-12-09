import React from 'react';
import { TELEGRAM_LINK } from '../../constants';

export const Social: React.FC = () => {
  return (
    <a
      href={TELEGRAM_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="telegram-link"
      aria-label="Telegram"
    >
      <img src="popup/icons/telegram.svg" alt="Telegram" width="26" height="26" />
    </a>
  );
};

