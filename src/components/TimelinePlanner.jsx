import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CheckCircle2, Circle, Clock, Plus, Trash2, Sparkles,
  Copy, Check, X, ListChecks, CalendarDays,
  AlertTriangle, RefreshCw
} from 'lucide-react';
import { getStoredApiKey } from '../services/storageService';

// Predefined Milestone templates based on event category
const DEFAULT_TIMELINE_TEMPLATES = {
  Marriage: [
    { offsetDays: -180, title: 'Finalize Wedding Venue & Auspicious Muhurat', category: 'Venue', priority: 'High', notes: 'Lock dates, sign contract, pay advance deposit.' },
    { offsetDays: -120, title: 'Book Photographer & Cinematic Videographer', category: 'Media', priority: 'High', notes: 'Review portfolios; book drone and candid photo crew.' },
    { offsetDays: -90, title: 'Send Save-the-Dates & Multilingual AI Invitations', category: 'Invitations', priority: 'Medium', notes: 'Design cards in Card Studio and share digital passes.' },
    { offsetDays: -60, title: 'Curate Banquet Menu & Food Tasting Session', category: 'Catering', priority: 'High', notes: 'Select appetizers, live chaat counter, traditional sweets.' },
    { offsetDays: -45, title: 'Bridal & Groom Attire Fittings', category: 'Attire', priority: 'Medium', notes: 'Schedule second fitting and coordinate matching accessories.' },
    { offsetDays: -30, title: 'Confirm Sangeet Choreography & DJ Playlist', category: 'Music', priority: 'Medium', notes: 'Finalize family dance performances and anchor script.' },
    { offsetDays: -14, title: 'RSVP Headcount & Seating Arrangements', category: 'Logistics', priority: 'High', notes: 'Confirm final plate count with banquet caterer.' },
    { offsetDays: -3, title: 'Mehendi & Haldi Prep Rehearsal', category: 'Rituals', priority: 'High', notes: 'Arrange floral jewellery, organic heena cones & seating.' },
    { offsetDays: 0, title: 'The Wedding Day: Sacred Pheras & Royal Banquet', category: 'Ceremony', priority: 'High', notes: 'Ensure garland exchanges, mandap items, and priest arrival.' }
  ],
  Birthday: [
    { offsetDays: -30, title: 'Choose Theme & Book Celebration Venue', category: 'Venue', priority: 'High', notes: 'Confirm party hall or cafe capacity and audio setup.' },
    { offsetDays: -21, title: 'Send Digital AI Invitations via Card Studio', category: 'Invitations', priority: 'High', notes: 'Collect RSVPs and dietary preferences.' },
    { offsetDays: -14, title: 'Order Custom Theme Cake & Sweet Treats', category: 'Cake', priority: 'Medium', notes: 'Confirm flavor, weight, custom topper & delivery time.' },
    { offsetDays: -10, title: 'Hire Magician / Entertainer & Plan Games', category: 'Entertainment', priority: 'Medium', notes: 'Prepare music playlist and game prizes.' },
    { offsetDays: -5, title: 'Assemble Return Gifts / Goodie Bags', category: 'Favors', priority: 'Low', notes: 'Pack personalized treats and thank-you notes.' },
    { offsetDays: -1, title: 'Balloon Arch Setup & Decor Placement', category: 'Decor', priority: 'High', notes: 'Hang welcome banner and photobooth props.' },
    { offsetDays: 0, title: 'Party Day: Cake Cutting & Celebration', category: 'Event', priority: 'High', notes: 'Welcome guests, capture video, cut cake and celebrate!' }
  ],
  Community: [
    { offsetDays: -60, title: 'Secure Grounds Permission & Local Permits', category: 'Permits', priority: 'High', notes: 'Submit municipal and police safety paperwork.' },
    { offsetDays: -45, title: 'Mobilize Volunteers & Committee Leads', category: 'Volunteers', priority: 'High', notes: 'Assign logistics, stage management, and safety teams.' },
    { offsetDays: -30, title: 'Contract Stage, Sound System & Lighting Crew', category: 'Production', priority: 'High', notes: 'Ensure backup generators and sound checks are scheduled.' },
    { offsetDays: -20, title: 'Community Outreach & Digital Campaign', category: 'Marketing', priority: 'Medium', notes: 'Share flyers across community noticeboards and WhatsApp.' },
    { offsetDays: -7, title: 'Finalize Food Stalls & Drinking Water Points', category: 'Catering', priority: 'High', notes: 'Confirm hygiene compliance and waste disposal bins.' },
    { offsetDays: -1, title: 'Venue Walkthrough, Seating & Signage Inspection', category: 'Setup', priority: 'High', notes: 'Check emergency exits, first-aid tent and registration desk.' },
    { offsetDays: 0, title: 'Community Gala Opening & Main Stage Programs', category: 'Live', priority: 'High', notes: 'Deliver welcome address, oversee schedule and prize distributions.' }
  ],
  Diwali: [
    { offsetDays: -21, title: 'Home Deep Cleaning & Decor Shopping', category: 'Prep', priority: 'Medium', notes: 'Procure brass diyas, torans, and festive fairy lights.' },
    { offsetDays: -14, title: 'Order Signature Mithai & Dry Fruit Gift Hampers', category: 'Gifts', priority: 'High', notes: 'Pre-order sweets to avoid festival rush.' },
    { offsetDays: -7, title: 'Send Festive Greetings via AI Card Studio', category: 'Invitations', priority: 'Medium', notes: 'Invite relatives and close friends for Lakshmi Pujan.' },
    { offsetDays: -2, title: 'Craft Rangoli & Setup Deepotsav Altar', category: 'Decor', priority: 'High', notes: 'Lay out fresh flower rangoli and light auspicious lamps.' },
    { offsetDays: 0, title: 'Lakshmi Pujan, Feast & Sparklers Celebration', category: 'Pooja', priority: 'High', notes: 'Chant evening prayers, distribute prasad, and celebrate.' }
  ],
  Corporate: [
    { offsetDays: -60, title: 'Confirm Keynote Speakers & Symposium Agenda', category: 'Agenda', priority: 'High', notes: 'Send speaker briefs and confirm topic alignments.' },
    { offsetDays: -45, title: 'Delegate Registration & Ticketing Portal Launch', category: 'Registrations', priority: 'High', notes: 'Publish early-bird invites and schedule reminders.' },
    { offsetDays: -20, title: 'AV Rehearsal, Stage Backdrop & Brand Swag', category: 'Branding', priority: 'Medium', notes: 'Print delegate badges, sponsor banners and lanyards.' },
    { offsetDays: -7, title: 'Finalize Catering Menus & Networking Cocktail', category: 'Catering', priority: 'Medium', notes: 'Confirm dietary requirements with banquet head.' },
    { offsetDays: 0, title: 'Summit Kickoff: Keynotes, Panels & Awards Gala', category: 'Summit', priority: 'High', notes: 'Run schedule on time, coordinate mics, host awards.' }
  ],
  Anniversary: [
    { offsetDays: -45, title: 'Book Intimate Banquet Lawn or Fine Dining Venue', category: 'Venue', priority: 'High', notes: 'Reserve private dining terrace or boutique garden.' },
    { offsetDays: -30, title: 'Curate Slideshow & Memories Video Montage', category: 'Media', priority: 'Medium', notes: 'Collect vintage family photos and couple milestones.' },
    { offsetDays: -15, title: 'Select Live Acoustic Musician or Band', category: 'Music', priority: 'Medium', notes: 'Request favorite romantic ballads and first dance songs.' },
    { offsetDays: -7, title: 'Order Champagne, Floral Centerpieces & Cake', category: 'Catering', priority: 'High', notes: 'Confirm cake flavor and message plaque.' },
    { offsetDays: 0, title: 'Silver / Golden Jubilee Toast & Dinner', category: 'Celebration', priority: 'High', notes: 'Raise toast, screen memory video, and celebrate lasting love.' }
  ]
};

