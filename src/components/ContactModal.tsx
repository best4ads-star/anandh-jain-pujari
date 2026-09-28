import React, { useState, useEffect } from 'react';
import { X, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { GoldLeafBranch } from './Icons';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Heritage Documentation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 2200);
  };

  return (
    <div
      id="contact-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="contact-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#FAF7F0] dark:bg-[#142033] rounded-2xl shadow-2xl border border-[#E6DFD1] dark:border-[#263750] overflow-hidden my-8 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#F2ECE0] to-[#E8DEC7] dark:from-[#18263B] dark:to-[#18263B] border-b border-[#E3D8C1] dark:border-[#253750] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GoldLeafBranch className="w-8 h-8 text-[#B58A3C] dark:text-[#D8BD82]" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#B58A3C] dark:text-[#D8BD82]">
                Get In Touch
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#142033] dark:text-[#F8F5EE]">
                Contact Anandh
              </h2>
            </div>
          </div>

          <button
            id="close-contact-modal"
            onClick={onClose}
            aria-label="Close contact modal"
            className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 text-[#142033] dark:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7">
          {submitted ? (
            <div className="py-12 text-center flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3 animate-bounce" />
              <h3 className="font-serif text-2xl font-bold text-[#142033] dark:text-[#F8F5EE]">
                Thank You
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-1">
                Your message has been received with warm gratitude.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-[#F1ECE0] dark:bg-[#1A263B] text-xs text-[#4A5568] dark:text-[#CBD5E1] border border-[#E6DFD1] dark:border-[#263750]">
                <div className="flex items-center gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-[#B58A3C]" />
                  bestanandh@gmail.com
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#B58A3C]" />
                  Erode, Tamil Nadu
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142033] dark:text-[#CBD5E1] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priyanshu Jain"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1A263B] border border-[#E6DFD1] dark:border-[#263750] text-sm text-[#142033] dark:text-[#F8F5EE] focus:outline-none focus:border-[#B58A3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142033] dark:text-[#CBD5E1] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1A263B] border border-[#E6DFD1] dark:border-[#263750] text-sm text-[#142033] dark:text-[#F8F5EE] focus:outline-none focus:border-[#B58A3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142033] dark:text-[#CBD5E1] mb-1">
                  Interest / Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1A263B] border border-[#E6DFD1] dark:border-[#263750] text-sm text-[#142033] dark:text-[#F8F5EE] focus:outline-none focus:border-[#B58A3C]"
                >
                  <option value="Heritage Documentation">Temple Heritage Documentation</option>
                  <option value="Photography">Photography & Archives</option>
                  <option value="Digital Project Collaboration">Digital Project Collaboration</option>
                  <option value="Design & Typography">Graphic & Editorial Design</option>
                  <option value="General Inquiry">General Inquiry / Namaskar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142033] dark:text-[#CBD5E1] mb-1">
                  Message
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please write your thoughts or collaboration ideas..."
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1A263B] border border-[#E6DFD1] dark:border-[#263750] text-sm text-[#142033] dark:text-[#F8F5EE] focus:outline-none focus:border-[#B58A3C]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#142033] hover:bg-[#B58A3C] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
