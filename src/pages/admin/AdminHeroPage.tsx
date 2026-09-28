import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { getHeroSettings, saveHeroSettings } from '../../services/firestore/heroService';
import { useAuth } from '../../services/firebase/AuthContext';
import { HeroSettingsDocument } from '../../services/firestore/collections';

export function AdminHeroPage() {
  const { isFirebaseConfigured } = useAuth();
  const [settings, setSettings] = useState<HeroSettingsDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getHeroSettings();
      setSettings(data);
      setLoading(false);
    }
    load();
  }, [isFirebaseConfigured]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    if (!isFirebaseConfigured) {
      setSaveStatus('Firebase connection required to synchronize settings to Cloud Firestore.');
      return;
    }

    setSaving(true);
    setSaveStatus(null);
    try {
      await saveHeroSettings(settings);
      setSaveStatus('Hero settings successfully saved to Firestore!');
    } catch (err: any) {
      setSaveStatus(`Failed to save: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 text-center text-xs font-mono text-[#718096]">
        Loading Hero configuration...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-[#DACDB7] dark:border-[#1E2E44] pb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#B58A3C]" />
          <h1 className="font-playfair text-2xl font-bold text-[#142033] dark:text-[#F8F5EE]">
            Hero Settings Collection
          </h1>
        </div>
        <p className="text-xs font-serif text-[#5F6470] dark:text-[#94A3B8] mt-1">
          Connected to Firestore <code className="font-mono text-[11px] bg-[#EFE8DA] dark:bg-[#182638] px-1 py-0.5 rounded">heroSettings/default</code> document. The public Hero appearance remains preserved exactly as approved.
        </p>
      </div>

      {saveStatus && (
        <div className="p-3 rounded-xs bg-[#F4ECD8] dark:bg-[#1C2C40] border border-[#DACDB7] dark:border-[#2C415C] text-xs flex items-center gap-2 font-mono text-[#142033] dark:text-[#F8F5EE]">
          <Info className="w-4 h-4 text-[#B58A3C] shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-6 space-y-5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#5F6470] dark:text-[#94A3B8] mb-1.5">
            Greeting / Eyebrow Badge
          </label>
          <input
            type="text"
            value={settings.greeting}
            onChange={(e) => setSettings({ ...settings, greeting: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xs border border-[#D8CCB8] dark:border-[#2C3F58] bg-[#F9F6F0] dark:bg-[#152234] text-[#142033] dark:text-[#F8F5EE] focus:outline-none focus:border-[#B58A3C]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#5F6470] dark:text-[#94A3B8] mb-1.5">
            Display Title
          </label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xs border border-[#D8CCB8] dark:border-[#2C3F58] bg-[#F9F6F0] dark:bg-[#152234] text-[#142033] dark:text-[#F8F5EE] focus:outline-none focus:border-[#B58A3C]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#5F6470] dark:text-[#94A3B8] mb-1.5">
            Hero Subtitle / Tagline
          </label>
          <textarea
            rows={2}
            value={settings.subtitle}
            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xs border border-[#D8CCB8] dark:border-[#2C3F58] bg-[#F9F6F0] dark:bg-[#152234] text-[#142033] dark:text-[#F8F5EE] focus:outline-none focus:border-[#B58A3C]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#5F6470] dark:text-[#94A3B8] mb-1.5">
            Philosophical Quote
          </label>
          <textarea
            rows={2}
            value={settings.quote}
            onChange={(e) => setSettings({ ...settings, quote: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xs border border-[#D8CCB8] dark:border-[#2C3F58] bg-[#F9F6F0] dark:bg-[#152234] text-[#142033] dark:text-[#F8F5EE] focus:outline-none focus:border-[#B58A3C]"
          />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-[#EBE1D0] dark:border-[#1F3045]">
          <span className="text-[11px] font-mono text-[#718096]">
            Document ID: default
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#142033] dark:bg-[#B58A3C] text-[#F8F5EE] dark:text-[#0B131E] rounded-xs text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save to Firestore'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
