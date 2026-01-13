interface LoadingBarProps {
  active: boolean;
}

const LoadingBar = ({ active }: LoadingBarProps) => {
  if (!active) return null;

  return (
    <div className="mb-3 h-2 w-full overflow-hidden rounded bg-gray-200">
      <div className="loading-bar h-full w-1/3 rounded bg-emerald-500" />
    </div>
  );
};

export default LoadingBar;
