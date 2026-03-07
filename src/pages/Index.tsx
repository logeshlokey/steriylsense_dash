import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Activity, Shield, Phone, MessageCircle } from 'lucide-react';
import DateFilterPanel from '@/components/dashboard/DateFilterPanel';
import Enhanced3DRoomView from '@/components/dashboard/Enhanced3DRoomView';
import LiveCameraFeed from '@/components/dashboard/LiveCameraFeed';
import EnhancedHygieneScores from '@/components/dashboard/EnhancedHygieneScores';
import ContaminationForecast from '@/components/dashboard/ContaminationForecast';
import ROIDashboard from '@/components/dashboard/ROIDashboard';
import AIInsightPanel from '@/components/dashboard/AIInsightPanel';
import EnhancedSensorHealth from '@/components/dashboard/EnhancedSensorHealth';
import UVBacterialScatter from '@/components/dashboard/UVBacterialScatter';
import ContaminationFlow from '@/components/dashboard/ContaminationFlow';
import AnalysisSwitcher from '@/components/dashboard/AnalysisSwitcher';
import RootCausePanel from "@/components/dashboard/RootCausePanel";
import PredictiveMaintenancePanel from "@/components/dashboard/PredictiveMaintenancePanel";
import Papa from "papaparse";
import VoiceAssistant from "@/components/dashboard/VoiceAssistant";
import TestGemini from "../TestGemini"; 
import Login from "./Login";
import DeviceLink from "./DeviceLink";

// ❌ REMOVE THIS (caused hook error)
// const [isDeviceLinked, setIsDeviceLinked] = useState(false);

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDeviceLinked, setIsDeviceLinked] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ start: startDate, end: endDate });
    console.log('Date range changed:', { startDate, endDate });
  };

  const handleDataUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log("Parsed Data:", results.data);
        setUploadedData(results.data);
      },
    });
  };

  // ---------------- Login Screen ----------------
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // ---------------- Device Link Screen ----------------
  if (!isDeviceLinked) {
    return <DeviceLink onDeviceLinked={() => setIsDeviceLinked(true)} />;
  }

  // ---------------- Dashboard ----------------
  return (
    <div className="min-h-screen bg-background p-6 flex flex-col justify-between">

      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
  <div className="relative">
  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-purple-500 blur-md opacity-70"></div>
  <div className="relative w-14 h-14 rounded-full bg-background flex items-center justify-center">
    <img
  src="/images/logo.jpeg"
  alt="Sterilysense Logo"
  className="w-10 h-10 object-contain rounded-full"
/>
  </div>
</div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">SterilySense</h1>
                <p className="text-muted-foreground">
                  AI-Powered UV Disinfection Dashboard
                </p>
              </div>
            </div>

            <Badge className="bg-success text-success-foreground animate-pulse-glow">
              <Activity className="w-3 h-5 mr-1" />
              System Online
            </Badge>
          </div>
        </div>

        {/* Date Filter & Upload Panel */}
        <DateFilterPanel
          onDateRangeChange={handleDateRangeChange}
          onDataUpload={handleDataUpload}
        />

        {/* Dashboard Widgets */}
        <div className="space-y-8">
          <Enhanced3DRoomView dataset={uploadedData} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <LiveCameraFeed />
            <EnhancedHygieneScores />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ContaminationForecast />
            <AnalysisSwitcher />
          </div>
          <AIInsightPanel />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <EnhancedSensorHealth />
            <div className="space-y-6">
              <UVBacterialScatter />
              <ContaminationFlow />
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <RootCausePanel dataset={uploadedData} />
            <PredictiveMaintenancePanel dataset={uploadedData} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 p-6 bg-card rounded-xl shadow-lg relative">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Customer Support</h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <span className="font-bold text-foreground">Service Provider 1 :</span>
                <span className="ml-2">lokey V - Software Mechanic</span>
                <span className="ml-2">📞 +91 98765 43210</span>
              </li>
              <li>
                <span className="font-bold text-foreground">Service Provider 2 :</span>
                <span className="ml-2">Jaya prakash - Hardware Mechanic</span>
                <span className="ml-2">📞 +91 91234 56789</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="https://wa.me/7305714848"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Support
            </a>

            <a
              href="tel:+917305714848"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition"
            >
              <Phone className="w-4 h-4" />
              Call Support
            </a>
          </div>
        </div>
      </footer>

      <VoiceAssistant />
    </div>
  );
};

export default Index;
