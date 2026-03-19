import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { QuadcopterSettings, PIDSettings } from '../backend';
import { toast } from 'sonner';

export function useGetSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<QuadcopterSettings | null>({
    queryKey: ['settings'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getSettings();
      } catch (error) {
        // User doesn't exist yet, return null
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPIDSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<{ roll: PIDSettings; pitch: PIDSettings; yaw: PIDSettings } | null>({
    queryKey: ['pidSettings'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPIDSettings();
      } catch (error) {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: {
      pidRoll: PIDSettings;
      pidPitch: PIDSettings;
      pidYaw: PIDSettings;
      maxThrottle: bigint;
      cameraEnabled: boolean;
      thermalCameraEnabled: boolean;
      failsafeEnabled: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      await actor.setSettings(
        settings.pidRoll,
        settings.pidPitch,
        settings.pidYaw,
        settings.maxThrottle,
        settings.cameraEnabled,
        settings.thermalCameraEnabled,
        settings.failsafeEnabled
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['pidSettings'] });
      toast.success('Settings saved successfully', {
        description: 'Your quadcopter configuration has been updated',
      });
    },
    onError: (error) => {
      toast.error('Failed to save settings', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    },
  });
}

export function useGetMaxThrottle() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint | null>({
    queryKey: ['maxThrottle'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getMaxThrottle();
      } catch (error) {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCameraEnabled() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['cameraEnabled'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCameraEnabled();
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsThermalCameraEnabled() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['thermalCameraEnabled'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isThermalCameraEnabled();
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsFailsafeEnabled() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['failsafeEnabled'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isFailsafeEnabled();
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}
