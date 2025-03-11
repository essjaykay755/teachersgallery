"use client";

import React from 'react';
import AvatarDiagnostics from '@/components/avatar-diagnostics';
import { useAuth } from '@/lib/contexts/auth';

export default function AvatarDebugPage() {
  const { user, profile } = useAuth();
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Avatar Debug Tools</h1>
      
      <p className="mb-6 text-gray-600">
        This page provides tools to diagnose and fix avatar image loading issues.
      </p>
      
      <div className="mb-8">
        <AvatarDiagnostics />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">How to fix common avatar issues:</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>If your avatar is not showing up in all places, try re-uploading it.</li>
          <li>Check that your avatar URL is a direct image URL (ends with .jpg, .png, etc.)</li>
          <li>Make sure your image is less than 2MB in size.</li>
          <li>If you see a broken image icon, the URL might be incorrect or the file might have been deleted.</li>
          <li>Try refreshing your browser cache (Ctrl+F5 or Cmd+Shift+R).</li>
        </ul>
      </div>
    </div>
  );
} 