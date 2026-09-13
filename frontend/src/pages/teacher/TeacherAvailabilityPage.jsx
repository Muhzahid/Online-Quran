import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { teacherApi } from '../../services/teacherApi';
import Loader from '../../components/loaders/Loader';
import ErrorState from '../../components/common/ErrorState';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const emptyWeek = () =>
  DAYS.map((day) => ({
    day,
    startTime: '18:00',
    endTime: '21:00',
    isOff: false,
  }));

export default function TeacherAvailabilityPage() {
  const [slots, setSlots] = useState(emptyWeek());
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await teacherApi.getMyProfile();
      const teacher = data.data.teacher;
      setTimezone(teacher.timezone || timezone);
      if (teacher.availability?.length) {
        const mapped = DAYS.map((day) => {
          const existing = teacher.availability.find((s) => s.day === day);
          return (
            existing || {
              day,
              startTime: '18:00',
              endTime: '21:00',
              isOff: true,
            }
          );
        });
        setSlots(mapped);
      }
    } catch (err) {
      setError(err.message || 'Unable to load availability.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateSlot = (day, field, value) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.day === day ? { ...slot, [field]: value } : slot
      )
    );
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await teacherApi.updateAvailability({ availability: slots, timezone });
      toast.success('Availability saved');
    } catch (err) {
      toast.error(err.message || 'Unable to save availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading availability..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-primary">
        Weekly Availability
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Set your teaching hours. Overlapping slots are blocked by the server.
      </p>

      <div className="mt-6">
        <label htmlFor="timezone" className="mb-1 block text-sm font-medium">
          Timezone
        </label>
        <input
          id="timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full max-w-md rounded-md border border-border bg-surface px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-8 space-y-4">
        {slots.map((slot) => (
          <div
            key={slot.day}
            className="grid items-center gap-3 border-b border-border pb-4 sm:grid-cols-[120px_1fr_1fr_auto]"
          >
            <p className="font-medium capitalize">{slot.day}</p>
            <input
              type="time"
              value={slot.startTime}
              disabled={slot.isOff}
              onChange={(e) => updateSlot(slot.day, 'startTime', e.target.value)}
              className="rounded-md border border-border px-3 py-2 text-sm disabled:opacity-40"
              aria-label={`${slot.day} start`}
            />
            <input
              type="time"
              value={slot.endTime}
              disabled={slot.isOff}
              onChange={(e) => updateSlot(slot.day, 'endTime', e.target.value)}
              className="rounded-md border border-border px-3 py-2 text-sm disabled:opacity-40"
              aria-label={`${slot.day} end`}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={slot.isOff}
                onChange={(e) => updateSlot(slot.day, 'isOff', e.target.checked)}
              />
              OFF
            </label>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="mt-8 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save Availability'}
      </button>
    </div>
  );
}
