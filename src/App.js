import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AuthPageOwnerLogIn from "./Components/AuthPageOwnerLogIn";
import ViewProfile from "./Components/ViewProfile";
import OverView from "./Components/OverView";
import Notification from "./Components/Notifications";
import UserManagement from "./Components/UserManagement";
import Ground from "./Components/Ground";
import BookingHistory from "./Components/BookingHistory";
import Message from "./Components/Message";
import AddGround from "./Components/AddGround";
import RemoveGround from "./Components/RemoveGround";
import EditGround from "./Components/EditGround";
import EditSpecificGround from "./Components/EditSpecificGround";

function App() {
  return (
    <>
      <Router>
        <div className="app-container">
          <header>
            <Navbar title="Sport Spot" />
          </header>
          <AuthPageOwnerLogIn />
          <main className="content">
            <Routes>
              <OverView />
              <Route path="/overview" element={<OverView />} />
              <Route path="/viewprofile" element={<ViewProfile />} />
              <Route path="/bookinghistory" element={<BookingHistory />} />
              <Route path="/ground" element={<Ground />} />
              <Route path="/usermanagement" element={<UserManagement />} />
              <Route path="/addground" element={<AddGround />} />
              <Route path="/removeground" element={<RemoveGround />} />
              <Route path="/editground" element={<EditGround />} />
              <Route
                path="/editspecificground"
                element={<EditSpecificGround />}
              />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/message/:id" element={<Message />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
