import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import StudentLayout from '../layouts/StudentLayout';
import TeacherLayout from '../layouts/TeacherLayout';
import AdminLayout from '../layouts/AdminLayout';
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import CoursesPage from '../pages/public/CoursesPage';
import CourseDetailsPage from '../pages/public/CourseDetailsPage';
import TeachersPage from '../pages/public/TeachersPage';
import TeacherDetailsPage from '../pages/public/TeacherDetailsPage';
import PricingPage from '../pages/public/PricingPage';
import HowItWorksPage from '../pages/public/HowItWorksPage';
import TrialClassPage from '../pages/public/TrialClassPage';
import ContactPage from '../pages/public/ContactPage';
import FaqPage from '../pages/public/FaqPage';
import BlogPage from '../pages/public/BlogPage';
import BlogPostPage from '../pages/public/BlogPostPage';
import PrivacyPolicyPage from '../pages/public/PrivacyPolicyPage';
import TermsPage from '../pages/public/TermsPage';
import PlaceholderPage from '../pages/public/PlaceholderPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import {
  AdminRoute,
  PublicOnlyRoute,
  StudentRoute,
  TeacherRoute,
} from './ProtectedRoutes';
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentProfilePage from '../pages/student/StudentProfilePage';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherProfilePage from '../pages/teacher/TeacherProfilePage';
import TeacherAvailabilityPage from '../pages/teacher/TeacherAvailabilityPage';
import TeacherQualificationsPage from '../pages/teacher/TeacherQualificationsPage';
import TeacherTrialClassesPage from '../pages/teacher/TeacherTrialClassesPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import TeacherApplicationsPage from '../pages/admin/TeacherApplicationsPage';
import AdminBookingsPage from '../pages/admin/AdminBookingsPage';
import ClassesPage from '../pages/common/ClassesPage';
import AssignmentsPage from '../pages/common/AssignmentsPage';
import ProgressPage from '../pages/student/ProgressPage';
import NotificationsPage from '../pages/common/NotificationsPage';
import AdminCoursesPage from '../pages/admin/AdminCoursesPage';
import AdminTeachersPage from '../pages/admin/AdminTeachersPage';
import AdminStudentsPage from '../pages/admin/AdminStudentsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminContactMessagesPage from '../pages/admin/AdminContactMessagesPage';
import PaymentsPage from '../pages/student/PaymentsPage';
import MessagesPage from '../pages/common/MessagesPage';
import SettingsPage from '../pages/common/SettingsPage';

function Page({ title }) {
  return <PlaceholderPage title={title} />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:slug" element={<CourseDetailsPage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="teachers/:id" element={<TeacherDetailsPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="trial-class" element={<TrialClassPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms-and-conditions" element={<TermsPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      <Route path="/student" element={<StudentRoute />}>
        <Route element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="courses" element={<Page title="My Courses" />} />
          <Route path="teachers" element={<Page title="My Teachers" />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="calendar" element={<Page title="Calendar" />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="attendance" element={<Page title="Attendance" />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="reviews" element={<Page title="Reviews" />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/teacher" element={<TeacherRoute />}>
        <Route element={<TeacherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="profile" element={<TeacherProfilePage />} />
          <Route path="qualifications" element={<TeacherQualificationsPage />} />
          <Route path="availability" element={<TeacherAvailabilityPage />} />
          <Route path="students" element={<Page title="Students" />} />
          <Route path="trial-classes" element={<TeacherTrialClassesPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="calendar" element={<Page title="Calendar" />} />
          <Route path="attendance" element={<Page title="Attendance" />} />
          <Route path="progress" element={<Page title="Progress" />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="reviews" element={<Page title="Reviews" />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudentsPage />} />
          <Route path="teachers" element={<AdminTeachersPage />} />
          <Route
            path="teacher-applications"
            element={<TeacherApplicationsPage />}
          />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="classes" element={<Page title="Classes" />} />
          <Route path="payments" element={<Page title="Payments" />} />
          <Route path="subscriptions" element={<Page title="Subscriptions" />} />
          <Route path="reviews" element={<Page title="Reviews" />} />
          <Route path="contact-messages" element={<AdminContactMessagesPage />} />
          <Route path="blog" element={<Page title="Blog Management" />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Page title="Page Not Found" />} />
    </Routes>
  );
}
