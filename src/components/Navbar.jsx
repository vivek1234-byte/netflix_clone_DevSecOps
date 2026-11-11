import { useEffect, useState } from 'react';

export default function Navbar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${solid ? 'nav--solid' : ''}`}>
      <span className="nav__logo">STREAMFLIX</span>
    </nav>
  );
}