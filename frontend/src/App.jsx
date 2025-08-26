import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Verify from "./pages/auth/Verify.jsx";
import Footer from "./components/Footer";
import About from "./pages/About";
import Account from "./Pages/Account";
import { userData } from "./Context/UserContext.jsx";
import Loading from "./components/Loading";
import Courses from "./pages/Courses";
import CourseDescription from "./Pages/CourseDescription";
import PaymentSuccess from "./pages/PaymentSuccess";
import { Dashboard } from "./Pages/dashboard/Dashboard.jsx";
import CourseStudy from "./Pages/coursestudy/CourseStudy.jsx";
import Lecture from "./Pages/lecture/Lecture.jsx";
import AdminDashboard from "./admin/dashboard/AdminDashboard.jsx";
import AdminCourses from "./admin/Courses/AdminCourses.jsx";
import AdminUser from "./admin/users/AdminUser.jsx";
import  {ForgotPassword}  from "./Pages/auth/ForgotPassword.jsx";
import  ResetPassword  from "./Pages/auth/ResetPassword.jsx";
import Playground from "./Pages/Playground";
import ProfessionalCareer from "./Pages/professionalCareer/ProfessionalCareer.jsx";


const App = () => {
  const { isAuth, user, loading } = userData();
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Header isAuth={isAuth} />
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/career" element={<ProfessionalCareer />} />


            <Route path="/courses" element={<Courses />} />
            <Route
              path="/account"
              element={isAuth ? <Account user={user} /> : <Login />}
            />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/register"
              element={isAuth ? <Home /> : <Register />}
            />
            <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
             <Route path="/forgot" element={isAuth ? <Home /> : <ForgotPassword />} />
              <Route
              path="/reset-password/:token"
              element={isAuth ? <Home /> : <ResetPassword />}
            />
           
            <Route
              path="/course/:id"
              element={isAuth ? <CourseDescription user={user} /> : <Login />}
            />
            <Route
              path="/payment-success/:id"
              element={isAuth ? <PaymentSuccess user={user}/> : <Login />}
            />
            <Route
              path="/:id/dashboard"
              element={isAuth ? <Dashboard user={user} /> : <Login />}
            />
             <Route
              path="/course/study/:id"
              element={isAuth ? <CourseStudy user={user} /> : <Login />}
            />
            <Route
              path="/lectures/:id"
              element={isAuth ? <Lecture user={user} /> : <Login />}
            />
              <Route
              path="/admin/dashboard"
              element={isAuth ? < AdminDashboard user={user} /> : <Login />}
            />
             <Route
              path="/admin/course"
              element={isAuth ? <AdminCourses user={user} /> : <Login />}
            />
            <Route
              path="/admin/users"
              element={isAuth ? <AdminUser user={user} /> : <Login />}
            />
            </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
