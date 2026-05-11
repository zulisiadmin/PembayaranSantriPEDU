import './LoadingState.css';

export function LoadingState({ rows = 3, compact = false }) {
  return (
    <div className={`loading-state ${compact ? 'compact' : ''}`} aria-label="Sedang memuat">
      <div className="loading-mark" />
      {!compact && (
        <div className="loading-lines">
          {Array.from({ length: rows }, (_, index) => <span key={index} />)}
        </div>
      )}
    </div>
  );
}
