import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Row from './components/Row';
import { requests } from './api/tmdb';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Banner />
      <Row title="Originals" path={requests.originals} large />
      <Row title="Trending Now" path={requests.trending} />
      <Row title="Top Rated" path={requests.topRated} />
      <Row title="Action Movies" path={requests.action} />
      <Row title="Comedy Movies" path={requests.comedy} />
      <Row title="Horror Movies" path={requests.horror} />
      <Row title="Documentaries" path={requests.documentaries} />
    </div>
  );
}