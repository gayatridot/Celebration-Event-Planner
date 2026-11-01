import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { EventDashboard } from './components/EventDashboard';
import { EventModal } from './components/EventModal';
import { CardStudioModal } from './components/CardStudioModal';
import { BudgetManager } from './components/BudgetManager';
import { TimelinePlanner } from './components/TimelinePlanner';
import { VendorChecklist } from './components/VendorChecklist';
import { AIIdeasPanel } from './components/AIIdeasPanel';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Toast } from './components/Toast';
import {
  getStoredEvents,
  saveStoredEvents,
  getStoredApiKey,
  INITIAL_EVENTS
} from './services/storageService';

export function App() {
  const [events, setEvents] = useState(() => getStoredEvents());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  // Card Studio Modal State
  const [isCardStudioOpen, setIsCardStudioOpen] = useState(false);
  const [studioEvent, setStudioEvent] = useState(null);

  // Budget Manager Modal State
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [budgetEvent, setBudgetEvent] = useState(null);

  // Timeline Planner Modal State
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [timelineEvent, setTimelineEvent] = useState(null);

  // Vendor Checklist Modal State
  const [isVendorsOpen, setIsVendorsOpen] = useState(false);
  const [vendorEvent, setVendorEvent] = useState(null);

  // AI Ideas Panel Modal State
  const [isIdeasOpen, setIsIdeasOpen] = useState(false);
  const [ideasEvent, setIdeasEvent] = useState(null);

  // GenAI Planning Assistant Modal State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantEvent, setAssistantEvent] = useState(null);

  // API Key Settings Modal State
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(Boolean(getStoredApiKey()));

  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Sync events to localStorage on changes
  useEffect(() => {
    saveStoredEvents(events);
  }, [events]);

  // Create or Update Event handler
  const handleSaveEvent = (savedEvent) => {
    setEvents((prev) => {
      const existsIndex = prev.findIndex((e) => e.id === savedEvent.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedEvent;
        showToast(`Updated "${savedEvent.name}" successfully!`, 'success');
        return updated;
      } else {
        showToast(`Created new celebration "${savedEvent.name}"!`, 'success');
        return [savedEvent, ...prev];
      }
    });
  };

  // Delete Event handler
  const handleDeleteEvent = (eventId) => {
    const target = events.find((e) => e.id === eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    showToast(`Deleted "${target?.name || 'Event'}"`, 'info');
  };

  // Reset to initial demo celebrations
  const handleResetSamples = () => {
    setEvents(INITIAL_EVENTS);
    saveStoredEvents(INITIAL_EVENTS);
    showToast('Reset dashboard to curated sample celebrations!', 'info');
  };

  // Edit Event trigger
  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setIsEventModalOpen(true);
  };

  // Create Event trigger
  const handleOpenCreateModal = () => {
    setEventToEdit(null);
    setIsEventModalOpen(true);
  };

  // Feature Modal Openers
  const handleOpenCardStudio = (event) => {
    setStudioEvent(event);
    setIsCardStudioOpen(true);
  };

  const handleOpenBudget = (event) => {
    setBudgetEvent(event);
    setIsBudgetOpen(true);
  };

  const handleOpenTimeline = (event) => {
    setTimelineEvent(event);
    setIsTimelineOpen(true);
  };

  const handleOpenVendors = (event) => {
    setVendorEvent(event);
    setIsVendorsOpen(true);
  };

  const handleOpenIdeas = (event) => {
    setIdeasEvent(event);
    setIsIdeasOpen(true);
  };

  const handleOpenAssistant = (event) => {
    // If called without specific event, use the first upcoming event
    const target = event || events[0] || INITIAL_EVENTS[0];
    setAssistantEvent(target);
    setIsAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Navigation Bar */}
      <Navbar
        eventCount={events.length}
        onOpenCreateModal={handleOpenCreateModal}
        onOpenAssistant={() => handleOpenAssistant(events[0])}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onResetSamples={handleResetSamples}
        hasApiKey={hasApiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <EventDashboard
          events={events}
          onOpenCreateModal={handleOpenCreateModal}
          onOpenCardStudio={handleOpenCardStudio}
          onOpenBudget={handleOpenBudget}
          onOpenTimeline={handleOpenTimeline}
          onOpenVendors={handleOpenVendors}
          onOpenIdeas={handleOpenIdeas}
          onOpenAssistant={handleOpenAssistant}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </main>

      {/* Modals & Dialogs */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
      />

      <CardStudioModal
        isOpen={isCardStudioOpen}
        onClose={() => setIsCardStudioOpen(false)}
        event={studioEvent}
        onToast={showToast}
      />

      <BudgetManager
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        event={budgetEvent}
        onToast={showToast}
      />

      <TimelinePlanner
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        event={timelineEvent}
        onToast={showToast}
      />

      <VendorChecklist
        isOpen={isVendorsOpen}
        onClose={() => setIsVendorsOpen(false)}
        event={vendorEvent}
        onToast={showToast}
      />

      <AIIdeasPanel
        isOpen={isIdeasOpen}
        onClose={() => setIsIdeasOpen(false)}
        event={ideasEvent}
        onToast={showToast}
      />

      <AiAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        event={assistantEvent}
        onToast={showToast}
      />

      <ApiKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onKeySaved={(key) => {
          setHasApiKey(Boolean(key));
          showToast(key ? 'Gemini API Key activated!' : 'Using Smart Cultural Engine (Fallback Mode)', 'info');
        }}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}

export default App;
