import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './components/App.css';
import LoginComponent from './components/LoginComponent';
import CharitiesDisplay from './components/CharitiesDisplay';
import UserRegistration from './components/UserRegistration';
import CharityDescription from './components/CharityDescription';
import DonationComponent from './components/DonationComponent';
import PassItForwardComponent from './components/PassItForwardComponent';
import UserProfilePage from './components/UserProfilePage';
import EditUserProfilePage from './components/EditUserProfilePage';
import EditCharityProfilePage from './components/EditCharityProfilePage';

function App() {
  return (
    <Router>
      <div>
        <section>
          <article>
            <Routes>
              <Route path="/" element={<LoginComponent />} />
              <Route
                path="/search_charities/:charity"
                element={<CharitiesDisplay />}
              />
              <Route path="/activity_feed" element={<CharitiesDisplay />} />
              <Route
                path="/search_charities"
                element={<CharitiesDisplay flag="allcharities" />}
              />
              <Route path="/register" element={<UserRegistration />} />
              {/* <Route
                path="/org_register"
                element={<OrganizationRegistration />}
              /> */}
              <Route
                path="/charities/:charityName"
                element={<CharityDescription />}
              />
              <Route
                path="/donate/:charityName"
                element={<DonationComponent />}
              />
              <Route
                path="/passitforward/:charityName"
                element={<PassItForwardComponent />}
              />
              <Route path="/user/:username" element={<UserProfilePage />} />
              <Route
                path="/user/edit/:username"
                element={<EditUserProfilePage />}
              />
              <Route
                path="/charities/edit/:orgID"
                element={<EditCharityProfilePage />}
              />
              {/* <Route path="*" exact element={<NotFound />} /> */}
            </Routes>
          </article>
        </section>
      </div>
    </Router>
  );
}

export default App;
