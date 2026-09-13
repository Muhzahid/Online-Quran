import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { APP_NAME, APP_TAGLINE } from '../../constants';
import { courseService, teacherService } from '../../services/contentService';
import CourseCard from '../../components/cards/CourseCard';
import TeacherCard from '../../components/cards/TeacherCard';
import Loader from '../../components/loaders/Loader';

const stats = [
  { label: 'Students taught', value: '12,000+' },
  { label: 'Certified teachers', value: '180+' },
  { label: 'Countries served', value: '40+' },
  { label: 'Trial satisfaction', value: '98%' },
];

const steps = [
  { title: 'Choose a course', text: 'Pick the path that matches your level and goals.' },
  { title: 'Book a free trial', text: 'Meet a verified teacher and experience a live class.' },
  { title: 'Learn with structure', text: 'Follow lessons, track progress, and grow consistently.' },
];

const reasons = [
  'Verified Quran teachers with admin approval',
  'Flexible scheduling across timezones',
  'Progress tracking for reading, Tajweed, and Hifz',
  'Secure messaging and class reminders',
];

const faqs = [
  {
    q: 'Is the trial class really free?',
    a: 'Yes. You can book one free trial class to meet a teacher and explore our platform.',
  },
  {
    q: 'Do you teach kids and adults?',
    a: 'Yes. We offer dedicated kids and adults programs with age-appropriate teaching methods.',
  },
  {
    q: 'What meeting tools do you use?',
    a: 'Teachers share secure Google Meet or Zoom links for each class.',
  },
];

const plans = [
  { name: 'Basic', classes: '2 classes/week', price: 39 },
  { name: 'Standard', classes: '3 classes/week', price: 59, featured: true },
  { name: 'Premium', classes: '5 classes/week', price: 89 },
];

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, teacherRes] = await Promise.all([
          courseService.list({ limit: 6 }),
          teacherService.list({ limit: 3 }),
        ]);
        setCourses(courseRes.data.data.items || []);
        setTeachers(teacherRes.data.data.items || []);
      } catch {
        setCourses([]);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f5f1e8] via-[#fffdf8] to-[#dce8df]">
        <div className="absolute -right-32 top-16 h-96 w-96 rounded-full border border-secondary/20" />
        <div className="absolute -right-20 top-28 h-72 w-72 rounded-full border border-secondary/20" />
        <div className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-6xl font-semibold leading-[0.9] tracking-tight text-primary sm:text-7xl lg:text-8xl"
          >
            {APP_NAME}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl font-display text-2xl text-text sm:text-3xl"
          >
            {APP_TAGLINE}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-xl text-base text-text-muted sm:text-lg"
          >
            Personalized online Quran classes with verified teachers — from Noorani
            Qaida to Tajweed and Memorization.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              to="/trial-class"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Book Free Trial
            </Link>
            <Link
              to="/courses"
              className="rounded-md border border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              Explore Courses
            </Link>
          </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md lg:ml-auto"
          >
            <div className="absolute -inset-4 rounded-[2rem] border border-secondary/40" />
            <div className="relative overflow-hidden rounded-[1.5rem] bg-primary p-3 shadow-[0_24px_70px_rgba(23,79,59,0.22)]">
              <img
                src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=85"
                alt="Open Quran beside prayer beads"
                className="aspect-[4/5] w-full rounded-[1.1rem] object-cover opacity-90"
              />
              <div className="absolute inset-x-8 bottom-8 rounded-xl border border-white/20 bg-primary/85 p-5 text-white backdrop-blur-md">
                <p className="font-display text-2xl">A calmer way to learn.</p>
                <p className="mt-1 text-sm text-white/70">Live guidance. Lasting practice.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-semibold text-primary">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold text-primary">
              Quran courses
            </h2>
            <p className="mt-2 text-text-muted">
              Structured programs for every age and level.
            </p>
          </div>
          <Link to="/courses" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <Loader message="Loading courses..." />
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold">How it works</h2>
          <p className="mt-2 max-w-xl text-white/80">
            Three simple steps to begin your Quran journey.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title}>
                <p className="font-display text-4xl text-secondary-light">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-2xl">{step.title}</h3>
                <p className="mt-2 text-sm text-white/80">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-primary">
          Why choose us
        </h2>
        <p className="mt-2 max-w-xl text-text-muted">
          Built for serious learning with care for families and adult learners.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {reasons.map((reason) => (
            <li
              key={reason}
              className="border-l-4 border-secondary pl-4 text-sm text-text"
            >
              {reason}
            </li>
          ))}
        </ul>
      </section>

      {/* Featured teachers */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold text-primary">
                Featured teachers
              </h2>
              <p className="mt-2 text-text-muted">
                Learn from approved, experienced instructors.
              </p>
            </div>
            <Link
              to="/teachers"
              className="text-sm font-medium text-primary hover:underline"
            >
              Browse teachers
            </Link>
          </div>
          {loading ? (
            <Loader message="Loading teachers..." />
          ) : (
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {teachers.map((teacher) => (
                <TeacherCard key={teacher._id} teacher={teacher} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-primary">
          Quran learning benefits
        </h2>
        <p className="mt-2 max-w-2xl text-text-muted">
          Strengthen your recitation, deepen understanding, and build a lasting
          daily connection with the Quran — at home, on your schedule.
        </p>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-primary">
            Testimonials
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <blockquote className="text-text">
              <p className="font-display text-2xl leading-relaxed">
                “My daughter looks forward to every class. The teachers are patient
                and truly skilled.”
              </p>
              <footer className="mt-4 text-sm text-text-muted">— Fatima, Parent</footer>
            </blockquote>
            <blockquote className="text-text">
              <p className="font-display text-2xl leading-relaxed">
                “I restarted Quran as an adult and finally feel confident with
                Tajweed.”
              </p>
              <footer className="mt-4 text-sm text-text-muted">— Yusuf, Student</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-primary">Pricing</h2>
        <p className="mt-2 text-text-muted">
          Simple plans that grow with your learning pace.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border p-6 ${
                plan.featured
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-surface'
              }`}
            >
              <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
              <p className={`mt-1 text-sm ${plan.featured ? 'text-white/80' : 'text-text-muted'}`}>
                {plan.classes}
              </p>
              <p className="mt-6 font-display text-4xl font-semibold">
                ${plan.price}
                <span className="text-base font-body font-normal">/mo</span>
              </p>
              <Link
                to="/pricing"
                className={`mt-6 inline-block rounded-md px-4 py-2 text-sm font-semibold ${
                  plan.featured
                    ? 'bg-white text-primary'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-primary">FAQ</h2>
          <div className="mt-8 space-y-6">
            {faqs.map((item) => (
              <details key={item.q} className="group border-b border-border pb-4">
                <summary className="cursor-pointer list-none font-medium text-text">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-text-muted">{item.a}</p>
              </details>
            ))}
          </div>
          <Link to="/faq" className="mt-6 inline-block text-sm text-primary hover:underline">
            More questions
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-semibold text-white">
              Ready to begin?
            </h2>
            <p className="mt-2 text-white/80">
              Book your free trial class and meet your teacher today.
            </p>
          </div>
          <Link
            to="/trial-class"
            className="rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary-dark"
          >
            Book Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
