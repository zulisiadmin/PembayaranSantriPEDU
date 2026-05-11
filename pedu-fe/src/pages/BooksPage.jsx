import { BookOpen, ExternalLink, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { ListScreen } from '../components/ListScreen';
import './BooksPage.css';

export function BooksPage() {
  const [books, setBooks] = useState([]);
  const [source, setSource] = useState('Google Drive');
  const [folderUrl, setFolderUrl] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let alive = true;
    const query = search.trim();
    const timer = window.setTimeout(async () => {
      setStatus('loading');

      try {
        const data = await apiFetch(`/santri/books${query ? `?search=${encodeURIComponent(query)}` : ''}`);
        if (!alive) return;
        setBooks(data.books || []);
        setSource(data.sourceName || 'Google Drive');
        setFolderUrl(data.folderUrl || '');
        setStatus('ready');
      } catch (error) {
        if (!alive) return;
        setBooks([]);
        setStatus(error.message || 'Internet tidak ada, mohon periksa jaringan anda.');
      }
    }, 180);

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [search]);

  const subtitle = useMemo(() => {
    if (folderUrl) return `File kitab terhubung ke ${source}, urut berdasarkan nama.`;
    return 'File kitab diarahkan ke Google Drive agar penyimpanan aplikasi tetap ringan.';
  }, [folderUrl, source]);

  return (
    <ListScreen title="Kitab" subtitle={subtitle}>
      <label className="book-search">
        <Search size={17} />
        <input
          type="search"
          placeholder="Cari nama kitab"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>

      {folderUrl && (
        <a className="drive-folder-link" href={folderUrl} target="_blank" rel="noreferrer">
          Buka folder Drive <ExternalLink size={14} />
        </a>
      )}

      {status === 'loading' && (
        <div className="book-loading" aria-label="Sedang memuat">
          <span />
          <span />
          <span />
        </div>
      )}

      {status === 'ready' && books.map((book) => (
        <article className="book-item" key={book.id || book.title}>
          <ImagePlaceholder label={book.imageAlt} />
          <div className="book-meta">
            <div className="list-icon">
              <BookOpen size={22} />
            </div>
            <div>
              <h3>{book.title}</h3>
              <p>{book.source}</p>
            </div>
            <a className="small-button" href={book.viewUrl || book.url} target="_blank" rel="noreferrer">
              Buka
            </a>
          </div>
        </article>
      ))}

      {status !== 'loading' && status !== 'ready' && (
        <div className="empty-books">{status}</div>
      )}

      {status === 'ready' && books.length === 0 && (
        <div className="empty-books">Kitab tidak ditemukan.</div>
      )}
    </ListScreen>
  );
}