// Priority styling
const PRIORITY_BADGES = {
  High: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Low: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
};

export const TimelinePlanner = ({ isOpen, onClose, event, onToast }) => {
  const storageKey = event?.id ? `event_timeline_${event.id}` : 'temp_timeline';
  const eventDateObj = new Date(event?.date || Date.now());

  // Generate initial tasks based on event date and default templates
  const getInitialTasks = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.tasks) && parsed.tasks.length > 0) {
          return parsed.tasks;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved timeline:', e);
    }

    const template = DEFAULT_TIMELINE_TEMPLATES[event.category] || DEFAULT_TIMELINE_TEMPLATES.Community;
    return template.map((item, index) => {
      const targetDate = new Date(eventDateObj);
      targetDate.setDate(targetDate.getDate() + item.offsetDays);
      const dateStr = targetDate.toISOString().split('T')[0];

      return {
        id: `task-${Date.now()}-${index}`,
        title: item.title,
        category: item.category,
        dueDate: dateStr,
        priority: item.priority,
        notes: item.notes,
        isCompleted: false,
        createdAt: new Date().toISOString()
      };
    });
  };

  const [tasks, setTasks] = useState(getInitialTasks);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ tasks }));
    } catch (e) {
      console.error('Failed to save timeline tasks:', e);
    }
  }, [tasks, storageKey]);

  // Form state for adding custom tasks
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'General',
    dueDate: event.date || new Date().toISOString().split('T')[0],
    priority: 'Medium',
    notes: ''
  });

  // UI & Filter states
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'timeline'
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PENDING, COMPLETED, OVERDUE
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // Progress metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Days until event
  const daysUntilEvent = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(event.date || Date.now());
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  }, [event.date]);

  // Calculate overdue status for task
  const isTaskOverdue = useCallback((task) => {
    if (task.isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }, []);

  const overdueCount = useMemo(() => {
    return tasks.filter((t) => isTaskOverdue(t)).length;
  }, [tasks, isTaskOverdue]);

  // Toggle Task Completion
  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.isCompleted;
          if (nextState) {
            onToast?.(`Completed: "${t.title}" 🎉`, 'success');
          }
          return { ...t, isCompleted: nextState };
        }
        return t;
      })
    );
  };

  // Add Task Handler
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      onToast?.('Please enter a task title.', 'error');
      return;
    }

    const taskItem = {
      id: `task-${Date.now()}`,
      title: newTask.title.trim(),
      category: newTask.category.trim() || 'General',
      dueDate: newTask.dueDate || event.date,
      priority: newTask.priority,
      notes: newTask.notes.trim(),
      isCompleted: false,
      createdAt: new Date().toISOString()
    };

    setTasks((prev) => [taskItem, ...prev]);
    setNewTask({
      title: '',
      category: 'General',
      dueDate: event.date || new Date().toISOString().split('T')[0],
      priority: 'Medium',
      notes: ''
    });

    onToast?.(`Added task "${taskItem.title}"`, 'success');
  };

  // Delete Task
  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    onToast?.('Task deleted', 'info');
  };

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          t.title.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.notes.toLowerCase().includes(query);

        const isOverdue = isTaskOverdue(t);
        const matchesStatus =
          statusFilter === 'ALL' ||
          (statusFilter === 'COMPLETED' && t.isCompleted) ||
          (statusFilter === 'PENDING' && !t.isCompleted) ||
          (statusFilter === 'OVERDUE' && isOverdue);

        const matchesPriority =
          priorityFilter === 'ALL' || t.priority === priorityFilter;

        return matchesQuery && matchesStatus && matchesPriority;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [tasks, searchQuery, statusFilter, priorityFilter, isTaskOverdue]);

  // AI Timeline Planning Copilot
  const handleGetAiPlanningAdvice = async () => {
    setIsAiGenerating(true);
    setShowAiModal(true);

    const apiKey = getStoredApiKey();
    if (apiKey && apiKey.trim() !== '') {
      try {
        const prompt = `You are a world-class certified wedding & event director.
Generate a milestone schedule & priority planning checklist for this celebration:
Event Name: "${event.name}"
Category: "${event.category}"
Event Date: "${event.date}"
Host: "${event.host}"
Venue: "${event.venue}"
Days Remaining: ${daysUntilEvent}
Current Completed Tasks: ${completedTasks} of ${totalTasks}

Output strictly valid JSON with this exact structure:
{
  "phaseStrategy": "Overall strategic advice for the current countdown phase (2-3 sentences)",
  "recommendedTasks": [
    { "title": "Task title", "category": "Category", "daysBeforeEvent": 15, "priority": "High", "actionableTip": "One specific pro tip" }
  ],
  "crucialMilestones": [
    "Milestone 1 to safeguard against stress",
    "Milestone 2"
  ],
  "dayOfProtocols": [
    "Emergency kit advice or day-of run-sheet protocol"
  ]
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 900,
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(raw.replace(/```json/gi, '').replace(/```/g, '').trim());
            setAiSuggestions({ ...parsed, source: 'gemini-1.5-flash' });
            setIsAiGenerating(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Gemini AI Timeline error, using fallback:', err);
      }
    }

    // Smart Cultural Fallback
    setAiSuggestions({
      phaseStrategy: `With ${daysUntilEvent} days remaining for "${event.name}", prioritize vendor contracts, food menu tasting, and guest communication. Completing high-priority items at least 2 weeks before the big day eliminates stress.`,
      recommendedTasks: [
        {
          title: 'Conduct Final Sound & Microphone Checks',
          category: 'Production',
          daysBeforeEvent: 3,
          priority: 'High',
          actionableTip: 'Test wireless microphones and audio levels across the entire hall.'
        },
        {
          title: 'Assemble Emergency Day-Of Kit',
          category: 'Logistics',
          daysBeforeEvent: 2,
          priority: 'Medium',
          actionableTip: 'Pack safety pins, stain remover pens, phone power banks, band-aids, and breath mints.'
        },
        {
          title: 'Confirm Vendor Arrival Windows & Point-of-Contact',
          category: 'Coordination',
          daysBeforeEvent: 5,
          priority: 'High',
          actionableTip: 'Share a single contact person (not the host/bride/groom) for delivery logistics.'
        }
      ],
      crucialMilestones: [
        'Lock final RSVP numbers 10 days out to prevent catering penalties.',
        'Share high-resolution QR codes / map pins with out-of-town guests.'
      ],
      dayOfProtocols: [
        'Assign a dedicated friend or coordinator to manage vendor envelope disbursements.',
        'Schedule a 30-minute buffer before the main ritual/program begins.'
      ],
      source: 'smart-cultural-engine'
    });
    setIsAiGenerating(false);
  };

  // Add AI recommended task to checklist
  const handleAdoptAiTask = (rec) => {
    const targetDate = new Date(eventDateObj);
    targetDate.setDate(targetDate.getDate() - (rec.daysBeforeEvent || 7));

    const item = {
      id: `task-${Date.now()}`,
      title: rec.title,
      category: rec.category || 'Coordination',
      dueDate: targetDate.toISOString().split('T')[0],
      priority: rec.priority || 'High',
      notes: rec.actionableTip || '',
      isCompleted: false,
      createdAt: new Date().toISOString()
    };

    setTasks((prev) => [item, ...prev]);
    onToast?.(`Adopted "${item.title}" into your checklist!`, 'success');
  };

  // Copy Task Checklist
  const handleCopyChecklist = () => {
    const text = `📋 Event Planning Checklist for "${event.name}" (${event.category})
Event Date: ${event.date} (${daysUntilEvent} days remaining)
Progress: ${completedTasks}/${totalTasks} tasks completed (${progressPercent}%)

${tasks
  .map(
    (t) =>
      `[${t.isCompleted ? 'X' : ' '}] ${t.title} (Due: ${t.dueDate} | Priority: ${t.priority})`
  )
  .join('\n')}
`;
    navigator.clipboard.writeText(text);
    onToast?.('Planning checklist copied to clipboard!', 'success');
  };

  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timeline-planner-title"
    >
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-300">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="timeline-planner-title" className="text-base sm:text-lg font-bold text-slate-100">
                  Timeline & Planning Checklists
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {event.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-sm sm:max-w-md">
                Countdown milestones & task executions for "{event.name}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGetAiPlanningAdvice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-200 border border-amber-500/30 transition-all shadow-sm"
              title="Get GenAI Milestone Recommendations"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI Timeline Advisor</span>
            </button>

            <button
              onClick={handleCopyChecklist}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Copy Checklist"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Copy</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-1"
              aria-label="Close Timeline Planner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Milestone Countdown & Metrics Ribbon */}
        <div className="bg-slate-950/40 border-b border-slate-800/80 p-4 sm:p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Countdown</span>
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-slate-100">
                  {daysUntilEvent > 0 ? `${daysUntilEvent} Days` : daysUntilEvent === 0 ? 'Today!' : 'Past Event'}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 truncate">
                Target: {event.date}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Completed Tasks</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                  {completedTasks}
                </span>
                <span className="text-xs text-slate-500">/ {totalTasks}</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                <span>{progressPercent}% execution rate</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Pending Action</span>
                <Circle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-amber-300">
                  {pendingTasks}
                </span>
                <span className="text-xs text-slate-500">milestones</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                <span>On the active checklist</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Overdue Deadlines</span>
                <AlertTriangle className={`w-4 h-4 ${overdueCount > 0 ? 'text-rose-400' : 'text-slate-500'}`} />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  className={`text-xl sm:text-2xl font-bold ${
                    overdueCount > 0 ? 'text-rose-400' : 'text-slate-300'
                  }`}
                >
                  {overdueCount}
                </span>
                <span className="text-xs text-slate-500">tasks</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                <span>{overdueCount > 0 ? 'Require immediate attention' : 'All milestones on schedule'}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Planning Velocity</span>
              <span className="font-semibold text-indigo-300">
                {progressPercent}% Completed ({completedTasks} settled of {totalTasks} milestones)
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* View Tabs & Search Bar */}
        <div className="px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Task Checklist
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Visual Roadmap
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending Only</option>
              <option value="COMPLETED">Completed</option>
              <option value="OVERDUE">Overdue Only</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Content Body: Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Add Task Panel (4 Cols) */}
          <div className="lg:col-span-4 p-5 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/40 overflow-y-auto space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                Add Milestone Task
              </h3>

              <form onSubmit={handleAddTask} className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Task Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g. Schedule Bridal Mehndi, Finalize Menu..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Category</label>
                    <input
                      type="text"
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      placeholder="e.g. Venue, Decor, Music"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Actionable Notes / Contacts</label>
                  <textarea
                    rows={2}
                    value={newTask.notes}
                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                    placeholder="Specific instructions, vendor phone, or requirements..."
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Task</span>
                </button>
              </form>
            </div>

            {/* Quick Tips Box */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-300 space-y-2">
              <span className="font-semibold flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                Pro-Planner Rule of Thumb
              </span>
              <p className="text-[11px] text-indigo-200/80 leading-relaxed">
                For major {event.category.toLowerCase()} celebrations, 70% of vendor milestones should be locked 30 days prior. Reserve the final week purely for dress rehearsals and personal wellness.
              </p>
            </div>
          </div>

          {/* Right: Tasks List / Visual Timeline View (8 Cols) */}
          <div className="lg:col-span-8 p-5 overflow-y-auto bg-slate-950/20">
            {activeTab === 'list' ? (
              /* Checklist Mode */
              <div className="space-y-2.5">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    <ListChecks className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No tasks found matching your filter criteria.</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const overdue = isTaskOverdue(task);
                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 group ${
                          task.isCompleted
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                            : overdue
                            ? 'bg-rose-950/20 border-rose-800/40 hover:border-rose-700'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            onClick={() => handleToggleTask(task.id)}
                            className={`p-1.5 rounded-lg border transition-colors shrink-0 mt-0.5 ${
                              task.isCompleted
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                            }`}
                            aria-label={`Mark "${task.title}" as ${task.isCompleted ? 'pending' : 'completed'}`}
                          >
                            {task.isCompleted ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4
                                className={`text-xs sm:text-sm font-semibold truncate ${
                                  task.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                                }`}
                              >
                                {task.title}
                              </h4>

                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Medium
                                }`}
                              >
                                {task.priority}
                              </span>

                              {overdue && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                                  Overdue
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                              <span className="text-slate-300 font-medium">{task.category}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.dueDate}
                              </span>
                            </div>

                            {task.notes && (
                              <p className="mt-1 text-xs text-slate-400 leading-relaxed font-normal">
                                {task.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors opacity-80 group-hover:opacity-100 shrink-0"
                          title="Delete task"
                          aria-label={`Delete ${task.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Visual Timeline Roadmap View */
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-purple-500 before:to-emerald-500">
                {filteredTasks.map((task, idx) => {
                  const overdue = isTaskOverdue(task);
                  return (
                    <div key={task.id} className="relative group">
                      {/* Timeline Node Icon */}
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`absolute -left-[27px] sm:-left-[35px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          task.isCompleted
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                            : overdue
                            ? 'bg-rose-950 border-rose-500 text-rose-300'
                            : 'bg-slate-900 border-indigo-500 text-indigo-300'
                        }`}
                        title="Click to toggle status"
                      >
                        {task.isCompleted ? <Check className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                      </button>

                      <div
                        className={`p-4 rounded-2xl border transition-all ${
                          task.isCompleted
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                            : overdue
                            ? 'bg-rose-950/20 border-rose-800/40'
                            : 'bg-slate-900/80 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase">
                            Due {task.dueDate}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Medium
                            }`}
                          >
                            {task.priority} Priority
                          </span>
                        </div>
                        <h4
                          className={`text-sm font-bold mt-1 text-slate-100 ${
                            task.isCompleted ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </h4>
                        {task.notes && (
                          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                            {task.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations Modal */}
        {showAiModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-lg">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>GenAI Countdown Strategy & Pro Milestones</span>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isAiGenerating ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 mx-auto text-amber-400 animate-spin" />
                  <p className="text-sm text-slate-300">
                    Gemini AI is analyzing event category, days remaining & logistical dependencies...
                  </p>
                </div>
              ) : aiSuggestions ? (
                <div className="mt-4 space-y-5">
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs sm:text-sm leading-relaxed">
                    <strong>Phase Strategy ({daysUntilEvent} Days Left):</strong> {aiSuggestions.phaseStrategy}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Recommended Strategic Tasks to Adopt
                    </h4>
                    <div className="space-y-2.5">
                      {aiSuggestions.recommendedTasks?.map((rec, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2 font-semibold text-slate-200">
                              <span>{rec.title}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300">
                                {rec.category}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-1">{rec.actionableTip}</p>
                          </div>
                          <button
                            onClick={() => handleAdoptAiTask(rec)}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 shadow-sm"
                          >
                            + Adopt Task
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {aiSuggestions.crucialMilestones && (
                    <div>
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                        Critical Milestone Guardrails
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                        {aiSuggestions.crucialMilestones.map((milestone, idx) => (
                          <li key={idx}>{milestone}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiSuggestions.dayOfProtocols && (
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                        Day-of Execution Protocols
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                        {aiSuggestions.dayOfProtocols.map((protocol, idx) => (
                          <li key={idx}>{protocol}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Close Planner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePlanner;
