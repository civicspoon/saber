import React from 'react';

const StackedIcons = ({ icons, sizes, colors, positions }) => {
  return (
    <div className="relative inline-block">
      {icons.map((Icon, index) => (
        <Icon
          key={index}
          className={`absolute ${index === 0 ? 'relative' : ''} ${colors[index] || ''} ${sizes[index] || ''} ${positions[index] || ''}`}
        />
      ))}
    </div>
  );
};

export default StackedIcons;
