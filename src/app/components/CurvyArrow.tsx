import React from 'react';

const CurvyArrow = () => {
  return (
    <div className="absolute -bottom-12 right-0 pointer-events-none w-[20rem] h-[12rem]">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 320 192"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6" />
          </marker>
        </defs>
        <path
          d="M10 10 Q 160 0, 310 192"
          stroke="#8B5CF6"
          strokeWidth="2"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
        />
        <path
          id="curve"
          d="M10 10 Q 160 0, 310 192"
          stroke="none"
          fill="none"
        />
        <text className="text-xs font-medium fill-current text-purple-300">
          <textPath href="#curve" startOffset="15%">
            Check out the demo!
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CurvyArrow;
