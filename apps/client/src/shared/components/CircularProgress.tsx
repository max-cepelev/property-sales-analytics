interface Props {
  sqSize: number;
  strokeWidth: number;
  percentage: number;
  color: string;
  fontSize?: number | string;
}

export default function CircularProgress({
  sqSize,
  strokeWidth,
  percentage,
  color = 'red',
  fontSize = 15,
}: Props) {
  const radius = (sqSize - strokeWidth) / 2;

  const viewBox = `0 0 ${sqSize} ${sqSize}`;

  const dashArray = radius * Math.PI * 2;

  const dashOffset = dashArray - (dashArray * percentage) / 100;

  return (
    <svg width={sqSize} height={sqSize} viewBox={viewBox}>
      <circle
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        fill='none'
        stroke='#ddd'
        strokeWidth={`${strokeWidth}px`}
      />
      <circle
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={`${strokeWidth}px`}
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        stroke={color}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
          transition: 'stroke-dashoffset 1s linear',
        }}
      />
      <text
        x='50%'
        y='50%'
        dy='.3em'
        textAnchor='middle'
        fontSize={fontSize}
        fontWeight={'bold'}
        fill={color}
      >
        {`${percentage}%`}
      </text>
    </svg>
  );
}
