import Header from "./components/webComponents/Header";
import Nav from "./components/webComponents/Nav";
import Footer from "./components/webComponents/Footer"
import Main from "./components/webComponents/Maincontent/Main";
import { SearchProvider } from "./components/webComponents/SearchContext";
import "./App.css";

function App() {
  return (
    <SearchProvider>
      <Header />
      <Nav />
      <Main />
      <Footer />
    </SearchProvider>
  );
}

export default App;
