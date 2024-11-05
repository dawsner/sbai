import React from 'react';
import { Bell, Globe, Moon, Sun, CreditCard } from 'lucide-react';
import { useStore } from '../../lib/store';

export default function Settings() {
  const { settings, updateSettings } = useStore();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your application preferences</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {/* Theme Settings */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Theme</h2>
                <p className="text-sm text-gray-500">Choose your preferred color theme</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateSettings({ ...settings, theme: 'light' })}
                  className={`p-2 rounded-lg ${
                    settings.theme === 'light'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-400 hover:text-gray-500'
                  }`}
                >
                  <Sun className="w-5 h-5" />
                </button>
                <button
                  onClick={() => updateSettings({ ...settings, theme: 'dark' })}
                  className={`p-2 rounded-lg ${
                    settings.theme === 'dark'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-400 hover:text-gray-500'
                  }`}
                >
                  <Moon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="p-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Configure how you want to be notified</p>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <label className="text-sm text-gray-700">Email Notifications</label>
                </div>
                <button
                  onClick={() => updateSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      email: !settings.notifications.email
                    }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <label className="text-sm text-gray-700">Desktop Notifications</label>
                </div>
                <button
                  onClick={() => updateSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      desktop: !settings.notifications.desktop
                    }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.notifications.desktop ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.notifications.desktop ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="p-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Regional</h2>
              <p className="text-sm text-gray-500">Customize your regional preferences</p>
            </div>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSettings({ ...settings, language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Zone
                  </label>
                  <select
                    value={settings.timeZone}
                    onChange={(e) => updateSettings({ ...settings, timeZone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => updateSettings({ ...settings, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}