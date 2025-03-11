"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { AvatarWithTypeIndicator } from "@/components/ui/avatar";
import { fixAvatarUrl, testImageUrl } from "@/lib/avatar-debugger";
import { useAuth } from "@/lib/contexts/auth";

export default function AvatarDiagnostics() {
  const { user, profile, refreshProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const runDiagnostics = async () => {
    if (!avatarUrl) return;
    
    setIsLoading(true);
    
    try {
      // Test the original URL
      const originalResult = await testImageUrl(avatarUrl);
      
      // Test with our fixed URL function
      const fixedUrl = fixAvatarUrl(avatarUrl);
      const fixedResult = await testImageUrl(fixedUrl);
      
      // Test with cache busting
      const cacheBustUrl = `${fixedUrl}${fixedUrl.includes('?') ? '&' : '?'}_cb=${Date.now()}`;
      const cacheBustResult = await testImageUrl(cacheBustUrl);
      
      // Store all results
      setTestResults({
        originalUrl: avatarUrl,
        originalResult,
        fixedUrl,
        fixedResult,
        cacheBustUrl,
        cacheBustResult,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error running diagnostics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar Diagnostics</CardTitle>
        <CardDescription>
          Test and debug avatar loading issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar Display Tests */}
        <div className="grid grid-cols-3 gap-4">
          {/* Regular Avatar */}
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-sm font-medium">Standard Avatar</h3>
            <Avatar size="lg" key={`avatar-${refreshKey}`}>
              <AvatarImage src={avatarUrl || undefined} alt="User avatar" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">AvatarImage component</span>
          </div>
          
          {/* AvatarWithTypeIndicator */}
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-sm font-medium">With Type Indicator</h3>
            <AvatarWithTypeIndicator 
              size="lg"
              src={avatarUrl || undefined}
              userType={profile?.user_type || "unknown"}
              key={`type-${refreshKey}`}
            />
            <span className="text-xs text-gray-500">AvatarWithTypeIndicator</span>
          </div>
          
          {/* Direct img tag */}
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-sm font-medium">Direct Image</h3>
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
              <img 
                src={avatarUrl || '/default-avatar.png'} 
                alt="Direct img tag"
                className="w-full h-full object-cover"
                key={`img-${refreshKey}`}
              />
            </div>
            <span className="text-xs text-gray-500">Plain &lt;img&gt; tag</span>
          </div>
        </div>
        
        {/* Fixed URL versions */}
        {avatarUrl && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {/* Fixed URL Avatar */}
            <div className="flex flex-col items-center space-y-2">
              <h3 className="text-sm font-medium">Fixed URL</h3>
              <Avatar size="lg" key={`fixed-${refreshKey}`}>
                <AvatarImage src={fixAvatarUrl(avatarUrl)} alt="Fixed URL" />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-500">With fixAvatarUrl()</span>
            </div>
            
            {/* Cache busted URL */}
            <div className="flex flex-col items-center space-y-2">
              <h3 className="text-sm font-medium">Cache Busted</h3>
              <Avatar size="lg" key={`cache-${refreshKey}`}>
                <AvatarImage 
                  src={`${fixAvatarUrl(avatarUrl)}${avatarUrl.includes('?') ? '&' : '?'}_cb=${Date.now()}`} 
                  alt="Cache busted" 
                />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-500">With cache busting</span>
            </div>
            
            {/* Default avatar */}
            <div className="flex flex-col items-center space-y-2">
              <h3 className="text-sm font-medium">Default Avatar</h3>
              <Avatar size="lg">
                <AvatarImage src="/default-avatar.png" alt="Default" />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-500">Default fallback</span>
            </div>
          </div>
        )}
        
        {/* Controls and Information */}
        <div className="flex space-x-2 mt-4">
          <Button onClick={runDiagnostics} disabled={isLoading}>
            {isLoading ? "Testing..." : "Run Diagnostics"}
          </Button>
          <Button variant="outline" onClick={forceRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Force Refresh
          </Button>
          <Button variant="outline" onClick={() => refreshProfile()}>
            Refresh Profile
          </Button>
        </div>
        
        {/* URL Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <h3 className="font-medium mb-1">Avatar URL Information</h3>
          <p className="mb-2 break-all">Current URL: {avatarUrl || "None"}</p>
          {avatarUrl && (
            <p className="text-xs text-gray-500 break-all">
              Fixed URL: {fixAvatarUrl(avatarUrl)}
            </p>
          )}
        </div>
        
        {/* Test Results */}
        {testResults && (
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Diagnostic Results</h3>
            <div className="grid grid-cols-1 gap-2">
              {/* Original URL test */}
              <div className="p-2 rounded bg-gray-50">
                <div className="flex items-center">
                  <span className="font-medium text-sm">Original URL: </span>
                  <span className="ml-2">
                    {testResults.originalResult.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-500 inline-block" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 inline-block" />
                    )}
                  </span>
                  <span className="ml-1 text-sm">
                    {testResults.originalResult.status === 'success' ? 'Loaded' : 'Failed'}
                    {testResults.originalResult.timeTaken && ` (${testResults.originalResult.timeTaken}ms)`}
                  </span>
                </div>
              </div>
              
              {/* Fixed URL test */}
              <div className="p-2 rounded bg-gray-50">
                <div className="flex items-center">
                  <span className="font-medium text-sm">Fixed URL: </span>
                  <span className="ml-2">
                    {testResults.fixedResult.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-500 inline-block" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 inline-block" />
                    )}
                  </span>
                  <span className="ml-1 text-sm">
                    {testResults.fixedResult.status === 'success' ? 'Loaded' : 'Failed'}
                    {testResults.fixedResult.timeTaken && ` (${testResults.fixedResult.timeTaken}ms)`}
                  </span>
                </div>
              </div>
              
              {/* Cache busted URL test */}
              <div className="p-2 rounded bg-gray-50">
                <div className="flex items-center">
                  <span className="font-medium text-sm">Cache Busted URL: </span>
                  <span className="ml-2">
                    {testResults.cacheBustResult.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-500 inline-block" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 inline-block" />
                    )}
                  </span>
                  <span className="ml-1 text-sm">
                    {testResults.cacheBustResult.status === 'success' ? 'Loaded' : 'Failed'}
                    {testResults.cacheBustResult.timeTaken && ` (${testResults.cacheBustResult.timeTaken}ms)`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 