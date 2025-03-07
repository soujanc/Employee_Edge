import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import { LeaveProvider } from "./contexts/LeaveContext";
import RequireAuth from "./components/RequireAuth";

import Login from "./pages/Auth/Login";
import Herosection from "./pages/Hero/Herosection";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import FeedbackForm from "./pages/Feedback/FeedbackForm";
import Profile from "./pages/Profile/Profile";
import AllEmployee from "./pages/Employee/AllEmployee";
import LeaveRequest from "./pages/Leave/LeaveRequest";
import EventsPage from "./pages/Events/Events";
import AttendancePage from "./pages/Attendence/attendence";
import PaySlip from "./pages/Payroll/PaySlip";
import NewPassword from "./pages/Auth/NewPassword";
import { EmployeeProvider } from "./contexts/EmployeeContext";
import { EventProvider } from "./contexts/EventContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { AttendanceProvider } from "./contexts/AttendanceContext";
import Layt from "./Layt";
import Logout from "./pages/Auth/logout";
// import "./App.css"

function App() {
  const [count, setCount] = useState(0);
  return (
    <AuthProvider>
      <BrowserRouter>
        <ProfileProvider>
          <LeaveProvider>
            <EmployeeProvider>
              <AttendanceProvider>
                <EventProvider>
                  <Routes>
                    <Route exact path="/" element={<Layt />}>
                      <Route index element={<Herosection />} />
                      <Route path="login" element={<Login />} />
                      <Route path="forgetPass" element={<ForgetPassword />} />
                      <Route path="newPass" element={<NewPassword />} />
                      <Route path="logout" element={<Logout />} />
                      
                      <Route path="feedback" element={
                        <RequireAuth>
                          <FeedbackForm/>
                        </RequireAuth>
                      }/>
                      <Route path="profile" element={
                        <RequireAuth>
                          <Profile />
                        </RequireAuth>
                      } />
                      <Route path="employee" element={
                        <RequireAuth>
                          <AllEmployee />
                        </RequireAuth>} />
                      <Route path="leave" element={
                        <RequireAuth>
                          <LeaveRequest />
                        </RequireAuth>} />
                      <Route path="payslip" element={
                        <RequireAuth>
                          <PaySlip />
                        </RequireAuth>} />
                      <Route path="attendence" element={
                        <RequireAuth>
                          <AttendancePage />
                        </RequireAuth>} />
                      <Route path="events" element={
                        <RequireAuth>
                          <EventsPage />
                        </RequireAuth>} />
                    </Route>
                  </Routes>
                </EventProvider>
              </AttendanceProvider>
            </EmployeeProvider>
          </LeaveProvider>
        </ProfileProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
