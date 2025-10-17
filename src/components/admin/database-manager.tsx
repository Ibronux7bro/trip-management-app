'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from '@/app/providers/translation-provider';
import { 
  useStats, 
  useBackup, 
  useRestore, 
  useExport, 
  useImport, 
  useClearData 
} from '@/lib/data-manager';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  HardDrive,
  FileText,
  Users,
  Truck,
  Package
} from 'lucide-react';
import { useTranslation } from '@/app/providers/translation-provider';

export default function DatabaseManager() {
  const { t, isRTL } = useTranslation();
  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);

  // Data hooks
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useStats();
  const backupMutation = useBackup();
  const restoreMutation = useRestore();
  const exportMutation = useExport();
  const importMutation = useImport();
  const clearMutation = useClearData();

  const handleBackup = async () => {
    try {
      await backupMutation.mutateAsync();
      // Show success message
    } catch (error) {
      console.error('Backup failed:', error);
    }
  };

  const handleRestore = async () => {
    if (window.confirm(t('Are you sure you want to restore from backup? This will overwrite current data.'))) {
      try {
        await restoreMutation.mutateAsync();
        refetchStats();
        // Show success message
      } catch (error) {
        console.error('Restore failed:', error);
      }
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportMutation.mutateAsync();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trip-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) return;
    
    try {
      await importMutation.mutateAsync(importData);
      setImportData('');
      setShowImport(false);
      refetchStats();
      // Show success message
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  const handleClear = async () => {
    if (window.confirm(t('Are you sure you want to clear all data? This action cannot be undone.'))) {
      try {
        await clearMutation.mutateAsync();
        refetchStats();
        // Show success message
      } catch (error) {
        console.error('Clear failed:', error);
      }
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" text={t('Loading database information...')} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Database Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Database className="h-5 w-5" />
            {t('Database Statistics')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`flex items-center gap-2 p-3 bg-blue-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">{t('Orders')}</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.orders || 0}</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 p-3 bg-green-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Truck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">{t('Vehicles')}</p>
                <p className="text-2xl font-bold text-green-600">{stats?.vehicles || 0}</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 p-3 bg-purple-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">{t('Drivers')}</p>
                <p className="text-2xl font-bold text-purple-600">{stats?.drivers || 0}</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 p-3 bg-orange-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <HardDrive className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-900">{t('Database Size')}</p>
                <p className="text-lg font-bold text-orange-600">{stats?.size || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {stats?.lastBackup && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                {t('Last Backup')}: {new Date(stats.lastBackup).toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <RefreshCw className="h-5 w-5" />
            {t('Backup & Restore')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              onClick={handleBackup}
              disabled={backupMutation.isPending}
              variant="outline"
              className="flex items-center gap-2"
            >
              {backupMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              {t('Create Backup')}
            </Button>

            <Button
              onClick={handleRestore}
              disabled={restoreMutation.isPending}
              variant="outline"
              className="flex items-center gap-2"
            >
              {restoreMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {t('Restore from Backup')}
            </Button>
          </div>

          {backupMutation.isError && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('Failed to create backup')}
              </AlertDescription>
            </Alert>
          )}

          {backupMutation.isSuccess && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {t('Backup created successfully')}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Import & Export */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FileText className="h-5 w-5" />
            {t('Import & Export')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              onClick={handleExport}
              disabled={exportMutation.isPending}
              variant="outline"
              className="flex items-center gap-2"
            >
              {exportMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {t('Export Data')}
            </Button>

            <Button
              onClick={() => setShowImport(!showImport)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {t('Import Data')}
            </Button>
          </div>

          {showImport && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Paste JSON data to import')}
                </label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder={t('Paste your exported data here...')}
                  className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                  dir="ltr"
                />
              </div>
              
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  onClick={handleImport}
                  disabled={importMutation.isPending || !importData.trim()}
                  className="flex items-center gap-2"
                >
                  {importMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {t('Import Data')}
                </Button>
                
                <Button
                  onClick={() => {
                    setImportData('');
                    setShowImport(false);
                  }}
                  variant="outline"
                >
                  {t('Cancel')}
                </Button>
              </div>

              {importMutation.isError && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {t('Failed to import data. Please check the format.')}
                  </AlertDescription>
                </Alert>
              )}

              {importMutation.isSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    {t('Data imported successfully')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertTriangle className="h-5 w-5" />
            {t('Danger Zone')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">
                {t('Clear All Data')}
              </h4>
              <p className="text-sm text-red-700 mb-4">
                {t('This will permanently delete all orders, vehicles, drivers, and other data. This action cannot be undone.')}
              </p>
              
              <Button
                onClick={handleClear}
                disabled={clearMutation.isPending}
                variant="destructive"
                className="flex items-center gap-2"
              >
                {clearMutation.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {t('Clear All Data')}
              </Button>
            </div>

            {clearMutation.isError && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {t('Failed to clear data')}
                </AlertDescription>
              </Alert>
            )}

            {clearMutation.isSuccess && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {t('All data cleared successfully')}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
