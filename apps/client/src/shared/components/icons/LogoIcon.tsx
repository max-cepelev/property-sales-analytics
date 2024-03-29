export default function LogoIcon({ color = '#ffffff' }: { color?: string }) {
  return (
    <svg
      width='40px'
      height='40px'
      viewBox='0 0 50 50'
      data-name='Layer 1'
      id='Layer_1'
      xmlns='http://www.w3.org/2000/svg'
    >
      <title />
      <path
        fill={color}
        d='M43.125,4.5H6.875A2.377,2.377,0,0,0,4.5,6.875v36.25A2.377,2.377,0,0,0,6.875,45.5h36.25A2.377,2.377,0,0,0,45.5,43.125V6.875A2.377,2.377,0,0,0,43.125,4.5ZM44.5,43.125A1.377,1.377,0,0,1,43.125,44.5H6.875A1.377,1.377,0,0,1,5.5,43.125V6.875A1.377,1.377,0,0,1,6.875,5.5h36.25A1.377,1.377,0,0,1,44.5,6.875Z'
      />
      <path
        fill='#c'
        d='M40,39.5h-.375V12a2.5,2.5,0,0,0-2.5-2.5H35.5A2.5,2.5,0,0,0,33,12V39.5H28.377V22a2.5,2.5,0,0,0-2.5-2.5H24.252a2.5,2.5,0,0,0-2.5,2.5V39.5H17.129V32a2.5,2.5,0,0,0-2.5-2.5H13A2.5,2.5,0,0,0,10.5,32v7.5H10a.5.5,0,0,0,0,1H40a.5.5,0,0,0,0-1Z'
      />
      <path fill='#40e23b' d='M34,12a1.5,1.5,0,0,1,1.5-1.5h1.625a1.5,1.5,0,0,1,1.5,1.5V39.5H34Z' />
      <path
        fill='#fdef2d'
        d='M22.752,22a1.5,1.5,0,0,1,1.5-1.5h1.625a1.5,1.5,0,0,1,1.5,1.5V39.5H22.752Z'
      />
      <path
        fill='#ec1f1f'
        d='M11.5,32A1.5,1.5,0,0,1,13,30.5h1.625a1.5,1.5,0,0,1,1.5,1.5v7.5H11.5Z'
      />
      <path fill='c' d='M10,10.5h6.587a.5.5,0,0,0,0-1H10a.5.5,0,0,0,0,1Z' />
      <path fill={color} d='M10,13.415h6.587a.5.5,0,0,0,0-1H10a.5.5,0,0,0,0,1Z' />
      <path fill={color} d='M10,16.331h6.587a.5.5,0,0,0,0-1H10a.5.5,0,0,0,0,1Z' />
    </svg>
  );
}
