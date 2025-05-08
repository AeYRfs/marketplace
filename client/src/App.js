import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import Category from './pages/Category';
import ProfilePage from './pages/ProfilePage';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import './styles.css';
import './themes/lightTheme.css';
import './themes/darkTheme.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Navbar />
        <SearchBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/category/:category" component={Category} />
          <Route path="/profile/:userId" component={ProfilePage} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/admin" component={AdminDashboard} />
        </Switch>
      </Router>
    </LanguageProvider>
  );
}

export default App;