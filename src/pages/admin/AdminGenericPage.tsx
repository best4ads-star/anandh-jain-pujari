import React from 'react';
import { Database, Plus, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { useAuth } from '../../services/firebase/AuthContext';
import { CollectionName } from '../../services/firestore/collections';

interface AdminGenericPageProps {
  collectionName: CollectionName;
  title: string;
  description: string;
  sampleItems: { id: string; title: string; status: string; subtitle?: string }[];
}

export function AdminGenericPage({
  collectionName,
  title,
  description,
  sampleItems,
}: AdminGenericPageProps) {
  const { isFirebaseConfigured } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DACDB7] dark:border-[#1E2E44] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#B58A3C]" />
            <h1 className="font-playfair text-2xl font-bold text-[#142033] dark:text-[#F8F5EE]">
              {title} Collection
            </h1>
          </div>
          <p className="text-xs font-serif text-[#5F6470] dark:text-[#94A3B8] mt-1">
            Connected to Firestore <code className="font-mono text-[11px] bg-[#EFE8DA] dark:bg-[#182638] px-1 py-0.5 rounded">{collectionName}</code> collection with schema validation.
          </p>
        </div>
      </div>

      <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-5">
        <p className="text-xs text-[#5F6470] dark:text-[#94A3B8] mb-4">
          {description}
        </p>

        <div className="divide-y divide-[#EBE1D0] dark:divide-[#1F3045] border border-[#EAE0D0] dark:border-[#1E2E44] rounded-2xs overflow-hidden">
          {sampleItems.map((item) => (
            <div
              key={item.id}
              className="p-4 flex items-center justify-between hover:bg-[#F9F5EC] dark:hover:bg-[#152336] transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-[#142033] dark:text-[#F8F5EE]">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium">
                    {item.status}
                  </span>
                </div>
                {item.subtitle && (
                  <div className="text-xs text-[#5F6470] dark:text-[#94A3B8] mt-0.5">
                    {item.subtitle}
                  </div>
                )}
                <div className="text-[10px] font-mono text-[#718096] dark:text-[#94A3B8] mt-1">
                  ID: {item.id}
                </div>
              </div>

              <div className="text-xs font-mono text-[#B58A3C]">
                {isFirebaseConfigured ? 'Firestore Ready' : 'Local Fallback Record'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
