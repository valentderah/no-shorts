import React from 'react';

interface SubtitleProps {
  text: string;
}

export const Subtitle: React.FC<SubtitleProps> = ({ text }) => {
  return <div className="stats-label">{text}</div>;
};

