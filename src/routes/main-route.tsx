import * as React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './protected-route';
import AdminAppLayout from '../layout';
import Profile from '../users/pages/profile';
import CVUploadInterface from '../admin/pages/resumes';
import UserProfile from '../admin/pages/user-profile';
import JobPosting from '../admin/pages/job-posts';
import Candidates from '../admin/pages/candidates';
import Settings from '../admin/pages/settings';
import Home from '../admin/pages/home';

const Authenticate = () => {
  return <Navigate to={'/admin'} />
}

const MainRoutes: React.FC<{ theme: 'dark' | 'light', inTeams: boolean }> = ({ theme, inTeams }) => {

  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>

          <Route path={inTeams ? '/tab/abc' : '/'} element={<Authenticate />} />

          <Route path='/admin' element={<AdminAppLayout />}>
            <Route index element={<Home />} />
            <Route path='candidates' index element={<Candidates />} />
            <Route path='job-posting' element={<JobPosting />} />
            <Route path='resume' element={<CVUploadInterface theme={theme} />} />
            <Route path='profile' element={<Profile />} />
            <Route path='user/:id' element={<UserProfile />} />
            <Route path='settings' element={<Settings theme={theme} />} />
            {/* <Route path='resume-hub' element={<CVScreening theme={theme} />} /> */}
          </Route>

          <Route path="*" element={<Navigate to={'/admin'} />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default MainRoutes;
