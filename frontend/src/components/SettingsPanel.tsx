import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetSettings, useSetSettings } from '../hooks/useQueries';
import { Save, Loader2, Settings2, Shield, Camera } from 'lucide-react';
import type { PIDSettings } from '../backend';

interface SettingsPanelProps {
  activeTab: 'pid' | 'general' | 'safety';
  onTabChange: (tab: 'pid' | 'general' | 'safety') => void;
}

export default function SettingsPanel({ activeTab, onTabChange }: SettingsPanelProps) {
  const { data: settings, isLoading } = useGetSettings();
  const setSettings = useSetSettings();

  const [pidRoll, setPidRoll] = useState<PIDSettings>({ kp: 1.0, ki: 0.0, kd: 0.0 });
  const [pidPitch, setPidPitch] = useState<PIDSettings>({ kp: 1.0, ki: 0.0, kd: 0.0 });
  const [pidYaw, setPidYaw] = useState<PIDSettings>({ kp: 1.0, ki: 0.0, kd: 0.0 });
  const [maxThrottle, setMaxThrottle] = useState<number>(100);
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(false);
  const [thermalCameraEnabled, setThermalCameraEnabled] = useState<boolean>(false);
  const [failsafeEnabled, setFailsafeEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (settings) {
      setPidRoll(settings.pidRoll);
      setPidPitch(settings.pidPitch);
      setPidYaw(settings.pidYaw);
      setMaxThrottle(Number(settings.maxThrottle));
      setCameraEnabled(settings.cameraEnabled);
      setThermalCameraEnabled(settings.thermalCameraEnabled);
      setFailsafeEnabled(settings.failsafeEnabled);
    }
  }, [settings]);

  const handleSave = () => {
    setSettings.mutate({
      pidRoll,
      pidPitch,
      pidYaw,
      maxThrottle: BigInt(maxThrottle),
      cameraEnabled,
      thermalCameraEnabled,
      failsafeEnabled,
    });
  };

  const renderPIDControls = (
    title: string,
    pid: PIDSettings,
    setPid: (pid: PIDSettings) => void,
    icon: React.ReactNode
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>
          Proportional, Integral, and Derivative gains
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${title}-kp`}>Kp (Proportional)</Label>
          <Input
            id={`${title}-kp`}
            type="number"
            step="0.01"
            value={pid.kp}
            onChange={(e) => setPid({ ...pid, kp: parseFloat(e.target.value) || 0 })}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-ki`}>Ki (Integral)</Label>
          <Input
            id={`${title}-ki`}
            type="number"
            step="0.01"
            value={pid.ki}
            onChange={(e) => setPid({ ...pid, ki: parseFloat(e.target.value) || 0 })}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-kd`}>Kd (Derivative)</Label>
          <Input
            id={`${title}-kd`}
            type="number"
            step="0.01"
            value={pid.kd}
            onChange={(e) => setPid({ ...pid, kd: parseFloat(e.target.value) || 0 })}
            className="font-mono"
          />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pid">PID Control</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
        </TabsList>

        <TabsContent value="pid" className="space-y-4 mt-6">
          {renderPIDControls('Roll Axis', pidRoll, setPidRoll, <Settings2 className="w-5 h-5" />)}
          {renderPIDControls('Pitch Axis', pidPitch, setPidPitch, <Settings2 className="w-5 h-5" />)}
          {renderPIDControls('Yaw Axis', pidYaw, setPidYaw, <Settings2 className="w-5 h-5" />)}
        </TabsContent>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Throttle Configuration</CardTitle>
              <CardDescription>
                Set maximum throttle limit (0-100%)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxThrottle">Max Throttle (%)</Label>
                <Input
                  id="maxThrottle"
                  type="number"
                  min="0"
                  max="100"
                  value={maxThrottle}
                  onChange={(e) => setMaxThrottle(parseInt(e.target.value) || 0)}
                  className="font-mono text-lg"
                />
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${maxThrottle}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Camera Systems
              </CardTitle>
              <CardDescription>
                Enable or disable camera modules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="camera">Standard Camera (OV7670)</Label>
                  <p className="text-sm text-muted-foreground">
                    Normal video feed
                  </p>
                </div>
                <Switch
                  id="camera"
                  checked={cameraEnabled}
                  onCheckedChange={setCameraEnabled}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="thermal">Thermal Camera (FLIR Lepton)</Label>
                  <p className="text-sm text-muted-foreground">
                    Thermal imaging feed
                  </p>
                </div>
                <Switch
                  id="thermal"
                  checked={thermalCameraEnabled}
                  onCheckedChange={setThermalCameraEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Safety Features
              </CardTitle>
              <CardDescription>
                Configure failsafe and emergency protocols
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="failsafe">Failsafe Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Auto-land when communication is lost
                  </p>
                </div>
                <Switch
                  id="failsafe"
                  checked={failsafeEnabled}
                  onCheckedChange={setFailsafeEnabled}
                />
              </div>
              <Separator />
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">Safety Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Always arm/disarm before flight operations</li>
                  <li>Monitor battery voltage continuously</li>
                  <li>Test failsafe in safe environment</li>
                  <li>Keep firmware updated for stability</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button
        onClick={handleSave}
        disabled={setSettings.isPending}
        className="w-full"
        size="lg"
      >
        {setSettings.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </>
        )}
      </Button>
    </div>
  );
}
