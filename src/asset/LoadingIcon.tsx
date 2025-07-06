export default function LoadingIcon() {
  return (
    <svg
      aria-label="loading"
      role="img"
      viewBox="0 0 400 300"
      width="80"
			height="90"
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg) }
            100% { transform: rotate(360deg) }
          }

            @keyframes strokeColorCycle {
            0% { stroke: #0091ff }
            17% { stroke:rgb(232, 0, 240) }
            33% { stroke:rgb(255, 221, 0) }
						50% { stroke: #0091ff }
						67% { stroke:rgb(232, 0, 240) }
            87% { stroke:rgb(255, 221, 0) }
            100% { stroke: #0091ff }
          }

          .spinner-group {
            transform-box: fill-box;
            transform-origin: center;
            animation: spin 2s linear infinite;
          }

          .stroke-animate {
            animation: strokeColorCycle 2s linear infinite;
          }
        `}
      </style>

      <g className="spinner-group">
        <path
          fill="none"
          strokeWidth={24}
          className="stroke-animate"
          d="m54 111h291c2.8 0 5 2.2 5 5v166c0 2.8-2.2 5-5 5h-291c-2.8 0-5-2.2-5-5v-166c0-2.8 2.2-5 5-5zm4 10l284 158"
        />
      </g>
    </svg>
  )
}
