import './ImagePlaceholder.css';

export function ImagePlaceholder({ label = 'Gambar sementara' }) {
  return (
    <div className="image-placeholder" role="img" aria-label={label}>
      {/* <img src="/images/nama-file.jpg" alt={label} /> */}
      <span>{label}</span>
    </div>
  );
}
