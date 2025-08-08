import React, { createContext, useState, useContext } from 'react';

const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
  const [reminders, setReminders] = useState([
    { 
      id: '1', 
      hour: '07',
      minute:'30',
      title: 'Baby Spinach', 
      category: 'Watering',
      active: true,
      days: {Mo: true, Tu: true, W: true, Th: true, F: true, Sa: false, Su: false},
      frequency: 'Daily',
      note:'Kasian bayinya'
    },
    { 
      id: '2', 
      hour: '08',
      minute:'00',
      title: 'Peace Lily', 
      category: 'Watering',
      active: false, 
      days: {Mo: true, Tu: true, W: true, Th: true, F: true, Sa: false, Su: false},
      frequency: 'Daily',
      note:'Lily, Lily... Yess papa~~'
    },
    { 
      id: '3', 
      hour: '09',
      minute:'15',
      title: 'Snake Plant', 
      category: 'Fertilizing',
      active: true, 
      days: {Mo: false, Tu: false, W: false, Th: false, F: true, Sa: true, Su: true},
      frequency: 'Daily',
      note:'Aduh abang bukan maksudku begituuu~~~'
    },
    { 
      id: '4', 
      hour: '12',
      minute:'45',
      title: 'Monstera', 
      category: 'Pruning',
      active: false, 
      days: {Mo: true, Tu: false, W: true, Th: false, F: true, Sa: false, Su: false},
      frequency: 'Daily',
      note:'Omooo, ada monster gesss :O'
    },
    { 
      id: '5', 
      hour: '14',
      minute:'30',
      title: 'Fiddle Leaf Fig', 
      category: 'Watering',
      active: true, 
      days: {Mo: true, Tu: false, W: true, Th: false, F: true, Sa: false, Su: false},
      frequency: 'Daily',
      note:'Figma kali ya maksudnya???'
    },
    { 
      id: '6', 
      time: '15.45',
      hour: '15',
      minute:'45',
      title: 'Pothos', 
      category: 'Fertilizing',
      active: false, 
      days: {Mo: false, Tu: true, W: false, Th: true, F: false, Sa: true, Su: false},
      frequency: 'Daily',
      note:'Ayo bangun pagi dan berfotosintesis!!'
    },
    { 
      id: '7', 
      hour: '17',
      minute:'00',
      title: 'Orchid', 
      category: 'Watering',
      active: true, 
      days: {Mo: true, Tu: true, W: true, Th: true, F: true, Sa: true, Su: true},
      frequency: 'Daily',
      note:'Nama jalan sih ini kataku'
    },
    { 
      id: '8', 
      hour: '19',
      minute:'15', 
      title: 'Rubber Plant', 
      category: 'Pruning',
      active: false, 
      days: {Mo: false, Tu: false, W: false, Th: false, F: false, Sa: true, Su: true},
      frequency: 'Daily',
      note:'Berarti ini tanaman penghapus karena rubber?'
    }
  ]);

  const updateReminder = (updatedReminder) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === updatedReminder.id ? updatedReminder : reminder
      )
    );
  };

  const addReminder = (newReminder) => {
    setReminders(prev => [newReminder, ...prev]);
  };

  const toggleReminderActive = (id) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, active: !reminder.active } 
          : reminder
      )
    );
  };

  const getReminderById = (id) => {
    return reminders.find(reminder => reminder.id === id);
  };

  // Get specific reminders for Home page (ids 1, 2, 4)
  const getHomeReminders = () => {
    return reminders.filter(reminder => ['1', '2', '4'].includes(reminder.id));
  };

  return (
    <ReminderContext.Provider value={{
      reminders,
      setReminders,
      updateReminder,
      addReminder,
      toggleReminderActive,
      getReminderById,
      getHomeReminders
    }}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};
