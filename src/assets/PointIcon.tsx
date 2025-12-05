import * as React from 'react';

const PointIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} fill="#000000" viewBox="0 0 32 32" version="1.1" width="20" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {' '}
        <title>point</title>{' '}
        <path d="M16 4.686l-11.314 11.314 11.314 11.314 11.314-11.314-11.314-11.314zM10.343 16l5.657-5.657 5.657 5.657-5.657 5.657-5.657-5.657z"></path>{' '}
      </g>
    </svg>
  );
};

export default PointIcon;
