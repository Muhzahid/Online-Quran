import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { messageApi } from '../../services/messageApi';
import Loader from '../../components/loaders/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]); const [selected, setSelected] = useState(null); const [messages, setMessages] = useState([]); const [body, setBody] = useState(''); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = async () => { setLoading(true); try { const { data } = await messageApi.conversations(); setConversations(data.data.items || []); } catch (requestError) { setError(requestError.message || 'Unable to load conversations.'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const open = async (conversation) => { setSelected(conversation); try { const { data } = await messageApi.messages(conversation._id); setMessages(data.data.items || []); } catch (requestError) { toast.error(requestError.message || 'Unable to load messages.'); } };
  const send = async (event) => { event.preventDefault(); if (!body.trim() || !selected) return; try { const { data } = await messageApi.send(selected._id, body.trim()); setMessages((current) => [...current, data.data.message]); setBody(''); } catch (requestError) { toast.error(requestError.message || 'Unable to send message.'); } };
  if (loading) return <Loader message="Loading messages..." />; if (error) return <ErrorState message={error} onRetry={load} />;
  return <div><h1 className="font-display text-3xl font-semibold text-primary">Messages</h1>{!conversations.length ? <div className="mt-8"><EmptyState title="No conversations yet." description="A conversation becomes available when an administrator or teacher starts one." /></div> : <div className="mt-8 grid gap-4 md:grid-cols-[240px_1fr]"><aside className="space-y-2">{conversations.map((conversation) => <button type="button" key={conversation._id} onClick={() => open(conversation)} className="block w-full rounded-md border border-border bg-surface p-3 text-left text-sm">{conversation.participants.map((participant) => participant.name).join(', ')}</button>)}</aside><section className="rounded-md border border-border bg-surface p-4"><div className="min-h-64 space-y-3">{messages.map((message) => <p key={message._id} className="rounded-md bg-background p-3 text-sm"><strong>{message.senderId?.name}:</strong> {message.body}</p>)}</div>{selected && <form onSubmit={send} className="mt-4 flex gap-2"><input value={body} onChange={(event) => setBody(event.target.value)} className="min-w-0 flex-1 rounded-md border border-border p-2 text-sm" placeholder="Write a message" /><button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Send</button></form>}</section></div>}</div>;
}
