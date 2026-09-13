import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { courseService, teacherService } from '../../services/contentService';
import { bookingApi } from '../../services/bookingApi';
import Loader from '../../components/loaders/Loader';

const steps = ['Course', 'Teacher', 'Date & Time', 'Confirm'];

export default function TrialClassPage() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [courseId, setCourseId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, tRes] = await Promise.all([
          courseService.list({ limit: 50 }),
          teacherService.list({ limit: 50 }),
        ]);
        setCourses(cRes.data.data.items || []);
        setTeachers(tRes.data.data.items || []);
      } catch (err) {
        toast.error(err.message || 'Unable to load booking options');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!teacherId || !date) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }
    const loadSlots = async () => {
      if (!isAuthenticated) return;
      setSlotsLoading(true);
      try {
        const { data } = await bookingApi.getSlots({ teacherId, date });
        setSlots(data.data.slots || []);
        setSelectedSlot(null);
      } catch (err) {
        toast.error(err.message || 'Unable to load slots');
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    loadSlots();
  }, [teacherId, date, isAuthenticated]);

  const selectedCourse = useMemo(
    () => courses.find((c) => c._id === courseId),
    [courses, courseId]
  );
  const selectedTeacher = useMemo(
    () => teachers.find((t) => t._id === teacherId),
    [teachers, teacherId]
  );

  const canNext =
    (step === 0 && courseId) ||
    (step === 1 && teacherId) ||
    (step === 2 && date && selectedSlot) ||
    step === 3;

  const onSubmit = async () => {
    if (!isAuthenticated) {
      toast.info('Please login as a student to book a trial');
      navigate('/login', { state: { from: { pathname: '/trial-class' } } });
      return;
    }
    if (user?.role !== 'student') {
      toast.error('Only students can book trial classes');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await bookingApi.create({
        teacherId,
        courseId,
        date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        type: 'trial',
        notes,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      toast.success(data.message || 'Trial booked');
      navigate('/student/classes');
    } catch (err) {
      toast.error(err.message || 'Unable to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading trial booking..." />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-primary">
        Book a Free Trial
      </h1>
      <p className="mt-2 text-text-muted">
        Select a course, teacher, and available time slot.
      </p>

      <ol className="mt-8 flex flex-wrap gap-3 text-sm">
        {steps.map((label, index) => (
          <li
            key={label}
            className={`rounded-md px-3 py-1 ${
              index === step
                ? 'bg-primary text-white'
                : index < step
                  ? 'bg-primary/10 text-primary'
                  : 'bg-border/40 text-text-muted'
            }`}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="mt-8">
        {step === 0 && (
          <div className="space-y-3">
            {courses.map((course) => (
              <label
                key={course._id}
                className={`flex cursor-pointer items-start gap-3 border p-4 ${
                  courseId === course._id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="course"
                  checked={courseId === course._id}
                  onChange={() => setCourseId(course._id)}
                />
                <span>
                  <span className="block font-medium">{course.title}</span>
                  <span className="text-sm text-text-muted">
                    {course.shortDescription}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            {teachers.map((teacher) => (
              <label
                key={teacher._id}
                className={`flex cursor-pointer items-start gap-3 border p-4 ${
                  teacherId === teacher._id
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="teacher"
                  checked={teacherId === teacher._id}
                  onChange={() => setTeacherId(teacher._id)}
                />
                <span>
                  <span className="block font-medium">
                    {teacher.userId?.name}
                  </span>
                  <span className="text-sm text-text-muted">
                    {(teacher.specialization || []).join(', ')} · $
                    {teacher.hourlyRate}/hr · {teacher.country}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {!isAuthenticated && (
              <p className="rounded-md border border-secondary/40 bg-secondary/10 p-3 text-sm">
                <Link to="/login" className="font-medium text-primary underline">
                  Login as a student
                </Link>{' '}
                to view available slots and complete booking.
              </p>
            )}
            <div>
              <label htmlFor="date" className="mb-1 block text-sm font-medium">
                Date
              </label>
              <input
                id="date"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
            {slotsLoading && <Loader message="Loading available times..." />}
            {!slotsLoading && date && isAuthenticated && (
              <div className="flex flex-wrap gap-2">
                {slots.length === 0 ? (
                  <p className="text-sm text-text-muted">
                    No available slots on this date.
                  </p>
                ) : (
                  slots.map((slot) => (
                    <button
                      key={`${slot.startTime}-${slot.endTime}`}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-md border px-3 py-2 text-sm ${
                        selectedSlot?.startTime === slot.startTime
                          ? 'border-primary bg-primary text-white'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {slot.startTime} – {slot.endTime}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 rounded-md border border-border bg-surface p-5 text-sm">
            <p>
              <strong>Course:</strong> {selectedCourse?.title}
            </p>
            <p>
              <strong>Teacher:</strong> {selectedTeacher?.userId?.name}
            </p>
            <p>
              <strong>Date:</strong> {date}
            </p>
            <p>
              <strong>Time:</strong> {selectedSlot?.startTime} –{' '}
              {selectedSlot?.endTime}
            </p>
            <div>
              <label htmlFor="notes" className="mb-1 block font-medium">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="rounded-md border border-border px-4 py-2 text-sm"
          >
            Back
          </button>
        )}
        {step < 3 && (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStep((s) => s + 1)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Continue
          </button>
        )}
        {step === 3 && (
          <button
            type="button"
            disabled={submitting}
            onClick={onSubmit}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        )}
      </div>
    </div>
  );
}
