declare module 'react-fps-stats' {
  interface FPSStatsProps {
    top?: string | number
    right?: string | number
    bottom?: string | number
    left?: string | number
    graphHeight?: number
    graphWidth?: number
  }

  export default function FPSStats(props: FPSStatsProps): JSX.Element
}
